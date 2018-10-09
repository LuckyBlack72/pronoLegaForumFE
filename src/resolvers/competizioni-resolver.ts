import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorage, SessionStorage } from 'ngx-store';

import { Utils } from '../models/utils';
import { PronosticiService } from '../app/service/pronostici.service';
import { AnagraficaCompetizioni, ApplicationParameter, LogAggiornamenti } from '../models/models';

@Injectable()
export class CompetizioniResolver implements Resolve<AnagraficaCompetizioni[]> {

    constructor(private pronosticiService: PronosticiService, private utils: Utils) {
    }

    @LocalStorage() protected competizioni: AnagraficaCompetizioni[];
    @SessionStorage() protected applicationParameter: ApplicationParameter;
    @LocalStorage() protected log_aggiornamentiLS: LogAggiornamenti[];

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AnagraficaCompetizioni[]> {

        let fnd = false;
        let fnd_tbl = false;

        if (this.competizioni) {

            if ( this.log_aggiornamentiLS ) {

                for (let i = 0; i < this.log_aggiornamentiLS.length; i++ ) {

                    for (let x = 0; x < this.applicationParameter.log_aggiornamenti.length; x++ ) {

                        if (this.log_aggiornamentiLS[i].tabella ===
                            this.applicationParameter.log_aggiornamenti[x].tabella) {
                                fnd_tbl = true;

                                if ( this.log_aggiornamentiLS[i].data_aggiornamento ===
                                    this.applicationParameter.log_aggiornamenti[x].data_aggiornamento ) {
                                        fnd = true;
                                        break;
                                }
                        }
                    }

                    if (fnd_tbl) {
                        break;
                    }

                }

            } else {

                this.log_aggiornamentiLS = this.applicationParameter.log_aggiornamenti;
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
}
