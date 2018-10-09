import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PronosticiService } from '../app/service/pronostici.service';
import { LogAggiornamenti } from '../models/models';
import { Utils } from '../models/utils';

@Injectable()
export class LogAggiornamentiResolver implements Resolve<LogAggiornamenti[]> {

    constructor(
                private pronosticiService: PronosticiService,
                private utils: Utils
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<LogAggiornamenti[]> {

            return this.pronosticiService.getLogAggiornamenti();

    }
}
