import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, Sort, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage, SessionStorageService, LocalStorageService } from 'ngx-store';

import { PronosticiService } from '../service/pronostici.service';
// import { DataService } from '../dataservice.service';
import { UtilService } from '../service/util.service';

import { environment } from '../../environments/environment';

import {
          Stagioni,
          FiltroPronostici,
          Pronostici,
          PuntiCompetizione,
          DatiClassifica,
          FiltroValoriPronostici,
          ValoriPronosticiClassifica,
          ApplicationParameter,
          DeviceInfo,
          DialogClassificaData,
          DialogPronoTableData
      } from '../../models/models';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

@Component({
  selector: 'app-classifica',
  templateUrl: './classifica.component.html',
  styleUrls: ['./classifica.component.css']
})
export class ClassificaComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private pronosticiService: PronosticiService,
    // public dataService: DataService,
    private utilService: UtilService,
    private deviceDetectorService: DeviceDetectorService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;
  // @LocalStorage() listaStagioni: Stagioni[];
  listaStagioni: Stagioni[];

  @ViewChild('st') stCmb: ElementRef;
  @ViewChild('table') tabValoriPronostici: ElementRef;

  paginator: MatPaginator;
  sort: MatSort;

  @ViewChild(MatSort)
  set iniSort(sort: MatSort) {
    this.sort = sort;
    this.dataSourceClassifica.sort = this.sort;
  }

  @ViewChild(MatPaginator)
  set iniPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSourceClassifica.paginator = this.paginator;
  }

  // fsort: Sort;
  showClassifica: boolean;
  nickname: string;
  datiPerClassifica: DatiClassifica[];
  pronosticiUtenti: Pronostici[];
  dataSourceClassifica = new MatTableDataSource([]);
  datiperDataSourceClassifica: any[];
  // datiperDataSourceClassificaSorted: any[];
  displayedColumns = [];

  stagioneSelect: number;

  dialogData: DialogClassificaData = {
    competizioni: [],
    pronostici: [],
    valoriClassifica: [],
    nickname: null
  };
  pronoType: string;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    // this.localStorageService.set('listaStagioni', this.activatedRoute.snapshot.data.listaStagioni);
    this.listaStagioni = this.activatedRoute.snapshot.data.listaStagioni;
    this.nickname = this.applicationParameter.nickname; // mi prendo il valore di nickname dal servizio
    this.showClassifica = false;
    this.pronoType = 'E';

    this.dialogData = {
      competizioni: [],
      pronostici: [],
      valoriClassifica: [],
      nickname: null
    };

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  getClassifica(stagione: number) {

    // console.log(stagione);

    const searchParameter: FiltroPronostici = { stagione: stagione};
    const searchParameterCl: FiltroValoriPronostici = { stagione: stagione};
    const calcoloClassifica = environment.production
                              ? true // this.utilService.checkDateClassifica(this.dataService.data_calcolo_classifica)
                              : true;

    if (calcoloClassifica && stagione != 0) {

      this.clearDatiClassifica();
      this.pronosticiService.getPronostici(searchParameter).subscribe(
        pronosticiUtenti => {
          this.dialogData.pronostici = pronosticiUtenti;
// console.log(pronosticiUtenti);
          this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameterCl).subscribe(
            valoriClassifica => {
              this.dialogData.valoriClassifica = valoriClassifica;
// console.log(valoriClassifica);
              this.datiPerClassifica = this.calcoloClassifica(pronosticiUtenti, valoriClassifica);
// console.log(this.datiPerClassifica);
              this.datiperDataSourceClassifica = this.buildDataSource(this.datiPerClassifica);
              // this.fsort = { active: 'Totale', direction: 'desc'};
              // this.datiperDataSourceClassificaSorted = this.sortData(this.fsort);
              this.dataSourceClassifica.data = this.datiperDataSourceClassifica;
              this.displayedColumns.push('Nickname');
              for (let x = 0; x < this.datiPerClassifica[0].punti.length; x++) {
                this.displayedColumns.push(this.datiPerClassifica[0].punti[x].competizione);
              }
// console.log(this.displayedColumns);
              this.showClassifica = true;
            }
            ,
            errorCl => {
                        this.stCmb.nativeElement.selectedIndex = 0;
                        this.showClassifica = false;
                        Swal({
                              allowOutsideClick: false,
                              allowEscapeKey: false,
                              title: 'Errore applicativo',
                              type: 'error'
                            });

                        }
          );
        }
        ,
        error => {

                    this.stCmb.nativeElement.selectedIndex = 0;
                    this.showClassifica = false;
                    Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Errore applicativo',
                          type: 'error'
                        });

                  }
      );

    } else {

      if (!calcoloClassifica) { // si può calcolare la classifica ma non ho selezionato stagioni

        this.stCmb.nativeElement.selectedIndex = 0;
        this.showClassifica = false;

        Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Stagione ancora in corso',
          type: 'error'
        });

      } else {

        this.showClassifica = false;

      }
    }

  }

  calcoloClassifica(pronostici: Pronostici[], valoriClassifica: ValoriPronosticiClassifica[]): DatiClassifica[] {

    const retVal: DatiClassifica[] = [];
    let puntiCompetizioneArray: PuntiCompetizione[] = [];

    let nickname = 'XXX';
    let puntiCompetizione = 0;
    let totalePartecipante = 0;

//    console.log(pronostici);

    for (let i = 0; i < pronostici.length; i++) {
      if (pronostici[i].tipo_pronostici === this.pronoType) { // Pronostici dello stesso tipo del radio button

        if (nickname === 'XXX') {
          nickname = pronostici[i].nickname;
        }

        if (pronostici[i].nickname === nickname) {

          puntiCompetizione = this.calcolaPuntiCompetizione(pronostici[i], valoriClassifica);
          puntiCompetizioneArray.push({
                                        competizione: pronostici[i].competizione,
                                        punti: puntiCompetizione
                                      });
          totalePartecipante += puntiCompetizione;
          puntiCompetizione = 0;

        } else {

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
          puntiCompetizione = this.calcolaPuntiCompetizione(pronostici[i], valoriClassifica);
          puntiCompetizioneArray.push({
                                        competizione: pronostici[i].competizione,
                                        punti: puntiCompetizione
                                      });
          totalePartecipante += puntiCompetizione;
          puntiCompetizione = 0;

        }

      }

    }

    // i dati dell'ultimo partecipante
    puntiCompetizioneArray.push({
                                  competizione: 'Totale',
                                  punti: totalePartecipante
                              });
    retVal.push({
                  nickname: nickname,
                  punti: puntiCompetizioneArray
    });

//    console.log(retVal);

    return retVal;

  }

  calcolaPuntiCompetizione(pronostici: Pronostici, valoriClassifica: ValoriPronosticiClassifica[]): number {

    let retVal = 0;

    if (this.pronoType === 'E') {

      for (let i = 0; i < valoriClassifica.length; i++) {
        if (pronostici.id_competizione === valoriClassifica[i].id_competizione ) {
          for (let x = 0; x < pronostici.pronostici.length; x++) {
            for (let y = 0 ; y < valoriClassifica[i].valori_pronostici_classifica.length; y++) {
              if (
                    pronostici.pronostici[x] !== 'XXX' &&
                    pronostici.pronostici[x] === valoriClassifica[i].valori_pronostici_classifica[y]
                ) {
                if ( x === y ) { // stessa posizione
                  retVal += valoriClassifica[i].punti_esatti;
                } else { // posizioni differenti
                  if ( valoriClassifica[i].tipo_competizione === 'CMP' || valoriClassifica[i].tipo_competizione === 'SCO' ) { // campionati
                    retVal += valoriClassifica[i].punti_lista;
                  } else { // coppe
                    if ( x > 1 && y > 1 ) { // nelle coppe 3 e 4 sono esatti anche se invertiti
                        retVal += valoriClassifica[i].punti_esatti;
                      } else {
                        retVal += valoriClassifica[i].punti_lista;
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        }
      }

    } else { // Lega Forum

      for (let i = 0; i < valoriClassifica.length; i++) {
        if (pronostici.id_competizione === valoriClassifica[i].id_competizione ) {
          for (let x = 0; x < pronostici.pronostici.length; x++) {
            for (let y = 0 ; y < valoriClassifica[i].valori_pronostici_classifica.length; y++) {
              if (
                    pronostici.pronostici[x] !== 'XXX' &&
                    pronostici.pronostici[x] === valoriClassifica[i].valori_pronostici_classifica[y]
                  ) {
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

    }

    return retVal;

  }

  buildDataSource(dataToTransform: DatiClassifica[]): any[] {

    let element: {[x: string]: any} = {};
    const retVal: any[] = [];
    for (let i = 0; i < dataToTransform.length; i++) {
      element['Nickname'] = dataToTransform[i].nickname;
      for (let x = 0; x < dataToTransform[i].punti.length; x++) {
        element[dataToTransform[i].punti[x].competizione] =
        dataToTransform[i].punti[x].punti;
      }
      retVal.push(element);
      element = {};
    }

    return retVal;

  }

  applyFilter(filterValue: string) {
    this.dataSourceClassifica.filter = filterValue.trim().toLowerCase();
  }

  /* non serve usando matSort
  sortData(sort: Sort): any[] {
    const data = this.datiperDataSourceClassifica.slice();

    if (!sort.active || sort.direction === '' || data.length < 2) {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

  }

  compare (a: any, b: any , isAsc: any): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  */

  clearDatiClassifica(): void {

    this.datiPerClassifica = [];
    this.datiperDataSourceClassifica = [];
    // this.datiperDataSourceClassificaSorted = [];
    this.displayedColumns = [];

    this.dialogData = {
      competizioni: [],
      pronostici: [],
      valoriClassifica: [],
      nickname: null
    };

  }

  exportClassificaExcel(): void {

    this.utilService.exportClassificaExcel(this.datiperDataSourceClassifica);

  }

  showUserProno(tableRow: any): void {

    this.dialogData.nickname = tableRow.Nickname;
    this.dialogData.competizioni = [];
    for (let i = 1; i < (this.displayedColumns.length - 1); i++) { // la prima e l'ultima colonna non mi servono
      this.dialogData.competizioni.push(this.displayedColumns[i]);
    }

    this.dialog.open(PronoUserComponent, {
      width: '600px',
      data: this.dialogData
    });

  }

  buildHeaderTableName(columnName: string): string {

//    console.log(columnName);

    let retVal: string;

    if (this.pronoType === 'E') {
      retVal = columnName;
    } else {

      if (columnName.includes('Vincitore Lega Forum')) {
        retVal = 'Lega Forum';
      }
      if (columnName.startsWith('Podio')) {
        retVal = 'Gi ' + columnName[(columnName.length - 1)];
      }
      if (columnName.includes('Trab')) {
        retVal = 'Trab';
      }
      if (columnName.includes('Franco')) {
        retVal = 'M. Franco';
      }
      if (columnName.includes('Masters')) {
        retVal = 'Masters';
      }
      if (columnName.includes('Champions')) {
        retVal = 'Champions';
      }
      if (columnName.includes('Totale')) {
        retVal = columnName;
      }
      if (columnName.includes('Nickname')) {
        retVal = columnName;
      }
    }

    return retVal;

  }

  resetClassifica() {

    this.showClassifica = false;
    this.stagioneSelect = null;

  }

}

@Component({
  selector: 'app-prono-user',
  templateUrl: 'prono-user.component.html',
})
export class PronoUserComponent implements OnInit {

  constructor (
    public dialogRef: MatDialogRef<PronoUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogClassificaData
  ) {

  }

  dataSourcePronostici = new MatTableDataSource([]);
  paginator: MatPaginator;
  displayedColumns = ['Posizione', 'Classifica', 'Pronostico'];
  competizioneToFill: string;
  dataSourcePronosticiData: DialogPronoTableData[];

  @ViewChild(MatPaginator)
  set iniPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSourcePronostici.paginator = this.paginator;
  }

  onExitClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.competizioneToFill = this.data.competizioni[0];
    this.fillPronostici(this.competizioneToFill);

  }

  fillPronostici(competizione: string) {

    let idxValoriClassifica: number;

    this.dataSourcePronosticiData = [];
    for (let i = 0; i < this.data.pronostici.length; i++) {
      if (
          this.data.pronostici[i].competizione === competizione &&
          this.data.pronostici[i].nickname === this.data.nickname
        ) {
        for (let y = 0; y < this.data.valoriClassifica.length; y++) {
          if (this.data.pronostici[i].id_competizione === this.data.valoriClassifica[y].id_competizione) {
            idxValoriClassifica = y;
            break;
          }
        }
        for (let x = 0; x < this.data.pronostici[i].pronostici.length; x++) {
          this.dataSourcePronosticiData.push(
                                              {
                                                posizione: (x + 1),
                                                classifica: this.data.valoriClassifica[idxValoriClassifica].valori_pronostici_classifica[x]
                                                .replace('XXX', 'Non Disponibile'),
                                                pronostico: this.data.pronostici[i].pronostici[x]
                                                .replace('XXX', 'Non Pronosticato'),
                                                colore: this.getColoreProno(
                                                                        this.data.valoriClassifica[idxValoriClassifica],
                                                                        this.data.pronostici[i].pronostici[x],
                                                                        x
                                                                      )
                                              }
                                            );
        }
        break;
      }
    }
    this.dataSourcePronostici.data = this.dataSourcePronosticiData;

  }

  getColoreProno( valoriClassifica: ValoriPronosticiClassifica,  pronostici: string, indicePronostico: number ): string {

    let retVal: string;

    retVal = 'red';

    for (let y = 0 ; y < valoriClassifica.valori_pronostici_classifica.length; y++) {
      if (
            pronostici !== 'XXX' &&
            pronostici === valoriClassifica.valori_pronostici_classifica[y]
        ) {
          if ( indicePronostico === y ) { // stessa posizione
            retVal = 'green';
          } else { // posizioni differenti
            if ( valoriClassifica.tipo_competizione === 'CMP' ) { // campionati
              if ( valoriClassifica.punti_lista > 0) {
                retVal = 'blue';
              } else {
                retVal = 'red';
              }
            } else if ( valoriClassifica.tipo_competizione === 'SCO' ) {
              retVal = 'blue';
            } else { // coppe
              if ( indicePronostico > 1 && y > 1 ) { // nelle coppe 3 e 4 sono esatti anche se invertiti
                  retVal = 'green';
                } else {
                  retVal = 'blue';
              }
            }
          }
          break;
      }
    }

    return retVal;

  }

}
