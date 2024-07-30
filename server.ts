import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

Deno.serve(async (request) => {
  return serveDir(
    request,
    {
      fsRoot: "./public/",
      urlRoot: "",
      enableCors: true,
    },
  );
});
