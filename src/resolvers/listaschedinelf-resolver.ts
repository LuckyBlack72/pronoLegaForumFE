import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Utils } from '../models/utils';
import { SchedineService } from '../app/service/schedine.service';
import { AnagraficaCompetizioniSettimanali } from '../models/models';

@Injectable()
export class ListaSchedineLfResolver implements Resolve<AnagraficaCompetizioniSettimanali[]> {

    constructor(private schedineService: SchedineService, private utils: Utils) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioniSettimanali[]> {


        // 0 prende tutte le competizioni del DB a prescirdere dalla stagione
        return this.schedineService.getAnagraficaSchedine(0, 'L');

    }
}
