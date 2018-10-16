import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, MatRadioChange } from '@angular/material';

import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage, LocalStorageService } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ExternalApiService } from '../service/externalApi.service';
import { CrudCompetizioneService } from '../service/crudCompetizione.service';

import {
        AnagraficaCompetizioni,
        ValoriPronostici,
        ApplicationParameter,
        DeviceInfo,
        TipoCompetizione,
        DatiSquadraLegaForum
      } from '../../models/models';

import { Utils } from '../../models/utils';


@Component({
  selector: 'app-crud-competizione',
  templateUrl: './crud-competizione.component.html',
  styleUrls: ['./crud-competizione.component.css']
})
export class CrudCompetizioneComponent implements OnInit {

  constructor(

    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private externalApiService: ExternalApiService,
    private crudCompetizioneService: CrudCompetizioneService,
    private localStorageService: LocalStorageService

  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;
  @LocalStorage()  datiLegaForum: DatiSquadraLegaForum[][][];

  competizioni: AnagraficaCompetizioni[];
  createUpdateViewCompetizione: string;
  idCompetizioneToEdit: number;
  fillCompetizioneData: boolean;
  isFillingData: boolean;
  leagueList: any;

  competizioneToSave: AnagraficaCompetizioni = {
                                                  id: 0,
                                                  competizione: null,
                                                  nome_pronostico: null,
                                                  anni_competizione: [0],
                                                  punti_esatti: 1,
                                                  punti_lista: 0,
                                                  numero_pronostici: 1,
                                                  pronostici_inseriti: 0,
                                                  logo: null,
                                                  tipo_competizione: null,
                                                  tipo_pronostici: null,
                                                  date_competizione: [{
                                                                        stagione: '0',
                                                                        data_apertura: null,
                                                                        data_chiusura: null,
                                                                        data_calcolo_classifica: null
                                                                      }]
                                                };

  stagioneCompetizione: number;

  listaStagioniCompetizione: number[] = [];
  tipiCompetizione: TipoCompetizione[] = [];
  valoriPronostici: ValoriPronostici[];

  fileToUpload: File;
  @ViewChild('imgLogo') imgLogo: ElementRef;
  imgLogoUrl: string;

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

  lega: any; // per avere nome nome_pronostico = lega.value - per avere competizione = lega.name

  ngOnInit() {

    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.tipiCompetizione = this.activatedRoute.snapshot.data.tipiCompetizione;
    this.localStorageService.set('datiLegaForum', this.activatedRoute.snapshot.data.datiLegaForum);
    this.lega = { value : null, name: null};
    this.buildleagueListCombo('E', 'ALL', this.activatedRoute.snapshot.data.leagueList, this.datiLegaForum);

    this.createUpdateViewCompetizione = 'C';
    this.fillCompetizioneData = false;

    const stagione = parseInt(this.utils.getStagione().substring(0, 4), 10);
    this.listaStagioniCompetizione.push(stagione);
    this.listaStagioniCompetizione.push((stagione + 1));

  }

  setEnabledDisabledScegliButton(): boolean {
    let retVal: boolean;
    retVal = false;
    if (
          this.createUpdateViewCompetizione === 'U' &&
          (!this.idCompetizioneToEdit || this.idCompetizioneToEdit == 0)
        ) {
          retVal = true;
        }
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
        this.competizioneToSave.tipo_pronostici = 'E';
        break;
      case 'U':
        this.crudCompetizioneService.getDatiCompetizione(this.idCompetizioneToEdit).subscribe(
          data => {
            this.competizioneToSave = data;
            this.lega = { value: this.competizioneToSave.nome_pronostico, name: this.competizioneToSave.competizione };
            this.stagioneCompetizione = this.listaStagioniCompetizione[(this.listaStagioniCompetizione.length - 1)];
            this.externalApiService.getValoriPronostici(
                                                          this.competizioneToSave.nome_pronostico,
                                                          this.stagioneCompetizione.toString()
                                                        ).subscribe(
              valoriPronostici => {
                this.dataSourceValoriPronostici.data =
                this.buildDataSourceValoriPronostici(valoriPronostici, [], 'E', 'T');
              },
              erroreApiEsterna => {
                this.resetDataValues();
                Swal({
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  title: 'Errore Applicativo',
                  type: 'error'
                });
              }
            );
          }
          ,
          error => {
            this.resetDataValues();
            Swal({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Errore Applicativo',
              type: 'error'
            });
          }
        );
        break;
      case 'V':
        this.crudCompetizioneService.getDatiCompetizione(this.idCompetizioneToEdit).subscribe(
          data => {
            this.competizioneToSave = data;
            this.lega = { value: this.competizioneToSave.nome_pronostico, name: this.competizioneToSave.competizione };
            this.stagioneCompetizione =
            this.competizioneToSave.anni_competizione[(this.competizioneToSave.anni_competizione.length - 1)];
            for (let i = 0; i < this.valoriPronostici.length; i++) {
              if (this.competizioneToSave.id === this.valoriPronostici[i].id_competizione ) {
                this.dataSourceValoriPronostici.data =
                this.buildDataSourceValoriPronostici({}, this.valoriPronostici[i].valori_pronostici, 'I', '');
                break;
              }
            }
          }
          ,
          error => {
            this.resetDataValues();
            Swal({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Errore Applicativo',
              type: 'error'
            });
          }
        );
        break;
      default:
        break;
    }

  }

