import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';

import { CrudCompetizioneService } from '../service/crudCompetizione.service';
import { UtilService } from '../service/util.service';

import {
  AnagraficaCompetizioni,
  ValoriPronostici,
  Pronostici,
  AnagraficaCompetizioniGrouped,
  DeviceInfo
} from '../../models/models';

@Component({
  selector: 'app-statistiche',
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.css']
})
export class StatisticheComponent implements OnInit {

  constructor(
                private activatedRoute: ActivatedRoute,
                private deviceDetectorService: DeviceDetectorService,
                private crudCompetizioneService: CrudCompetizioneService,
                private utilService: UtilService
              ) { }

  competizioni: AnagraficaCompetizioni[];
  valoriPronostici: ValoriPronostici[];
  pronostici: Pronostici[];

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  competizioniGrouped: AnagraficaCompetizioniGrouped[];

  numeroPronostici: number[] =  [];
  posizioneToCheck: number;
  idCompetizioneToFill: number;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;
    this.pronostici = this.activatedRoute.snapshot.data.pronostici;

    this.competizioniGrouped = this.crudCompetizioneService.buildCompetizioniGrouped(this.competizioni);

  }

  setPosizioniCompetizione(idCompetizione: number): void {

    let numeroPronostici = 0;

    for (let i = 0 ; i < this.competizioni.length; i++) {
      if (idCompetizione === this.competizioni[i].id) {
        numeroPronostici = this.competizioni[i].numero_pronostici;
        break;
      }
    }

    this.numeroPronostici = [];
    for (let x = 1 ; x <= numeroPronostici; x++) {
      this.numeroPronostici.push(x);
    }

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

}
