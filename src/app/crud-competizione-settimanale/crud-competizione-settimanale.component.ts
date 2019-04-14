import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { SessionStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ExternalApiService } from '../service/externalApi.service';
import { SchedineService } from '../service/schedine.service';
import { CrudCompetizioneService } from '../service/crudCompetizione.service';

import { Utils } from '../../models/utils';

import {
  ApplicationParameter,
  DeviceInfo,
  DatePronostici,
  FiltroValoriPronostici,
  AnagraficaCompetizioniSettimanali,
  AnagraficaCompetizioniSettimanaliGrouped
} from '../../models/models';
import { StringifyOptions } from 'querystring';

@Component({
  selector: 'app-crud-competizione-settimanale',
  templateUrl: './crud-competizione-settimanale.component.html',
  styleUrls: ['./crud-competizione-settimanale.component.css']
})
export class CrudCompetizioneSettimanaleComponent implements OnInit {

  constructor(

    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private externalApiService: ExternalApiService,
    private schedineService: SchedineService,
    private crudCompetizioneService: CrudCompetizioneService

  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;
  competizioni: AnagraficaCompetizioniSettimanali[];
  competizioniLf: AnagraficaCompetizioniSettimanali[];

  createUpdateViewCompetizione: string;
  idCompetizioneToEdit: number;

  fillCompetizioneData: boolean;
  isFillingData: boolean;
  leagueList: any;

  competizioneToSave: AnagraficaCompetizioniSettimanali = {
    id: 0,
    stagione: 0,
    settimana: 0,
    pronostici: ['XXX'],
    valori_pronostici: ['XXX'],
    date_competizione: [{
                          stagione: '0',
                          data_apertura: null,
                          data_chiusura: null,
                          data_calcolo_classifica: null
                        }],
    numero_pronostici: 1,
    punti_esatti: 1,
    punti_lista: 0
  };

  stagioneCompetizione: number;

  date_competizione: DatePronostici = {
    stagione : null,
    data_apertura: null,
    data_chiusura: null,
    data_calcolo_classifica: null
  };

  @ViewChild('table') tabClassifica: ElementRef;
  paginator: MatPaginator;
  sort: MatSort;

  @ViewChild(MatSort)
  set iniSort(sort: MatSort) {
    this.sort = sort;
    this.dataSourceValoriPronostici.sort = this.sort;
  }

  @ViewChild(MatPaginator)
  set iniPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSourceValoriPronostici.paginator = this.paginator;
  }

  dataSourceValoriPronostici = new MatTableDataSource([]);
  displayedColumns = ['prono'];

  lega: any = {value: null, name: null}; // per avere nome nome_pronostico = lega.value - per avere competizione = lega.name
  competizioniGrouped: AnagraficaCompetizioniSettimanaliGrouped[];
  schedina: string[] = [];
  roundList: any[] = [];
  giornataToLoad: string;

  selectableChip = true;
  removableChip  = true;

  tipo_pronostici: string;

  ngOnInit() {

    this.tipo_pronostici = 'E';

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.competizioniLf = this.activatedRoute.snapshot.data.listaCompetizioniLf;

    this.setComboCompetizioni(this.competizioni, this.competizioniLf, this.tipo_pronostici);

    this.lega = { value : null, name: null};
    this.buildleagueListCombo(this.activatedRoute.snapshot.data.leagueList);
    this.buildRoundListCombo();

    this.createUpdateViewCompetizione = 'C';
    this.fillCompetizioneData = false;

  }

  private buildleagueListCombo( leagues: any ): void {

    const retVal: any[] = [];

    for (let i = 0; i < leagues.data.leagues.length; i++) {

      if ( leagues.data.leagues[i].cup === false ) {
        retVal.push(
                    {
                      value: leagues.data.leagues[i].league_slug,
                      name:  leagues.data.leagues[i].name
                    }
                  );
      }

    }

    this.leagueList = retVal;
    this.lega.nome = null;
    this.lega.value = '0';
    this.stagioneCompetizione = 0;
    this.dataSourceValoriPronostici.data = [];
  }

  setEnabledDisabledScegliButton(): boolean {
    let retVal: boolean;
    retVal = false;
    /*
    if (
          this.createUpdateViewCompetizione === 'U' &&
          (!this.idCompetizioneToEdit || this.idCompetizioneToEdit == 0)
        ) {
          retVal = true;
        }
    */
    return retVal;
  }

  setEnabledDisabledDropDownCompetizione(): boolean {
    let retVal: boolean;
    retVal = false;
    if (this.createUpdateViewCompetizione === 'C') {
      this.idCompetizioneToEdit = null;
      retVal = true;
    }
    return retVal;
  }

