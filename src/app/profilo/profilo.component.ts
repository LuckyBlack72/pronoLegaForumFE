import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { PronosticiService } from '../service/pronostici.service';
import { FiltroAnagraficaPartecipanti, AnagraficaPartecipanti } from '../../models/models';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {

  constructor(
                private activatedRoute: ActivatedRoute,
                private pronosticiService: PronosticiService
              ) {

  }

  loading = false;
  loginbutton = false;

  searchParameter: FiltroAnagraficaPartecipanti = { nickname: '' };
  dataToSave: AnagraficaPartecipanti = {
                                          nickname: '',
                                          email_address: '',
                                          password_value: ''
                                        };
  anagraficaPartecipante: AnagraficaPartecipanti[];

  // i contenitori degli input sulla pagina
  profileForm: FormGroup;

  get f() { return this.profileForm.controls; }

  ngOnInit() {

    this.anagraficaPartecipante = this.activatedRoute.snapshot.data.anagraficaPartecipante;

    this.profileForm = new FormGroup({
      nicknameFormControl: new FormControl({value: this.anagraficaPartecipante[0].nickname, disabled: true}, Validators.required),
      emailFormControl: new FormControl(this.anagraficaPartecipante[0].email_address, [Validators.required, Validators.email]),
      currentPasswordFormControl: new FormControl('', Validators.required),
      newPasswordFormControl: new FormControl('', Validators.required),
      repeatNewPasswordFormControl: new FormControl('', Validators.required),
    });

  }

  checkPasswordToConfirmSave() {

    if (this.profileForm.valid) {
      this.pronosticiService.checkPassword(
                                            this.profileForm.controls.nicknameFormControl.value,
                                            this.profileForm.controls.currentPasswordFormControl.value
                                          ).subscribe(
        data => {
          this.saveData();
        }
        ,
        error => Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Password Corrente Errata',
          type: 'error'
        })
      );
    }

  }

  saveData() {

    let checkNewPassword = true;

    checkNewPassword = this.checkNewPassword();

      if (checkNewPassword) {

        this.loading = true;
        this.dataToSave.nickname = this.profileForm.controls.nicknameFormControl.value;
        this.dataToSave.email_address = this.profileForm.controls.emailFormControl.value;
        this.dataToSave.password_value = this.profileForm.controls.newPasswordFormControl.value;
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
            this.profileForm = new FormGroup({
              nicknameFormControl: new FormControl(this.anagraficaPartecipante[0].nickname, Validators.required),
              emailPasswordFormControl: new FormControl(this.anagraficaPartecipante[0].email_address,
                                                        [Validators.required, Validators.email]),
              currentPasswordFormControl: new FormControl('', Validators.required),
              newPasswordFormControl: new FormControl('', Validators.required),
              repeatNewPasswordFormControl: new FormControl('', Validators.required),
            });
            Swal({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Errore applicazione' + '[' + error + ']',
              type: 'error'
            });
          }
        );
      } else {
        Swal({
          allowOutsideClick: false,
          allowEscapeKey: false,
          title: 'Le nuove password non coincidono',
          type: 'error'
        });
      }
  }

  checkNewPassword (): boolean {

    const pVcheck = this.profileForm.controls.newPasswordFormControl.value;
    const pcVcheck = this.profileForm.controls.repeatNewPasswordFormControl.value;

    let retVal = true;

    if ( pVcheck !== pcVcheck ) {
      retVal = false;
    }

    return retVal;

  }

}
