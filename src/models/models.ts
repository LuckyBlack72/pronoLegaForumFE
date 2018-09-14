export interface AnagraficaPartecipanti {
  id?: number;
  nickname: string;
  email_address: string;
  password_value: string;
}

export interface FiltroAnagraficaPartecipanti {
  nickname?: string;
}

export interface AnagraficaCompetizioni {
  id?: number;
  competizione: string;
  nome_pronostico: string;
  anni_competizione: number[];
  punti_esatti: number;
  punti_lista: number;
  numero_pronostici: number;
  pronostici_inseriti?: number;
}

export interface ValoriPronostici {
  id?: number;
  stagione: number;
  id_competizione: number;
  valori_pronostici: string[];
}

export interface FiltroValoriPronostici {
  stagione?: number;
  idCompetizione?: number;
}

export interface Pronostici {
  id?: number;
  id_partecipanti: number;
  stagione: number;
  id_competizione: number;
  pronostici: string[];
}

export interface FiltroPronostici {
  stagione?: number;
  idPartecipanti?: number;
  nickname?: string;
  idCompetizione?: number;
}

export interface ValoriPronosticiComboFiller {
  idCompetizione: number;
  valuePronostico: string;
}

export interface CheckDuplicateProno {
  Competizione: string;
  check: boolean;
}

