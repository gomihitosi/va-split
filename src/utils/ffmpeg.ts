import { TARGET_AUDIO_EXTENSION, TARGET_VIDEO_EXTENSION } from "@/stores/file";
import { Encode, Transfer } from "@/stores/setting";
import { Format, InfoResult, StreamFile, TransferResult } from "@/types";
import { resolveResource } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

export const getDefaultFfmpegPath = async () => {
  // FIXME: 頭文字に何か付いてるけどよくわからない
  const recourceFfmpegPath = await resolveResource("ffmpeg.exe");
  return recourceFfmpegPath.replace(/^\\\\\?\\/, "");
};

export const ffmpegInfo = (
  ffmpegPath: string,
  filePaths: string[]
): Promise<InfoResult[]> => {
  const promiseList = filePaths.map((filePath) => {
    return new Promise<InfoResult>((resolve) => {
      const splitPath = filePath.split(`\\`);
      const fileName = splitPath.slice(-1)[0];
      const splitFileName = fileName.split(".");

      const result: StreamFile = {
        filePath,
        directoryPath: splitPath.slice(0, -1).join("\\"),
        name: splitFileName.slice(0, -1).join("."),
        extension: splitFileName.slice(-1)[0],
        audio: [],
      };
      const log: string[] = [`### ffmpegInfo: ${fileName}`];

      const command = new Command(
        "ffmpeg-i",
        [`/C`, `${ffmpegPath}`, `-i`, `${result.filePath}`],
        { encoding: "utf-8" }
      );
      command.stderr.on("data", (stderr: string) => {
        const trimStderr = stderr.trim();
        log.push(trimStderr);

        if (!/^Stream/.test(trimStderr)) {
          return;
        }
        if (/Video:/.test(trimStderr)) {
          const video = trimStderr
            .substring(trimStderr.search(/Video:/))
            .split(" ")[1]
            .replace(/,$/, "");
          result.video = video;
          return;
        }
        if (/Audio:/.test(trimStderr)) {
          const audio = trimStderr
            .substring(trimStderr.search(/Audio:/))
            .split(" ")[1]
            .replace(/,$/, "");
          result.audio.push(audio);
          return;
        }
      });
      command.on("close", () => {
        resolve({ result, log });
      });
      command.spawn();
    });
  });
  return Promise.all(promiseList);
};

export const processStreamList = (
  ffmpegPath: string,
  streamList: StreamFile[],
  format: Format
): Promise<TransferResult[]> => {
  const promiseList = streamList
    .map((stream) => {
      if (TARGET_VIDEO_EXTENSION.includes(stream.extension)) {
        return videoFileProcess(ffmpegPath, stream, format);
      }
      if (TARGET_AUDIO_EXTENSION.includes(stream.extension)) {
        return audioFileProcess(ffmpegPath, stream, format);
      }
      const errorMessage = `### processStreamList: Unsupported extension. =>  ${stream.extension}`;
      return generateErrorTransferResult(errorMessage);
    })
    .flat();
  return Promise.all(promiseList);
};

const generateErrorTransferResult = (message: string) => {
  const errorResult: TransferResult = {
    log: [message],
  };
  return new Promise<TransferResult>((resolve) => {
    resolve(errorResult);
  });
};

type TransgerProps = {
  ffmpegPath: string;
  stream: StreamFile;
  channel: number;
  format: Format;
  isSuffixChannel: boolean;
};

const getTransferAudio = (transferProps: TransgerProps) => {
  const { format } = transferProps;
  if (format.transfer === Transfer.Wav.value) {
    return audioTransferWav(transferProps);
  }
  if (format.transfer === Transfer.Mp3.value) {
    if (format.encode === Encode.VBR.value) {
      return audioTransferMp3ByVbr(transferProps);
    }
    if (
      format.encode === Encode.ABR.value ||
      format.encode === Encode.CBR.value
    ) {
      return audioTransferMp3ByAbrCbr(transferProps);
    }
  }
  if (format.transfer === Transfer.Ogg.value) {
    if (
      format.encode === Encode.VBR.value ||
      format.encode === Encode.ABR.value
    ) {
      return audioTransferOggByAbrVbr(
        transferProps,
        format.encode === Encode.VBR.value
      );
    }
    if (format.encode === Encode.CBR.value) {
      return audioTransferOggByCbr(transferProps);
    }
  }
  if (format.transfer === Transfer.Aac.value) {
    return audioTransferAacByCbrVbr(
      transferProps,
      format.encode === Encode.VBR.value
    );
  }

  const errorMessage = `### getTransferAudio: Unsupported transfer or encode. =>  ${format.transfer}, ${format.encode}`;
  return generateErrorTransferResult(errorMessage);
};

const videoFileProcess = (
  ffmpegPath: string,
  stream: StreamFile,
  format: Format
): Promise<TransferResult>[] => {
  const videoProcess = videoCopy(ffmpegPath, stream);
  const audioProcess = stream.audio.map((_, index) => {
    const channel = index + 1;
    const transferProps: TransgerProps = {
      ffmpegPath,
      stream,
      channel,
      format,
      isSuffixChannel: true,
    };
    return getTransferAudio(transferProps);
  });
  return [videoProcess, ...audioProcess];
};

