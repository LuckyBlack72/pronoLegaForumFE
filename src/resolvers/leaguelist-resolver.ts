import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ExternalApiService } from '../app/service/externalApi.service';
import { Utils } from '../models/utils';

@Injectable()
export class LeagueListResolver implements Resolve<any> {

    constructor(
                private externalApiService: ExternalApiService,
                private utils: Utils
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<any> {

            return this.externalApiService.getLeagueList();

    }
}
