import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { DeviceDetectorModule } from 'ngx-device-detector';

// Hotkeys
import { HotkeyModule } from 'angular2-hotkeys';
import { CommandService } from './service/command.service';
// HotKeys

import { WebStorageModule } from 'ngx-store'; // gestione sessionstorage / localstorage

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PronosticiService } from './service/pronostici.service';
// import { DataService } from './dataservice.service';
import { UtilService } from './service/util.service';
import { ExternalApiService } from './service/externalApi.service';

import { Utils } from '../models/utils';

import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';
import { StagioniResolver } from '../resolvers/stagioni-resolver';
import { DatePronosticiResolver } from '../resolvers/datepronostici-resolver';
import { AnagraficaPartecipantiResolver } from '../resolvers/anagraficapartecipanti-resolver';

import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { MenuUtenteComponent } from './menu-utente/menu-utente.component';
import { ClassificaComponent } from './classifica/classifica.component';
import { PageheaderComponent } from './pageheader/pageheader.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfiloComponent } from './profilo/profilo.component';


@NgModule({
  declarations: [
    AppComponent,
    PageheaderComponent,
    IndexPageComponent,
    PronosticiComponent,
    RegistrazioneComponent,
    MenuUtenteComponent,
    ClassificaComponent,
    PageheaderComponent,
    ToolbarComponent,
    ProfiloComponent
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
    CountdownTimerModule.forRoot(),
    HotkeyModule.forRoot(),
    WebStorageModule,
    DeviceDetectorModule.forRoot()
  ],
  // tslint:disable-next-line:max-line-length
  providers: [
              Utils,
              PronosticiService,
              UtilService,
              // DataService,
              CompetizioniResolver,
              ValoriPronosticiResolver,
              PronosticiResolver,
              DatePronosticiResolver,
              StagioniResolver,
              CommandService,
              AnagraficaPartecipantiResolver,
              ExternalApiService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
