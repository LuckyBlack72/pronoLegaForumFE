import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/service/pronostici.service';
import { Pronostici, FiltroPronostici, ApplicationParameter } from '../models/models';
// import { DataService } from '../app/dataservice.service';

@Injectable()
export class PronosticiResolver implements Resolve<Pronostici[]> {

    constructor(
                private pronosticiService: PronosticiService,
                private utils: Utils
              //  public dataService: DataService
            ) {
    }

    @SessionStorage() applicationParameter: ApplicationParameter;

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Pronostici[]> {

        const searchParameters: FiltroPronostici = {
                                                    stagione: parseInt(this.utils.getStagione().substring(0, 4), 10),
                                                    idPartecipanti: this.applicationParameter.idPartecipante
                                                    };
        return this.pronosticiService.getPronostici(searchParameters);

    }
}
