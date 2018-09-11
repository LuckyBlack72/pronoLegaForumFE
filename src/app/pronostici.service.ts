import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; // per il get e il post non tipizzati

import { environment } from '../environments/environment';

@Injectable()
export class PronosticiService {

  constructor ( private http: HttpClient ) { }

  checkPassword (nick: string, pwd: string): Observable<string> {

    const postData = {nickname: nick , password : pwd };

    return this.http.post<string>(environment.backEndURL + '/checkPassword', postData);

  }

}
