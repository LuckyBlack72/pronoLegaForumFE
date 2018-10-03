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

  competizioneToSave: AnagraficaCompetizioni = {
                                                  id: 0,
                                                  competizione: 'XXX',
                                                  nome_pronostico: 'XXX',
                                                  anni_competizione: [0],
                                                  punti_esatti: 0,
                                                  punti_lista: 0,
                                                  numero_pronostici: 0,
                                                  pronostici_inseriti: 0,
                                                  logo: 'XXX',
                                                  tipo_competizione: 'XXX'
                                                };

  stagioneCompetizione: number;

  listaStagioniCompetizione: number[] = [];


  ngOnInit() {

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;
    this.createUpdateCompetizione = 'C';
    this.fillCompetizioneData = false;

    const stagione = parseInt(this.utils.getStagione().substring(0, 4), 10)
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
        this.competizioneToSave = this.crudCompetizioneService.getDatiCompetizione(this.idCompetizioneToEdit);
        break;
      default:
        break;
    }

  }

}
