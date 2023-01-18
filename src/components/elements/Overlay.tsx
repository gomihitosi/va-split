import { useGlobalContext } from "@/contexts/GlobalContext";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    overlay: css({
      width: `100%`,
      height: `100%`,
      color: `#ffffff`,
      backgroundColor: `rgba(0, 0, 0, 0.75)`,
      position: `absolute`,
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      top: `0`,
      left: `0`,
      zIndex: `100`,
      userSelect: `none`,
    }),
  };
};

export default function Overlay() {
  const { styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  const { isProcess } = useGlobalContext();

  if (!isProcess) {
    return <></>;
  }
  return <div css={styles["overlay"]}>処理中…</div>;
}
