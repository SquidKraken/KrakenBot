/* eslint-disable node/no-process-env */
import type { Server } from "node:http";
import http from "node:http";

export function startKrakenServer(): Server {
  const server = http.createServer((_request, response) => {
    response.writeHead(200);
    response.end();
  });

  return server.listen(process.env.PORT ?? 5000);
}
