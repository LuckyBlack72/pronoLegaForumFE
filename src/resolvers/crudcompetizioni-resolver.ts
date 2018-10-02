import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/service/pronostici.service';
import { AnagraficaCompetizioni } from '../models/models';

@Injectable()
export class CrudCompetizioniResolver implements Resolve<AnagraficaCompetizioni[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {

        // 0 prende tutte le competizioni del DB a prescirdere dalla stagione
        return this.pronosticiService.getAnagraficaCompetizioni(0);

    }
}
