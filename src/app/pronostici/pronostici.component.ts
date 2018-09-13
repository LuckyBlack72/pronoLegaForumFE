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
  valoriPronosticiToShow: string[] = [];
  valoriPronosticiToSave: Pronostici;
  nickname: string;

  setPronosticiToSave(value: string, index: number) {


  }

  fillPronostici(numero_pronostici: number, idCompetizione: number) {

    this.valoriPronosticiToShow = [];
    this.numberPronostici = [];

    for (let x = 0; x < this.valoriPronostici.length; x++) {
      console.log(this.valoriPronostici[x]);
      if (this.valoriPronostici[x].id_competizione == idCompetizione ) {
        for (let y = 0; y < this.valoriPronostici[x].valori_pronostici.length; y++) {
          this.valoriPronosticiToShow.push(this.valoriPronostici[x].valori_pronostici[y]);
        }
      }
    }

    for (let i = 1; i <= numero_pronostici; i++) {
      this.numberPronostici.push(i);
    }
    this.showProno = true;

  }

  ngOnInit() {

    // prendo i dati dai resolver
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;

    this.showProno = false;

    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio

  }

}
