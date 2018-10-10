import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage, LocalStorageService, SessionStorageService } from 'ngx-store';

import { PronosticiService } from '../service/pronostici.service';
// import { DataService } from '../dataservice.service';
import { DatePronostici, ApplicationParameter, LogAggiornamenti } from '../../models/models';
import { Utils } from '../../models/utils';


@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {

  nicknameV: string;
  passwordV: string;
  loading = false;
  @ViewChild('f') form: any;

  @SessionStorage() applicationParameter: ApplicationParameter;
  @LocalStorage() log_aggiornamentiLS: LogAggiornamenti[];

  log_aggiornamenti: LogAggiornamenti[];

  constructor(
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private pronosticiService: PronosticiService,
              private utils: Utils,
              private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService
 //             public dataService: DataService
            ) { }

  ngOnInit() {

    if (!this.log_aggiornamentiLS) {
      this.localStorageService.set('log_aggiornamentiLS', this.activatedRoute.snapshot.data.logAggiornamenti);
    }

    this.log_aggiornamenti = this.activatedRoute.snapshot.data.logAggiornamenti;

    // creo l'oggetto per il session storage da propagare in tutta l'applicazione
    // viene distrutto quando si chiude il tab del browser con l'applicazione
    // è nella memoria locale del browser
    this.applicationParameter = {
      data_apertura: 'XXX',
      data_chiusura: 'XXX',
      data_calcolo_classifica : 'XXX',
      nickname: '',
      idPartecipante: 0,
      menu_utente_page: false,
      log_aggiornamenti: this.log_aggiornamenti
    };
    this.sessionStorageService.set('applicationParameter', this.applicationParameter);

  }

  onSubmit() {

    if (this.form.valid) {
      this.loading = true;
      this.pronosticiService.checkPassword(this.nicknameV, this.passwordV)
          .subscribe(
              data => {
                  this.applicationParameter.nickname = this.nicknameV;
                  this.applicationParameter.idPartecipante = data;
                  this.loading = false;
                  this.form.reset();
                  this.applicationParameter.menu_utente_page = false;
                  this.sessionStorageService.set('applicationParameter', this.applicationParameter);
                  this.router.navigate(['/menu-utente']) ;
              },
              error => {
                  this.loading = false;
                  this.form.reset();
                  Swal({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: 'NickName e/o Password Errata',
                    type: 'error'
                  });
              });
    }

  }

  gotoRegister() {

    this.router.navigate(['/registrazione']) ;

  }

}
