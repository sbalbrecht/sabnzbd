import { queryOptions } from "@tanstack/react-query";

type GenericMap = {
  [key: string]: string;
};

const asJson = (res: Response) => res.json();

export const headerQueryOptions = () =>
  queryOptions({
    queryKey: ["header"],
    queryFn: fetchHeader,
  });

export const languagesQueryOptions = () =>
  queryOptions({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

export const fetchHeader: () => Promise<GenericMap> = async () =>
  await fetch("/header").then(asJson);

export const fetchLanguages: () => Promise<string[][]> = async () =>
  await fetch("/languages").then(asJson);
