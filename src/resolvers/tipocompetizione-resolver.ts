import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PronosticiService } from '../app/service/pronostici.service';
import { TipoCompetizione } from '../models/models';

@Injectable()
export class TipoCompetizioneResolver implements Resolve<TipoCompetizione[]> {

    constructor(
                private pronosticiService: PronosticiService
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<TipoCompetizione[]> {


        return this.pronosticiService.getTipoCompetizione();


    }
}
