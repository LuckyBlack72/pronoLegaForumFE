import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from 'ngx-store';

import {
          AnagraficaCompetizioni, DatePronostici,
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

    @LocalStorage() competizioni: AnagraficaCompetizioni[];

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

    saveAnagraficaCompetizione(competizioneToSave: AnagraficaCompetizioni): Observable<string> {

        return this.pronosticiService.saveAnagraficaCompetizioni(competizioneToSave);

    }

    uploadLogo(logo: File): Observable<string> {

        return this.pronosticiService.uploadLogo(logo);

    }

    checkDataToSave(dataToSave: AnagraficaCompetizioni, stagioneCompetizione: number): boolean {

        let retVal: boolean;
        retVal = true;

        if (stagioneCompetizione == null || stagioneCompetizione == 0) {
            retVal = false;
        } else {
            if (
                    dataToSave.competizione == null ||
                    dataToSave.tipo_competizione == null || dataToSave.tipo_competizione === 'XXX' ||
                    dataToSave.logo == null
                ) {
                    retVal = false;
                }
        }

        return retVal;

    }

    SplitDateCompetizioneStringIntoArray(dateCompetizione: string): DatePronostici[] {

        const retVal: DatePronostici[] = [];
        const regExp = /["]/g;
        const regExp2 = /[\\]/g;
        const regExp3 = /[(]/g;
        const regExp4 = /[)]/g;
        let StringToSplit: string =
        dateCompetizione.replace(regExp, '').replace(regExp2, '').replace('),(' , ')*(');
        StringToSplit = StringToSplit.substring(1);
        StringToSplit = StringToSplit.substring(0, (StringToSplit.length - 1));
        StringToSplit = StringToSplit.replace(regExp3, '').replace(regExp4, '');
// console.log('StringTosplit :' + StringToSplit);
        const recordArray: string[] = StringToSplit.split('*');

// console.log(recordArray);

        let recordToSplit: string;
        let dateToSetInRecord: string[] = [];

        for (let i = 0; i < recordArray.length; i++) {
            recordToSplit = recordArray[i].substring(0, (recordArray[i].length - 1));
// console.log(recordToSplit);
            dateToSetInRecord = recordToSplit.split(',');
            retVal.push({
                            stagione: dateToSetInRecord[0],
                            data_apertura: dateToSetInRecord[1].substring(0, 10),
                            data_chiusura: dateToSetInRecord[2].substring(0, 10),
                            data_calcolo_classifica: dateToSetInRecord[3].substring(0, 10)
                        });
            dateToSetInRecord = [];
            recordToSplit = '';
        }

// console.log(retVal);
        return retVal;
    }

}

