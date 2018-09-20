import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { Utils } from '../models/utils';
import { PronosticiService } from '../app/pronostici.service';
import { AnagraficaCompetizioni } from '../models/models';

@Injectable()
export class CompetizioniResolver implements Resolve<AnagraficaCompetizioni[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {
        return this.pronosticiService.getAnagraficaCompetizioni(parseInt(this.utils.getStagione().substring(0, 4), 10));
    }
}
