import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';

import { environment } from '../../environments/environment';

import {
        FiltroPronostici,
        AnagraficaCompetizioniSettimanali,
        AnagraficaCompetizioniSettimanaliGrouped,
        PronosticiSettimanali,
        Stagioni,
        PronosticiSettimanaliPerClassifica,
        NickUtente
      } from '../../models/models';

@Injectable()
export class SchedineService {

  constructor ( private http: HttpClient ) { }

  getAnagraficaSchedine ( stagione: number ): Observable<AnagraficaCompetizioniSettimanali[]> {

    const postData = { stagione: stagione };

    return this.http.post<AnagraficaCompetizioniSettimanali[]>(environment.backEndURL + '/schedine/getAnagraficaSchedine', postData);

  }

  getNewSettimanaSchedina ( stagione: number ): Observable<number> {

    const postData = { stagione: stagione };

    return this.http.post<number>(environment.backEndURL + '/schedine/getNewSettimanaSchedina', postData);

  }

  getPronosticiSettimanali ( searchParameters: FiltroPronostici ): Observable<PronosticiSettimanali[]> {

    return this.http.post<PronosticiSettimanali[]>(environment.backEndURL + '/schedine/getPronosticiSettimanali', searchParameters);

  }


  getPronosticiSettimanaliPerClassifica ( searchParameters: FiltroPronostici ): Observable<PronosticiSettimanaliPerClassifica[]> {

    return this.http.post<PronosticiSettimanaliPerClassifica[]>(
                    environment.backEndURL + '/schedine/getPronosticiSettimanaliPerClassifica',
                    searchParameters
                  );

  }
  savePronosticiSettimanali ( dataToSave: PronosticiSettimanali, nickname: string, id_partecipanti: number ): Observable<string> {

    const postData = { pronostici: dataToSave, id_partecipanti: id_partecipanti, nickname: nickname };

    return this.http.post<string>(environment.backEndURL + '/schedine/savePronosticiSettimanali', postData);

  }

  saveAnagraficaSchedine ( dataToSave: AnagraficaCompetizioniSettimanali, tipo_ddl: string): Observable<string> {

    const postData = { anagraficaSchedine: dataToSave, tipo_ddl: tipo_ddl};
    return this.http.post<string>(environment.backEndURL + '/schedine/saveAnagraficaSchedine', postData);

  }

  getStagioni (): Observable<Stagioni[]> {

    return this.http.post<Stagioni[]>(environment.backEndURL + '/schedine/getStagioni', {});

  }

  getUtentiConPronosticiSettimanali (stagione: number): Observable<NickUtente[]> {

    const postData = { stagione: stagione };

    return this.http.post<NickUtente[]>(environment.backEndURL + '/schedine/getUtentiConPronosticiSettimanali', postData);

  }

  getDataForClassifica ( searchParameters: FiltroPronostici): Observable<any> {

    const dataForClassifica: any[] = [];

    // Anagrafica Partecipanti che hanno pronosticato schedine
    dataForClassifica.push(
                            <Observable<any>>
                            this.http.post<string[]>(
                            environment.backEndURL + '/schedine/getUtentiConPronosticiSettimanali', 
                            { stagione: searchParameters.stagione })
    );

    // Anagrafica Schedine
    dataForClassifica.push(
                            <Observable<any>>
                            this.http.post<AnagraficaCompetizioniSettimanali[]>(
                            environment.backEndURL + '/schedine/getAnagraficaSchedine',
                            { stagione: searchParameters.stagione }
                            )
                          );

    // Pronostici Schedine
    dataForClassifica.push(
                            <Observable<any>>
                            this.http.post<PronosticiSettimanaliPerClassifica[]>(
                            environment.backEndURL + '/schedine/getPronosticiSettimanaliPerClassifica',
                            searchParameters
                            )
    );

    return forkJoin(dataForClassifica);

  }

  buildCompetizioniGrouped(competizioni: AnagraficaCompetizioniSettimanali[]): AnagraficaCompetizioniSettimanaliGrouped[] {

    const retVal: AnagraficaCompetizioniSettimanaliGrouped[] = [];
    let comboCompetizioni: AnagraficaCompetizioniSettimanali[] = [];

    let stagioneGroup = 0;

    if (competizioni.length > 0) {
        stagioneGroup = competizioni[0].stagione;
        for (let i = 0; i < competizioni.length; i++) {
            if ( competizioni[i].stagione !== stagioneGroup ) { // cambio stagione
                retVal.push({group: stagioneGroup.toString() , competizioni: comboCompetizioni});
                stagioneGroup = competizioni[i].stagione;
                comboCompetizioni = [];
                comboCompetizioni.push(competizioni[i]);
            } else {
                comboCompetizioni.push(competizioni[i]);
            }

        }
        retVal.push({group: stagioneGroup.toString() , competizioni: comboCompetizioni});

    }

    return retVal;

}

checkDataToSave(dataToSave: AnagraficaCompetizioniSettimanali): boolean {

  let retVal: boolean;
  retVal = true;

      if ( dataToSave.punti_esatti === 0) {
        retVal = false;
      }

      if ( dataToSave.numero_pronostici !== dataToSave.pronostici.length) {
        retVal = false;
      }

  return retVal;

}

}
