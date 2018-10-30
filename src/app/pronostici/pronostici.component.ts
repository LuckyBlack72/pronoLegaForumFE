import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage, SessionStorageService, LocalStorageService } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

// import { DataService } from '../dataservice.service';
import { PronosticiService } from '../service/pronostici.service';
import { UtilService } from '../service/util.service';
import { ExternalApiService } from '../service/externalApi.service';
import { CrudCompetizioneService } from '../service/crudCompetizione.service';
import { Command, CommandService } from '../service/command.service';

import {
        AnagraficaCompetizioni,
        ValoriPronostici,
        Pronostici,
        ValoriPronosticiComboFiller,
        CheckDuplicateProno,
        ValoriPronosticiClassifica,
        FiltroPronostici,
        ApplicationParameter,
        ApiTransformReturnValue,
        DeviceInfo,
        AnagraficaCompetizioniGrouped,
        DatePronostici
      } from '../../models/models';

import { Utils } from '../../models/utils';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';

@Component({
  selector: 'app-pronostici',
  templateUrl: './pronostici.component.html',
  styleUrls: ['./pronostici.component.css']
})

export class PronosticiComponent implements OnInit, OnDestroy {

  constructor(
              private activatedRoute: ActivatedRoute,
              private utils: Utils,
              private pronosticiService: PronosticiService,
  //            public dataService: DataService,
              private utilService: UtilService,
              private commandService: CommandService,
              private externalApiService: ExternalApiService,
              private deviceDetectorService: DeviceDetectorService,
              private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService,
              private crudCompetizioneService: CrudCompetizioneService
            ) {
    this.subscriptionHotKey = this.commandService.commands.subscribe(c => this.handleCommand(c));
  }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;


  // @LocalStorage() competizioni: AnagraficaCompetizioni[];
  // @LocalStorage() valoriPronostici: ValoriPronostici[];

  competizioni: AnagraficaCompetizioni[];
  valoriPronostici: ValoriPronostici[];

  showProno: boolean;
  numberPronostici: number[] = [];
  numberPronosticiGt10: number[] = [];
  pronosticiGt10: boolean;
  valoriPronosticiToShow: ValoriPronosticiComboFiller[] = [];
  valoriPronosticiToSave: Pronostici[];
  valoriPronosticiSaved: Pronostici[];
  nickname: string;
  idPartecipante: number;
  idCompToselect: number;
  logo: string;
  pronoClosed: boolean;
  admin: boolean;
  adminPassword: boolean;

  subscriptionHotKey: Subscription;

  calcoloClassificaCompetizioniSaved: ValoriPronosticiClassifica[];
  cCCToSaveToPronostici: Pronostici[];

  competizioniGrouped: AnagraficaCompetizioniGrouped[];
  idCompetizioneToFill: number;
  dataChiusuraProno: string;
  dateCompetizioneInCorso: DatePronostici = {
    stagione : null,
    data_apertura: null,
    data_chiusura: null,
    data_calcolo_classifica: null
  };
  /* al momento non serve
  setPronosticiToSave(value: string, index: number, idCompetizione: number) {

    if (value !== 'XXX') {
      for (let i = 0; i < this.valoriPronosticiToSave.length; i++) {
        if (this.valoriPronosticiToSave[i].id_competizione == idCompetizione) {
          this.valoriPronosticiToSave[i].pronostici[(index - 1)] = value;
          break;
        }
      }
    }

  }
*/

setPronosticiInseriti(value: string, index: number, idCompetizione: number) {

  if (value === 'XXX') { // sto togliendo un prono

    for (let i = 0; i < this.competizioni.length; i++) {
      if (this.competizioni[i].id === idCompetizione) {
        this.competizioni[i].pronostici_inseriti--;
        break;
      }
    }

  } else { // sto aggiungendo / modificando un prono

    for (let i = 0; i < this.valoriPronosticiToSave.length; i++) {
      if (this.valoriPronosticiToSave[i].id_competizione === idCompetizione) {
        let totPieni = 0;
        for (let y = 0; y < this.valoriPronosticiToSave[i].pronostici.length; y++) {
          if (this.valoriPronosticiToSave[i].pronostici[y] !== 'XXX') {
            totPieni++;
          }
        }
        for (let x = 0; x < this.competizioni.length; x++) {
          if (this.competizioni[x].id === idCompetizione) {
            this.competizioni[x].pronostici_inseriti = totPieni;
            break;
          }
        }
      }
    }

  }

}

