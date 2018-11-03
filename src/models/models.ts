export interface ApplicationParameter {

  nickname?: string;
  idPartecipante?: number;
  data_apertura?: string;
  data_chiusura?: string;
  data_calcolo_classifica?: string;
  menu_utente_page?: boolean;
  log_aggiornamenti?: LogAggiornamenti[];

}
export interface AnagraficaPartecipanti {
  id?: number;
  nickname?: string;
  email_address?: string;
  password_value?: string;
}

export interface FiltroAnagraficaPartecipanti {
  nickname?: string;
}

export interface AnagraficaCompetizioni {
  id?: number;
  competizione?: string;
  nome_pronostico?: string;
  anni_competizione?: number[];
  punti_esatti?: number;
  punti_lista?: number;
  numero_pronostici?: number;
  pronostici_inseriti?: number;
  logo?: string;
  tipo_competizione?: string;
  tipo_pronostici?: string;
  date_competizione?: DatePronostici[];
}

export interface AnagraficaCompetizioniGrouped {
  group?: string;
  competizioni?: AnagraficaCompetizioni[];
}

export interface ValoriPronostici {
  id?: number;
  stagione?: number;
  id_competizione?: number;
  valori_pronostici?: string[];
}

export interface ValoriPronosticiClassifica {
  id?: number;
  stagione?: number;
  id_competizione?: number;
  valori_pronostici_classifica?: string[];
  punti_esatti?: number;
  punti_lista?: number;
  tipo_competizione?: string;
}


export interface FiltroValoriPronostici {
  stagione?: number;
  idCompetizione?: number;
}

export interface Pronostici {
  id?: number;
  id_partecipanti?: number;
  nickname?: string;
  stagione?: number;
  id_competizione?: number;
  competizione?: string;
  tipo_pronostici?: string;
  pronostici?: string[];
}

export interface FiltroPronostici {
  stagione?: number;
  idPartecipanti?: number;
  nickname?: string;
  idCompetizione?: number;
}

export interface ValoriPronosticiComboFiller {
  idCompetizione?: number;
  valuePronostico?: string;
}

export interface CheckDuplicateProno {
  competizione?: string;
  check?: boolean;
}
export interface DatePronostici {
  stagione?: string;
  data_apertura?: string;
  data_chiusura?: string;
  data_calcolo_classifica?: string;
}
export interface FiltroStagione {
  stagione?: number;
}
export interface Stagioni {
  stagione?: number;
}

export interface PuntiCompetizione {
  competizione: string;
  punti: number;
}
export interface DatiClassifica {
  nickname: string;
  punti: PuntiCompetizione[];
}

export interface ExcelRow {
  [x: string]: string;
}

export interface ApiTransformReturnValue {
  datiToSaveOnDb?: Pronostici[];
  competizioniAggiornate?: string[];
  competizioniNonAggiornate?: string[];
}

export interface DeviceInfo {
  browser?: string;
  browser_version?: string;
  device?: string;
  os?: string;
  os_version?: string;
  userAgent?: string;
}

export interface TipoCompetizione {
  tipo?: string;
  nome?: string;
}

export interface LogAggiornamenti {
  tabella?: string;
  data_aggiornamento?: string;
}
export interface ReloadLocalStorageValues {
  fnd: boolean;
  lsIdx?: number;
  ssIdx?: number;
}

export interface DatiSquadraLegaForum {
  id?: number;
  squadra?: string;
  allenatore?: string;
  stagione?: number;
  serie?: string;
  fascia?: number;
  ranking?: number;
  girone?: string;
  ods?: number;
}

export interface DialogClassificaData {
  competizioni?: string[];
  pronostici?: Pronostici[];
  valoriClassifica?: ValoriPronosticiClassifica[];
  nickname?: string;
}

export interface DialogPronoTableData {
  posizione?: number;
  classifica?: string;
  pronostico?: string;
}
