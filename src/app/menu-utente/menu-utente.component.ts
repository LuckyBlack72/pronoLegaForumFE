import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../dataservice.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-menu-utente',
  templateUrl: './menu-utente.component.html',
  styleUrls: ['./menu-utente.component.css']
})
export class MenuUtenteComponent implements OnInit {

  constructor(
    private router: Router,
    public dataService: DataService,
    private utilService: UtilService
  ) { }

  pronoClosed: boolean;
  dataChiusuraProno: string;
  nickname: string;

  ngOnInit() {

    this.nickname = this.dataService.nickname; // mi prendo il valore di nickname dal servizio
    this.pronoClosed = this.utilService.checkDateProno(this.dataService.data_chiusura);
    this.dataChiusuraProno = this.dataService.data_chiusura;

  }

  navigatePage(page: String) {

    switch (page) {

      case 'p' :
        this.router.navigate(['/pronostici']);
        break;

      case 'c' :
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
