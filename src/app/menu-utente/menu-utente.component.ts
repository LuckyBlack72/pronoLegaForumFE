import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-store';

// import { DataService } from '../dataservice.service';
import { UtilService } from '../service/util.service';
import { ApplicationParameter } from '../../models/models';

@Component({
  selector: 'app-menu-utente',
  templateUrl: './menu-utente.component.html',
  styleUrls: ['./menu-utente.component.css']
})
export class MenuUtenteComponent implements OnInit {

  constructor(
    private router: Router,
    // public dataService: DataService,
    private utilService: UtilService
  ) { }

  @SessionStorage() protected applicationParameter: ApplicationParameter;

  ngOnInit() {
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
