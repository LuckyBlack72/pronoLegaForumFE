import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { CompetizioniResolver } from '../resolvers/competizioni-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';
import { PronosticiResolver } from '../resolvers/pronostici-resolver';

// qui si mettono i resolver per i vari routing
const routes: Routes = [
  { path: '',
    redirectTo: '/index-page',
    pathMatch: 'full'
  },
  { path: 'index-page',
    component: IndexPageComponent
  },
  { path: 'pronostici',
    component: PronosticiComponent,
    resolve: {
              listaCompetizioni: CompetizioniResolver,
              valoriPronostici: ValoriPronosticiResolver,
              pronosticiSaved: PronosticiResolver
            }
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

