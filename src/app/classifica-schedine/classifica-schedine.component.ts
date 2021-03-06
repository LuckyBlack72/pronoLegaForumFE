import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorage } from 'ngx-store';

import { UtilService } from '../service/util.service';

import { environment } from '../../environments/environment';

import {
          Stagioni,
          FiltroPronostici,
          PuntiCompetizione,
          DatiClassifica,
          ApplicationParameter,
          DeviceInfo,
          DialogClassificaSchedineData,
          PronosticiSettimanaliPerClassifica,
          DialogPronoTableSchedineData,
          AnagraficaCompetizioniSettimanali,
          NickUtente
      } from '../../models/models';
import { SchedineService } from '../service/schedine.service';

@Component({
  selector: 'app-classifica-schedine',
  templateUrl: './classifica-schedine.component.html',
  styleUrls: ['./classifica-schedine.component.css']
})
export class ClassificaSchedineComponent implements OnInit {

  constructor(

    private activatedRoute: ActivatedRoute,
    private schedineService: SchedineService,
    private utilService: UtilService,
    private deviceDetectorService: DeviceDetectorService,
    public dialog: MatDialog

  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;
  listaStagioniEx: Stagioni[];
  listaStagioniLf: Stagioni[];
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
  // pronosticiUtenti: Pronostici[];
  dataSourceClassifica = new MatTableDataSource([]);
  datiperDataSourceClassifica: any[];
  displayedColumns = [];

  stagioneSelect: number;

  dialogData: DialogClassificaSchedineData = {
    competizioni: [],
    pronostici: [],
    nickname: null
  };

  tipo_pronostici: string;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();
    this.tipo_pronostici = 'E';

    this.listaStagioniEx = this.activatedRoute.snapshot.data.listaStagioni;
    this.listaStagioniLf = this.activatedRoute.snapshot.data.listaStagioniLf;
    this.setComboStagioni(this.listaStagioniEx, this.listaStagioniLf, this.tipo_pronostici);
    this.nickname = this.applicationParameter.nickname; // mi prendo il valore di nickname dal servizio
    this.showClassifica = false;

    this.dialogData = {
      competizioni: [],
      pronostici: [],
      nickname: null
    };

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  setComboStagioni(
                    stagioniEx: Stagioni[],
                    stagioniLf: Stagioni[],
                    tipo_pronostici: string
                  ): void {

    if ( tipo_pronostici === 'E') {
      this.listaStagioni = stagioniEx;
    } else {
      this.listaStagioni = stagioniLf;
    }

  }


  getClassifica(stagione: number) {

    console.log(stagione);

    const searchParameter: FiltroPronostici = { stagione: stagione, tipo_pronostici: this.tipo_pronostici };
    const calcoloClassifica = environment.production
                              ? true // this.utilService.checkDateClassifica(this.dataService.data_calcolo_classifica)
                              : true;

    if (calcoloClassifica && stagione != 0) {

      this.clearDatiClassifica();
      this.schedineService.getDataForClassifica(searchParameter).subscribe(
        dataForClassifica => {

                          this.dialogData.pronostici = dataForClassifica[2];
                          this.datiPerClassifica = this.calcoloClassifica(dataForClassifica[2], dataForClassifica[1], dataForClassifica[0]);
                          this.datiperDataSourceClassifica = this.buildDataSource(this.datiPerClassifica);
                          this.dataSourceClassifica.data = this.datiperDataSourceClassifica;
                          this.displayedColumns.push('Nickname');
                          for (let x = 0; x < this.datiPerClassifica[0].punti.length; x++) {
                            this.displayedColumns.push(this.datiPerClassifica[0].punti[x].competizione);
                          }
                          this.showClassifica = true;
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

/*
      this.schedineService.getPronosticiSettimanaliPerClassifica(searchParameter).subscribe(
        pronosticiUtenti => {

          this.schedineService.getAnagraficaSchedine(stagione).subscribe(
            schedine => {
                          this.dialogData.pronostici = pronosticiUtenti;
                          this.datiPerClassifica = this.calcoloClassifica(pronosticiUtenti, schedine);
                          this.datiperDataSourceClassifica = this.buildDataSource(this.datiPerClassifica);
                          this.dataSourceClassifica.data = this.datiperDataSourceClassifica;
                          this.displayedColumns.push('Nickname');
                          for (let x = 0; x < this.datiPerClassifica[0].punti.length; x++) {
                            this.displayedColumns.push(this.datiPerClassifica[0].punti[x].competizione);
                          }
                          this.showClassifica = true;
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
*/

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

  calcoloClassifica(
                      pronostici: PronosticiSettimanaliPerClassifica[],
                      schedine: AnagraficaCompetizioniSettimanali[],
                      utenti: NickUtente[]
                    ): DatiClassifica[] {


    const retVal: DatiClassifica[] = [];
    let puntiCompetizioneArray: PuntiCompetizione[] = [];
    let puntiCompetizione = 0;
    let indexNick = 0;
    let indexSchedina = 0;
    let indexTotale = 0;

    // Costruisco tutto il ritorno vuoto -------------------
    for ( let iU = 0; iU < utenti.length; iU++ ) {
      for ( let iC = 0; iC < schedine.length; iC++ ) {
          puntiCompetizioneArray.push({
            competizione: schedine[iC].settimana.toString(),
            punti: 0
          });
      }
      puntiCompetizioneArray.push({
        competizione: 'Totale',
        punti: 0
      });
      retVal.push({
        nickname: utenti[iU].nickname,
        punti: puntiCompetizioneArray
      });
      puntiCompetizioneArray =  [];
    }
    // ------------------------------------------------------

    // Calcolo le classifiche ---------------------------------
    for (let x = 0; x < pronostici.length; x++) {

      puntiCompetizione = this.calcolaPuntiCompetizione(pronostici[x]);
      // tslint:disable-next-line:no-shadowed-variable

      indexNick = retVal.findIndex(
                                    (item) =>
                                    item.nickname === pronostici[x].nickname
      );

      indexSchedina = retVal[indexNick].punti.findIndex (
                                                      // tslint:disable-next-line:no-shadowed-variable
                                                      (item) =>
                                                      item.competizione === pronostici[x].settimana.toString()
                                                    );
      indexTotale = retVal[indexNick].punti.findIndex (
                                                      // tslint:disable-next-line:no-shadowed-variable
                                                      (item) =>
                                                      item.competizione === 'Totale'
                                                    );

      retVal[indexNick].punti[indexSchedina].punti = puntiCompetizione;
      retVal[indexNick].punti[indexTotale].punti += puntiCompetizione;
      puntiCompetizione = 0;
      indexNick = 0;
      indexSchedina = 0;
      indexTotale = 0;

    }
    // ---------------------------------------------------------

    return retVal;

  }

  calcolaPuntiCompetizione(pronostici: PronosticiSettimanaliPerClassifica): number {

    let retVal = 0;

    for ( let i = 0; i < pronostici.valori_pronostici.length; i++ ) {
      if (
            pronostici.valori_pronostici[i] === pronostici.valori_pronostici_classifica[i]  &&
            pronostici.valori_pronostici[i] !== 'XXX'
          ) {
            retVal += pronostici.punti_esatti;
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

  clearDatiClassifica(): void {

    this.datiPerClassifica = [];
    this.datiperDataSourceClassifica = [];
    this.displayedColumns = [];

    this.dialogData = {
      competizioni: [],
      pronostici: [],
      nickname: null
    };

  }

  exportClassificaExcel(): void {

    this.utilService.exportClassificaExcel(this.datiperDataSourceClassifica);

  }

  showUserProno(tableRow: any): void {

    this.dialogData.competizioni = [];
    this.dialogData.nickname = tableRow.Nickname;
    for (let i = 1; i < (this.displayedColumns.length - 1); i++) { // la prima e l'ultima colonna non mi servono
      this.dialogData.competizioni.push(this.displayedColumns[i]);
    }

    this.dialog.open(PronoSchedineUserComponent, {
      width: '600px',
      data: this.dialogData
    });

  }

  buildHeaderTableName(columnName: string): string {

//    console.log(columnName);

    let retVal: string;

    if (columnName.includes('Totale')) {
      retVal = columnName;
    } else if (columnName.includes('Nickname')) {
      retVal = columnName;
    } else {
      retVal = 'St ' + columnName;
    }

    return retVal;

  }

  resetClassifica() {

    this.setComboStagioni(this.listaStagioniEx, this.listaStagioniLf, this.tipo_pronostici);
    this.showClassifica = false;
    this.stagioneSelect = null;

  }

}

@Component({
  selector: 'app-prono-schedine-user',
  templateUrl: 'prono-schedine-user.component.html',
})
export class PronoSchedineUserComponent implements OnInit {

  constructor (
    public dialogRef: MatDialogRef<PronoSchedineUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogClassificaSchedineData
  ) {

  }

  dataSourcePronostici = new MatTableDataSource([]);
  paginator: MatPaginator;
  displayedColumns = ['Partita', 'Risultato', 'Pronostico'];
  competizioneToFill: string;
  dataSourcePronosticiData: DialogPronoTableSchedineData[];

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

    this.dataSourcePronosticiData = [];
    for (let i = 0; i < this.data.pronostici.length; i++) {
      if (
          this.data.pronostici[i].settimana.toString() === competizione &&
          this.data.pronostici[i].nickname === this.data.nickname
        ) {
            for (let x = 0; x < this.data.pronostici[i].pronostici.length; x++) {
              this.dataSourcePronosticiData.push(
                                                  {
                                                    partita: this.data.pronostici[i].pronostici[x],
                                                    risultato : this.data.pronostici[i].valori_pronostici_classifica[x],
                                                    pronostico: this.data.pronostici[i].valori_pronostici[x],
                                                    colore: this.getColoreProno(
                                                                            this.data.pronostici[i].valori_pronostici[x],
                                                                            this.data.pronostici[i].valori_pronostici_classifica[x]
                                                                          )
                                                  }
                                                );
            }
            break;
      }
    }
    this.dataSourcePronostici.data = this.dataSourcePronosticiData;

  }

  getColoreProno( pronostico: string,  risultato: string ): string {

    let retVal: string;

    retVal = 'red';

    if ( pronostico === risultato ) {
      retVal = 'green';
    }

    return retVal;

  }

}

