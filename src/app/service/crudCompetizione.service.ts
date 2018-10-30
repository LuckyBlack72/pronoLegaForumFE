import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from 'ngx-store';

import {
          AnagraficaCompetizioni, DatePronostici, AnagraficaCompetizioniGrouped
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

    // @LocalStorage() competizioni: AnagraficaCompetizioni[];

/*
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
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === idCompetizione) {
                        datiCompetizione = data[i];
                        fnd = true;
                        break;
                    }
                }
                return of(datiCompetizione);
              }
              ,
              error => {
                  datiCompetizione = null;
                  return of(datiCompetizione);
              }
            );
        } else {
            return of(datiCompetizione);
        }
    }
*/

    saveAnagraficaCompetizione(competizioneToSave: AnagraficaCompetizioni, valoriPronostici: any): Observable<string> {

        return this.pronosticiService.saveAnagraficaCompetizioni(competizioneToSave, valoriPronostici);

    }

    uploadLogo(logo: File): Observable<string> {

        return this.pronosticiService.uploadLogo(logo);

    }

    loadLogo(logo: string): Observable<Blob> {

        return this.pronosticiService.loadLogo(logo);

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

    SplitDateCompetizioneStringIntoArray(dateCompetizione: string, full: boolean): DatePronostici[] {

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
            if (full) {
                retVal.push({
                    stagione: dateToSetInRecord[0],
                    data_apertura: dateToSetInRecord[1],
                    data_chiusura: dateToSetInRecord[2],
                    data_calcolo_classifica: dateToSetInRecord[3]
                });
            } else {
                retVal.push({
                    stagione: dateToSetInRecord[0],
                    data_apertura: dateToSetInRecord[1].substring(0, 10),
                    data_chiusura: dateToSetInRecord[2].substring(0, 10),
                    data_calcolo_classifica: dateToSetInRecord[3].substring(0, 10)
                });
            }
            dateToSetInRecord = [];
            recordToSplit = '';
        }

// console.log(retVal);
        return retVal;
    }

    buildCompetizioniGrouped(competizioni: AnagraficaCompetizioni[]): AnagraficaCompetizioniGrouped[] {

        const retVal: AnagraficaCompetizioniGrouped[] = [];
        const extCompetizioni: AnagraficaCompetizioni[] = [];
        const lfCompetizioni: AnagraficaCompetizioni[] = [];

        for (let i = 0; i < competizioni.length; i++) {
            if (competizioni[i].tipo_pronostici === 'E') {
                extCompetizioni.push(competizioni[i]);
            } else {
                lfCompetizioni.push(competizioni[i]);
            }
        }

        if ( extCompetizioni.length > 0 ) {
            retVal.push({group: 'Esterne', competizioni: extCompetizioni});
        }
        if ( lfCompetizioni.length > 0 ) {
            retVal.push({group: 'Lega Forum', competizioni: lfCompetizioni});
        }

        return retVal;

    }

}

