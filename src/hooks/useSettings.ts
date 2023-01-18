import { useGlobalContext } from "@/contexts/GlobalContext";
import { getDefaultFfmpegPath } from "@/utils/ffmpeg";
import { getSettingsPath, readSettings } from "@/utils/setting";
import { exists } from "@tauri-apps/api/fs";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { useEffect, useRef } from "react";
import { watch } from "tauri-plugin-fs-watch-api";

const settingPath = await getSettingsPath();

export default function useSettings() {
  const { setFfmpegPath, setFormat, setStyleTheme } = useGlobalContext();

  const setWindowSize = async (fontSize: number) => {
    const size = fontSize * 24;
    await appWindow.setSize(new LogicalSize(size, size));
  };

  // settings.jsonの更新を監視して再読み込み
  const watchSettingsFile = async () => {
    return watch(settingPath, { delayMs: 200, recursive: false }, () => {
      readSettings().then(async (settings) => {
        setFormat(settings.format);
        setStyleTheme(settings.styleTheme);

        setWindowSize(settings.styleTheme.fontSize);

        const path = settings.ffmpegPath ?? (await getDefaultFfmpegPath());
        if (await exists(path)) {
          setFfmpegPath(path);
          return;
        }
        setFfmpegPath(undefined);
      });
    });
  };

  // settings.jsonから設定値を読み込み
  // FIXME: <React.StrictMode>対策。あんまりよくない気がする
  const processing = useRef<boolean>(false);
  useEffect(() => {
    if (processing.current) return;
    processing.current = true;

    readSettings().then(async (settings) => {
      watchSettingsFile();

      setFormat(settings.format);
      setStyleTheme(settings.styleTheme);

      setWindowSize(settings.styleTheme.fontSize);

      const existsFfmpeg =
        !!settings.ffmpegPath && (await exists(settings.ffmpegPath));
      if (existsFfmpeg) {
        setFfmpegPath(settings.ffmpegPath);
        appWindow.show();
        return;
      }
      // exeファイルと同じ場所を検索
      const defaultPath = await getDefaultFfmpegPath();
      if (await exists(defaultPath)) {
        setFfmpegPath(defaultPath);
        appWindow.show();
        return;
      }
      setFfmpegPath(undefined);
      appWindow.show();
    });
  }, []);
}
