import { DefaultFormat, DefaultStyleTheme } from "@/stores/setting";
import { Format, StreamFile, StyleTheme } from "@/types";
import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

interface GlobalContext {
  isProcess: boolean;
  setIsProcess: Dispatch<React.SetStateAction<boolean>>;

  ffmpegPath?: string;
  setFfmpegPath: Dispatch<React.SetStateAction<string | undefined>>;
  format?: Format;
  setFormat: Dispatch<React.SetStateAction<Format | undefined>>;
  styleTheme?: StyleTheme;
  setStyleTheme: Dispatch<React.SetStateAction<StyleTheme | undefined>>;

  filePaths: string[];
  setFilePaths: Dispatch<React.SetStateAction<string[]>>;
  streamList: StreamFile[];
  setStreamList: Dispatch<React.SetStateAction<StreamFile[]>>;
  logList: string[];
  setLogList: Dispatch<React.SetStateAction<string[]>>;
}

const initialValue: GlobalContext = {
  isProcess: false,
  setIsProcess: () => {},

  ffmpegPath: undefined,
  setFfmpegPath: () => {},
  format: DefaultFormat,
  setFormat: () => {},
  styleTheme: DefaultStyleTheme,
  setStyleTheme: () => {},

  filePaths: [],
  setFilePaths: () => {},
  streamList: [],
  setStreamList: () => {},
  logList: [],
  setLogList: () => {},
};

export const GlobalContext = createContext(initialValue);

type Props = { children?: ReactNode };

export const GlobalProvider = ({ children }: Props) => {
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const [ffmpegPath, setFfmpegPath] = useState<string>();
  const [format, setFormat] = useState<Format>();
  const [styleTheme, setStyleTheme] = useState<StyleTheme>();

  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [streamList, setStreamList] = useState<StreamFile[]>([]);
  const [logList, setLogList] = useState<string[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        isProcess,
        setIsProcess,

        ffmpegPath,
        setFfmpegPath,
        format,
        setFormat,
        styleTheme,
        setStyleTheme,

        filePaths,
        setFilePaths,
        streamList,
        setStreamList,
        logList,
        setLogList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
