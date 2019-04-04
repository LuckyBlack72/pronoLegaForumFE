import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, MatRadioChange } from '@angular/material';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { SessionStorage, LocalStorageService, SessionStorageService } from 'ngx-store';
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

  ngOnInit() {

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
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
        for (let x = 0; x < this.competizioni.length; x++) {
          if (
              this.competizioni[x].id === this.idCompetizioneToEdit
            ) {
            this.competizioneToSave = this.competizioni[x];
            this.schedina = this.competizioni[x].pronostici;
            this.buildleagueListCombo(this.activatedRoute.snapshot.data.leagueList);
            console.log('this.competizioneToSave');
            console.log(this.competizioneToSave);
            // this.lega = { value: this.competizioneToSave.nome_pronostico, name: this.competizioneToSave.competizione };

console.log(this.leagueList);

console.log(this.lega);

            this.stagioneCompetizione =
            this.competizioneToSave.stagione;
            this.competizioneToSave.date_competizione =
            this.crudCompetizioneService.SplitDateCompetizioneStringIntoArray(this.competizioneToSave.date_competizione.toString(), false);
            this.date_competizione =
            this.competizioneToSave.date_competizione[(this.competizioneToSave.date_competizione.length - 1)];


//            console.log('this.date_competizione');
//            console.log(this.date_competizione);

            this.dataSourceValoriPronostici.data = [];
//            this.buildDataSourceValoriPronostici({}, this.competizioneToSave.pronostici, 'I');
            break;
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

    console.log('internal data');
    console.log(internalData);

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
    this.createUpdateViewCompetizione = 'C';

    if (resetType === 'S') {
      this.refreshDataCompetizioniValoriPronostici();
    }

  }

  refreshDataCompetizioniValoriPronostici(): void {

    this.schedineService.getAnagraficaSchedine(0).subscribe(
      data => {
        // this.sessionStorageService.set('competizioni', data);
        this.competizioni = data;
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
        const searchParameters: FiltroValoriPronostici = {stagione: parseInt(this.utils.getStagione().substring(0, 4), 10)};
      }
    );

  }

  loadValoriPronostici(nome_pronostico: string, stagione: string, giornata: string ): void {

    if (
          (nome_pronostico == null || nome_pronostico == '0') ||
          (stagione == null || stagione == '0')
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

}
