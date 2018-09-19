import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatTableDataSource, Sort} from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { PronosticiService } from '../pronostici.service';
import { DataService } from '../dataservice.service';
import { UtilService } from '../util.service';

import {
          Stagioni,
          FiltroPronostici,
          Pronostici,
          PuntiCompetizione,
          DatiClassifica,
          FiltroValoriPronostici,
          ValoriPronosticiClassifica
      } from '../../models/models';

@Component({
  selector: 'app-classifica',
  templateUrl: './classifica.component.html',
  styleUrls: ['./classifica.component.css']
})
export class ClassificaComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private pronosticiService: PronosticiService,
    public dataService: DataService,
    private utilService: UtilService
  ) { }


  @ViewChild('st') stCmb: ElementRef;

  pronoClosed: boolean;
  showClassifica: boolean;
  dataChiusuraProno: string;
  nickname: string;
  listaStagioni: Stagioni[];
  datiPerClassifica: DatiClassifica[];
  dataSourceClassifica = new MatTableDataSource();
  datiperDataSourceClassifica: any[];
  datiperDataSourceClassificaSorted: any[];
  displayedColumns = [];

  ngOnInit() {

    this.listaStagioni = this.activatedRoute.snapshot.data.listaStagioni;
    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio
    this.pronoClosed = this.utilService.checkDateProno(this.dataService.data_chiusura);
    this.dataChiusuraProno = this.dataService.data_chiusura;
    this.showClassifica = false;

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  getClassifica(stagione: number) {

    const searchParameter: FiltroPronostici = { stagione: stagione};
    const searchParameterCl: FiltroValoriPronostici = { stagione: stagione};
    const calcoloClassifica = this.utilService.checkDateClassifica(this.dataService.data_calcolo_classifica);

    if (calcoloClassifica) {

      this.pronosticiService.getPronostici(searchParameter).subscribe(
        pronosticiUtenti => {
          this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameterCl).subscribe(
            valoriClassifica => {
              this.datiPerClassifica = this.calcoloClassifica(pronosticiUtenti, valoriClassifica);
              this.datiperDataSourceClassifica = this.buildDataSource(this.datiPerClassifica);
              const sort: Sort = { active: 'Totale', direction: 'desc'};
              this.datiperDataSourceClassificaSorted = this.sortData(sort);
              this.dataSourceClassifica.data = this.datiperDataSourceClassifica;
              for (let x = 0; x < this.datiPerClassifica[0].punti.length; x++) {
                this.displayedColumns.push(this.datiPerClassifica[0].punti[x].competizione);
              }
              this.showClassifica = true;
            }
            ,
            errorCl => Swal({
                              allowOutsideClick: false,
                              allowEscapeKey: false,
                              title: 'Errore applicativo',
                              type: 'error'
                            })
          );
        }
        ,
        error => Swal({
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        title: 'Errore applicativo',
                        type: 'error'
                      })
      );

    } else {
        Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Stagione ancora in corso',
          type: 'error'
        });
        this.stCmb.nativeElement.selectedIndex = 0;
        this.showClassifica = false;
    }

  }

  calcoloClassifica(pronostici: Pronostici[], valoriClassifica: ValoriPronosticiClassifica[]): DatiClassifica[] {

    const retVal: DatiClassifica[] = [];
    let puntiCompetizioneArray: PuntiCompetizione[] = [];

    let nickname = '';
    let puntiCompetizione = 0;
    let totalePartecipante = 0;

    for (let i = 0; i < pronostici.length; i++) {
      if (pronostici[i].nickname !== nickname && nickname !== '' ) {
        puntiCompetizioneArray.push({
                                      competizione: 'Totale',
                                      punti: totalePartecipante
                                    });
        retVal.push({
                      nickname: nickname,
                      punti: puntiCompetizioneArray
                    });
        puntiCompetizioneArray = [];
        totalePartecipante = 0;
        nickname = pronostici[i].nickname;
      } else {
        if (nickname === '' ) {
          nickname = pronostici[i].nickname;
        }
      }
      puntiCompetizione = this.calcolaPuntiCompetizione(pronostici[i], valoriClassifica);
      puntiCompetizioneArray.push({
                                    competizione: pronostici[i].competizione,
                                    punti: puntiCompetizione
                                  });
      totalePartecipante += puntiCompetizione;
      puntiCompetizione = 0;
    }

    return retVal;

  }

  calcolaPuntiCompetizione(pronostici: Pronostici, valoriClassifica: ValoriPronosticiClassifica[]): number {

    let retVal = 0;

    for (let i = 0; i < valoriClassifica.length; i++) {
      if (pronostici.id_competizione === valoriClassifica[i].id_competizione ) {
        for (let x = 0; x < pronostici.pronostici.length; x++) {
          for (let y = 0 ; y < valoriClassifica[i].valori_pronostici_classifica.length; y++) {
            if ( pronostici.pronostici[x] === valoriClassifica[i].valori_pronostici_classifica[y] ) {
              if ( x === y ) { // stessa posizione
                retVal += valoriClassifica[i].punti_esatti;
              } else { // posizioni differenti
                retVal += valoriClassifica[i].punti_lista;
              }
              break;
            }
          }
        }
        break;
      }
    }

    return retVal;

  }

  buildDataSource(dataToTransform: DatiClassifica[]): any[] {

    let element: {[x: string]: any} = {};
    const retVal: any[] = [];
    for (let i = 0; i < dataToTransform.length; i++) {
      element['nickname'] = dataToTransform[i].nickname;
      for (let x = 0; x < dataToTransform[i].punti.length; x++) {
        element[dataToTransform[i].punti[x].competizione] =
        dataToTransform[i].punti[x].punti;
      }
      retVal.push(element);
      element = {};
    }

    return retVal;

  }

  sortData(sort: Sort): any[] {
    const data = this.datiperDataSourceClassifica.slice();

    if (!sort.active || sort.direction === '') {
      return data;
    }

    this.datiperDataSourceClassificaSorted = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  compare (a: any, b: any , isAsc: any): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
