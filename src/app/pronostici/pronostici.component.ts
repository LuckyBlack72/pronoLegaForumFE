import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AnagraficaCompetizioni, ValoriPronostici, Pronostici } from '../../models/models';
import { DataService } from '../dataservice.service';

@Component({
  selector: 'app-pronostici',
  templateUrl: './pronostici.component.html',
  styleUrls: ['./pronostici.component.css']
})
export class PronosticiComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, public dataService: DataService ) { }

  competizioni: AnagraficaCompetizioni[];
  valoriPronostici: ValoriPronostici[];
  showProno: boolean;
  numberPronostici: number[] = [];
  numberPronosticiGt10: number[] = [];
  pronosticiGt10: boolean;
  valoriPronosticiToShow: string[] = [];
  valoriPronosticiToSave: Pronostici[];
  nickname: string;

  setPronosticiToSave(value: string, index: number) {


  }

  fillPronostici(numero_pronostici: number, idCompetizione: number) {

    this.valoriPronosticiToShow = [];
    this.numberPronostici = [];
    this.numberPronosticiGt10 = [];
    this.pronosticiGt10 = false;

    for (let x = 0; x < this.valoriPronostici.length; x++) {
      if (this.valoriPronostici[x].id_competizione == idCompetizione ) {
        for (let y = 0; y < this.valoriPronostici[x].valori_pronostici.length; y++) {
          this.valoriPronosticiToShow.push(this.valoriPronostici[x].valori_pronostici[y]);
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

  }

  ngOnInit() {

    // prendo i dati dai resolver
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;

    this.showProno = false;

    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio

  }

}
