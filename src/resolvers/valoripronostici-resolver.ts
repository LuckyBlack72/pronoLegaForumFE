import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { ValoriPronostici, FiltroValoriPronostici } from '../models/models';

@Injectable()
export class ValoriPronosticiResolver implements Resolve<ValoriPronostici[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ValoriPronostici[]> {

        const searchParameters: FiltroValoriPronostici = {stagione: parseInt(this.utils.getStagione().substring(0, 4), 10)};
        return this.pronosticiService.getValoriPronostici(searchParameters);
    }
}
