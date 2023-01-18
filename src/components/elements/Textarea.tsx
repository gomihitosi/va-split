import { useGlobalContext } from "@/contexts/GlobalContext";
import { EmSize } from "@/stores/style";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    textarea: css({
      height: `100%`,
      boxSizing: `border-box`,
      cursor: `default`,
      outline: `none`,
      border: `solid 1px ${styleTheme.border}`,
      color: `${styleTheme.text}`,
      backgroundColor: `${styleTheme.bg}`,
      fontSize: EmSize.Level2,
      resize: `none`,
      overflowY: `scroll`,
      "::-webkit-scrollbar": {
        width: EmSize.Level1,
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: `${styleTheme.border}`,
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: `${styleTheme.accent}`,
      },
    }),
  };
};

type Props = {
  value?: string | number | readonly string[];
  readOnly: boolean;
  title: string;
};

export default function Textarea({ value, readOnly = false, title }: Props) {
  const { styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  return (
    <textarea
      title={title}
      value={value}
      readOnly={readOnly}
      css={styles["textarea"]}
    />
  );
}
