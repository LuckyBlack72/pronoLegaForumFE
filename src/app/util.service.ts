import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './dataservice.service';

@Injectable()
export class UtilService {

  constructor( private router: Router, public dataService: DataService ) { }

  checkDateProno(dateToCheck: string): boolean {

    let retVal = false;
    if (dateToCheck === '') {
      retVal = false;
    } else {
      const dataChiusura = new Date(dateToCheck);
      const oggi = new Date();
      if ( oggi.getTime() > dataChiusura.getTime() ) {
        retVal = true;
      }
    }
    return retVal;
  }

  logout(): void {

    this.dataService.nickname = ''; // resetto
    this.dataService.idPartecipante = 0; // resetto
    this.router.navigate(['/index-page']) ;

  }

}