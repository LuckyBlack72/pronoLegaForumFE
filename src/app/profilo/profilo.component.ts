import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PronosticiService } from '../service/pronostici.service';
import { FiltroAnagraficaPartecipanti, AnagraficaPartecipanti } from '../../models/models';
import { UtilService } from '../service/util.service';

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
  anagraficaPartecipante: AnagraficaPartecipanti[];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private pronosticiService: PronosticiService,
              private utilService: UtilService) { }


  ngOnInit() {

      this.anagraficaPartecipante = this.activatedRoute.snapshot.data.anagraficaPartecipante;
      this.nicknameV = this.anagraficaPartecipante[0].nickname;
      this.emailV = this.anagraficaPartecipante[0].email_address;

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
        this.dataToSave.password_value = this.passwordV === undefined || this.passwordV === '' ? 'ZYZYZY' : this.passwordV;
        this.pronosticiService.updateAnagraficaPartecipanti(this.dataToSave)
        .subscribe(
          dataSaved => {
            this.loginbutton = true;
            this.loading = false;
            Swal({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Modifiche Effettuate con successo',
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

    const pVcheck = this.passwordV === undefined || this.passwordV === '' ? 'ZYZYZY' : this.passwordV;
    const pcVcheck = this.passwordConfV === undefined || this.passwordConfV === '' ? 'ZYZYZY' : this.passwordV;

    let retVal = true;

    if ( pVcheck !== pcVcheck ) {
      retVal = false;
    }

    return retVal;

  }


  checkEmail (): boolean {

    return this.utilService.checkEmail(this.emailV);

  }

}
