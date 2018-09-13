import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PronosticiService } from './pronostici.service';
import { DataService } from './dataservice.service';
import { CompetizioniResolver } from '../resolvers/pronostici-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { Utils } from '../models/utils';

import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    PronosticiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'modal-content'
    })
  ],
  providers: [Utils, CompetizioniResolver, ValoriPronosticiResolver, PronosticiService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
