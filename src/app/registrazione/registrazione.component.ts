import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PronosticiService } from '../pronostici.service';
import { FiltroAnagraficaPartecipanti, AnagraficaPartecipanti } from '../../models/models';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  nicknameV: string;
  passwordV: string;
  passwordConfV: string;
  emailV: string;
  loading = false;
  loginbutton = false;
  @ViewChild('f') form: any;
  searchParameter: FiltroAnagraficaPartecipanti = { nickname: '' };
  dataToSave: AnagraficaPartecipanti = {
                                          nickname: '',
                                          email_address: '',
                                          password_value: ''
                                        };

  constructor(private router: Router, private pronosticiService: PronosticiService, private utilService: UtilService) { }

  ngOnInit() {
  }

  onSubmit() {

    let checkPassword = true;
    let checkEmail = true;

     if (this.form.valid) {

      checkPassword = this.checkPassword();
      checkEmail = this.checkEmail();

      if (checkPassword && checkEmail) {

        this.loading = true;
        this.searchParameter.nickname = this.nicknameV;
        this.pronosticiService.getAnagraficaPartecipanti(this.searchParameter)
            .subscribe(
                data => {
                  if (data.length > 0) {
                    this.loading = false;
                    Swal({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      title: 'Nickname già presente',
                      type: 'error'
                    });
                  } else {

                    this.dataToSave.nickname = this.nicknameV;
                    this.dataToSave.email_address = this.emailV;
                    this.dataToSave.password_value = this.passwordV;
                    this.pronosticiService.saveAnagraficaPartecipanti(this.dataToSave)
                    .subscribe(
                      dataSaved => {
                        this.loginbutton = true;
                        this.loading = false;
                        Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Registrazione Effettuata con successo',
                          type: 'success'
                        });
                      },
                      error => {
                        this.loading = false;
                        this.form.reset();
                        Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Errore applicazione' + '[' + error + ']',
                          type: 'error'
                        });
                    });
                  }
                },
                error => {
                    this.loading = false;
                    this.form.reset();
                    Swal({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      title: 'Errore applicazione' + '[' + error + ']',
                      type: 'error'
                    });
                });
      } else {
        checkPassword ? this.emailV = '' : this.passwordConfV = '';
        Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: checkPassword ? 'Indirizzo email non valido' : 'Le password non coincidono',
          type: 'error'
        });
      }
    }
  }

  gotoLogin() {

    this.router.navigate(['/index-page']) ;

  }

  checkPassword (): boolean {

    let retVal = true;

    if (this.passwordV !== this.passwordConfV) {
      retVal = false;
    }

    return retVal;

  }

  checkEmail (): boolean {

    return this.utilService.checkEmail(this.emailV);

  }


}
