import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { DatePronosticiResolver } from '../resolvers/datepronostici-resolver';
import { MenuUtenteComponent } from './menu-utente/menu-utente.component';

// qui si mettono i resolver per i vari routing
const routes: Routes = [
  { path: '',
    redirectTo: '/index-page',
    pathMatch: 'full'
  },
  { path: 'index-page',
    component: IndexPageComponent,
    resolve: {
      datePronostici: DatePronosticiResolver,
    }
  },
  { path: 'pronostici',
    component: PronosticiComponent,
    resolve: {
              listaCompetizioni: CompetizioniResolver,
              valoriPronostici: ValoriPronosticiResolver,
              pronosticiSaved: PronosticiResolver
            }
  },
  { path: 'registrazione',
    component: RegistrazioneComponent
  },
  { path: 'menu-utente',
    component: MenuUtenteComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

