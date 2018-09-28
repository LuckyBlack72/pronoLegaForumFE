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
        ValoriPronosticiClassifica} from '../../models/models';

@Injectable()
export class PronosticiService {

  constructor ( private http: HttpClient ) { }

  checkPassword ( nick: string, pwd: string ): Observable<number> {

    const postData = {nickname: nick , password : pwd };

    return this.http.post<number>(environment.backEndURL + '/partecipanti/checkPassword', postData);

  }

  checkAdminPassword ( pwd: string ): Observable<string> {

    const postData = { password: pwd };

    return this.http.post<string>(environment.backEndURL + '/partecipanti/checkAdminPassword', postData);

  }

  getValoriPronostici ( searchParameters: FiltroValoriPronostici ): Observable<ValoriPronostici[]> {

    return this.http.post<ValoriPronostici[]>(environment.backEndURL + '/pronostici/getValoriPronostici', searchParameters);

  }

  getAnagraficaCompetizioni ( stagione: number ): Observable<AnagraficaCompetizioni[]> {

    const postData = { stagione: stagione };

    return this.http.post<AnagraficaCompetizioni[]>(environment.backEndURL + '/classifica/getAnagraficaCompetizioni', postData);

  }

  getAnagraficaPartecipanti ( searchParameters: FiltroAnagraficaPartecipanti ): Observable<AnagraficaPartecipanti[]> {

    return this.http.post<AnagraficaPartecipanti[]>(environment.backEndURL + '/partecipanti/getAnagraficaPartecipanti', searchParameters);

  }

  getPronostici ( searchParameters: FiltroPronostici ): Observable<Pronostici[]> {

    return this.http.post<Pronostici[]>(environment.backEndURL + '/pronostici/getPronostici', searchParameters);

  }

  savePronostici ( dataToSave: Pronostici[], nickname: string, id_partecipanti: number ): Observable<string> {

    const postData = { pronostici: dataToSave, id_partecipanti: id_partecipanti, nickname: nickname };

    return this.http.post<string>(environment.backEndURL + '/pronostici/savePronostici', postData);

  }

  saveClassificaCompetizioni ( dataToSave: Pronostici[] ): Observable<string> {

    const postData = { classificaCompetizioni: dataToSave };

    return this.http.post<string>(environment.backEndURL + '/classifica/saveClassificaCompetizioni', postData);

  }

  saveAnagraficaPartecipanti ( dataToSave: AnagraficaPartecipanti ): Observable<string> {

    const postData = { anagraficaPartecipanti: dataToSave };

    return this.http.post<string>(environment.backEndURL + '/partecipanti/saveAnagraficaPartecipanti', postData);

  }

  updateAnagraficaPartecipanti ( dataToSave: AnagraficaPartecipanti ): Observable<string> {

    const postData = { anagraficaPartecipanti: dataToSave };

    return this.http.post<string>(environment.backEndURL + '/partecipanti/updateAnagraficaPartecipanti', postData);

  }

  getDatePronostici ( searchParameters: FiltroStagione ): Observable<DatePronostici> {

    return this.http.post<DatePronostici>(environment.backEndURL + '/pronostici/getDatePronostici', searchParameters);

  }

  getStagioni (): Observable<Stagioni[]> {

    return this.http.post<Stagioni[]>(environment.backEndURL + '/classifica/getStagioni', {});

  }

  getValoriPronosticiCalcoloClassifica ( searchParameters: FiltroValoriPronostici ): Observable<ValoriPronosticiClassifica[]> {

    return this.http.post<ValoriPronosticiClassifica[]>
    (environment.backEndURL + '/pronostici/getValoriPronosticiCalcoloClassifica', searchParameters);

  }


}
