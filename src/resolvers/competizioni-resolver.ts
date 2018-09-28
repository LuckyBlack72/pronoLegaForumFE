import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/service/pronostici.service';
import { AnagraficaCompetizioni } from '../models/models';

@Injectable()
export class CompetizioniResolver implements Resolve<AnagraficaCompetizioni[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    @LocalStorage() protected competizioni: AnagraficaCompetizioni[];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {

        let fnd = false;

        if (this.competizioni) {
            for (let i = 0; i < this.competizioni[0].anni_competizione.length; i++ ) {
                if ( this.competizioni[0].anni_competizione[i] === parseInt(this.utils.getStagione().substring(0, 4), 10) ) {
                    fnd = true;
                    break;
                }
            }
        } else {
            fnd = false;
        }

        if (fnd) {
            return of(this.competizioni);
        } else {
            return this.pronosticiService.getAnagraficaCompetizioni(parseInt(this.utils.getStagione().substring(0, 4), 10));
        }

    }
}
