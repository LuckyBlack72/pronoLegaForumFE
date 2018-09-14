import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../dataservice.service';
import { PronosticiService } from '../pronostici.service';

import {
        AnagraficaCompetizioni,
        ValoriPronostici,
        Pronostici,
        ValoriPronosticiComboFiller,
        CheckDuplicateProno
      } from '../../models/models';
import { Utils } from '../../models/utils';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-pronostici',
  templateUrl: './pronostici.component.html',
  styleUrls: ['./pronostici.component.css']
})
export class PronosticiComponent implements OnInit {

  constructor(
              private activatedRoute: ActivatedRoute,
              private utils: Utils,
              private pronosticiService: PronosticiService,
              public dataService: DataService
            ) { }

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

    for (let x = 0; x < this.valoriPronostici.length; x++) {
      if (this.valoriPronostici[x].id_competizione == idCompetizione ) {
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

    numero_pronostici > 10 ? this.pronosticiGt10 = true : this.pronosticiGt10 = false;
    this.showProno = true;

  }

  salvaPronostici()  {

    let check = this.checkPronoToSave();

    if (check.check) {
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
    } else {
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Ci sono valori duplicati in ' + check.Competizione + ' , correggerli prima di salvarli',
        type: 'error'
      });
    }

  }

  checkPronoToSave(): CheckDuplicateProno {

    let retVal: CheckDuplicateProno = { Competizione: ' ', check: true };
    let duplicates: number[] = [];

    for (let i = 0; i < this.valoriPronosticiToSave.length ; i++) {
      duplicates = [];
      for (let x = 0; x <= this.valoriPronosticiToSave[i].pronostici.length; x++) {
        if (this.valoriPronosticiToSave[i].pronostici[x] !== 'XXX') {
          if (duplicates[this.valoriPronosticiToSave[i].pronostici[x]] === undefined) {
            duplicates[this.valoriPronosticiToSave[i].pronostici[x]] = 1;
          } else {
            for (let z = 0; z < this.competizioni.length; z++) {
              if (this.valoriPronosticiToSave[i].id_competizione == this.competizioni[z].id) {
                retVal.Competizione = this.competizioni[z].competizione;
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
      if (this.valoriPronosticiToSave[i].id_competizione == idCompetizione) {
        retVal = i;
        break;
      }
    }

    return retVal;

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

  }


}
