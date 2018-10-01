import { Component, OnInit } from '@angular/core';
import { SessionStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

// import { DataService } from '../dataservice.service';
import { UtilService } from '../service/util.service';

import { ApplicationParameter, DeviceInfo } from '../../models/models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    // public dataService: DataService,
    private utilService: UtilService, private deviceDetectorService: DeviceDetectorService
  ) { }

  pronoClosed: boolean;
  dataChiusuraProno: string;
  nickname: string;
  backActive: boolean;
  @SessionStorage() protected applicationParameter: ApplicationParameter;

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

    this.nickname = this.applicationParameter.nickname; // mi prendo il valore di nickname dal servizio
    this.pronoClosed = this.utilService.checkDateProno(this.applicationParameter.data_chiusura);
    this.dataChiusuraProno = this.applicationParameter.data_chiusura;
    this.backActive = this.applicationParameter.menu_utente_page;

  }

  logout() {

    this.utilService.logout();

  }

  back() {

    this.utilService.back();

  }

  editProfile() {

    this.utilService.editProfile();

  }

}
