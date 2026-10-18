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
  /** music intensity: 0 calm, 1 building (default), 2 full */
  mood?: 0 | 1 | 2;
  C: FC<SlideProps>;
};
