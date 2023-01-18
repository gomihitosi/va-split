import { useGlobalContext } from "@/contexts/GlobalContext";
import { Options } from "@/stores/setting";
import { EmSize, Transition } from "@/stores/style";
import { StyleTheme } from "@/types";
import { css } from "@emotion/react";
import { ReactNode } from "react";

const getStyles = (styleTheme?: StyleTheme) => {
  if (!styleTheme) return {};
  return {
    select: css({
      width: `100%`,
      cursor: `pointer`,
      WebkitAppearance: `none`,
      appearance: `none`,
      outline: `none`,
      padding: `${EmSize.Level4} ${EmSize.Level3}`,
      border: `solid 1px ${styleTheme.border}`,
      borderRadius: EmSize.Level4,
      color: `${styleTheme.text}`,
      backgroundColor: `${styleTheme.bg}`,
      fontSize: EmSize.Level1,
    }),
    "select-wrapper": css({
      position: `relative`,
      userSelect: `none`,
      transition: `${Transition.Short}`,
      flex: `1`,
      "::before": {
        color: `${styleTheme.accent}`,
        content: `"▼"`,
        position: `absolute`,
        right: `0.5em`,
        pointerEvents: `none`,
      },
    }),
  };
};

type Props = {
  title: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options?: Options;
  children?: ReactNode;
};

export default function SelectBox({
  title,
  value,
  onChange,
  options,
  children,
}: Props) {
  const { styleTheme } = useGlobalContext();
  const styles = getStyles(styleTheme);

  return (
    <div css={styles["select-wrapper"]}>
      <select
        css={styles["select"]}
        aria-label={title}
        {...{ title, value, onChange }}
      >
        {options &&
          Object.values(options).map((v) => (
            <option key={v.value} value={v.value}>
              {v.text}
            </option>
          ))}
        {children}
      </select>
    </div>
  );
}
