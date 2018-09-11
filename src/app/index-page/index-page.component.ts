import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PronosticiService } from '../pronostici.service';

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

  constructor(private router: Router, private pronosticiService: PronosticiService) { }

  ngOnInit() {
  }

  onSubmit() {

    if (this.form.valid) {
      this.loading = true;
      this.pronosticiService.checkPassword(this.nicknameV, this.passwordV)
          .subscribe(
              data => {
                  // this.router.navigate([this.returnUrl]);
                  this.loading = false;
                  this.form.reset();
                  Swal({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: 'Dati Corretti',
                    type: 'success'
                  });
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

}
