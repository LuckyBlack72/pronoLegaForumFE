import { Component, OnInit } from '@angular/core';

import { UtilService } from '../service/util.service';
import { SchedineService } from '../service/schedine.service';

import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

// Grafici
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
// Grafici

import {
          AnagraficaCompetizioniSettimanali,
          PronosticiSettimanali,
          AnagraficaCompetizioniSettimanaliGrouped
        } from '../../models/models';

@Component({
  selector: 'app-statistiche-schedine',
  templateUrl: './statistiche-schedine.component.html',
  styleUrls: ['./statistiche-schedine.component.css']
})
export class StatisticheSchedineComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceDetectorService: DeviceDetectorService,
    private schedineService: SchedineService,
    private utilService: UtilService
  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  isGrafico: boolean;
  tipo_pronostici: string;
  idCompetizioneToFill: number;

  competizioni: AnagraficaCompetizioniSettimanali[];
  pronosticiEx: PronosticiSettimanali[];
  competizioniLf: AnagraficaCompetizioniSettimanali[];
  pronosticiLf: PronosticiSettimanali[];
  competizioniGrouped: AnagraficaCompetizioniSettimanaliGrouped[];

    // Grafici
    barChartOptions: ChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{ticks: { min: 0, max : 100 }}], // V1
      // scales: { xAxes: [{ticks: { min: 0}}], // V2
        yAxes: [{}]
              },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    barChartLabels: Label[] = ['Pronostici'];
    barChartType: ChartType = 'horizontalBar';
    barChartLegend = true;
    barChartPlugins = [pluginDataLabels];

    barChartData: ChartDataSets[] = [{data: [0], label: ''}];
    tipoVisualizzazione: string;
    // Grafici


  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();


    this.resetStatistiche();
    this.tipo_pronostici = 'E';

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.competizioniLf = this.activatedRoute.snapshot.data.listaCompetizioniLf;
    this.pronosticiEx = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.pronosticiLf = this.activatedRoute.snapshot.data.pronosticiSavedLf;

    if ( this.tipo_pronostici === 'E' ) {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
    } else {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioniLf);
    }


  }

  resetStatistiche(): void {

    this.isGrafico = false;

  }

  createGraph( idCompetizione: number, tipo_pronostici: string ): void {

    let competizioni: AnagraficaCompetizioniSettimanali[];
    let prono: PronosticiSettimanali[];

    // Label sono le partite
    // dataset 3 (1 X 2)

    if ( tipo_pronostici === 'E' ) {
      competizioni = this.competizioni;
      prono = this.pronosticiEx;
    } else {
      competizioni = this.competizioniLf;
      prono = this.pronosticiLf;
    }

    this.barChartLabels = [];

    for (let i = 0; i < competizioni.length; i++) {
      if ( competizioni[i].id === idCompetizione ) {
        competizioni[i].pronostici.forEach( pronoValue => {
          this.barChartLabels.push(pronoValue);
        });
      }

    }

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

}
