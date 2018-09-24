import { Injectable, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material';

import * as XLSX from 'xlsx';

import { DataService } from './dataservice.service';
import { Pronostici, ExcelRow } from '../models/models';
import { Utils } from '../models/utils';

@Injectable()
export class UtilService {

  constructor( private router: Router, public dataService: DataService, private utils: Utils ) { }

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


}
