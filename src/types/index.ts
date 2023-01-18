export type StreamFile = {
  filePath: string;
  directoryPath: string;
  name: string;
  extension: string;
  video?: string;
  audio: string[];
};

export type InfoResult = {
  result: StreamFile;
  log: string[];
};

export type TransferResult = {
  log: string[];
};

export type Format = {
  transfer: string;
  samplingRate: string;
  encode?: string;
  codec: string;
};

export type StyleTheme = {
  fontSize: number;
  bg: string;
  text: string;
  titleBg: string;
  titleText: string;
  border: string;
  accent: string;
};

export type Settings = {
  ffmpegPath?: string;
  format: Format;
  styleTheme: StyleTheme;
};
