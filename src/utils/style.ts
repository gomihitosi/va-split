import { Opacity, Transition } from "@/stores/style";

const convertHex = (color: string) => {
  const colors = color.split("").slice(1);
  if (colors.length == 3) {
    return colors.map((v) => v + v).map((v) => parseInt(v, 16));
  }
  return [...Array(3)].map((_, i) =>
    parseInt(colors.slice(i * 2, i * 2 + 2).join(""), 16)
  );
};

const convertRgb = (color: string) => {
  const colors = Array.from(color.matchAll(/\d+/g)).map((v) => v[0]);
  if (!colors) return [255, 255, 255];
  return (colors.length > 3 ? colors.slice(0, 3) : colors).map((v) =>
    parseInt(v, 10)
  );
};

const isHexColor = (color: string) => String(color)[0] === "#";

const isRgbColor = (color: string) => String(color).startsWith("rgb");

export const getDefaultHoverOpacityStyle = (color: string) => {
  const colors: number[] = [];
  if (isHexColor(color)) colors.push(...convertHex(color));
  if (isRgbColor(color)) colors.push(...convertRgb(color));

  return {
    ":hover": {
      backgroundColor: `rgba(${colors.join(", ")})`,
    },
    ":active": {
      transition: Transition.None,
      backgroundColor: `rgba(${colors.join(",")}, ${Opacity.Level1})`,
    },
  };
};
