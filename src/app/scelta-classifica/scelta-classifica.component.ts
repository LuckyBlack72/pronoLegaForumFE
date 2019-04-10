import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-store';

import { DeviceDetectorService } from 'ngx-device-detector';

import { UtilService } from '../service/util.service';

import { ApplicationParameter, DeviceInfo } from '../../models/models';

@Component({
  selector: 'app-scelta-classifica',
  templateUrl: './scelta-classifica.component.html',
  styleUrls: ['./scelta-classifica.component.css']
})
export class SceltaClassificaComponent implements OnInit {

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() applicationParameter: ApplicationParameter;

  constructor(

    private router: Router,
    private utilService: UtilService,
    private deviceDetectorService: DeviceDetectorService

  ) { }

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();
  }

  navigatePage(page: String) {

    switch (page) {

      case 'p' :
        this.applicationParameter.menu_utente_page = true;
        this.router.navigate(['/classifica']);
        break;

      case 's' :
        this.applicationParameter.menu_utente_page = true;
        this.router.navigate(['/classifica-schedine']); // TODO
        break;

      default :
        break;

    }

  }

  logout() {

    this.utilService.logout();

  }

}
