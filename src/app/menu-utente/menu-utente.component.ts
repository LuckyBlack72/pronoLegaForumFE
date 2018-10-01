import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

// import { DataService } from '../dataservice.service';
import { UtilService } from '../service/util.service';
import { ApplicationParameter, DeviceInfo } from '../../models/models';


@Component({
  selector: 'app-menu-utente',
  templateUrl: './menu-utente.component.html',
  styleUrls: ['./menu-utente.component.css']
})
export class MenuUtenteComponent implements OnInit {

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  constructor(
    private router: Router,
    // public dataService: DataService,
    private utilService: UtilService,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  @SessionStorage() protected applicationParameter: ApplicationParameter;

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
        this.router.navigate(['/pronostici']);
        break;

      case 'c' :
        this.applicationParameter.menu_utente_page = true;
        this.router.navigate(['/classifica']);
        break;

      default :
        break;

    }

  }

  logout() {

    this.utilService.logout();

  }

}
