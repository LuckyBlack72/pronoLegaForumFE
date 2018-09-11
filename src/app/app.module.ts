import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiService } from './pronostici.service';



@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent
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
  providers: [PronosticiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
