import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PronosticiService } from '../app/pronostici.service';
import { Stagioni } from '../models/models';

@Injectable()
export class StagioniResolver implements Resolve<Stagioni[]> {

    constructor(
                private pronosticiService: PronosticiService
            ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Stagioni[]> {

        return this.pronosticiService.getStagioni();

    }
}
