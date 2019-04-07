import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';


import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { DeviceDetectorModule } from 'ngx-device-detector';

// Hotkeys
import { HotkeyModule } from 'angular2-hotkeys';
import { CommandService } from './service/command.service';
// HotKeys

// Grafici
import { ChartsModule } from 'ng2-charts';
// Grafici

import { WebStorageModule } from 'ngx-store'; // gestione sessionstorage / localstorage

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PronosticiService } from './service/pronostici.service';
// import { DataService } from './dataservice.service';
import { UtilService } from './service/util.service';
import { ExternalApiService } from './service/externalApi.service';
import { CrudCompetizioneService } from './service/crudCompetizione.service';

import { Utils } from '../models/utils';

import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';
import { StagioniResolver } from '../resolvers/stagioni-resolver';
import { DatePronosticiResolver } from '../resolvers/datepronostici-resolver';
import { AnagraficaPartecipantiResolver } from '../resolvers/anagraficapartecipanti-resolver';
import { TipoCompetizioneResolver } from '../resolvers/tipocompetizione-resolver';

import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { MenuUtenteComponent } from './menu-utente/menu-utente.component';
import { ClassificaComponent, PronoUserComponent } from './classifica/classifica.component';
import { PageheaderComponent } from './pageheader/pageheader.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfiloComponent } from './profilo/profilo.component';
import { CrudCompetizioneComponent } from './crud-competizione/crud-competizione.component';
import { CrudCompetizioniResolver } from '../resolvers/crudcompetizioni-resolver';
import { LogAggiornamentiResolver } from '../resolvers/logaggiornamenti-resolver';
import { LeagueListResolver } from '../resolvers/leaguelist-resolver';
import { DatiLegaForumResolver } from '../resolvers/datilegaforum-resolver';
import { StatisticheComponent } from './statistiche/statistiche.component';
import { StagioneCorrenteResolver } from '../resolvers/stagionecorrente-resolver';
import { CrudCompetizioneSettimanaleComponent } from './crud-competizione-settimanale/crud-competizione-settimanale.component';
import { SchedineService } from './service/schedine.service';
import { ListaSchedineResolver } from '../resolvers/listaschedine-resolver';
import { SchedineComponent } from './schedine/schedine.component';
import { PronosticiSchedineResolver } from '../resolvers/pronosticischedine-resolver';

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
    ProfiloComponent,
    CrudCompetizioneComponent,
    PronoUserComponent,
    StatisticheComponent,
    CrudCompetizioneSettimanaleComponent,
    SchedineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    DeviceDetectorModule.forRoot(),
    ChartsModule
  ],
  // tslint:disable-next-line:max-line-length
  providers: [
              Utils,
              PronosticiService,
              SchedineService,
              UtilService,
              // DataService,
              CompetizioniResolver,
              ValoriPronosticiResolver,
              PronosticiResolver,
              DatePronosticiResolver,
              StagioniResolver,
              CommandService,
              AnagraficaPartecipantiResolver,
              ExternalApiService,
              CrudCompetizioniResolver,
              CrudCompetizioneService,
              TipoCompetizioneResolver,
              LogAggiornamentiResolver,
              LeagueListResolver,
              DatiLegaForumResolver,
              StagioneCorrenteResolver,
              ListaSchedineResolver,
              PronosticiSchedineResolver,
              {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
            ],
  entryComponents: [PronoUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
