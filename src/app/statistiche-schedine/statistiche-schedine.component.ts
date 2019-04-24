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


    this.tipo_pronostici = 'E';
    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.competizioniLf = this.activatedRoute.snapshot.data.listaCompetizioniLf;
    this.pronosticiEx = this.activatedRoute.snapshot.data.pronosticiSaved;
    this.pronosticiLf = this.activatedRoute.snapshot.data.pronosticiSavedLf;

    this.resetStatistiche();

  }

  resetStatistiche(): void {

    this.isGrafico = false;
    if ( this.tipo_pronostici === 'E' ) {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioni);
    } else {
      this.competizioniGrouped = this.schedineService.buildCompetizioniGrouped(this.competizioniLf);
    }

  }

  createGraph( idCompetizione: number, tipo_pronostici: string ): void {

    let competizioni: AnagraficaCompetizioniSettimanali[];
    let prono: PronosticiSettimanali[];
    let stagione: number;
    let settimana: number;
    let barChartData1: ChartDataSets = {data: [], label: '1'};
    let barChartDataX: ChartDataSets = {data: [], label: 'X'};
    let barChartData2: ChartDataSets = {data: [], label: '2'};
    const dataFiller1: any[] = [];
    const dataFillerX: any[] = [];
    const dataFiller2: any[] = [];

    let pronoTotaliSchedina = 0;
    let pronoTemp = 0;

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
    this.barChartData = [];

    for (let i = 0; i < competizioni.length; i++) {
      if ( competizioni[i].id === idCompetizione ) {
        stagione = competizioni[i].stagione;
        settimana = competizioni[i].settimana;
        for (let ip = 0; ip < competizioni[i].pronostici.length; ip++) {
          this.barChartLabels.push(competizioni[i].pronostici[ip]);
          dataFiller1.push(0);
          dataFillerX.push(0);
          dataFiller2.push(0);
        }
        barChartData1 = { data: dataFiller1 , label: '1'};
        barChartDataX = { data: dataFillerX , label: 'X'};
        barChartData2 = { data: dataFiller2 , label: '2'};
/*
console.log('-- Prima -----------------');
console.log(barChartData1.data);
console.log(barChartDataX.data);
console.log(barChartData2.data);
console.log('-- Prima -----------------');
*/
        break;
      }
    }

    for (let x = 0; x < prono.length; x++) {
// console.log('Stagione : ' + prono[x].stagione + ' - ' + stagione);
// console.log('Settimana : ' + prono[x].settimana + ' - ' + settimana);
      if ( prono[x].stagione === stagione && prono[x].settimana === settimana ) {
        pronoTotaliSchedina += 1;
        for (let y = 0; y < prono[x].valori_pronostici.length; y++) {
          pronoTemp = 0;
// console.log('Prono : ' + prono[x].valori_pronostici[y]);
          switch (prono[x].valori_pronostici[y]) {
            case '1' : {
              pronoTemp = +barChartData1.data[y].toString(); // così diventa numero
// console.log(' p1 ' + pronoTemp + ' -  y: ' + y);
              pronoTemp += 1;
              barChartData1.data[y] = pronoTemp;
// console.log('Prono 1 : ' + barChartData1.data);
// console.log(barChartDataX.data);
// console.log(barChartData2.data);
              break;
            }
            case 'X' : {
              pronoTemp = +barChartDataX.data[y].toString(); // così diventa numero
// console.log(' pX ' + pronoTemp + ' -  y: ' + y);
              pronoTemp += 1;
              barChartDataX.data[y] = pronoTemp;
// console.log('Prono X : ' + barChartDataX.data);
// console.log(barChartData1.data);
// console.log(barChartData2.data);
              break;
            }
            case '2' : {
              pronoTemp = +barChartData2.data[y].toString(); // così diventa numero
// console.log(' p2 ' + pronoTemp + ' -  y: ' + y);                                          
              pronoTemp += 1;
              barChartData2.data[y] = pronoTemp;
// console.log('Prono 2 : ' + barChartData2.data);
// console.log(barChartData1.data);
// console.log(barChartDataX.data);
              break;
            }
            default : {
              break;
            }
          }
        }
      }
    }

    for (let iPerc = 0; iPerc < barChartData1.data.length; iPerc++) { // Calcolo le percentuali

      pronoTemp = 0;
      pronoTemp = +barChartData1.data[iPerc].toString(); // così diventa numero
      pronoTemp = +(( pronoTemp / pronoTotaliSchedina ) * 100).toFixed(2);
      barChartData1.data[iPerc] = pronoTemp;

      pronoTemp = 0;
      pronoTemp = +barChartDataX.data[iPerc].toString(); // così diventa numero
      pronoTemp = +(( pronoTemp / pronoTotaliSchedina ) * 100).toFixed(2);
      barChartDataX.data[iPerc] = pronoTemp;

      pronoTemp = 0;
      pronoTemp = +barChartData2.data[iPerc].toString(); // così diventa numero
      pronoTemp = +(( pronoTemp / pronoTotaliSchedina ) * 100).toFixed(2);
      barChartData2.data[iPerc] = pronoTemp;

    }

    /*
    console.log('-- DOPO ---');
    console.log(barChartData1);
    console.log(barChartDataX);
    console.log(barChartData2);
    console.log('-- DOPO ---');
    */

    this.barChartData.push(barChartData1);
    this.barChartData.push(barChartDataX);
    this.barChartData.push(barChartData2);

    this.isGrafico = true;

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

}
