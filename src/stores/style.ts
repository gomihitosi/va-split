export const Transition = {
  None: "0s",
  Short: "0.1s ease-out",
} as const;
export type Transition = typeof Transition[keyof typeof Transition];

export const Opacity = {
  Level1: "0.75",
  Level2: "0.5",
} as const;
export type Opacity = typeof Opacity[keyof typeof Opacity];

export const EmSize = {
  Level1: "1em",
  Level2: "0.8em",
  Level3: "0.4em",
  Level4: "0.2em",
} as const;
export type EmSize = typeof EmSize[keyof typeof EmSize];
