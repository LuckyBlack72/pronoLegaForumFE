import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

// import { DataService } from '../dataservice.service';
import { UtilService } from '../service/util.service';
import { PronosticiService } from '../service/pronostici.service';
import { CommandService, Command } from '../service/command.service';

import { ApplicationParameter, DeviceInfo } from '../../models/models';


@Component({
  selector: 'app-menu-utente',
  templateUrl: './menu-utente.component.html',
  styleUrls: ['./menu-utente.component.css']
})
export class MenuUtenteComponent implements OnInit, OnDestroy {

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  subscriptionHotKey: Subscription;

  constructor(
    private router: Router,
    // public dataService: DataService,
    private pronosticiService: PronosticiService,
    private utilService: UtilService,
    private deviceDetectorService: DeviceDetectorService,
    private commandService: CommandService,
  ) {

    this.subscriptionHotKey = this.commandService.commands.subscribe(c => this.handleCommand(c));

  }

  @SessionStorage() protected applicationParameter: ApplicationParameter;

  ngOnInit() {

    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.isMobile  = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktopDevice = this.deviceDetectorService.isDesktop();

  }

  ngOnDestroy() {

    this.subscriptionHotKey.unsubscribe();

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

  handleCommand(command: Command) {

    switch (command.name) {
      case 'MenuUtenteComponent.SetAdmin':
        this.checkAdminPassword();
        break;
      default:
        break;
    }

  }

  async checkAdminPassword() {

    const {value: password} = await Swal({
      title: 'Administrator Login',
      input: 'password',
      inputPlaceholder: 'Enter Administrator password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true
    });

    if (password) {
      this.pronosticiService.checkAdminPassword(password).subscribe(
        data => {
          this.applicationParameter.menu_utente_page = true;
          this.router.navigate(['crud-competizione']);
          }
        ,
        error => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Password Errata',
          type: 'error'
        })
      );
    }
  }

}
