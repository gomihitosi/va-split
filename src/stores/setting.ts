import { Format, StyleTheme } from "@/types";

// FIXME: 上手く抽象化出来なかった
export type Options = {
  [key: string]: {
    value: string;
    text: string;
  };
};

export const findOptionsValue = <T>(options: Options, value: string) =>
  Object.values(options).find((v) => v.value === value) as T;

export const Transfer = {
  Wav: { value: "1", text: "wav" },
  Mp3: { value: "2", text: "mp3" },
  Ogg: { value: "3", text: "ogg" },
  Aac: { value: "4", text: "aac" },
} as const;
export type Transfer = typeof Transfer[keyof typeof Transfer];
export const TransferOptions = Transfer as Options;

export const WavSampleBit = {
  pcmS8: { value: "pcm_s8", text: "8bit (整数)" },
  pcmS16Le: { value: "pcm_s16le", text: "16bit (整数)" },
  pcmS26Le: { value: "pcm_s24le", text: "24bit (整数)" },
  pcmS32Le: { value: "pcm_s32le", text: "32bit (整数)" },
  pcmF32Le: { value: "pcm_f32le", text: "32bit (少数)" },
  pcmF64Le: { value: "pcm_f64le", text: "64bit (少数)" },
} as const;
export type WavSampleBit = typeof WavSampleBit[keyof typeof WavSampleBit];
export const WavSampleBitOptions = WavSampleBit as Options;

export const SamplingRate = {
  hz8000: { value: "8000", text: "8000Hz" },
  hz11025: { value: "11025", text: "11025Hz" },
  hz16000: { value: "16000", text: "16000Hz" },
  hz22050: { value: "22050", text: "22050Hz" },
  hz32000: { value: "32000", text: "32000Hz" },
  hz44100: { value: "44100", text: "44100Hz" },
  hz48000: { value: "48000", text: "48000Hz" },
} as const;
export type SamplingRate = typeof SamplingRate[keyof typeof SamplingRate];
export const SamplingRateOptions = SamplingRate as Options;

export const Encode = {
  ABR: { value: "abr", text: "ABR (平均)" },
  CBR: { value: "cbr", text: "CBR (固定)" },
  VBR: { value: "vbr", text: "VBR (可変)" },
} as const;
export type Encode = typeof Encode[keyof typeof Encode];
export const EncodeOptions = Encode as Options;

export const AacEncode = {
  CBR: { value: "cbr", text: "CBR (固定)" },
  VBR: { value: "vbr", text: "VBR (可変)" },
} as const;
export type AacEncode = typeof AacEncode[keyof typeof AacEncode];
export const AacEncodeOptions = AacEncode as Options;

export const BitRate = {
  kbps32: { value: "32", text: "32kbps" },
  kbps48: { value: "48", text: "48kbps" },
  kbps64: { value: "64", text: "64kbps" },
  kbps96: { value: "96", text: "96kbps" },
  kbps128: { value: "128", text: "128kbps" },
  kbps160: { value: "160", text: "160kbps" },
  kbps192: { value: "192", text: "192kbps" },
  kbps224: { value: "224", text: "224kbps" },
  kbps256: { value: "256", text: "256kbps" },
  kbps320: { value: "320", text: "320kbps" },
} as const;
export type BitRate = typeof BitRate[keyof typeof BitRate];
export const BitRateOptions = BitRate as Options;

export const Mp3VbrQuality = {
  Q9: { value: "9", text: "9(低品質)" },
  Q8: { value: "8", text: "8" },
  Q7: { value: "7", text: "7" },
  Q6: { value: "6", text: "6" },
  Q5: { value: "5", text: "5" },
  Q4: { value: "4", text: "4" },
  Q3: { value: "3", text: "3" },
  Q2: { value: "2", text: "2" },
  Q1: { value: "1", text: "1" },
  Q0: { value: "0", text: "0(高品質)" },
} as const;
export type Mp3VbrQuality = typeof Mp3VbrQuality[keyof typeof Mp3VbrQuality];
export const Mp3VbrQualityOptions = Mp3VbrQuality as Options;

export const OggVbrQuality = {
  Q0: { value: "0", text: "0(低品質)" },
  Q1: { value: "1", text: "1" },
  Q2: { value: "2", text: "2" },
  Q3: { value: "3", text: "3" },
  Q4: { value: "4", text: "4" },
  Q5: { value: "5", text: "5" },
  Q6: { value: "6", text: "6" },
  Q7: { value: "7", text: "7" },
  Q8: { value: "8", text: "8" },
  Q9: { value: "9", text: "9" },
  Q10: { value: "10", text: "10(高品質)" },
} as const;
export type OggVbrQuality = typeof OggVbrQuality[keyof typeof OggVbrQuality];
export const OggVbrQualityOptions = OggVbrQuality as Options;

export const AacVbrQuality = {
  Q_1: { value: "-1", text: "-1(低品質)" },
  Q0: { value: "0", text: "0" },
  Q1: { value: "1", text: "1" },
  Q2: { value: "2", text: "2" },
  Q3: { value: "3", text: "3" },
  Q4: { value: "4", text: "4" },
  Q5: { value: "5", text: "5" },
  Q6: { value: "6", text: "6" },
  Q7: { value: "7", text: "7" },
  Q8: { value: "8", text: "8" },
  Q9: { value: "9", text: "9" },
  Q10: { value: "10", text: "10(高品質)" },
} as const;
export type AacVbrQuality = typeof AacVbrQuality[keyof typeof AacVbrQuality];
export const AacVbrQualityOptions = AacVbrQuality as Options;

export const DefaultFormat: Format = {
  transfer: Transfer.Wav.value,
  samplingRate: SamplingRate.hz44100.value,
  codec: WavSampleBit.pcmS16Le.value,
};

export const DefaultStyleTheme: StyleTheme = {
  fontSize: 12,
  bg: "#222222",
  titleBg: "#111111",
  text: "#f3efe0",
  titleText: "#faf8f7",
  border: "#434242",
  accent: "#22a39f",
};
