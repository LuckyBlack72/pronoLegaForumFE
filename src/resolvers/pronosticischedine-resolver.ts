import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { FiltroPronostici, ApplicationParameter, PronosticiSettimanali } from '../models/models';
import { SchedineService } from '../app/service/schedine.service';
// import { DataService } from '../app/dataservice.service';

@Injectable()
export class PronosticiSchedineResolver implements Resolve<PronosticiSettimanali[]> {

    constructor(
                private schedineService: SchedineService,
                private utils: Utils
              //  public dataService: DataService
            ) {
    }

    @SessionStorage() applicationParameter: ApplicationParameter;

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<PronosticiSettimanali[]> {


        if (state.url === '/statistiche-schedine') {

            return this.schedineService.getPronosticiSettimanali({tipo_pronostici: 'E'});

        } else {

            const searchParameters: FiltroPronostici = {
                stagione: this.utils.getStagioneCorrente(),
                idPartecipanti: this.applicationParameter.idPartecipante,
                tipo_pronostici: 'E'
                };

            return this.schedineService.getPronosticiSettimanali(searchParameters);

        }



    }
}
