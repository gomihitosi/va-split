import { exists, readBinaryFile } from "@tauri-apps/api/fs";
import { resolveResource } from "@tauri-apps/api/path";

export const getResourceFileUrl = async (fileName: string) => {
  const filePath = await resolveResource(fileName);
  const result = await exists(filePath);
  if (!result) {
    return undefined;
  }
  // FIXME: 頭文字に何か付いてるけどよくわからない
  const binary = await readBinaryFile(filePath.replace(/^\\\\\?\\/, ""));

  return URL.createObjectURL(new Blob([binary.buffer]));
};

export const playEndSound = () => {
  getResourceFileUrl("end.wav").then((url) => {
    if (!url) return;
    const sound = new Audio(url);
    sound.play();
    sound.onended = (ev) => {
      URL.revokeObjectURL(url);
    };
  });
};
