import { useGlobalContext } from "@/contexts/GlobalContext";
import { ffmpegInfo, processStreamList } from "@/utils/ffmpeg";
import { playEndSound } from "@/utils/file";
import { message } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { useEffect } from "react";

export default function useProcess() {
  const {
    ffmpegPath,
    setFfmpegPath,
    format,
    filePaths,
    setFilePaths,
    streamList,
    setStreamList,
    setLogList: setLog,
    setIsProcess,
  } = useGlobalContext();

  // ドロップされたファイルに変換対象となるファイルが存在する場合は、ffmpeg.exeを使用してストリーム情報を取得
  useEffect(() => {
    const asyncProcess = async () => {
      if (!ffmpegPath || filePaths.length === 0) {
        return;
      }
      if (!(await exists(ffmpegPath))) {
        message(
          `ffmpeg.exeが見つかりませんでした。\n再度ファイルパスを設定してください。`
        );
        setFfmpegPath(undefined);
        return;
      }
      setFilePaths([]);
      setStreamList([]);
      setLog([]);

      const infoResultList = await ffmpegInfo(ffmpegPath, filePaths);
      setLog(infoResultList.flatMap((v) => v.log));
      setStreamList(infoResultList.flatMap((v) => v.result));
    };
    asyncProcess();
  }, [filePaths]);

  // ストリーム情報を元にファイルを変換
  useEffect(() => {
    if (!ffmpegPath || streamList.length === 0 || !format) {
      return;
    }
    setIsProcess(true);
    processStreamList(ffmpegPath, streamList, format).then(
      (transferResultList) => {
        const newLog = transferResultList.flatMap((v) => v.log);
        setLog((value) => [...value, ...newLog]);

        setIsProcess(false);
        playEndSound();
      }
    );
  }, [streamList]);
}
