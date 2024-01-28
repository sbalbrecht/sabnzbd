import { queryOptions } from "@tanstack/react-query";

export type GenericMap = {
  [key: string]: string;
};

export type GenericRecord = Record<string, string | number | boolean>;

export type ConfigServer = {
  server: string;
  host: string;
  port: number;
  username: string;
  password: string;
  connections: number;
  ssl: boolean;
  ssl_verify: 0 | 1 | 2;
};

export const asJson = (res: Response) => res.json();

export const getRequestParams = <T extends GenericRecord>(
  params: T,
): URLSearchParams => {
  // URLSearchParams takes a Record<string, string>, so we need to turn each value into a string.
  const record = Object.entries(params).map(([key, value]) => [
    key,
    value.toString(),
  ]);

  return new URLSearchParams(record);
};

export const urlWithParams = <T extends GenericRecord>(
  path: string,
  params: T,
): string => {
  const origin = window.location.origin;
  const url = new URL(`${origin}${path}`);
  const requestParams = getRequestParams(params);
  url.search = requestParams.toString();
  return url.toString();
};

export const headerQueryOptions = () =>
  queryOptions({
    queryKey: ["header", Date.now().valueOf()],
    queryFn: fetchHeader,
  });

export const languagesQueryOptions = () =>
  queryOptions({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

type LanguageSelection = {
  lang: string;
};

export const languageQueryOptions = (lang: LanguageSelection) =>
  queryOptions({
    queryKey: ["language", lang],
    queryFn: () => setUserLanguage(lang),
  });

export const serverQueryOptions = () =>
  queryOptions({
    queryKey: ["server", Date.now().valueOf()],
    queryFn: fetchEnabledServer,
  });

export const fetchHeader: () => Promise<GenericMap> = async () =>
  await fetch("/header").then(asJson);

export const fetchLanguages: () => Promise<string[][]> = async () =>
  await fetch("/languages").then(asJson);

export const setUserLanguage: (
  lang: LanguageSelection,
) => Promise<string> = async (lang: LanguageSelection) => {
  const url = urlWithParams("/language", lang);
  return await fetch(url, { method: "POST" }).then(() => "");
};

export const fetchEnabledServer: () => Promise<ConfigServer> = async () =>
  fetch("/server").then(asJson);
