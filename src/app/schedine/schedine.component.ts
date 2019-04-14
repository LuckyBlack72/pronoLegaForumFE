import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SessionStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

import { PronosticiService } from '../service/pronostici.service';
import { UtilService } from '../service/util.service';
import { CrudCompetizioneService } from '../service/crudCompetizione.service';
import { Command, CommandService } from '../service/command.service';
import { SchedineService } from '../service/schedine.service';

import {
        ValoriPronosticiComboFiller,
        ApplicationParameter,
        DeviceInfo,
        DatePronostici,
        AnagraficaCompetizioniSettimanali,
        PronosticiSettimanali,
        AnagraficaCompetizioniSettimanaliGrouped
      } from '../../models/models';

import { Utils } from '../../models/utils';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';

@Component({
  selector: 'app-schedine',
  templateUrl: './schedine.component.html',
  styleUrls: ['./schedine.component.css']
})
export class SchedineComponent implements OnInit, OnDestroy {

  constructor(
                private activatedRoute: ActivatedRoute,
                private utils: Utils,
                private pronosticiService: PronosticiService,
                private utilService: UtilService,
                private commandService: CommandService,
                private deviceDetectorService: DeviceDetectorService,
                private crudCompetizioneService: CrudCompetizioneService,
                private schedineService: SchedineService
              ) {
    this.subscriptionHotKey = this.commandService.commands.subscribe(c => this.handleCommand(c));
  }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;

  competizioni: AnagraficaCompetizioniSettimanali[];
  competizioniLf: AnagraficaCompetizioniSettimanali[];

  showProno: boolean;
  numberPronostici: number[] = [];
  numberPronosticiGt10: number[] = [];
  pronosticiGt10: boolean;
  valoriPronosticiToShow: ValoriPronosticiComboFiller[] = [];
  valoriPronosticiToSave: PronosticiSettimanali[];
  valoriPronosticiSaved: PronosticiSettimanali[];

  valoriPronosticiToSaveLf: PronosticiSettimanali[];
  valoriPronosticiSavedLf: PronosticiSettimanali[];
  valoriPronosticiToSaveEx: PronosticiSettimanali[];
  valoriPronosticiSavedEx: PronosticiSettimanali[];

  nickname: string;
  idPartecipante: number;
  idCompToselect: number;
  logo: string;
  pronoClosed: boolean;
  admin: boolean;
  adminPassword: boolean;

  subscriptionHotKey: Subscription;

  cCCToSaveToPronostici: AnagraficaCompetizioniSettimanali[];

  competizioniGrouped: AnagraficaCompetizioniSettimanaliGrouped[];

  idCompetizioneToFill: number;
  dataChiusuraProno: string;
  dateCompetizioneInCorso: DatePronostici = {
    stagione : null,
    data_apertura: null,
    data_chiusura: null,
    data_calcolo_classifica: null
  };
  logoImage: any;

  tipo_pronostici: string;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    this.tipo_pronostici = 'E';

    // prendo i dati dai resolver
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.competizioniLf = this.activatedRoute.snapshot.data.listaCompetizioniLf;