  createUpdateViewCompetizioneData(createUpdateViewCompetizione: string): void {

    this.fillCompetizioneData = true;

    switch (createUpdateViewCompetizione) {

      case 'C':
        this.stagioneCompetizione = this.utils.getStagioneCorrente();
        break;
      case 'V':
        if ( this.tipo_pronostici === 'E' ) {
          for (let x = 0; x < this.competizioni.length; x++) {
            if (
                this.competizioni[x].id === this.idCompetizioneToEdit
              ) {
              this.competizioneToSave = this.competizioni[x];
              this.schedina = this.competizioni[x].pronostici;
              this.buildleagueListCombo(this.activatedRoute.snapshot.data.leagueList);
              this.stagioneCompetizione =
              this.competizioneToSave.stagione;
              this.competizioneToSave.date_competizione =
              this.crudCompetizioneService.SplitDateCompetizioneStringIntoArray(
                                                                                  this.competizioneToSave.date_competizione.toString(),
                                                                                  false
                                                                                );
              this.date_competizione =
              this.competizioneToSave.date_competizione[(this.competizioneToSave.date_competizione.length - 1)];
              this.dataSourceValoriPronostici.data = [];
              break;
            }
          }
        } else {
          for (let x = 0; x < this.competizioniLf.length; x++) {
            if (
                this.competizioniLf[x].id === this.idCompetizioneToEdit
              ) {
              this.competizioneToSave = this.competizioniLf[x];
              this.schedina = this.competizioniLf[x].pronostici;
              this.buildleagueListCombo(this.activatedRoute.snapshot.data.leagueList);
              this.stagioneCompetizione =
              this.competizioneToSave.stagione;
              this.competizioneToSave.date_competizione =
              this.crudCompetizioneService.SplitDateCompetizioneStringIntoArray(
                                                                                  this.competizioneToSave.date_competizione.toString(),
                                                                                  false
                                                                                );
              this.date_competizione =
              this.competizioneToSave.date_competizione[(this.competizioneToSave.date_competizione.length - 1)];
              this.dataSourceValoriPronostici.data = [];
              break;
            }
          }

        }
        break;
      default:
        break;
    }

  }

  private buildDataSourceValoriPronostici(
                                            externalData: any,
                                            internalData: string[],
                                            dataType: string
                                          ): string[] {

    const retVal: any[] = [];

//    console.log('internal data');
//    console.log(internalData);

    if ( dataType === 'I' ) { // dati interni
      for (let i = 0; i < internalData.length; i++) {
        retVal.push({prono: internalData[i]});
      }

    } else { // dati esterni

      for (let i = 0; i < externalData.data.rounds[0].matches.length; i++) {
          retVal.push({
          prono: externalData.data.rounds[0].matches[i].home_team + ' - ' +  externalData.data.rounds[0].matches[i].away_team
        });
      }

    }

    return retVal;

  }

  resetData(): void {

    if (this.createUpdateViewCompetizione === 'V') {

      this.resetDataValues('R');

    } else {

      Swal({
        title: 'Vuoi veramente annullare i dati inseriti ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Conferma Annullamento'
      }).then((result) => {
        if (result.value) {
          this.resetDataValues('R');
        }
      });

    }

  }

  resetDataValues(resetType: string): void {

    this.competizioneToSave = {
      id: 0,
      stagione: 0,
      settimana: 0,
      pronostici: ['XXX'],
      valori_pronostici: ['XXX'],
      date_competizione: [{
                            stagione: '0',
                            data_apertura: null,
                            data_chiusura: null,
                            data_calcolo_classifica: null
                          }],
      numero_pronostici: 1,
      punti_esatti: 1,
      punti_lista: 0
    };

    // this.lega = { };
    this.date_competizione = { };
    this.fillCompetizioneData = false;
    this.idCompetizioneToEdit = null;
    this.schedina = [];
    this.createUpdateViewCompetizione = 'C';

    if (resetType === 'S') {
      this.refreshDataCompetizioniValoriPronostici();
    }

  }

  refreshDataCompetizioniValoriPronostici(): void {

    this.schedineService.getAnagraficaSchedine( 0, this.tipo_pronostici ).subscribe(
      data => {
        // this.sessionStorageService.set('competizioni', data);
        this.competizioni = data;
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
      }
    );

  }

  loadValoriPronostici(nome_pronostico: string, stagione: string, giornata: string ): void {

    if (
          (nome_pronostico == null || nome_pronostico === '0') ||
          (stagione == null || stagione === '0')
        ) {

      this.dataSourceValoriPronostici.data = [];

    } else {

      this.loadValoriPronosticiEsterni(nome_pronostico, stagione, giornata);

    }

  }

