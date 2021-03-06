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
          ValoriPronostici,
          DatiSquadraLegaForum
        } from '../../models/models';

import { Utils } from '../../models/utils';
import { PronosticiService } from './pronostici.service';


@Injectable()
export class ExternalApiService {

  constructor ( private http: HttpClient, private utils: Utils, private pronosticiService: PronosticiService ) { }


  // @LocalStorage() valoriPronostici: ValoriPronostici[];


  buildApiCallsUrl (stagione: string, competizioni: AnagraficaCompetizioni[]): string[] {

    const urlsToCall: string[] = [];
    let urlToCall: string;
    const annoNum = parseInt(this.utils.getStagione().substring(4, 2), 10);
    const annoNumNext = annoNum + 1;
    const stagioneCall = this.utils.getStagione().substring(4, 2) + '-' + annoNumNext.toString(10);

    urlToCall = '';
    for (let i = 0; i < competizioni.length; i++) {

      if (competizioni[i].tipo_pronostici === 'E') {

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
                                    stagione: number,
                                    valoriPronostici: ValoriPronostici[]
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
            console.log('Scorer Length : [' + x + ']' + 'Name : [' + apiData[i].data.topscorers[(x - 1)].fullname + ']' );
            pronostici.push(this.decodePlayerName(datiCompetizioni[i].id, apiData[i].data.topscorers[(x - 1)].fullname, valoriPronostici));
          }
/*
          console.log('Scorer Length : [' + 0 + ']' + 'Name : [' + apiData[i].data.topscorers[(0)].fullname + ']' );
          console.log('Scorer Length : [' + 1 + ']' + 'Name : [' + apiData[i].data.topscorers[(1)].fullname + ']' );
          console.log('Scorer Length : [' + 2 + ']' + 'Name : [' + apiData[i].data.topscorers[(2)].fullname + ']' );
          console.log('Scorer Length : [' + 3 + ']' + 'Name : [' + apiData[i].data.topscorers[(3)].fullname + ']' );
          console.log('Scorer Length : [' + 4 + ']' + 'Name : [' + apiData[i].data.topscorers[(4)].fullname + ']' );
          console.log('Scorer Length : [' + 5 + ']' + 'Name : [' + apiData[i].data.topscorers[(5)].fullname + ']' );
          console.log('Scorer Length : [' + 6 + ']' + 'Name : [' + apiData[i].data.topscorers[(6)].fullname + ']' );
          console.log('Scorer Length : [' + 7 + ']' + 'Name : [' + apiData[i].data.topscorers[(7)].fullname + ']' );
          console.log('Scorer Length : [' + 8 + ']' + 'Name : [' + apiData[i].data.topscorers[(8)].fullname + ']' );
          console.log('Scorer Length : [' + 9 + ']' + 'Name : [' + apiData[i].data.topscorers[(9)].fullname + ']' );
          console.log('Scorer Length : [' + 10 + ']' + 'Name : [' + apiData[i].data.topscorers[(10)].fullname + ']' );
*/
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

  console.log('Team Name : [' + teamToDecode + ']' );
  switch (teamToDecode) {
    case 'Man City':
      decodedTeamName = 'Manchester City';
      break;
    case 'Man United':
      decodedTeamName = 'Manchester Utd';
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

private decodePlayerName(idCompetizione: number, playerNameToDecode: string, valoriPronostici: ValoriPronostici[]): string {

  let decodedPlayerName = 'XXX';
  const upperCaseNameToDecode = playerNameToDecode.toUpperCase();
  let found = false;

  for (let i = 0; i < valoriPronostici.length; i++) {
    if (valoriPronostici[i].id_competizione === idCompetizione) {
      for (let x = 0; x < valoriPronostici[i].valori_pronostici.length; x++ ) {
        if (valoriPronostici[i].valori_pronostici[x].search(upperCaseNameToDecode) !== -1) {
          console.log('Api Name : [' + upperCaseNameToDecode + '] Prono Name : [' + valoriPronostici[i].valori_pronostici[x] + ']');
          decodedPlayerName = valoriPronostici[i].valori_pronostici[x];
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

getValoriPronosticiScorer (urlsToCall: string[]): Observable<any> {

  const dataFromApi: any[] = [];

  for (let i = 0; i < urlsToCall.length; i++ ) {
    dataFromApi.push(<Observable<any>> this.http.get(urlsToCall[i]));
  }

  return forkJoin(dataFromApi);

}

getDatiSorteggioLegaForum(stagione: number): Observable<DatiSquadraLegaForum[][][]> {

  const postParameter = { stagione: stagione };
  return this.http.post<DatiSquadraLegaForum[][][]>('https://sorteggiolegaforum.herokuapp.com' + '/getSorteggioStagione', postParameter);

}

getValoriPronosticiSchedine (competizione: string, stagione: string, giornata: string): Observable<any> {

  const annoNum = parseInt(stagione, 10) - 2000;
  const annoNumNext = annoNum + 1;
  const stagioneCall = annoNum.toString(10) + '-' + annoNumNext.toString(10);

  const urlToCall =
  'https://soccer.sportsopendata.net/v1/leagues/' +
  competizione + // Es: serie-a
  '/seasons/' +
  stagioneCall + // Es: 18-19
  '/rounds/' +
  giornata; // Es: round-1
  return  this.http.get<any>(urlToCall, {});

}


}
