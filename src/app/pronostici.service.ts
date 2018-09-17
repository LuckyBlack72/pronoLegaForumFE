import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

import { ValoriPronostici,
        FiltroValoriPronostici,
        AnagraficaCompetizioni,
        AnagraficaPartecipanti,
        FiltroAnagraficaPartecipanti,
        Pronostici,
        FiltroPronostici,
        DatePronostici,
        FiltroDatePronostici} from '../models/models';

@Injectable()
export class PronosticiService {

  constructor ( private http: HttpClient ) { }

  checkPassword ( nick: string, pwd: string ): Observable<number> {

    const postData = {nickname: nick , password : pwd };

    return this.http.post<number>(environment.backEndURL + '/checkPassword', postData);

  }

  getValoriPronostici ( searchParameters: FiltroValoriPronostici ): Observable<ValoriPronostici[]> {

    return this.http.post<ValoriPronostici[]>(environment.backEndURL + '/getValoriPronostici', searchParameters);

  }

  getAnagraficaCompetizioni ( stagione: number ): Observable<AnagraficaCompetizioni[]> {

    const postData = { stagione: stagione };

    return this.http.post<AnagraficaCompetizioni[]>(environment.backEndURL + '/getAnagraficaCompetizioni', postData);

  }

  getAnagraficaPartecipanti ( searchParameters: FiltroAnagraficaPartecipanti ): Observable<AnagraficaPartecipanti[]> {

    return this.http.post<AnagraficaPartecipanti[]>(environment.backEndURL + '/getAnagraficaPartecipanti', searchParameters);

  }

  getPronostici ( searchParameters: FiltroPronostici ): Observable<Pronostici[]> {

    return this.http.post<Pronostici[]>(environment.backEndURL + '/getPronostici', searchParameters);

  }

  savePronostici ( dataToSave: Pronostici[] ): Observable<string> {

    const postData = { pronostici: dataToSave };

    return this.http.post<string>(environment.backEndURL + '/savePronostici', postData);

  }

  saveAnagraficaPartecipanti ( dataToSave: AnagraficaPartecipanti ): Observable<string> {

    const postData = { anagraficaPartecipanti: dataToSave };

    return this.http.post<string>(environment.backEndURL + '/saveAnagraficaPartecipanti', postData);

  }

  getDatePronostici ( searchParameters: FiltroDatePronostici ): Observable<DatePronostici> {

    return this.http.post<DatePronostici>(environment.backEndURL + '/getDatePronostici', searchParameters);

  }

}
