import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SessionStorage, LocalStorage } from 'ngx-store';
import { DeviceDetectorService } from 'ngx-device-detector';

// import { DataService } from '../dataservice.service';
import { PronosticiService } from '../service/pronostici.service';
import { UtilService } from '../service/util.service';
import { ExternalApiService } from '../service/externalApi.service';
import { Command, CommandService } from '../service/command.service';

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
    private commandService: CommandService,
    private externalApiService: ExternalApiService,
    private deviceDetectorService: DeviceDetectorService

  ) { }

  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  @SessionStorage() protected applicationParameter: ApplicationParameter;

  competizioni: AnagraficaCompetizioni[];

  ngOnInit() {

    this.competizioni = this.activatedRoute.snapshot.data.listaCompetizioni;

  }

}
