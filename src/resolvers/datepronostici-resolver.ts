import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { DatePronostici, FiltroStagione } from '../models/models';

@Injectable()
export class DatePronosticiResolver implements Resolve<DatePronostici> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<DatePronostici> {

        const searchParameters: FiltroStagione = {stagione: parseInt(this.utils.getStagione().substring(0, 4), 10)};
        return this.pronosticiService.getDatePronostici(searchParameters);
    }
}
