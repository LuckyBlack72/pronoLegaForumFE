import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../dataservice.service';
import { PronosticiService } from '../pronostici.service';
import { UtilService } from '../util.service';

import {
        AnagraficaCompetizioni,
        ValoriPronostici,
        Pronostici,
        ValoriPronosticiComboFiller,
        CheckDuplicateProno,
        ValoriPronosticiClassifica,
        FiltroPronostici
      } from '../../models/models';
import { Utils } from '../../models/utils';

import Swal from 'sweetalert2';

import { Command, CommandService } from '../command.service';
import { Subscription } from 'rxjs';


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
              public dataService: DataService,
              private utilService: UtilService,
              private commandService: CommandService
            ) {
    this.subscriptionHotKey = this.commandService.commands.subscribe(c => this.handleCommand(c));
  }

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
  dataChiusuraProno: string;
  admin: boolean;

  subscriptionHotKey: Subscription;

  calcoloClassificaCompetizioniSaved: ValoriPronosticiClassifica[];
  calcoloClassificaCompetizioniSavedToPronostici: Pronostici[];


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

    this.valoriPronosticiToShow = [];
    this.numberPronostici = [];
    this.numberPronosticiGt10 = [];
    this.pronosticiGt10 = false;
    this.idCompToselect = 0;
    this.logo = '';

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

    if (numero_pronostici > 10) {
      for (let i = 1; i <= 10; i++) {
        this.numberPronostici.push(i);
      }
      for (let i = 11; i <= numero_pronostici; i++) {
        this.numberPronosticiGt10.push(i);
      }
    } else {
      for (let i = 1; i <= numero_pronostici; i++) {
        this.numberPronostici.push(i);
      }
    }

    for (let z = 0; z < this.competizioni.length; z++) {
      if (idCompetizione === this.competizioni[z].id) {
        this.logo = this.competizioni[z].logo;
        break;
      }
    }

    numero_pronostici > 10 ? this.pronosticiGt10 = true : this.pronosticiGt10 = false;
    this.showProno = true;

  }

  salvaPronosticiClassifica()  {

    const check = this.checkPronoToSave();

    if (check.check) {

      if (this.admin) { // admin salva la classifica

          this.pronosticiService.saveClassificaCompetizioni(this.valoriPronosticiToSave).subscribe(
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

        this.pronosticiService.savePronostici(this.valoriPronosticiToSave).subscribe(
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

    this.utilService.exportPronosticiExcel(this.valoriPronosticiToSave, this.dataService.nickname);

  }

  setAdmin(setUnset: boolean): void {
    this.admin = setUnset;
  }

  handleCommand(command: Command) {
    switch (command.name) {
      case 'PronosticiComponent.SetAdmin':
        this.setAdminEnvironment();
        break;
      case 'PronosticiComponent.UnsetAdmin':
        this.setAdmin(false);
        this.pronoClosed = this.utilService.checkDateProno(this.dataService.data_chiusura);
        break;
      }
  }

  setAdminEnvironment(): void {
    const searchParameter: FiltroPronostici = { stagione: parseInt(this.utils.getStagione().substring(0, 4), 10) };
    this.pronosticiService.getValoriPronosticiCalcoloClassifica(searchParameter).subscribe(
      data => {
                this.calcoloClassificaCompetizioniSaved = data;

                if (this.calcoloClassificaCompetizioniSaved.length === 0) {
                  for (let i = 0; i < this.competizioni.length; i++) {
                    const prono = [];
                    for (let x = 1; x <= this.competizioni[i].numero_pronostici; x++) {
                      prono.push('XXX');
                    }
                    const pronostico: Pronostici = {
                      id_partecipanti: 0,
                      stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                      id_competizione: this.competizioni[i].id,
                      pronostici: prono
                    };
                    this.calcoloClassificaCompetizioniSavedToPronostici.push(pronostico);
                  }

                } else if (this.calcoloClassificaCompetizioniSaved.length !== this.competizioni.length) {
                  let fnd = false;
                  for (let i = 0; i < this.competizioni.length; i++) {
                    for (let x = 0; x < this.calcoloClassificaCompetizioniSaved.length; x++) {
                      if (this.competizioni[i].id === this.calcoloClassificaCompetizioniSaved[x].id_competizione) {
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
                        id_partecipanti: 0,
                        stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                        id_competizione: this.competizioni[i].id,
                        pronostici: prono
                      };
                      this.calcoloClassificaCompetizioniSavedToPronostici.push(pronostico);
                    }
                  }
                }

                this.setAdmin(true);
                this.enableProno();
      },
      error => Swal({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      title: 'Errore nel Salvataggio Dati',
                      type: 'error'
                    })
    );

  }

  ngOnDestroy() {

    this.subscriptionHotKey.unsubscribe();

  }


  ngOnInit() {

    // prendo i dati dai resolver
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;
    this.valoriPronosticiSaved = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.valoriPronosticiToSave = this.activatedRoute.snapshot.data.pronosticiSaved;
    // ---------------------------

    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio
    this.idPartecipante = this.dataService.idPartecipante; // mi prendo il valore di id dal servizio

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
    this.pronoClosed = this.utilService.checkDateProno(this.dataService.data_chiusura);
    this.dataChiusuraProno = this.dataService.data_chiusura;

  }




}
