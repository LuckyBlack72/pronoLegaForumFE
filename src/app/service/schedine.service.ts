import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { ValoriPronostici,
        FiltroValoriPronostici,
        AnagraficaCompetizioni,
        AnagraficaPartecipanti,
        FiltroAnagraficaPartecipanti,
        Pronostici,
        FiltroPronostici,
        DatePronostici,
        FiltroStagione,
        Stagioni,
        ValoriPronosticiClassifica,
        TipoCompetizione,
        LogAggiornamenti,
        AnagraficaCompetizioniSettimanali,
        AnagraficaCompetizioniSettimanaliGrouped,
        PronosticiSettimanali} from '../../models/models';

@Injectable()
export class SchedineService {

  constructor ( private http: HttpClient ) { }

  getAnagraficaSchedine ( stagione: number ): Observable<AnagraficaCompetizioniSettimanali[]> {

    const postData = { stagione: stagione };

    return this.http.post<AnagraficaCompetizioniSettimanali[]>(environment.backEndURL + '/schedine/getAnagraficaSchedine', postData);

  }


  getPronosticiSettimanali ( searchParameters: FiltroPronostici ): Observable<PronosticiSettimanali[]> {

    return this.http.post<PronosticiSettimanali[]>(environment.backEndURL + '/schedine/getPronosticiSettimanali', searchParameters);

  }

  savePronosticiSettimanali ( dataToSave: PronosticiSettimanali[], nickname: string, id_partecipanti: number ): Observable<string> {

    const postData = { pronostici: dataToSave, id_partecipanti: id_partecipanti, nickname: nickname };

    return this.http.post<string>(environment.backEndURL + '/schedine/savePronosticiSettimanali', postData);

  }


  saveAnagraficaSchedine ( dataToSave: AnagraficaCompetizioniSettimanali, tipo_ddl: string): Observable<string> {

    const postData = { anagraficaSchedine: dataToSave, tipo_ddl: tipo_ddl};
    return this.http.post<string>(environment.backEndURL + '/schedine/saveAnagraficaSchedine', postData);

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

}
