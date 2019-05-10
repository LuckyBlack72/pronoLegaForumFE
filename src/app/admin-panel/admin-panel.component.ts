import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';

import { UtilService } from '../service/util.service';
import { PronosticiService } from '../service/pronostici.service';
import { SchedineService } from '../service/schedine.service';

import {
          DeviceInfo,
          FiltroAnagraficaPartecipanti,
          Stagioni
        } from '../../models/models';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  filtroExportPartecipanti: FiltroAnagraficaPartecipanti;

  listaStagioniEx: Stagioni[];
  listaStagioniLf: Stagioni[];
  listaStagioni: Stagioni[];
  tipoPronostici: string;
  stagioneSelect: number;
  tipoPronosticiCompetizioni: string;
  stagioneSelectCompetizioni: number;

  constructor(
                private deviceDetectorService: DeviceDetectorService,
                private activatedRoute: ActivatedRoute,
                private utilService: UtilService,
                private pronosticiService: PronosticiService,
                private schedineService: SchedineService
             ) { }

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    this.listaStagioniEx = this.activatedRoute.snapshot.data.listaStagioni;
    this.listaStagioniLf = this.activatedRoute.snapshot.data.listaStagioniLf;
    this.tipoPronostici = 'E';
    this.setComboStagioni(this.listaStagioniEx, this.listaStagioniLf, this.tipoPronostici);

    this.tipoPronosticiCompetizioni = 'E';

  }

  exportExcelUtenti ():  void {

    this.pronosticiService.getAnagraficaPartecipanti(this.filtroExportPartecipanti).subscribe(
      partecipanti => {
        this.utilService.exportUtentiExcel(partecipanti);
      }
      ,
      error => Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Errore Recupero dati',
        type: 'error'
      })
    );

  }

  exportExcelCompetizioni ():  void {

    this.pronosticiService.getAnagraficaCompetizioniExport(
                                                              this.stagioneSelectCompetizioni,
                                                              this.tipoPronosticiCompetizioni
                                                          ).subscribe(
      competizioni => {
        this.utilService.exportCompetizioniExcel(competizioni);
      }
      ,
      error => Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Errore Recupero dati',
        type: 'error'
      })
    );

  }


  exportExcelSchedine ():  void {

    this.schedineService.getAnagraficaSchedine(this.stagioneSelect, this.tipoPronostici).subscribe(
      schedine => {
        this.utilService.exportSchedineExcel(schedine);
      }
      ,
      error => Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Errore Recupero dati',
        type: 'error'
      })
    );

  }

  changeTipoPronostici() {

    this.setComboStagioni(this.listaStagioniEx, this.listaStagioniLf, this.tipoPronostici);
    this.stagioneSelect = null;

  }

  changeTipoPronosticiCompetizioni() {

    this.stagioneSelectCompetizioni = null;

  }


  setComboStagioni(
    stagioniEx: Stagioni[],
    stagioniLf: Stagioni[],
    tipoPronostici: string
  ): void {

    if ( tipoPronostici === 'E') {
      this.listaStagioni = stagioniEx;
    } else {
      this.listaStagioni = stagioniLf;
  }

}

}
