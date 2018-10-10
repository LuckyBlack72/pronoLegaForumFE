import { Injectable, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material';

import * as XLSX from 'xlsx';
import { SessionStorage, SessionStorageService } from 'ngx-store';

// import { DataService } from './dataservice.service';
import { Pronostici, ExcelRow, ReloadLocalStorageValues } from '../../models/models';
import { Utils } from '../../models/utils';
import { ApplicationParameter, LogAggiornamenti } from '../../models/models';

@Injectable()
export class UtilService {

  constructor(
              private router: Router,
              // public dataService: DataService,
              private sessionStorageService: SessionStorageService,
              private utils: Utils ) { }

  @SessionStorage() applicationParameter: ApplicationParameter;

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

    this.applicationParameter.nickname = ''; // resetto
    this.applicationParameter.idPartecipante = 0; // resetto
    this.applicationParameter.menu_utente_page = false;
    this.sessionStorageService.set('applicationParameter', this.applicationParameter);
    this.router.navigate(['/index-page']) ;

  }

  back() {

    this.applicationParameter.menu_utente_page = false;
    this.sessionStorageService.set('applicationParameter', this.applicationParameter);
    this.router.navigate(['/menu-utente']);

  }

  editProfile() {

    this.applicationParameter.menu_utente_page = true;
    this.sessionStorageService.set('applicationParameter', this.applicationParameter);
    this.router.navigate(['/profilo']);

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

  exportClassificaExcel(datiClassifica: any[]) {

    const fsort: Sort = { active: 'Totale', direction: 'desc'};
    const datiClassificaSorted: any[] = this.sortData(fsort, datiClassifica);

    const workbook = XLSX.utils.book_new();
    const now = new Date();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(datiClassificaSorted),
      'Classifica'
    );

    XLSX.writeFile(workbook,
                   'Classifica' +
                   '_' +
                   this.utils.getStagione().substring(0, 4) +
                   '_' +
                    now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear() +
                    '.xlsx'
                  ); // scrive il file e di conseguenza te lo fa salvare

  }

  private sortData(sort: Sort, datiToSort: any[]): any[] {
    const data = datiToSort.slice();

    if (!sort.active || sort.direction === '' || data.length < 2) {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

  }

  private compare (a: any, b: any , isAsc: any): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  checkEmail (email: string): boolean {

    let isValid = true;
    isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(email);


    return isValid;

  }

  checkReloadLocalStorageData(
                                tabella: string,
                                localStorageData: LogAggiornamenti[],
                                sessionStorageData: LogAggiornamenti[]
                              ): ReloadLocalStorageValues {

    let fnd_tbl: boolean;
    const retValObj: ReloadLocalStorageValues = { fnd: true,
                           lsIdx: 0,
                           ssIdx: 0
                          };



    for (let i = 0; i < localStorageData.length; i++ ) {

      for (let x = 0; x < sessionStorageData.length; x++ ) {

        if (
              sessionStorageData[x].tabella === tabella &&
              ( localStorageData[i].tabella === sessionStorageData[x].tabella )
            ) {
                fnd_tbl = true;

                if ( localStorageData[i].data_aggiornamento === sessionStorageData[x].data_aggiornamento ) {

                  retValObj.fnd = true;
                  break;

                } else {

                  retValObj.fnd = false;
                  retValObj.ssIdx = i;
                  retValObj.lsIdx = x;

                  break;

                }
        }
      }

      if (fnd_tbl) {
        break;
      }

    }

  return retValObj;

  }

}
