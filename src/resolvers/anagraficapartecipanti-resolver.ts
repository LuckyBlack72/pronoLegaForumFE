import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorage } from 'ngx-store';
import { PronosticiService } from '../app/service/pronostici.service';
// import { DataService } from '../app/dataservice.service';
import { AnagraficaPartecipanti, FiltroAnagraficaPartecipanti, ApplicationParameter } from '../models/models';

@Injectable()
export class AnagraficaPartecipantiResolver implements Resolve<AnagraficaPartecipanti[]> {

    constructor(
                private pronosticiService: PronosticiService,
                // public dataService: DataService
            ) {
    }

    @SessionStorage() protected applicationParameter: ApplicationParameter;

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaPartecipanti[]> {

        const searchParameter: FiltroAnagraficaPartecipanti = { nickname: this.applicationParameter.nickname};
        return this.pronosticiService.getAnagraficaPartecipanti(searchParameter);

    }
}
