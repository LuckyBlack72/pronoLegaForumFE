import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { MenuUtenteComponent } from './menu-utente/menu-utente.component';
import { ClassificaComponent } from './classifica/classifica.component';
import { ProfiloComponent } from './profilo/profilo.component';
import { CrudCompetizioneComponent } from './crud-competizione/crud-competizione.component';

import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { DatePronosticiResolver } from '../resolvers/datepronostici-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';
import { StagioniResolver } from '../resolvers/stagioni-resolver';
import { AnagraficaPartecipantiResolver } from '../resolvers/anagraficapartecipanti-resolver';
import { CrudCompetizioniResolver } from '../resolvers/crudcompetizioni-resolver';
import { TipoCompetizioneResolver } from '../resolvers/tipocompetizione-resolver';
import { LogAggiornamentiResolver } from '../resolvers/logaggiornamenti-resolver';

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
      logAggiornamenti: LogAggiornamentiResolver
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
  },
  { path: 'classifica',
    component: ClassificaComponent,
    resolve: {
              listaStagioni: StagioniResolver,
            }
  },
  { path: 'profilo',
    component: ProfiloComponent,
    resolve: {
              anagraficaPartecipante: AnagraficaPartecipantiResolver
    }
  },
  { path: 'crud-competizione',
  component: CrudCompetizioneComponent,
  resolve: {
    listaCompetizioni: CrudCompetizioniResolver,
    tipiCompetizione: TipoCompetizioneResolver
  }
},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

