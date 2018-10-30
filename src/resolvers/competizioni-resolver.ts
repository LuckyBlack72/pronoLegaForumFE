import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';

import { PronosticiService } from '../app/service/pronostici.service';
import { UtilService } from '../app/service/util.service';
import { AnagraficaCompetizioni, ApplicationParameter, LogAggiornamenti, ReloadLocalStorageValues } from '../models/models';
import { Utils } from '../models/utils';

@Injectable()
export class CompetizioniResolver implements Resolve<AnagraficaCompetizioni[]> {

    constructor(
        private pronosticiService: PronosticiService,
        private utils: Utils,
        private utilService: UtilService,
        private localStorageService: LocalStorageService) {
    }

    /* CON LOCAL STORAGE

    @LocalStorage() competizioni: AnagraficaCompetizioni[];
    @SessionStorage() applicationParameter: ApplicationParameter;
    @LocalStorage() log_aggiornamentiLS: LogAggiornamenti[];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {

        let checkReload: ReloadLocalStorageValues;
        let fnd = false;

        if (this.competizioni) {

            if ( this.log_aggiornamentiLS && this.log_aggiornamentiLS.length > 0 ) {

                checkReload = this.utilService.checkReloadLocalStorageData  (
                                                                        'anagrafica_competizioni',
                                                                        this.log_aggiornamentiLS,
                                                                        this.applicationParameter.log_aggiornamenti
                                                                    );
                fnd = checkReload.fnd;
                if (!checkReload.fnd) { // devo ricare i dati in local storage
                    this.log_aggiornamentiLS[checkReload.lsIdx].data_aggiornamento =
                    this.applicationParameter.log_aggiornamenti[checkReload.ssIdx].data_aggiornamento;
                    this.localStorageService.set('log_aggiornamentiLS', this.log_aggiornamentiLS);
                }

            } else {

                this.log_aggiornamentiLS = this.applicationParameter.log_aggiornamenti;
                this.localStorageService.set('log_aggiornamentiLS', this.log_aggiornamentiLS);
                fnd = false;

            }

        } else {

            fnd = false;

        }

        if (fnd) {

            return of(this.competizioni);

        } else {

            return this.pronosticiService.getAnagraficaCompetizioni(parseInt(this.utils.getStagione().substring(0, 4), 10));

        }

    }

    */

   resolve( // SENZA LOCAL STORAGE
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {

        return this.pronosticiService.getAnagraficaCompetizioni(parseInt(this.utils.getStagione().substring(0, 4), 10));

    }

}
