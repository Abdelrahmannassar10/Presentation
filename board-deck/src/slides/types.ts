import type { FC } from "react";

export type SlideProps = { step: number; active: boolean };

export type SlideDef = {
  id: string;
  steps: number;
  chapter: [string, string];
  title: [string, string];
  thumb: string;
  notes: [string, string];
  chrome?: boolean;
  C: FC<SlideProps>;
};
