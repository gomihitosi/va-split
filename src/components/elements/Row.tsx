import { EmSize } from "@/stores/style";
import { css } from "@emotion/react";
import { ReactNode } from "react";

const getStyles = () => {
  return {
    "select-row": css({
      width: `100%`,
      display: `flex`,
      gap: EmSize.Level1,
    }),
  };
};

type Props = {
  children?: ReactNode;
};

export default function Row({ children }: Props) {
  const styles = getStyles();

  return <div css={styles["select-row"]}>{children}</div>;
}
