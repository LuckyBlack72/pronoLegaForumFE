import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ExternalApiService } from '../app/service/externalApi.service';
import { Utils } from '../models/utils';
import { DatiSquadraLegaForum } from '../models/models';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class DatiLegaForumResolver implements Resolve<DatiSquadraLegaForum[][][]> {

    constructor(
                private externalApiService: ExternalApiService,
                private utils: Utils
            ) {
    }

/* CON LOCAL STORAGA

    @LocalStorage() datiLegaForum: DatiSquadraLegaForum[][][];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<DatiSquadraLegaForum[][][]> {

        const stagione = parseInt(this.utils.getStagione().substring(0, 4), 10);
        let fnd = false;

        if (this.datiLegaForum) {

            if (this.datiLegaForum[0][0][0].stagione === stagione) {

                fnd = true;

            } else {

                fnd = false;

            }

        } else {

            fnd = false;
        }

        if (fnd) {

            return of(this.datiLegaForum);

        } else {

            return this.externalApiService.getDatiSorteggioLegaForum(stagione);

        }

    }
*/

    resolve( // SENZA LOCAL STORAGE
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<DatiSquadraLegaForum[][][]> {

        const stagione = parseInt(this.utils.getStagione().substring(0, 4), 10);
        return this.externalApiService.getDatiSorteggioLegaForum(stagione);

    }

}
