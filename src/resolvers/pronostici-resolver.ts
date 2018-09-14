import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { Pronostici, FiltroPronostici } from '../models/models';
import { DataService } from '../app/dataservice.service';

@Injectable()
export class PronosticiResolver implements Resolve<Pronostici[]> {

    constructor(
                private pronosticiService: PronosticiService,
                private utils: Utils,
                public dataService: DataService
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Pronostici[]> {

        const searchParameters: FiltroPronostici = {
                                                    stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                                                    idPartecipanti: this.dataService.idPartecipante
                                                    };
        return this.pronosticiService.getPronostici(searchParameters);

    }
}
