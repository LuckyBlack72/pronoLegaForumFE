import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, timer } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { LocalStorage } from 'ngx-store';

import {
          AnagraficaCompetizioni,
          Pronostici,
          FiltroPronostici,
          ValoriPronosticiClassifica,
          ApiTransformReturnValue,
          ValoriPronostici
        } from '../../models/models';

import { Utils } from '../../models/utils';
import { PronosticiService } from './pronostici.service';


@Injectable()
export class ExternalApiService {

  constructor ( private http: HttpClient, private utils: Utils, private pronosticiService: PronosticiService ) { }


  @LocalStorage() valoriPronostici: ValoriPronostici[];


  buildApiCallsUrl (stagione: string, competizioni: AnagraficaCompetizioni[]): string[] {

    const urlsToCall: string[] = [];
    let urlToCall: string;
    const annoNum = parseInt(this.utils.getStagione().substring(4, 2), 10);
    const annoNumNext = annoNum + 1;
    const stagioneCall = this.utils.getStagione().substring(4, 2) + '-' + annoNumNext.toString(10);

    urlToCall = '';
    for (let i = 0; i < competizioni.length; i++) {

      urlToCall = 'https://soccer.sportsopendata.net/v1/leagues/' +
      competizioni[i].nome_pronostico +
      '/seasons/' +
      stagioneCall;
      if (competizioni[i].tipo_competizione === 'SCO' ) {
        urlToCall += '/topscorers';
      } else {
        urlToCall += '/standings';
      }

      urlsToCall.push(urlToCall);
      urlToCall = '';

    }

    return urlsToCall;

  }

  getAggiornamentiCompetizione (urlsToCall: string[]): Observable<any> {

    const dataFromApi: any[] = [];

    for (let i = 0; i < urlsToCall.length; i++ ) {
      dataFromApi.push(<Observable<any>> this.http.get(urlsToCall[i]));
    }

    return forkJoin(dataFromApi);

  }


  saveAndReloadClassificheCompetizioni(dataToSave: Pronostici[], searchParameterForReload: FiltroPronostici): Observable<any> {

    const saveData = <Observable<string>> this.pronosticiService.saveClassificaCompetizioni(dataToSave);
    // tslint:disable-next-line:max-line-length
    const reloadData = <Observable<ValoriPronosticiClassifica[]>> this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameterForReload);

    // finisce la prima richiesta , aspettea 1,5 secondi e poi esegue la seconda e manda i valori della seconda
    return saveData.pipe(mergeMap(saved => timer(1500).pipe(switchMap(() => reloadData))));

    /*
    return forkJoin (
      <Observable<string>> this.pronosticiService.saveClassificaCompetizioni(dataToSave),
      // tslint:disable-next-line:max-line-length
      timer(1500).pipe(switchMap(() =>
        <Observable<ValoriPronosticiClassifica[]>> this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameterForReload))
    ));
    */

  }

  transformApiDataToPronosticiData(
                                    apiData: any[],
                                    datiCompetizioni: AnagraficaCompetizioni[],
                                    stagione: number
                                  ):  ApiTransformReturnValue {

    let pronostici: string[] = [];
    const datiToInsertInDb: Pronostici[] = [];
    let retVal: ApiTransformReturnValue;
    const competizioniAggiornate: string[] = [];
    const competizioniNonAggiornate: string[] = [];

    for (let i = 0; i < apiData.length; i++) {

      if (datiCompetizioni[i].tipo_competizione === 'SCO') {
        if ( apiData[i].data.topscorers.length > 0 ) {
          competizioniAggiornate.push(datiCompetizioni[i].competizione);
          for (let x = 1; x <= datiCompetizioni[i].numero_pronostici; x++ ) {
            pronostici.push(this.decodePlayerName(datiCompetizioni[i].id, apiData[i].data.topscorers[(x - 1)].fullname));
          }
        } else {
          competizioniNonAggiornate.push(datiCompetizioni[i].competizione);
        }
      } else {
        if ( apiData[i].data.standings.length > 0 ) {
          competizioniAggiornate.push(datiCompetizioni[i].competizione);
          for (let x = 1; x <= datiCompetizioni[i].numero_pronostici; x++ ) {
            pronostici.push(this.decodeTeamName(apiData[i].data.standings[(x - 1)].team));
          }
        } else {
          competizioniNonAggiornate.push(datiCompetizioni[i].competizione);
        }
      }

      if (pronostici.length > 0 ) {
        datiToInsertInDb.push(
          {
            id: 0,
            id_partecipanti: 0,
            nickname: '',
            stagione: stagione,
            id_competizione: datiCompetizioni[i].id,
            competizione: '',
            pronostici: pronostici
          }
        );
      }

      pronostici = [];

    }

    retVal = {
      datiToSaveOnDb: datiToInsertInDb,
      competizioniAggiornate: competizioniAggiornate,
      competizioniNonAggiornate: competizioniNonAggiornate
    };

    return retVal;

}

private decodeTeamName(teamToDecode: string): string {
  let decodedTeamName = '';

  switch (teamToDecode) {
    case 'Man City':
      decodedTeamName = 'Manchester City';
      break;
    case 'Man Utd':
      decodedTeamName = 'Manchester United';
      break;
    case 'Leicester City':
      decodedTeamName = 'Leicester';
      break;
    case 'Huddersfield Town':
      decodedTeamName = 'Huddersfield';
      break;
    case 'Cardiff City':
      decodedTeamName = 'Cardiff';
      break;
    case 'Brighton & Hove Albion':
      decodedTeamName = 'Brighton';
      break;
    case 'Wolverhampton':
      decodedTeamName = 'Wolves';
      break;
    default:
      decodedTeamName = teamToDecode;
      break;
  }

  return decodedTeamName;

}

private decodePlayerName(idCompetizione: number, playerNameToDecode: string): string {

  let decodedPlayerName = 'XXX';
  const upperCaseNameToDecode = playerNameToDecode.toUpperCase();
  let found = false;

  for (let i = 0; i < this.valoriPronostici.length; i++) {
    if (this.valoriPronostici[i].id_competizione === idCompetizione) {
      for (let x = 0; x < this.valoriPronostici[i].valori_pronostici.length; x++ ) {
        if (this.valoriPronostici[i].valori_pronostici[x].search(upperCaseNameToDecode) !== -1) {
          decodedPlayerName = this.valoriPronostici[i].valori_pronostici[x];
          found = true;
        }
      }
      if (found = true) {
        found = false;
        break;
      }
    }
  }

  if (decodedPlayerName === 'XXX') {
    decodedPlayerName = playerNameToDecode;
  }

  return decodedPlayerName;

}

getLeagueList (): Observable<any> {

  return  this.http.get<any>('https://soccer.sportsopendata.net/v1/leagues', {});

}

getValoriPronostici (competizione: string, stagione: string): Observable<any> {

  const annoNum = parseInt(stagione, 10) - 2000;
  const annoNumNext = annoNum + 1;
  const stagioneCall = annoNum.toString(10) + '-' + annoNumNext.toString(10);

  const urlToCall =
  'https://soccer.sportsopendata.net/v1/leagues/' +
  competizione + // Es: serie-a
  '/seasons/' +
  stagioneCall + // Es: 18-19
  '/teams';

  return  this.http.get<any>(urlToCall, {});

}




}
