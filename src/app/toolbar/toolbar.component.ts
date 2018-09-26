import { Component, OnInit } from '@angular/core';
import { SessionStorage } from 'ngx-store';

// import { DataService } from '../dataservice.service';
import { UtilService } from '../util.service';

import { ApplicationParameter } from '../../models/models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    // public dataService: DataService,
    private utilService: UtilService
  ) { }

  pronoClosed: boolean;
  dataChiusuraProno: string;
  nickname: string;
  backActive: boolean;
  @SessionStorage() protected applicationParameter: ApplicationParameter;

  ngOnInit() {

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
