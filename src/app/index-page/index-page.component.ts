import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage, LocalStorageService, SessionStorageService } from 'ngx-store';

import { PronosticiService } from '../service/pronostici.service';
// import { DataService } from '../dataservice.service';
import { DatePronostici, ApplicationParameter, LogAggiornamenti, Stagioni } from '../../models/models';
import { Utils } from '../../models/utils';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pronosticiService: PronosticiService,
    private utils: Utils,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
//  public dataService: DataService
  ) { }

  loading = false;

  @SessionStorage() applicationParameter: ApplicationParameter;
  @SessionStorage() stagioneCorrente: Stagioni;

  // @LocalStorage() log_aggiornamentiLS: LogAggiornamenti[];
  log_aggiornamentiLS: LogAggiornamenti[];

  log_aggiornamenti: LogAggiornamenti[];

  // i contenitori degli input sulla pagina
  nicknameFormControl = new FormControl('', Validators.required);
  passwordFormControl = new FormControl('', Validators.required);



  ngOnInit() {

    /*
    if (!this.log_aggiornamentiLS) {
      this.localStorageService.set('log_aggiornamentiLS', this.activatedRoute.snapshot.data.logAggiornamenti);
    }
    */

    this.log_aggiornamenti = this.activatedRoute.snapshot.data.logAggiornamenti;
    this.stagioneCorrente = this.activatedRoute.snapshot.data.stagioneCorrente;

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

    if (this.nicknameFormControl.valid && this.passwordFormControl.valid) {
      this.loading = true;
      this.pronosticiService.checkPassword(this.nicknameFormControl.value, this.passwordFormControl.value)
          .subscribe(
              data => {
                  this.applicationParameter.nickname = this.nicknameFormControl.value;
                  this.applicationParameter.idPartecipante = data;
                  this.loading = false;
                  this.nicknameFormControl.setValue(null);
                  this.passwordFormControl.setValue(null);
                  this.applicationParameter.menu_utente_page = false;
                  this.sessionStorageService.set('applicationParameter', this.applicationParameter);
                  this.router.navigate(['/menu-utente']) ;
              },
              error => {
                  this.loading = false;
                  this.nicknameFormControl.setValue(null);
                  this.passwordFormControl.setValue(null);
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

  async recoverPassword() {

    const {value: email} = await Swal({
      title: 'Recupera Password',
      input: 'email',
      inputPlaceholder: 'Inserisci la mail del tuo profilo',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true
    });

    if (email) {
      this.pronosticiService.recoverPassword(email).subscribe(
        data => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Riceverai una mail con la password provvisoria da modificare al primo accesso',
          type: 'success'
        })
        ,
        error => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Nessun utente registrato con  questo indirizzo email',
          type: 'error'
        })
      );
    }
  }


}
