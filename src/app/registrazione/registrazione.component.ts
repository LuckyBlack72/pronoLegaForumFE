import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PronosticiService } from '../service/pronostici.service';
import { FiltroAnagraficaPartecipanti, AnagraficaPartecipanti } from '../../models/models';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  constructor(private router: Router, private pronosticiService: PronosticiService, private utilService: UtilService) { }

  loading = false;
  loginbutton = false;
  searchParameter: FiltroAnagraficaPartecipanti = { nickname: '' };
  dataToSave: AnagraficaPartecipanti = {
                                          nickname: '',
                                          email_address: '',
                                          password_value: ''
                                        };

    // i contenitori degli input sulla pagina
    registrazioneForm: FormGroup;

    get f() { return this.registrazioneForm.controls; }

  ngOnInit() {

    this.registrazioneForm = new FormGroup({
      nicknameFormControl: new FormControl('', Validators.required),
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl('', Validators.required),
      repeatPasswordFormControl: new FormControl('', Validators.required),
    });
  }

  onSubmit() {

    if (this.registrazioneForm.valid) {

      this.loading = true;
      this.searchParameter.nickname = this.f.nicknameFormControl.value;
      this.pronosticiService.getAnagraficaPartecipanti(this.searchParameter).subscribe(
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

          this.dataToSave.nickname = this.f.nicknameFormControl.value;
          this.dataToSave.email_address = this.f.emailFormControl.value;
          this.dataToSave.password_value = this.f.passwordFormControl.value;
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
              this.registrazioneForm = new FormGroup({
                nicknameFormControl: new FormControl('', Validators.required),
                emailFormControl: new FormControl('', [Validators.required, Validators.email]),
                passwordFormControl: new FormControl('', Validators.required),
                repeatPasswordFormControl: new FormControl('', Validators.required),
              });
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
          this.registrazioneForm = new FormGroup({
            nicknameFormControl: new FormControl('', Validators.required),
            emailFormControl: new FormControl('', [Validators.required, Validators.email]),
            passwordFormControl: new FormControl('', Validators.required),
            repeatPasswordFormControl: new FormControl('', Validators.required),
          });
          Swal({
            allowOutsideClick: false,
            allowEscapeKey: false,
            title: 'Errore applicazione' + '[' + error + ']',
            type: 'error'
          });
      });
    }

  }

  gotoLogin() {

    this.router.navigate(['/index-page']) ;

  }

}