    if ( this.tipo_pronostici === 'E' ) {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
    } else {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioniLf);
    }

    // --------------
    this.valoriPronosticiSavedEx = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.valoriPronosticiToSaveEx = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.valoriPronosticiSavedLf = this.activatedRoute.snapshot.data.pronosticiSavedLf;
    this.valoriPronosticiToSaveLf = this.activatedRoute.snapshot.data.pronosticiSavedLf;

    this.nickname = this.applicationParameter.nickname; // mi prendo il valore di nickname dal servizio
    this.idPartecipante = this.applicationParameter.idPartecipante; // mi prendo il valore di id dal servizio

    this.valoriPronosticiToSaveEx = this.fillPronoToSaveAndSaved(
                                                                  this.valoriPronosticiToSaveEx,
                                                                  this.valoriPronosticiSavedEx,
                                                                  this.competizioni,
                                                                  this.utils.getStagioneCorrente(),
                                                                  this.idPartecipante
                                                                );

    this.valoriPronosticiToSaveLf = this.fillPronoToSaveAndSaved(
                                                                  this.valoriPronosticiToSaveLf,
                                                                  this.valoriPronosticiSavedLf,
                                                                  this.competizioniLf,
                                                                  this.utils.getStagioneCorrente(),
                                                                  this.idPartecipante
                                                                );
    // --------------
    if ( this.tipo_pronostici === 'E' ) {
      this.valoriPronosticiSaved = this.activatedRoute.snapshot.data.pronosticiSaved;
      this.valoriPronosticiToSave = this.valoriPronosticiToSaveEx;
    } else {
      this.valoriPronosticiSaved = this.activatedRoute.snapshot.data.pronosticiSavedLf;
      this.valoriPronosticiToSave = this.valoriPronosticiToSaveLf;
    }

    this.cCCToSaveToPronostici = [];
    // ---------------------------

    this.showProno = false;

  }

  ngOnDestroy() {

    this.subscriptionHotKey.unsubscribe();

  }

  fillPronostici(numero_pronostici: number, idCompetizione: number, tipo_pronostici: string) {

    let datePronosticiCompetizione: DatePronostici[] = [];
    let competizioni: AnagraficaCompetizioniSettimanali[] = [];
    let logoImageSchedine = '';

    if (tipo_pronostici === 'E') {
      competizioni = this.competizioni;
      logoImageSchedine = 'schedina.jpg';
    } else {
      competizioni = this.competizioniLf;
      logoImageSchedine = 'logoLF.gif';
    }

    if (idCompetizione !== 0) { // non ho selezionato scegli una competizione dalla dropdown

      this.valoriPronosticiToShow = [];
      this.numberPronostici = [];
      this.numberPronosticiGt10 = [];
      this.pronosticiGt10 = false;
      this.idCompToselect = idCompetizione; // id della competizione selezionata
      this.logo = '';

      let np = numero_pronostici;
      if (np === 0) {
        for (let y = 0; y < competizioni.length; y++) {
          if ( competizioni[y].id === idCompetizione ) {
            np = competizioni[y].numero_pronostici;
            datePronosticiCompetizione =
            this.crudCompetizioneService.SplitDateCompetizioneStringIntoArray(competizioni[y].date_competizione.toString(), true);
            this.dateCompetizioneInCorso =
            datePronosticiCompetizione[(datePronosticiCompetizione.length - 1)];
            this.crudCompetizioneService.loadLogo(logoImageSchedine).subscribe(
              logoImage => {
                this.createImageFromBlob(logoImage);
              },
              errorImage => {
                this.logoImage = '';
              }
            );
            break;
          }
        }
      } else {
          np = numero_pronostici;
      }

      if (np > 10) {
        for (let i = 1; i <= 10; i++) {
          this.numberPronostici.push(i);
        }
        for (let i = 11; i <= np; i++) {
          this.numberPronosticiGt10.push(i);
        }
      } else {
        for (let i = 1; i <= np; i++) {
          this.numberPronostici.push(i);
        }
      }

      this.logo = logoImageSchedine;

      np > 10 ? this.pronosticiGt10 = true : this.pronosticiGt10 = false;

      this.pronoClosed = this.utilService.checkDateProno(this.dateCompetizioneInCorso.data_chiusura);
      this.showProno = true;

    } else {

      this.showProno = false;
      this.pronosticiGt10 = false;

    }

  }

  salvaPronosticiClassifica()  {

    let dataToSaveArray: AnagraficaCompetizioniSettimanali;

    if (this.admin) { // admin salva la classifica

        for (let i = 0; i < this.cCCToSaveToPronostici.length; i++) {
          if (this.cCCToSaveToPronostici[i].id === this.idCompToselect) {
            dataToSaveArray = this.cCCToSaveToPronostici[i];
            break;
          }
        }

        this.schedineService.saveAnagraficaSchedine(dataToSaveArray, 'U', this.tipo_pronostici).subscribe( // TODO
        data => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Dati Salvati con Successo',
          type: 'success'
        }),
        error => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Errore nel Salvataggio Dati',
          type: 'error'
        })
      );

    } else {

      if ( !this.pronoClosed ) {

        this.schedineService.savePronosticiSettimanali(
          this.valoriPronosticiToSave[this.getIndexCompetizione(this.idCompToselect, this.tipo_pronostici)],
          this.applicationParameter.nickname,
          this.applicationParameter.idPartecipante,
          this.tipo_pronostici
        ).subscribe(
                    data => Swal({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      title: 'Dati Salvati con Successo',
                      type: 'success'
                    }),
                    error => Swal({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      title: 'Errore nel Salvataggio Dati',
                      type: 'error'
                    })
        );

      } else {

        Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Schedina Chiusa',
          type: 'info'
        });

      }

    }

  }

  getIndexCompetizione(idCompetizione: number, tipo_pronostici: string): number {

    let retVal = 0;
    let stagione: number;
    let settimana: number;
    let competizioni: AnagraficaCompetizioniSettimanali[] = [];

    if (tipo_pronostici === 'E') {
      competizioni = this.competizioni;
    } else {
      competizioni = this.competizioniLf;
    }

    if ( this.admin ) {

      for (let y = 0; y < competizioni.length; y++) {
        if ( competizioni[y].id === idCompetizione ) {
          retVal = y;
          break;
        }
      }

    } else {

      for (let x = 0; x < competizioni.length; x++) {
        if ( competizioni[x].id === idCompetizione ) {
          stagione = competizioni[x].stagione;
          settimana = competizioni[x].settimana;
          break;
        }
      }

      for (let i = 0; i < this.valoriPronosticiToSave.length; i++) {
        if (
              this.valoriPronosticiToSave[i].stagione === stagione &&
              this.valoriPronosticiToSave[i].settimana === settimana
            ) {
                retVal = i;
                break;
        }
      }

    }

    return retVal;

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  disableProno() {

    this.pronoClosed = true;

  }

  enableProno() {

    this.pronoClosed = false;

  }

  exportExcelPronostici(): void {

    this.utilService.exportPronosticiExcel(this.valoriPronosticiToSave, this.applicationParameter.nickname);

  }

  setAdmin(setUnset: boolean): void {
    this.admin = setUnset;
  }

  handleCommand(command: Command) {
    switch (command.name) {
      case 'SchedineComponent.SetAdmin':
        this.checkAdminPassword();
        break;
      case 'SchedineComponent.UnsetAdmin':
        this.unsetAdminEnvironment();
        break;
      default:
        break;
      }
  }

  unsetAdminEnvironment(): void {

    this.setAdmin(false);
    this.adminPassword = false;
    // this.pronoClosed = this.utilService.checkDateProno(this.applicationParameter.data_chiusura);
    this.idCompetizioneToFill = 0;
    this.showProno = false;

  }

  async checkAdminPassword() {

    const {value: password} = await Swal({
      title: 'Administrator Login',
      input: 'password',
      inputPlaceholder: 'Enter Administrator password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true
    });

    if (password) {
      this.pronosticiService.checkAdminPassword(password).subscribe(
        data => {
          this.adminPassword = true;
          this.setAdminEnvironment();
        }
        ,
        error => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Password Errata',
          type: 'error'
        })
      );
    }

  }

  resetSchedina() {

    if ( this.admin ) {
      this.cCCToSaveToPronostici = [];
      if ( this.tipo_pronostici === 'E' ) {
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
        for ( let x = 0; x < this.competizioni.length; x++ ) {
          this.cCCToSaveToPronostici.push(this.competizioni[x]);
        }
      } else {
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioniLf);
        for ( let x = 0; x < this.competizioniLf.length; x++ ) {
          this.cCCToSaveToPronostici.push(this.competizioniLf[x]);
        }
      }
    } else {
      if ( this.tipo_pronostici === 'E' ) {
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
        this.valoriPronosticiToSave = this.valoriPronosticiToSaveEx;
      } else {
        this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioniLf);
        this.valoriPronosticiToSave = this.valoriPronosticiToSaveLf;
      }
    }

    this.idCompetizioneToFill = 0;
    this.showProno = false;

  }


 setAdminEnvironment(): void {

    if (this.adminPassword) {

      this.cCCToSaveToPronostici = [];
      if ( this.tipo_pronostici === 'E' ) {
        for ( let x = 0; x < this.competizioni.length; x++ ) {
          this.cCCToSaveToPronostici.push(this.competizioni[x]);
        }
      } else {
        for ( let x = 0; x < this.competizioniLf.length; x++ ) {
          this.cCCToSaveToPronostici.push(this.competizioniLf[x]);
        }
      }

      this.setAdmin(true);
      this.enableProno();
      this.idCompetizioneToFill = 0;
      this.showProno = false;

    } else {

      this.adminPassword = false;
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Password Administrator Errata',
        type: 'error'
      });

    }

  }

  createImageFromBlob(image: Blob) {

    const reader = new FileReader();
    reader.addEventListener('load', () => {
       this.logoImage =  reader.result;
    }, false);
    if (image) {
       reader.readAsDataURL(image);
    }

  }

  fillPronoToSaveAndSaved (
                            valoriPronosticiToSave: PronosticiSettimanali[],
                            valoriPronosticiSaved: PronosticiSettimanali[],
                            competizioni: AnagraficaCompetizioniSettimanali[],
                            stagione: number,
                            idPartecipante: number
                          ): PronosticiSettimanali[] {

    const retVal: PronosticiSettimanali[] = valoriPronosticiToSave;

    // setto l'array con i pronostici da salvare in modo che poi basti solo inserire il pronostico
    if (valoriPronosticiSaved.length === 0) {
      for (let i = 0; i < competizioni.length; i++) {
        const prono = [];
        for (let x = 1; x <= competizioni[i].numero_pronostici; x++) {
          prono.push('XXX');
        }
        const pronostico: PronosticiSettimanali = {
          id_partecipanti: idPartecipante,
          stagione: stagione,
          settimana: competizioni[i].settimana,
          pronostici: competizioni[i].pronostici,
          valori_pronostici: prono
        };
        retVal.push(pronostico);
      }

    } else if (valoriPronosticiSaved.length !== competizioni.length) {
      let fnd = false;
      for (let i = 0; i < competizioni.length; i++) {
        for (let x = 0; x < valoriPronosticiSaved.length; x++) {
          if (
                competizioni[i].stagione === valoriPronosticiSaved[x].stagione &&
                competizioni[i].settimana === valoriPronosticiSaved[x].settimana
              ) {
            fnd = true;
            break;
          }
        }
        if ( fnd ) {
          fnd = false;
        } else {
          const prono = [];
          for (let x = 1; x <= competizioni[i].numero_pronostici; x++) {
            prono.push('XXX');
          }
          const pronostico: PronosticiSettimanali = {
            id_partecipanti: idPartecipante,
            stagione: stagione,
            settimana: competizioni[i].settimana,
            pronostici: competizioni[i].pronostici,
            valori_pronostici: prono
          };
          retVal.push(pronostico);
        }
      }
    }

    return retVal;

  }

}
