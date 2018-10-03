import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from 'ngx-store';

import {
          AnagraficaCompetizioni,
        } from '../../models/models';

import { Utils } from '../../models/utils';
import { PronosticiService } from './pronostici.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CrudCompetizioneService {

  constructor (
                private http: HttpClient,
                private utils: Utils,
                private pronosticiService: PronosticiService
            ) { }

    @LocalStorage() protected competizioni: AnagraficaCompetizioni[];


    getDatiCompetizione(idCompetizione: number): Observable<AnagraficaCompetizioni> {

        let datiCompetizione: AnagraficaCompetizioni;
        let fnd: boolean;

        fnd = false;
        for (let i = 0; i < this.competizioni.length; i++) {
            if (this.competizioni[i].id === idCompetizione) {
                datiCompetizione = this.competizioni[i];
                fnd = true;
                break;
            }
        }

        if (!fnd) {
            this.pronosticiService.getAnagraficaCompetizioni(0).subscribe(
              data => {
                for (let i = 0; i < this.competizioni.length; i++) {
                    if (this.competizioni[i].id === idCompetizione) {
                        datiCompetizione = this.competizioni[i];
                        fnd = true;
                        break;
                    }
                }
                return datiCompetizione;
              }
              ,
              error => {
                  datiCompetizione = null;
                  return datiCompetizione;
              }
            );
        } else {
            return of(datiCompetizione);
        }

    }

    saveAnagraficaCompetizione(competizioneToSave: AnagraficaCompetizioni): Observable<string>{

        return this.pronosticiService.saveAnagraficaCompetizioni(competizioneToSave);


    }

    checkDataToSave(dataToSave: AnagraficaCompetizioni, stagioneCompetizione: number): boolean {

        let retVal: boolean;
        retVal = true;

        if (stagioneCompetizione == null || stagioneCompetizione == 0) {
            retVal = false;
        } else {
            if (
                    dataToSave.competizione == null ||
                    dataToSave.tipo_competizione == null || dataToSave.tipo_competizione === 'XXX'
                ) {
                    retVal = false;
                }
        }

        return retVal;

    }

}

