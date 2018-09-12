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
        FiltroPronostici } from '../models/models';

@Injectable()
export class PronosticiService {

  constructor ( private http: HttpClient ) { }

  checkPassword ( nick: string, pwd: string ): Observable<string> {

    const postData = {nickname: nick , password : pwd };

    return this.http.post<string>(environment.backEndURL + '/checkPassword', postData);

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

}
