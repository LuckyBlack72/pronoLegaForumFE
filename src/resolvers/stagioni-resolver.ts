import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage } from 'ngx-store';

import { PronosticiService } from '../app/service/pronostici.service';
import { Stagioni } from '../models/models';
import { Utils } from '../models/utils';

@Injectable()
export class StagioniResolver implements Resolve<Stagioni[]> {

    constructor(
                private pronosticiService: PronosticiService,
                private utils: Utils
            ) {
    }

    @LocalStorage() protected listaStagioni: Stagioni[];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Stagioni[]> {

        let fnd = false;

        if ( this.listaStagioni ) {

            for (let i = 0; i < this.listaStagioni.length; i++) {
                if (this.listaStagioni[i] === parseInt(this.utils.getStagione().substring(0, 4), 10) ) {
                    fnd = true;
                    break;
                }
            }

        }

        if (fnd) {

            return of(this.listaStagioni);

        } else {

            return this.pronosticiService.getStagioni();

        }

    }
}