  resetData(): void {

    if (this.createUpdateViewCompetizione === 'V') {

      this.resetDataValues();

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
          this.resetDataValues();
        }
      });

    }

  }

  resetDataValues(): void {

    this.competizioneToSave = {
      id: 0,
      competizione: null,
      nome_pronostico: null,
      anni_competizione: [0],
      punti_esatti: 1,
      punti_lista: 0,
      numero_pronostici: 1,
      pronostici_inseriti: 0,
      logo: null,
      tipo_competizione: null,
      tipo_pronostici: null,
      date_competizione: [{
        stagione: '0',
        data_apertura: null,
        data_chiusura: null,
        data_calcolo_classifica: null
      }]
    };

    this.lega = { };
    this.fillCompetizioneData = false;
    this.idCompetizioneToEdit = null;
    this.createUpdateViewCompetizione = 'C';

  }

  saveData(): void {

    this.competizioneToSave.competizione = this.lega.name;
    this.competizioneToSave.nome_pronostico = this.lega.value;

    const checkData = this.crudCompetizioneService.checkDataToSave(this.competizioneToSave, this.stagioneCompetizione);

    if (checkData) { // controlli ok
      if (this.competizioneToSave.id === 0) {
        this.competizioneToSave.anni_competizione[0] = this.stagioneCompetizione;
      } else {
        this.competizioneToSave.anni_competizione.push(this.stagioneCompetizione);
      }
      this.crudCompetizioneService.saveAnagraficaCompetizione(this.competizioneToSave, this.fileToUpload).subscribe(
        data => {
                  this.resetDataValues();
                  Swal({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: 'Competizione Salvata',
                    type: 'success'
                  });
        }
        ,
        error => {
                    this.resetDataValues();
                    Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Errore salvataggio Dati',
                         type: 'error'
                        });
        }
      );
    } else {
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Dati Competizione Mancanti o Errati',
        type: 'error'
      });
    }

  }

  onFileChanged(event: any) {

    const reader = new FileReader();

    if (event.target.files && event.target.files[0]) {

      this.fileToUpload = event.target.files[0];

      reader.onload = (e: any) => {
        this.imgLogoUrl = e.target.result;
        this.competizioneToSave.logo = event.target.files[0];
      };

      reader.readAsDataURL(event.target.files[0]);

    }

  }

  loadValoriPronostici(nome_pronostico: string, stagione: string, tipo_competizione: string, tipo_pronostici: string): void {

    if (
          (nome_pronostico == null || nome_pronostico == '0') ||
          (stagione == null || stagione == '0') ||
          (tipo_competizione == null || tipo_competizione == '0')
        ) {

      this.dataSourceValoriPronostici.data = [];
/*
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Inserire Stagione e Competizione e tipo Competizione per Caricare i Valori dei Pronostici',
        type: 'error'
      });
*/

    } else {

      if (tipo_pronostici === 'E') {

        this.loadValoriPronosticiEsterni(nome_pronostico, stagione, tipo_competizione);

      } else {

        this.loadValoriPronosticiLegaForum(nome_pronostico);

      }


    }

  }

  private loadValoriPronosticiLegaForum(nome_pronostico: string): void {

    const dataSourceData: any[] = [];
    const arrayNomePronostico = nome_pronostico.split('-');
    const serie = arrayNomePronostico[0]; // ALL tutti / numero = indice dell'array
    const girone = arrayNomePronostico[1]; // ALL tutti / numero = indice dell'array
    let push = false;

    for (let i = 0; i < this.datiLegaForum.length; i++) {

      for (let x = 0; x < this.datiLegaForum[i].length; x++) {

        for (let y = 0; y < this.datiLegaForum[i][x].length; y++) {

          if (serie === 'ALL') {
            if (girone === 'ALL') {
              push = true;
            } else {
              if (x === parseInt(girone, 10)) {
                push = true;
              }
            }
          } else {
            if (i === parseInt(serie, 10)) {
              if (girone === 'ALL') {
                push = true;
              } else {
                if (x === parseInt(girone, 10)) {
                  push = true;
                }
              }
            }
          }

          if (push) {
            dataSourceData.push({prono: this.datiLegaForum[i][x][y].squadra});
            push = false;
          }

        }

      }

    }

    this.dataSourceValoriPronostici.data = dataSourceData;

  }

  private loadValoriPronosticiEsterni(nome_pronostico: string, stagione: string, tipo_competizione: string): void {

    if (tipo_competizione === 'SCO') {

      this.externalApiService.getValoriPronostici(
        nome_pronostico,
        stagione
      ).subscribe(
        valoriPronostici => {
          const urlsToCall: string[] = [];
          const annoNum = parseInt(stagione, 10) - 2000;
          const annoNumNext = annoNum + 1;
          const stagioneCall = annoNum.toString(10) + '-' + annoNumNext.toString(10);
          let urlToCall = '';
          for (let i = 0; i < valoriPronostici.data.teams.length; i++) {
            urlToCall =
            'https://soccer.sportsopendata.net/v1/leagues/' +
            nome_pronostico + // Es: serie-a
            '/seasons/' +
            stagioneCall + // Es: 18-19
            '/teams/' +
            valoriPronostici.data.teams[i].name +
            '/players';
            urlsToCall.push(urlToCall);
            urlToCall = '';
          }
          this.externalApiService.getValoriPronosticiScorer(urlsToCall).subscribe(
            scorers => {
              this.dataSourceValoriPronostici.data =
              this.buildDataSourceValoriPronostici(scorers, [], 'E', 'S');
            }
            ,
            erroreScorers => {
              this.dataSourceValoriPronostici.data = [{prono: null}];
            }

          );

        },
        error => {
          this.dataSourceValoriPronostici.data = [{prono: null}];
        }
      );

    } else {

      this.externalApiService.getValoriPronostici(
        nome_pronostico,
        stagione
      ).subscribe(
        valoriPronostici => {
          this.dataSourceValoriPronostici.data =
          this.buildDataSourceValoriPronostici(valoriPronostici, [], 'E', 'T');
        },
        error => {
          this.dataSourceValoriPronostici.data = [{prono: null}];
        }
      );

    }

  }

  applyFilter(filterValue: string) {
    this.dataSourceValoriPronostici.filter = filterValue.trim().toLowerCase();
  }

  private buildDataSourceValoriPronostici(
                                            externalData: any,
                                            internalData: string[],
                                            dataType: string,
                                            competizioneType: string): string[] {

    const retVal: any[] = [];

    if ( dataType === 'I' ) { // dati interni

      for (let i = 0; i < internalData.length; i++) {
        retVal.push({prono: internalData[i]});
      }

    } else { // dati esterni

      if ( competizioneType === 'T' ) { // squadre

        for (let i = 0; i < externalData.data.teams.length; i++) {
          retVal.push({
                        prono: externalData.data.teams[i].name
                      });
        }

      } else { // scorers

        for (let x = 0; x < externalData.length; x++) {

          for (let y = 0; y < externalData[x].data.players.length; y++) {

            if (
              (externalData[x].data.players[y].position === 'centrocampista') ||
              (externalData[x].data.players[y].position === 'attaccante')
            ) {
              retVal.push({
                            prono:
                            externalData[x].data.players[y].fullname +
                            ' ' +
                            externalData[x].data.players[y].name
                          });
            }

          }

        }

      }

    }

    return retVal;

  }

  private buildleagueListCombo(
                                tipo_pronostici: string,
                                tipo_competizione: string,
                                leagues: any,
                                datiLegaForum: DatiSquadraLegaForum[][][]
                              ): void {

    const retVal: any[] = [];

    if (tipo_pronostici == 'E' ) { // esterni

      for (let i = 0; i < leagues.data.leagues.length; i++) {

        switch (tipo_competizione) {

          case 'ALL':
            retVal.push(
              {
                value: leagues.data.leagues[i].league_slug,
                name: leagues.data.leagues[i].name
              }
            );
            if ( leagues.data.leagues[i].cup === false ) {

              retVal.push(
                {
                   value: leagues.data.leagues[i].league_slug,
                   name: 'Capo Cannoniere ' + leagues.data.leagues[i].name
                }
              );

            }
            break;

          case 'CMP':
            if ( leagues.data.leagues[i].cup === false ) {
              retVal.push(
                {
                   value: leagues.data.leagues[i].league_slug,
                   name: leagues.data.leagues[i].name
                });
            }
            break;

          case 'CUP':
            if ( leagues.data.leagues[i].cup === true ) {
              retVal.push(
                {
                  value: leagues.data.leagues[i].league_slug,
                  name: leagues.data.leagues[i].name
                });
            }
            break;

          case 'SCO':
            if ( leagues.data.leagues[i].cup === false ) {

              retVal.push(
                {
                  value: leagues.data.leagues[i].league_slug,
                  name: 'Capo Cannoniere ' + leagues.data.leagues[i].name
                }
              );

            }
            break;
        }

      }

    } else { // legaforum

      switch (tipo_competizione) {

        case 'CMP':

          retVal.push(
            {
              value: '0-ALL',
              name: 'Vincitore Lega Forum'
            });

          for (let x = 0; x < datiLegaForum.length; x++) {

            for (let y = 0; y < datiLegaForum[x].length; y++) {

              retVal.push(
                {
                  value: x + '-' + y,
                  name: 'Podio Girone ' + datiLegaForum[x][y][0].girone
                });

            }

          }
          break;

          case 'CUP':
          retVal.push(
            {
              value: 'ALL-ALL',
              name: 'Coppa Trab'
            });
            retVal.push(
              {
                value: 'ALL-ALL',
                name: 'Vincitore Memorial Franco'
              });
              retVal.push(
                {
                  value: 'ALL-ALL',
                  name: 'Vincitore Masters Cup'
                });
              retVal.push(
              {
                value: 'ALL-ALL',
                name: 'Vincitore Champions Cup'
              });
            break;

            case 'ALL':
              retVal.push(
                {
                  value: '0-ALL',
                  name: 'Vincitore Lega Forum'
                });

              for (let x = 0; x < datiLegaForum.length; x++) {

                for (let y = 0; y < datiLegaForum[x].length; y++) {

                  retVal.push(
                    {
                      value: x + '-' + y,
                      name: 'Podio ' + datiLegaForum[x][y][0].girone
                    });

                }

              }
              retVal.push(
                {
                  value: 'ALL-ALL',
                  name: 'Vincitore Coppa Trab'
                });
                retVal.push(
                  {
                    value: 'ALL-ALL',
                    name: 'Vincitore Memorial Franco'
                  });
                  retVal.push(
                    {
                      value: 'ALL-ALL',
                      name: 'Vincitore Masters Cup'
                    });
                  retVal.push(
                  {
                    value: 'ALL-ALL',
                    name: 'Vincitore Champions Cup'
                  });
              break;
      }

    }

    this.leagueList = retVal;
    this.lega.nome = null;
    this.lega.value = '0';
    this.stagioneCompetizione = 0;
    this.dataSourceValoriPronostici.data = [];

  }

  changeTipoPronostici($event: MatRadioChange) {

    this.competizioneToSave.tipo_competizione = '0';
    this.lega.nome = null;
    this.lega.value = '0';
    this.stagioneCompetizione = 0;
    this.dataSourceValoriPronostici.data = [];
    this.buildleagueListCombo(
      $event.value,
      'ALL',
      this.activatedRoute.snapshot.data.leagueList,
      this.datiLegaForum
    );

  }

}
