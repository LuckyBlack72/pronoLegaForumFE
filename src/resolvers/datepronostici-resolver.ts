import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { DatePronostici, FiltroStagione } from '../models/models';

@Injectable()
export class DatePronosticiResolver implements Resolve<DatePronostici> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    @LocalStorage() protected datePronostici: DatePronostici;

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<DatePronostici> {

        if (!this.datePronostici || this.datePronostici[0].stagione != this.utils.getStagione().substring(0, 4)) {
            const searchParameters: FiltroStagione = {stagione: parseInt(this.utils.getStagione().substring(0, 4), 10)};
            return this.pronosticiService.getDatePronostici(searchParameters);
        } else {
            return of(this.datePronostici);
        }

    }
}
