import { ReactComponent as Close } from "@/assets/close.svg";
import { ReactComponent as Minimize } from "@/assets/minimize.svg";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { EmSize, Transition } from "@/stores/style";
import { StyleTheme } from "@/types";
import { writeSettings } from "@/utils/setting";
import { getDefaultHoverOpacityStyle } from "@/utils/style";
import { css } from "@emotion/react";
import { appWindow } from "@tauri-apps/api/window";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  const hoverStyle = getDefaultHoverOpacityStyle(styleTheme.accent);
  return {
    "title-bar": css({
      display: `flex`,
      justifyContent: `space-between`,
      userSelect: `none`,
      color: `${styleTheme.titleText}`,
      backgroundColor: `${styleTheme.titleBg}`,
    }),
    "title-text": css({
      display: `flex`,
      alignItems: `center`,
      fontSize: EmSize.Level2,
      paddingLeft: EmSize.Level1,
    }),
    "title-button-bar": css({
      display: `flex`,
    }),
    "title-button": css({
      fill: `${styleTheme.titleText}`,
      width: EmSize.Level2,
      height: EmSize.Level2,
      display: `flex`,
      padding: `${EmSize.Level3} ${EmSize.Level2}`,
      cursor: `default`,
      transition: Transition.Short,
      ...hoverStyle,
    }),
  };
};

export default function TitleBar() {
  const { ffmpegPath, format, styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  const handleClose = async () => {
    await writeSettings(ffmpegPath, format, styleTheme);
    await appWindow.close();
  };

  return (
    <div data-tauri-drag-region css={styles["title-bar"]}>
      <div css={styles["title-text"]}>va-split</div>
      <div css={styles["title-button-bar"]}>
        <div css={styles["title-button"]} onClick={() => appWindow.minimize()}>
          <Minimize />
        </div>
        <div css={styles["title-button"]} onClick={() => handleClose()}>
          <Close />
        </div>
      </div>
    </div>
  );
}
