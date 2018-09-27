import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { ValoriPronostici, FiltroValoriPronostici } from '../models/models';

@Injectable()
export class ValoriPronosticiResolver implements Resolve<ValoriPronostici[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    @LocalStorage() protected valoriPronostici: ValoriPronostici[];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ValoriPronostici[]> {


        if (
            !this.valoriPronostici ||
            this.valoriPronostici[0].stagione !== parseInt(this.utils.getStagione().substring(0, 4), 10)
        ) {

            const searchParameters: FiltroValoriPronostici = {stagione: parseInt(this.utils.getStagione().substring(0, 4), 10)};
            return this.pronosticiService.getValoriPronostici(searchParameters);

        } else {

            return of(this.valoriPronostici);

        }

    }
}
