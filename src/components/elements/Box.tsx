import { useGlobalContext } from "@/contexts/GlobalContext";
import { EmSize } from "@/stores/style";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";
import { ReactNode } from "react";

const getStyles = (isFlexOne: boolean, styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    "box-wrapper": css({
      display: `flex`,
      flexDirection: `column`,
      flex: `1`,
    }),
    box: css({
      display: `flex`,
      flexDirection: `column`,
      gap: EmSize.Level3,
      ...(isFlexOne ? { flex: `1` } : {}),
    }),
    caption: css({
      userSelect: `none`,
      pointerEvents: `none`,
      "::before": {
        color: `${styleTheme.accent}`,
        content: `"■"`,
      },
    }),
  };
};

type Props = {
  caption?: string;
  isFlexOne: boolean;
  children?: ReactNode;
};

export default function Box({ caption, isFlexOne = false, children }: Props) {
  const { styleTheme } = useGlobalContext();
  const styles = getStyles(isFlexOne, styleTheme);

  return (
    <div css={styles["box-wrapper"]}>
      {caption && <div css={styles["caption"]}>{caption}</div>}
      <div css={styles["box"]}>{children}</div>
    </div>
  );
}
