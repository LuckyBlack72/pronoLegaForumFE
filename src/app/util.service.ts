import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

import { DataService } from './dataservice.service';
import { Pronostici, ExcelRow } from '../models/models';

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

  checkDateClassifica(dateToCheck: string): boolean {

    let retVal = true;
    if (dateToCheck === '') {
      retVal = true;
    } else {
      const dataCalcoloClassifica = new Date(dateToCheck);
      const oggi = new Date();
      if ( dataCalcoloClassifica.getTime()  > oggi.getTime() ) {
        retVal = false;
      }
    }
    return retVal; // true la classifica si può calcolare, false no

  }


  logout(): void {

    this.dataService.nickname = ''; // resetto
    this.dataService.idPartecipante = 0; // resetto
    this.router.navigate(['/index-page']) ;

  }

  back() {

    this.router.navigate(['/menu-utente']);

  }

  exportPronosticiExcel(pronostici: Pronostici[], utente: string) {

    const workbook = XLSX.utils.book_new();
    let excelRows: ExcelRow[] = [];
    let element: {[x: string]: string} = {};

    for (let i = 0; i < pronostici.length; i++) {
      for (let x = 0; x < pronostici[i].pronostici.length; x++) {
        element[pronostici[i].competizione] = pronostici[i].pronostici[x].replace('XXX', ' ');
        excelRows.push(element);
        element = {};
      }
      XLSX.utils.book_append_sheet(
                                    workbook,
                                    XLSX.utils.json_to_sheet(excelRows),
                                    pronostici[i].competizione
      );
      excelRows = [];
    }

    XLSX.writeFile(workbook,
                   'Pronostici' + '_' + pronostici[0].stagione + '_' + utente + '.xlsx'
                  ); // scrive il file e di conseguenza te lo fa salvare

  }


}
