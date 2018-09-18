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