const audioFileProcess = async (
  ffmpegPath: string,
  stream: StreamFile,
  format: Format
): Promise<TransferResult> => {
  const channel = 0;
  const transferProps: TransgerProps = {
    ffmpegPath,
    stream,
    channel,
    format,
    isSuffixChannel: false,
  };
  return getTransferAudio(transferProps);
};

const commandSetup = (
  text: string,
  command: Command,
  resolve: (value: TransferResult | PromiseLike<TransferResult>) => void
) => {
  const log: string[] = [text];
  command.stderr.on("data", (stderr: string) => {
    log.push(stderr.trim());
  });
  command.on("close", () => {
    resolve({ log });
  });
  command.spawn();
};

const videoCopy = (
  ffmpegPath: string,
  stream: StreamFile
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const outputVideoPath = [
      stream.directoryPath,
      `${stream.name}_00.${stream.extension}`,
    ].join("\\");

    const command = new Command(
      "ffmpeg-copy-video",
      [
        `/C`,
        `${ffmpegPath}`,
        `-i`,
        `${stream.filePath}`,
        `-hide_banner`,
        `-an`,
        "-c:v",
        "copy",
        `${outputVideoPath}`,
        "-n",
      ],
      { encoding: "utf-8" }
    );

    const text = `### videoCopy: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const generateAudioPath = (transferProps: TransgerProps) => {
  const { format, stream, isSuffixChannel, channel } = transferProps;
  const getExtension = (): string => {
    if (format.transfer === Transfer.Wav.value) return "wav";
    if (format.transfer === Transfer.Mp3.value) return "mp3";
    if (format.transfer === Transfer.Ogg.value) return "ogg";
    if (format.transfer === Transfer.Aac.value) return "m4a";
    return "";
  };
  const suffixFileName = isSuffixChannel
    ? `_${String(channel).padStart(2, "0")}`
    : "";
  return [
    stream.directoryPath,
    `${stream.name}${suffixFileName}.${getExtension()}`,
  ].join("\\");
};

const generatePrefixAudioCommand = (transferProps: TransgerProps) => {
  const { ffmpegPath, stream, channel } = transferProps;
  return [
    `/C`,
    `${ffmpegPath}`,
    `-i`,
    `${stream.filePath}`,
    `-hide_banner`,
    "-map",
    `0:${channel}`,
    "-vn",
    "-ar",
  ];
};

const audioTransferWav = (
  transferProps: TransgerProps
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);
    const command = new Command(
      "ffmpeg-transfer-wav",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        `${format.codec}`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferWav: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const audioTransferMp3ByAbrCbr = async (
  transferProps: TransgerProps
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);

    const abr = format.encode === Encode.ABR.value ? "1" : "0";

    const command = new Command(
      "ffmpeg-transfer-mp3-abr-cbr",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        "libmp3lame",
        "-b:a",
        `${format.codec}k`,
        "-abr",
        `${abr}`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferMp3ByAbrCbr: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const audioTransferMp3ByVbr = async (
  transferProps: TransgerProps
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);

    const command = new Command(
      "ffmpeg-transfer-mp3-vbr",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        "libmp3lame",
        "-q:a",
        `${format.codec}`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferMp3ByVbr: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const audioTransferOggByCbr = async (
  transferProps: TransgerProps
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);

    const command = new Command(
      "ffmpeg-transfer-ogg-cbr",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        "libvorbis",
        "-b:a",
        `${format.codec}k`,
        "-minrate",
        `${format.codec}k`,
        "-maxrate",
        `${format.codec}k`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferOggByCbr: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const audioTransferOggByAbrVbr = async (
  transferProps: TransgerProps,
  isVbr: boolean
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);

    const command = new Command(
      "ffmpeg-transfer-ogg-abr-vbr",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        "libvorbis",
        `-${isVbr ? "q" : "b"}:a`,
        `${format.codec}${isVbr ? "" : "k"}`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferOggByVbr: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};

const audioTransferAacByCbrVbr = async (
  transferProps: TransgerProps,
  isVbr: boolean
): Promise<TransferResult> => {
  return new Promise<TransferResult>((resolve) => {
    const { stream, format } = transferProps;
    const outputAudioPath = generateAudioPath(transferProps);

    const command = new Command(
      "ffmpeg-transfer-aac-cbr-vbr",
      [
        ...generatePrefixAudioCommand(transferProps),
        `${format.samplingRate}`,
        "-c:a",
        "aac",
        "-aac_coder",
        "twoloop",
        `-${isVbr ? "q" : "b"}:a`,
        `${format.codec}${isVbr ? "" : "k"}`,
        outputAudioPath,
        "-n",
      ],
      { encoding: "utf-8" }
    );
    const text = `### audioTransferAacByCbr: ${stream.name}`;
    commandSetup(text, command, resolve);
  });
};
