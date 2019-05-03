import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pronostici Lega Forum';

  // per caricare lo spinner sulla navigazione tra pagine
  showLoadingIndicator = true;
  constructor ( private router: Router, private spinner: NgxSpinnerService) {
    this.router.events.subscribe((routerEvent: Event) => {
      if ( routerEvent instanceof NavigationStart ) {
        // this.showLoadingIndicator = true;
        this.spinner.show();
      }
      if ( routerEvent instanceof NavigationEnd ) {
        // this.showLoadingIndicator = false;
        this.spinner.hide();
      }
    });
  }
  // per caricare lo spinner sulla navigazione tra pagine

}
