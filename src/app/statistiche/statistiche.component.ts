import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatPaginator, MatTableDataSource, MatSort, MatRadioChange } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';

// Grafici
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
// Grafici

import { CrudCompetizioneService } from '../service/crudCompetizione.service';
import { UtilService } from '../service/util.service';

import {
  AnagraficaCompetizioni,
  ValoriPronostici,
  Pronostici,
  AnagraficaCompetizioniGrouped,
  DeviceInfo,
  Stagioni
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
  stagioni: Stagioni[];

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  competizioniGrouped: AnagraficaCompetizioniGrouped[];

  numeroPronostici: number[] =  [];
  posizioneToCheck: number;
  idCompetizioneToFill: number;
  stagioneToCheck: number;

  paginator: MatPaginator;
  sort: MatSort;

  @ViewChild(MatSort)
  set iniSort(sort: MatSort) {
    this.sort = sort;
    this.dataSourceStatistiche.sort = this.sort;
  }

  @ViewChild(MatPaginator)
  set iniPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSourceStatistiche.paginator = this.paginator;
  }

  dataSourceStatistiche = new MatTableDataSource([]);
  displayedColumns = ['Pronostico', 'Scelte', 'Percentuale'];

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
  barChartLabels: Label[] = ['Squadre'];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [{data: [0], label: ''}];
  isGrafico: boolean;
  tipoVisualizzazione: string;
  // Grafici

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.valoriPronostici = this.activatedRoute.snapshot.data.valoriPronostici;
    this.pronostici = this.activatedRoute.snapshot.data.pronostici;
    this.stagioni = this.activatedRoute.snapshot.data.stagioni;

    // this.competizioniGrouped = this.crudCompetizioneService.buildCompetizioniGrouped(this.competizioni);

    this.isGrafico = false;
    this.tipoVisualizzazione = 'T';

  }

  setCompetizioni(stagione: number): void {

    const competizioniToCheck: AnagraficaCompetizioni[] = [];

    for (let i = 0; i < this.competizioni.length; i++) {

      for (let x = 0; x < this.competizioni[i].anni_competizione.length; x++) {

        if (this.competizioni[i].anni_competizione[x] === stagione) {

          competizioniToCheck.push(this.competizioni[i]);
          break;

        }

      }

    }

    this.competizioniGrouped = this.crudCompetizioneService.buildCompetizioniGrouped(competizioniToCheck);

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

  calcolaPercentuali(idCompetizione: number, posizione: number, stagione: number): void {

    const prono = [];
    const scelte = [];
    let scelta = 0;
    let scelteTotali = 0;

    if ( idCompetizione && posizione && stagione ) {

      for (let i = 0; i < this.pronostici.length; i++) {

        if (
              this.pronostici[i].id_competizione === idCompetizione &&
              this.pronostici[i].stagione === stagione
            ) {

              if (this.pronostici[i].pronostici[(posizione - 1)] !== 'XXX') {

                if ( prono.indexOf(this.pronostici[i].pronostici[(posizione - 1)]) !== -1) {

                  scelta = scelte[prono.indexOf(this.pronostici[i].pronostici[(posizione - 1)])];
                  scelta++;
                  scelte[prono.indexOf(this.pronostici[i].pronostici[(posizione - 1)])] = scelta;
                  scelteTotali++;

                } else {

                  prono.push((this.pronostici[i].pronostici[(posizione - 1)]));
                  scelte.push(1);
                  scelteTotali++;

                }

              }
          }
      }

      this.dataSourceStatistiche.data = this.buildDataSource(prono, scelte, scelteTotali);
      this.buildGraphicData(prono, scelte, scelteTotali);

    } else {

      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Tutti i parametri di ricerca devono essere riempiti',
        type: 'error'
      });
    }


  }

  private buildDataSource(valori: any[], scelte: any[], scelteTotali: number): any[] {

    let element: {[x: string]: any} = {};
    const retVal: any[] = [];

    const scelteTotaliFormat = scelteTotali < 10 ? '0' + scelteTotali : scelteTotali;

    for (let i = 0; i < valori.length; i++) {
      element['Pronostico'] = valori[i];
      element['Scelte'] = scelte[i] < 10
                        ? '0' + scelte[i] + '/' + scelteTotaliFormat
                        : scelte[i] + '/' + scelteTotaliFormat;
      element['Percentuale'] = (( scelte[i] / scelteTotali ) * 100).toFixed(2);
      retVal.push(element);
      element = {};
    }

    return retVal;

  }

  // V1 1 Label e più Dataset
  private buildGraphicData(valori: any[], scelte: any[], scelteTotali: number): void {

    let element: {[x: string]: any} = {};
    let data: any[] = [];
    this.barChartData = [];
    this.barChartLabels = ['Squadre'];
    for (let i = 0; i < valori.length; i++) {
      // this.barChartLabels.push(valori[i]);
      data.push((( scelte[i] / scelteTotali ) * 100).toFixed(2));
      element['data'] = data;
      element['label'] = valori[i];
      this.barChartData.push(element);
      element = {};
      data = [];
    }

  }

  // V2 1 Dataset e Più Label
  /*
  private buildGraphicData(valori: any[], scelte: any[], scelteTotali: number): void {

  const element: {[x: string]: any} = {};
  const data: any[] = [];
  this.barChartData = [];
  this.barChartLabels = [];
  for (let i = 0; i < valori.length; i++) {
    this.barChartLabels.push(valori[i]);
    data.push((( scelte[i] / scelteTotali ) * 100).toFixed(2));
    element['data'] = data;
  }
  element['label'] = 'Squadre';
  this.barChartData.push(element);

}
*/

  changeTipoVisualizzazione($event: MatRadioChange) {

    if (this.tipoVisualizzazione === 'T') {
      this.isGrafico = false;
    } else {
      this.isGrafico = true;
    }

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  applyFilter(filterValue: string) {
    this.dataSourceStatistiche.filter = filterValue.trim().toLowerCase();
  }

}
