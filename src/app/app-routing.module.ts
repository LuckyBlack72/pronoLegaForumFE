import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { CompetizioniResolver } from '../resolvers/pronostici-resolver';
import { ValoriPronosticiResolver } from '../resolvers/valoripronostici-resolver';

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
              valoriPronostici: ValoriPronosticiResolver
            }
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