  private loadValoriPronosticiEsterni(nome_pronostico: string, stagione: string, giornata: string): void {

    this.externalApiService.getValoriPronosticiSchedine(
      nome_pronostico,
      stagione,
      giornata
    ).subscribe(
      valoriPronostici => {
        this.dataSourceValoriPronostici.data =
        this.buildDataSourceValoriPronostici(valoriPronostici, [], 'E');
      },
      error => {
        this.dataSourceValoriPronostici.data = [{prono: null}];
      }
    );

  }

  applyFilter(filterValue: string) {
    this.dataSourceValoriPronostici.filter = filterValue.trim().toLowerCase();
  }

  clearSchedina(): void {
    this.schedina = [];
  }

  buildRoundListCombo(): void {

    this.roundList = [];
    for (let i = 0 ; i < 38 ; i++) {
      this.roundList.push({value: 'round-' + (i + 1), name: (i + 1)});
    }

  }

  saveData(): void {

    let checkData: boolean;

    this.competizioneToSave.pronostici = this.schedina;

    checkData = this.schedineService.checkDataToSave(this.competizioneToSave);

    if (checkData) { // controlli ok

      this.date_competizione.stagione = this.stagioneCompetizione.toString();
      this.competizioneToSave.stagione = this.stagioneCompetizione;
      this.competizioneToSave.date_competizione[0] = this.date_competizione;

      this.schedineService.getNewSettimanaSchedina(this.stagioneCompetizione, this.tipo_pronostici).subscribe(
        settimana => {
                        this.competizioneToSave.settimana = settimana[0].settimana;
                        this.schedineService.saveAnagraficaSchedine(this.competizioneToSave, 'I', this.tipo_pronostici).subscribe(
                          data => {
                                    this.resetDataValues('S');
                                    Swal({
                                      allowOutsideClick: false,
                                      allowEscapeKey: false,
                                      title: 'Schedina Salvata',
                                      type: 'success'
                                    });
                          }
                          ,
                          error => {
                                      this.resetDataValues('R');
                                      Swal({
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            title: 'Errore salvataggio Dati',
                                          type: 'error'
                                          });
                          }
                        );
        }
        ,
        error => {
          Swal({
                allowOutsideClick: false,
                allowEscapeKey: false,
                title: 'Errore Comunicazione Riprovare',
              type: 'error'
              });
        }

      );

    } else {
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Dati Schedina Mancanti o Errati',
        type: 'error'
      });
    }

  }

  addProno(tableRow: any): void {

    if ( this.schedina.length < this.competizioneToSave.numero_pronostici ) {

        if ( this.schedina.indexOf(tableRow.prono) === -1)  {

          this.schedina.push(tableRow.prono);

        } else {

          Swal({
            allowOutsideClick: false,
            allowEscapeKey: false,
            title: 'Pronostico già inserito',
            type: 'error'
          });

        }

    } else {

      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Hai già inserito tutti i pronostici necessari',
        type: 'error'
      });

    }

  }

  removeProno(partita: any): void {

    const index = this.schedina.indexOf(partita);
    if (index >= 0) {
      this.schedina.splice(index, 1);
    }

  }

  async importDataFromExcel () { // async come le promise

    const dataSourceData: any[] = [];

    const {value: file} = await Swal({ // await impedisce al codice sottostante di essere sereguito fino al fullfillment della promise
      title: 'Importa partite da file Excel' ,
      input: 'file',
      inputAttributes: {
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      showCancelButton: true
    });

    if (file) {
      Swal.showLoading();
      const reader = new FileReader;
      reader.onload = (e) => {

        const fileData = reader.result;

        /* creo il WorkBook*/
        const wb = XLSX.read(fileData, {type : 'binary'});
        /* Get worksheet */
        const ws = wb.Sheets[wb.SheetNames[0]];
        const wsRows = XLSX.utils.sheet_to_json(ws);
        for (let i = 0; i < wsRows.length; i++) {
          for (const [key, value] of Object.entries(wsRows[i])) { // loop sulle righe del file
            if (key === 'Partita') {

              dataSourceData.push({prono: value});

            }
          }
        }
        this.dataSourceValoriPronostici.data = dataSourceData;
      };
      reader.readAsBinaryString(file);
    }

  }

  setComboCompetizioni(
                        competizioniEx: AnagraficaCompetizioniSettimanali[],
                        competizioniLf: AnagraficaCompetizioniSettimanali[],
                        tipo_pronostici: string
                      ): void {

    if ( tipo_pronostici === 'E') {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(competizioniEx);
    } else {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(competizioniLf);
    }

  }

}
