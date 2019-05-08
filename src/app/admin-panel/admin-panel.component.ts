import { Component, OnInit } from '@angular/core';

import { UtilService } from '../service/util.service';
import { PronosticiService } from '../service/pronostici.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';

import {
          DeviceInfo,
          FiltroAnagraficaPartecipanti
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

  constructor(
                private deviceDetectorService: DeviceDetectorService,
                private utilService: UtilService,
                private pronosticiService: PronosticiService
             ) { }

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

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

}
