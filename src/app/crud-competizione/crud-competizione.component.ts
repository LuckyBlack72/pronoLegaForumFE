import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

// import { DataService } from '../dataservice.service';
import { PronosticiService } from '../service/pronostici.service';
import { UtilService } from '../service/util.service';
import { ExternalApiService } from '../service/externalApi.service';
import { CrudCompetizioneService } from '../service/crudCompetizione.service';

import {
        AnagraficaCompetizioni,
        ValoriPronostici,
        Pronostici,
        ValoriPronosticiComboFiller,
        CheckDuplicateProno,
        ValoriPronosticiClassifica,
        FiltroPronostici,
        ApplicationParameter,
        ApiTransformReturnValue,
        DeviceInfo
      } from '../../models/models';

import { Utils } from '../../models/utils';


@Component({
  selector: 'app-crud-competizione',
  templateUrl: './crud-competizione.component.html',
  styleUrls: ['./crud-competizione.component.css']
})
export class CrudCompetizioneComponent implements OnInit {

  constructor(

    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private pronosticiService: PronosticiService,
    private utilService: UtilService,
    private externalApiService: ExternalApiService,
    private deviceDetectorService: DeviceDetectorService,
    private crudCompetizioneService: CrudCompetizioneService

  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() protected applicationParameter: ApplicationParameter;

  competizioni: AnagraficaCompetizioni[];
  createUpdateCompetizione: string;
  idCompetizioneToEdit: number;
  fillCompetizioneData: boolean;
  isFillingData: boolean;

  competizioneToSave: AnagraficaCompetizioni = {
                                                  id: 0,
                                                  competizione: null,
                                                  nome_pronostico: null,
                                                  anni_competizione: [0],
                                                  punti_esatti: 1,
                                                  punti_lista: 0,
                                                  numero_pronostici: 1,
                                                  pronostici_inseriti: 0,
                                                  logo: null,
                                                  tipo_competizione: null
                                                };

  stagioneCompetizione: number;

  listaStagioniCompetizione: number[] = [];


  ngOnInit() {

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.createUpdateCompetizione = 'C';
    this.fillCompetizioneData = false;

    const stagione = parseInt(this.utils.getStagione().substring(0, 4), 10);
    this.listaStagioniCompetizione.push(stagione);
    this.listaStagioniCompetizione.push((stagione + 1));

  }

  setEnabledDisabledScegliButton(): boolean {
    let retVal: boolean;
    retVal = false;
    if (
          this.createUpdateCompetizione === 'U' &&
          (!this.idCompetizioneToEdit || this.idCompetizioneToEdit == 0)
        ) {
          retVal = true;
        }
    return retVal;
  }

  setEnabledDisabledDropDownCompetizione(): boolean {
    let retVal: boolean;
    retVal = false;
    if (this.createUpdateCompetizione === 'C') {
      this.idCompetizioneToEdit = null;
      retVal = true;
    }
    return retVal;
  }

  createUpdateCompetizioneData(createUpdateCompetizione: string): void {

    this.fillCompetizioneData = true;

    switch (createUpdateCompetizione) {
      case 'C':
        break;
      case 'U':
        this.crudCompetizioneService.getDatiCompetizione(this.idCompetizioneToEdit).subscribe(
          data => this.competizioneToSave = data
          ,
          error => {
            this.resetDataValues();
            Swal({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Errore Applicativo',
              type: 'error'
            });
          }
        );
        break;
      default:
        break;
    }

  }

  resetData(): void {
    Swal({
      title: 'Vuoi veramente annullare i dati inseriti ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Conferma Annullamento'
    }).then((result) => {
      if (result.value) {
        this.resetDataValues();
      }
    });
  }

  resetDataValues(): void {

    this.competizioneToSave = {
      id: 0,
      competizione: null,
      nome_pronostico: null,
      anni_competizione: [0],
      punti_esatti: 1,
      punti_lista: 0,
      numero_pronostici: 1,
      pronostici_inseriti: 0,
      logo: null,
      tipo_competizione: null
    };

    this.fillCompetizioneData = false;
    this.idCompetizioneToEdit = null;
    this.createUpdateCompetizione = 'C';

  }

  saveData(): void {

    const checkData = this.crudCompetizioneService.checkDataToSave(this.competizioneToSave, this.stagioneCompetizione);

    if (checkData) { // controlli ok
      if (this.competizioneToSave.id === 0) {
        this.competizioneToSave.anni_competizione[0] = this.stagioneCompetizione;
      } else {
        this.competizioneToSave.anni_competizione.push(this.stagioneCompetizione);
      }
      this.crudCompetizioneService.saveAnagraficaCompetizione(this.competizioneToSave).subscribe(
        data => {
                  this.resetDataValues();
                  Swal({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: 'Competizione Salvata',
                    type: 'success'
                  });
        }
        ,
        error => {
                    this.resetDataValues();
                    Swal({
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          title: 'Errore salvataggio Dati',
                         type: 'error'
                        });
        }
      );
    } else {
      Swal({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Dati Competizione Mancanti o Errati',
        type: 'error'
      });
    }

  }

}
