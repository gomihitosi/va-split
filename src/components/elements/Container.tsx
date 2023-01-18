import Overlay from "@/components/elements/Overlay";
import Bar from "@/components/elements/TitleBar";
import Formater from "@/components/layout/Formater";
import Log from "@/components/layout/Log";
import StreamList from "@/components/layout/StreamList";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { EmSize } from "@/stores/style";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    "warning-container": css({
      padding: EmSize.Level2,
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      flex: `1`,
      userSelect: `none`,
    }),
    container: css({
      padding: `${EmSize.Level2} ${EmSize.Level1}`,
      gap: EmSize.Level3,
      display: `flex`,
      flexDirection: `column`,
      position: `relative`,
      flex: `1`,
    }),
  };
};

export default function Container() {
  const { ffmpegPath, styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  return (
    <>
      <Bar />
      {!ffmpegPath && (
        <div css={styles["warning-container"]}>
          <span>ffmpeg.exe が見つかりませんでした。</span>
          <span>ffmpeg.exe をドロップしてください。</span>
        </div>
      )}
      {ffmpegPath && (
        <div css={styles["container"]}>
          <Overlay />

          <Formater />
          <StreamList />
          <Log />
        </div>
      )}
    </>
  );
}
