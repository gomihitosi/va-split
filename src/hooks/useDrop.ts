import { useGlobalContext } from "@/contexts/GlobalContext";
import { TARGET_EXTENSION } from "@/stores/file";
import { writeSettings } from "@/utils/setting";
import { message } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export default function useDrop() {
  const {
    isProcess,
    ffmpegPath,
    setFfmpegPath,
    format,
    styleTheme,
    setFilePaths,
  } = useGlobalContext();

  const [dropFilePaths, setDropFilePaths] = useState<string[]>([]);

  // NOTE: ファイルドロップイベントであるonFileDropEventを使用するとuseStateの値が取得出来ない(スコープが違う？)
  // その為、後続処理はすべてuseEffectによる副作用での実装になっている。
  useEffect(() => {
    const unlisten = appWindow.onFileDropEvent((e) => {
      if (e.payload.type !== "drop") {
        return;
      }
      setDropFilePaths(e.payload.paths ?? []);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  });

  // ドロップされたファイルに対する処理
  useEffect(() => {
    if (isProcess || dropFilePaths.length === 0) {
      return;
    }
    if (
      dropFilePaths.length === 1 &&
      dropFilePaths[0].split("\\").slice(-1)[0] === "ffmpeg.exe"
    ) {
      setFfmpegPath(dropFilePaths[0]);
      writeSettings(dropFilePaths[0], format, styleTheme);
      return;
    }
    if (!ffmpegPath) {
      return;
    }
    const filterPaths = dropFilePaths.filter((path) =>
      TARGET_EXTENSION.includes(path.split(".").pop() ?? "")
    );
    if (filterPaths.length === 0) {
      message(
        `対応しているファイルがドロップされませんでした。\n対応しているファイルは下記となります。\n(${TARGET_EXTENSION.join(
          ", "
        )})`
      );
    }
    setFilePaths(filterPaths);
  }, [dropFilePaths]);
}