  fillPronostici(numero_pronostici: number, idCompetizione: number) {

    let datePronosticiCompetizione: DatePronostici[] = [];

    if (idCompetizione != 0) { // non ho selezionato scegli una competizione dalla dropdown

      this.valoriPronosticiToShow = [];
      this.numberPronostici = [];
      this.numberPronosticiGt10 = [];
      this.pronosticiGt10 = false;
      this.idCompToselect = 0;
      this.logo = '';

      let np = numero_pronostici;
      if (np == 0) {
        for (let y = 0; y < this.competizioni.length; y++) {
          if ( this.competizioni[y].id === idCompetizione ) {
            np = this.competizioni[y].numero_pronostici;
            datePronosticiCompetizione =
            this.crudCompetizioneService.SplitDateCompetizioneStringIntoArray(this.competizioni[y].date_competizione.toString(), true);
            this.dateCompetizioneInCorso =
            datePronosticiCompetizione[(datePronosticiCompetizione.length - 1)];
            break;
          }
        }
      } else {
          np = numero_pronostici;
      }

      for (let x = 0; x < this.valoriPronostici.length; x++) {
        if (this.valoriPronostici[x].id_competizione === idCompetizione ) {
          this.idCompToselect = this.valoriPronostici[x].id_competizione;
          for (let y = 0; y < this.valoriPronostici[x].valori_pronostici.length; y++) {
            this.valoriPronosticiToShow.push(
                                              {
                                                idCompetizione: this.valoriPronostici[x].id_competizione,
                                                valuePronostico: this.valoriPronostici[x].valori_pronostici[y]
                                              }
                                            );
          }
        }
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

      for (let z = 0; z < this.competizioni.length; z++) {
        if (idCompetizione === this.competizioni[z].id) {
          this.logo = this.competizioni[z].logo;
          break;
        }
      }

      np > 10 ? this.pronosticiGt10 = true : this.pronosticiGt10 = false;

      this.pronoClosed = this.utilService.checkDateProno(this.dateCompetizioneInCorso.data_chiusura);
      this.showProno = true;

    } else {

      this.showProno = false;
      this.pronosticiGt10 = false;

    }

  }

  salvaPronosticiClassifica()  {

    const check = this.checkPronoToSave();
    const dataToSaveArray: Pronostici[] = [];

    if (check.check) {

      if (this.admin) { // admin salva la classifica

          for (let i = 0; i < this.cCCToSaveToPronostici.length; i++) {
            if (this.cCCToSaveToPronostici[i].id_competizione === this.idCompToselect) {
              dataToSaveArray.push(this.cCCToSaveToPronostici[i]);
              break;
            }
          }

          this.pronosticiService.saveClassificaCompetizioni(dataToSaveArray).subscribe(
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

        this.pronosticiService.savePronostici(this.valoriPronosticiToSave,
                                              this.applicationParameter.nickname,
                                              this.applicationParameter.idPartecipante ).subscribe(
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

      }

    } else {

      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Ci sono valori duplicati in ' + check.competizione + ' , correggerli prima di salvarli',
        type: 'error'
      });

    }

  }

  checkPronoToSave(): CheckDuplicateProno {

    const retVal: CheckDuplicateProno = { competizione: ' ', check: true };
    let duplicates: number[] = [];

    for (let i = 0; i < this.valoriPronosticiToSave.length ; i++) {
      duplicates = [];
      for (let x = 0; x <= this.valoriPronosticiToSave[i].pronostici.length; x++) {
        if (this.valoriPronosticiToSave[i].pronostici[x] !== 'XXX') {
          if (duplicates[this.valoriPronosticiToSave[i].pronostici[x]] === undefined) {
            duplicates[this.valoriPronosticiToSave[i].pronostici[x]] = 1;
          } else {
            for (let z = 0; z < this.competizioni.length; z++) {
              if (this.valoriPronosticiToSave[i].id_competizione === this.competizioni[z].id) {
                retVal.competizione = this.competizioni[z].competizione;
                break;
              }
            }
            retVal.check = false;
            break;
          }
        }
      }
      if (!retVal.check) {
        break;
      }
    }

    return retVal;
  }

  getIndexCompetizione(idCompetizione: number): number {

    let retVal = 0;

    for (let i = 0; i < this.valoriPronosticiToSave.length; i++) {
      if (this.valoriPronosticiToSave[i].id_competizione === idCompetizione) {
        retVal = i;
        break;
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
      case 'PronosticiComponent.SetAdmin':
        this.checkAdminPassword();
        break;
      case 'PronosticiComponent.UnsetAdmin':
        this.unsetAdminEnvironment();
        break;
      case 'PronosticiComponent.AggiornaClassifica':
        this.aggiornaClassifica();
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

 setAdminEnvironment(): void {

    if (this.adminPassword) {
      const searchParameter: FiltroPronostici = { stagione: parseInt(this.utils.getStagione().substring(0, 4), 10) };
      this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameter).subscribe(
        data => {
                  this.calcoloClassificaCompetizioniSaved = data;
                  this.cCCToSaveToPronostici = [];

                  for ( let i = 0; i < this.calcoloClassificaCompetizioniSaved.length; i++ ) {
                    if ( !this.calcoloClassificaCompetizioniSaved[i].valori_pronostici_classifica ||
                         this.calcoloClassificaCompetizioniSaved[i].valori_pronostici_classifica.length === 0 ) {
                          for ( let x = 0; x < this.competizioni.length; x++ ) {
                        if ( this.calcoloClassificaCompetizioniSaved[i].id_competizione === this.competizioni[x].id ) {
                          const prono = [];
                          for (let y = 1; y <= this.competizioni[x].numero_pronostici; y++) {
                            prono.push('XXX');
                          }
                          const pronostico: Pronostici = {
                            id_partecipanti: 0,
                            stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                            id_competizione: this.competizioni[x].id,
                            pronostici: prono
                          };
                          this.cCCToSaveToPronostici.push(pronostico);
                          break;
                        }

                      }

                    } else { // dati presenti

                      for ( let x = 0; x < this.competizioni.length; x++ ) {
                        if ( this.calcoloClassificaCompetizioniSaved[i].id_competizione === this.competizioni[x].id ) {
                          const prono = [];
                          for (let y = 0; y < this.competizioni[x].numero_pronostici; y++) {
                            prono.push(this.calcoloClassificaCompetizioniSaved[i].valori_pronostici_classifica[y]);
                          }
                          const pronostico: Pronostici = {
                            id_partecipanti: 0,
                            stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                            id_competizione: this.competizioni[x].id,
                            pronostici: prono
                          };
                          this.cCCToSaveToPronostici.push(pronostico);
                          break;
                        }
                      }

                    }
                  }

                  this.setAdmin(true);
                  this.enableProno();
                  this.idCompetizioneToFill = 0;
                  this.showProno = false;
        },
        error => Swal({
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        title: 'Errore nel Caricamento Dati',
                        type: 'error'
                      })
      );

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

  aggiornaClassifica(): void {

    const dataFromApi: any[] = [];
    const datiCompetizioni: AnagraficaCompetizioni[] = [];
    let dataToSaveOnDb: ApiTransformReturnValue;
    let urlsToCall: string[] = [];

    if (this.admin) {

        urlsToCall = this.externalApiService.buildApiCallsUrl(
                                                              this.utils.getStagione().substring(0, 4),
                                                              this.competizioni
        );

        this.externalApiService.getAggiornamentiCompetizione(urlsToCall).subscribe(

          apiData => {

            for (let i = 0; i < apiData.length; i++ ) {

              dataFromApi.push(apiData[i]);
              datiCompetizioni.push({id: this.competizioni[i].id,
                                     competizione: this.competizioni[i].competizione,
                                     numero_pronostici: this.competizioni[i].numero_pronostici,
                                     tipo_competizione: this.competizioni[i].tipo_competizione});
            }

            dataToSaveOnDb = this.externalApiService.transformApiDataToPronosticiData(
              dataFromApi,
              datiCompetizioni,
              parseInt(this.utils.getStagione().substring(0, 4), 10),
              this.valoriPronostici
            );

            const searchParameter: FiltroPronostici = { stagione: parseInt(this.utils.getStagione().substring(0, 4), 10) };
            this.externalApiService.saveAndReloadClassificheCompetizioni(dataToSaveOnDb.datiToSaveOnDb, searchParameter).subscribe(
              dataObject => {

                console.log(dataObject);

                        let messageText: string;
                        messageText = '<p class="text-primary">Aggiornate :</p>';
                        for (let i = 0; i < dataToSaveOnDb.competizioniAggiornate.length; i++) {
                          messageText += '<p class="text-success">' + dataToSaveOnDb.competizioniAggiornate[i] + '</p>';
                        }
                        messageText += '<p class="text-primary">Non Aggiornate :</p>';
                        for (let i = 0; i < dataToSaveOnDb.competizioniNonAggiornate.length; i++) {
                          messageText += '<p class="text-danger">' + dataToSaveOnDb.competizioniNonAggiornate[i] + '</p>';
                        }
                        this.calcoloClassificaCompetizioniSaved = dataObject;

                        this.cCCToSaveToPronostici = [];
                        for ( let i = 0; i < this.calcoloClassificaCompetizioniSaved.length; i++ ) {
                          for ( let x = 0; x < this.competizioni.length; x++ ) {
                            if ( this.calcoloClassificaCompetizioniSaved[i].id_competizione === this.competizioni[x].id ) {
                              const prono = [];
                              for (let y = 0; y < this.competizioni[x].numero_pronostici; y++) {
                                prono.push(this.calcoloClassificaCompetizioniSaved[i].valori_pronostici_classifica[y]);
                              }
                              const pronostico: Pronostici = {
                                id_partecipanti: 0,
                                stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                                id_competizione: this.competizioni[x].id,
                                pronostici: prono
                              };
                              this.cCCToSaveToPronostici.push(pronostico);
                              break;
                            }
                          }
                        }
                        this.showProno = false;
                        Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Aggiornamento Automatico',
                          html: messageText,
                          type: 'success'
                        });
                  }
                  ,
                  error => Swal({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: 'Errore Aggiornamento Automatico Classifiche Competizioni',
                    type: 'error'
                  })
                );
              }
              ,
              error => Swal({
                allowOutsideClick: false,
                allowEscapeKey: false,
                title: 'Errore Aggiornamento Automatico Classifiche Competizioni',
                type: 'error'
              })
            );

    } else {

      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Solo l\'amministratore di sistema può aggiornare la classifica',
        type: 'error'
      });

    }

  }

  ngOnDestroy() {

    this.subscriptionHotKey.unsubscribe();

  }


  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    // prendo i dati dai resolver
    // this.localStorageService.set('competizioni', this.activatedRoute.snapshot.data.listaCompetizioni);
    // this.localStorageService.set('valoriPronostici', this.activatedRoute.snapshot.data.valoriPronostici);
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;

    this.competizioniGrouped = this.crudCompetizioneService.buildCompetizioniGrouped(this.competizioni);
    this.valoriPronosticiSaved = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.valoriPronosticiToSave = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.cCCToSaveToPronostici = [];
    // ---------------------------

    this.nickname = this.applicationParameter.nickname; // mi prendo il valore di nickname dal servizio
    this.idPartecipante = this.applicationParameter.idPartecipante; // mi prendo il valore di id dal servizio

    // setto l'array con i pronostici da salvare in modo che poi basti solo inserire il pronostico
    if (this.valoriPronosticiSaved.length === 0) {
      for (let i = 0; i < this.competizioni.length; i++) {
        const prono = [];
        for (let x = 1; x <= this.competizioni[i].numero_pronostici; x++) {
          prono.push('XXX');
        }
        const pronostico: Pronostici = {
          id_partecipanti: this.idPartecipante,
          stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
          id_competizione: this.competizioni[i].id,
          pronostici: prono
        };
        this.valoriPronosticiToSave.push(pronostico);
      }

    } else if (this.valoriPronosticiSaved.length !== this.competizioni.length) {
      let fnd = false;
      for (let i = 0; i < this.competizioni.length; i++) {
        for (let x = 0; x < this.valoriPronosticiSaved.length; x++) {
          if (this.competizioni[i].id === this.valoriPronosticiSaved[x].id_competizione) {
            fnd = true;
            break;
          }
        }
        if ( fnd ) {
          fnd = false;
        } else {
          const prono = [];
          for (let x = 1; x <= this.competizioni[i].numero_pronostici; x++) {
            prono.push('XXX');
          }
          const pronostico: Pronostici = {
            id_partecipanti: this.idPartecipante,
            stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
            id_competizione: this.competizioni[i].id,
            pronostici: prono
          };
          this.valoriPronosticiToSave.push(pronostico);
        }
      }
    }

    for (let i = 0; i < this.competizioni.length; i++) {
      for (let x = 0; x < this.valoriPronosticiToSave.length ; x++) {
        if (this.competizioni[i].id === this.valoriPronosticiToSave[x].id_competizione) {
          let totPieni = 0;
          for (let y = 0; y < this.valoriPronosticiToSave[x].pronostici.length; y++) {
            if (this.valoriPronosticiToSave[x].pronostici[y] !== 'XXX') {
              totPieni++;
            }
          }
          this.competizioni[i].pronostici_inseriti = totPieni;
        }
      }
    }

    this.showProno = false;
    // this.pronoClosed = this.utilService.checkDateProno(this.applicationParameter.data_chiusura);

  }




}
