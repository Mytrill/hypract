
export const conf: FirebaseConfig = {
  databaseURL: null
};

export interface FirebaseConfig {
  databaseURL: string
}

export const init = (config: FirebaseConfig) => {
  conf.databaseURL = config.databaseURL;
}
