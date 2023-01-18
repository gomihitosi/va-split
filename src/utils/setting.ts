import { DefaultFormat, DefaultStyleTheme } from "@/stores/setting";
import { Format, Settings, StyleTheme } from "@/types";
import { getDefaultFfmpegPath } from "@/utils/ffmpeg";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { join, resourceDir } from "@tauri-apps/api/path";

export const getSettingsPath = async () => {
  return join(await resourceDir(), "settings.json");
};

export const readSettings = async () => {
  const filePath = await getSettingsPath();
  const fileExists = await exists(filePath);
  if (!fileExists) {
    await writeSettings(await getDefaultFfmpegPath());
  }
  const binary = await readTextFile(filePath);
  return JSON.parse(binary) as Settings;
};

export const writeSettings = async (
  ffmpegPath?: string,
  format?: Format,
  styleTheme?: StyleTheme
) => {
  const settings: Settings = {
    ffmpegPath: ffmpegPath,
    format: format ?? DefaultFormat,
    styleTheme: styleTheme ?? DefaultStyleTheme,
  };

  const filePath = await getSettingsPath();
  return writeTextFile(filePath, JSON.stringify(settings, null, "\t"));
};
