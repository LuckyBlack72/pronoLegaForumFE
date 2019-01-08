import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Utils {

  // il valore viene preso da enviroment.ts --> locale
  // il valore viene preso da enviroment.prod.ts --> on line (produzione) heroku
  // BASE_URL_BACKEND = 'http://localhost:2108'; //Locale
  // BASE_URL_BACKEND = 'http://sorteggiolegaforum.herokuapp.com'; //On Line Heroku
  BASE_URL_BACKEND = environment.backEndURL;

  constructor() { }

  getStagione (): string {

    let stagione: any;
    let annoIntero: string;
    let anno: any;
    let annoCorrente: number;

    stagione = new Date(Date.now());

    annoCorrente = +stagione.getFullYear().toString(); // Trasforma stringa in numero

    if ( annoCorrente % 2 === 0 ) {

      annoIntero = stagione.getFullYear().toString();

    } else {

      annoIntero = ( annoCorrente - 1 ).toString();

    }

    anno = stagione.getFullYear().toString().substr(2);
    anno = +anno + 1;

    return annoIntero + '/' + anno;

  }

}
