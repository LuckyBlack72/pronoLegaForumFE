import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { PronosticiService } from '../pronostici.service';
import { DataService } from '../dataservice.service';
import { DatePronostici } from '../../models/models';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {

  nicknameV: string;
  passwordV: string;
  loading = false;
  datePronostici: DatePronostici;
  @ViewChild('f') form: any;

  constructor(
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private pronosticiService: PronosticiService,
              public dataService: DataService
            ) { }

  ngOnInit() {

    this.datePronostici = this.activatedRoute.snapshot.data.datePronostici;
    this.dataService.data_apertura = this.datePronostici[0].data_apertura;
    this.dataService.data_chiusura = this.datePronostici[0].data_chiusura;
    this.dataService.nickname = '';
    this.dataService.idPartecipante = 0;

  }

  onSubmit() {

    if (this.form.valid) {
      this.loading = true;
      this.pronosticiService.checkPassword(this.nicknameV, this.passwordV)
          .subscribe(
              data => {
                  this.dataService.nickname = this.nicknameV;
                  this.dataService.idPartecipante = data;
                  this.loading = false;
                  this.form.reset();
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
