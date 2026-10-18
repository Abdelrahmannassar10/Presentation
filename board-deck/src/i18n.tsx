import { createContext, useContext } from "react";

export type Lang = "en" | "ar";
export const LangCtx = createContext<Lang>("en");

/** Returns t(en, ar): the string for the active language. */
export function useT() {
  const lang = useContext(LangCtx);
  return (en: string, ar: string) => (lang === "ar" ? ar : en);
}
export const useLang = () => useContext(LangCtx);

const AR_DIGITS = false; // Board copy keeps Western digits in Arabic, as in the source report.
export const fmt = (n: number) => (AR_DIGITS ? n.toLocaleString("ar-EG") : n.toLocaleString("en-US"));
