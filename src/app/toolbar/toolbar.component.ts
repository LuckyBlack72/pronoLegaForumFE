import { Component, OnInit } from '@angular/core';

import { DataService } from '../dataservice.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public dataService: DataService,
    private utilService: UtilService
  ) { }

  pronoClosed: boolean;
  dataChiusuraProno: string;
  nickname: string;
  backActive: boolean;

  ngOnInit() {

    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio
    this.pronoClosed = this.utilService.checkDateProno(this.dataService.data_chiusura);
    this.dataChiusuraProno = this.dataService.data_chiusura;
    this.backActive = this.dataService.menu_utente_page;

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
