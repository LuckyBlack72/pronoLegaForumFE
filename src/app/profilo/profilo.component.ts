import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PronosticiService } from '../pronostici.service';
import { FiltroAnagraficaPartecipanti, AnagraficaPartecipanti } from '../../models/models';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {

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

  async checkPasswordToConfirmSave() {

    const {value: password} = await Swal({
      title: 'Conferma Modifiche Profilo',
      input: 'password',
      inputPlaceholder: 'Inserisci la tua password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true
    });

    if (password) {
      this.pronosticiService.checkPassword(this.nicknameV, password).subscribe(
        data => {
          this.saveData();
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


  saveData() {

    let checkPassword = true;
    let checkEmail = true;

    if (this.form.valid) {

      checkPassword = this.checkPassword();
      checkEmail = this.checkEmail();

      if (checkPassword && checkEmail) {

        this.loading = true;
        this.dataToSave.nickname = this.nicknameV;
        this.dataToSave.email_address = this.emailV;
        this.dataToSave.password_value = this.passwordV;
        this.pronosticiService.updateAnagraficaPartecipanti(this.dataToSave)
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
          }
        );
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
