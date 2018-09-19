import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CountdownTimerModule } from 'ngx-countdown-timer';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PronosticiService } from './pronostici.service';
import { DataService } from './dataservice.service';
import { UtilService } from './util.service';

import { Utils } from '../models/utils';

import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';
import { StagioniResolver } from '../resolvers/stagioni-resolver';
import { DatePronosticiResolver } from '../resolvers/datepronostici-resolver';

import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { MenuUtenteComponent } from './menu-utente/menu-utente.component';
import { ClassificaComponent } from './classifica/classifica.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    PronosticiComponent,
    RegistrazioneComponent,
    MenuUtenteComponent,
    ClassificaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'modal-content'
    }),
    CountdownTimerModule.forRoot()
  ],
  // tslint:disable-next-line:max-line-length
  providers: [
              Utils,
              PronosticiService,
              UtilService,
              DataService,
              CompetizioniResolver,
              ValoriPronosticiResolver,
              PronosticiResolver,
              DatePronosticiResolver,
              StagioniResolver
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
