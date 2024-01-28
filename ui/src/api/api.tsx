import { queryOptions } from "@tanstack/react-query";
import { ConfigServer, asJson, urlWithParams } from "./common";

export const pingTestServerOptions = (
  apikey: string,
  testServer: ConfigServer,
) => {
  return queryOptions({
    queryKey: ["pingTestServer", Date.now().valueOf(), testServer],
    queryFn: () => pingTestServer(apikey, testServer),
    enabled: false,
  });
};

export const pingTestServer = (apikey: string, server: ConfigServer) => {
  const url = urlWithParams("/api", {
    mode: "config",
    name: "test_server",
    output: "json",
    apikey,
    ...server,
  });

  return fetch(url, { method: "POST" }).then(asJson);
};
