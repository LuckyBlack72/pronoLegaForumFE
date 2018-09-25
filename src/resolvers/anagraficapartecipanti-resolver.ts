import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PronosticiService } from '../app/pronostici.service';
import { DataService } from '../app/dataservice.service';
import { AnagraficaPartecipanti, FiltroAnagraficaPartecipanti } from '../models/models';

@Injectable()
export class AnagraficaPartecipantiResolver implements Resolve<AnagraficaPartecipanti[]> {

    constructor(
                private pronosticiService: PronosticiService,
                public dataService: DataService
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaPartecipanti[]> {

        const searchParameter: FiltroAnagraficaPartecipanti = { nickname: this.dataService.nickname};
        return this.pronosticiService.getAnagraficaPartecipanti(searchParameter);

    }
}
