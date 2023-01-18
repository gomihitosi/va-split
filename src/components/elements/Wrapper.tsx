import { useGlobalContext } from "@/contexts/GlobalContext";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";
import { ReactNode } from "react";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    wrapper: css({
      width: `100%`,
      height: `100%`,
      color: `${styleTheme.text}`,
      backgroundColor: `${styleTheme.bg}`,
      fontSize: `${styleTheme.fontSize}px`,
      overflow: `hidden`,
      display: `flex`,
      flexDirection: `column`,
    }),
  };
};

type Props = {
  children?: ReactNode;
};

export default function Wrapper({ children }: Props) {
  const { styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  return <div css={styles["wrapper"]}>{children}</div>;
}
