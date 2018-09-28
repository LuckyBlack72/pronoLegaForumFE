import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AnagraficaCompetizioni, Pronostici } from '../../models/models';
import { Utils } from '../../models/utils';

@Injectable()
export class ExternalApiService {

  constructor ( private http: HttpClient, private utils: Utils ) { }

  getAggiornamentiCompetizioni (stagione: string, competizione: AnagraficaCompetizioni): Observable<any> {

    let urlToCall: string;
    const annoNum = parseInt(this.utils.getStagione().substring(4, 2), 10);

    const annoNumNext = annoNum + 1;
    const stagioneCall = this.utils.getStagione().substring(4, 2) + '-' + annoNumNext.toString(10);

    urlToCall = 'http://soccer.sportsopendata.net/v1/leagues/' +
    competizione.nome_pronostico +
    '/seasons/' +
    stagioneCall;
    if (competizione.tipo_competizione === 'SCO' ) {
      urlToCall += '/topscorers';
    } else {
      urlToCall += '/standings';
    }

    return this.http.get<any>(urlToCall);

  }

  transformApiDataToPronosticiData(apiData: any[], datiCompetizioni: AnagraficaCompetizioni[], stagione: number ): Pronostici[] {

    let pronostici: string[] = [];
    const datiToInsertInDb: Pronostici[] = [];

    for (let i = 0; i < apiData.length; i++) {
      for (let x = 1; x <= datiCompetizioni[i].numero_pronostici; x++ ) {
        if (datiCompetizioni[i].tipo_competizione === 'SCO') {
          if ( apiData[i].data.topscorers.length > 0 ) {
            pronostici.push(apiData[i].data.topscorers[(x - 1)].fullname);
          }
        } else {
          if ( apiData[i].data.standings.length > 0 ) {
            pronostici.push(apiData[i].data.standings[(x - 1)].fullname);
          }
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

    return datiToInsertInDb;

}


}
