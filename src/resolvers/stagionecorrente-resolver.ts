import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PronosticiService } from '../app/service/pronostici.service';
import { Stagioni } from '../models/models';
import { Utils } from '../models/utils';

@Injectable()
export class StagioneCorrenteResolver implements Resolve<Stagioni> {

    constructor(
                private pronosticiService: PronosticiService,
                private utils: Utils
            ) {
    }

    resolve( // SENZA LOCAL STORAGE
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Stagioni> {

        return this.pronosticiService.getStagioneCorrente();

    }

}
