import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { allDestroy, deleteTargetRows } from "./modules/delete.ts";
import { getAll } from "./modules/put.ts";
import { createNewRow } from "./modules/post.ts";

const postRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
    // データ挿入
    case "/new": {
      return await createNewRow(request);
    }
  }
  return undefined;
};

const putRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
    // データ取得
    // リクエストボディが欲しいのでGETでなくPUT
    case "/get_all": {
      return await getAll(request);
    }
    // データ更新
    case "/update": {
      return new Response();
    }
  }
  return undefined;
};

const deleteRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
    // データ全削除
    case "/all_destroy": {
      return await allDestroy(request);
    }
    // データ削除
    case "/elements": {
      return await deleteTargetRows(request);
    }
  }
  return undefined;
};

Deno.serve(async (request) => {
  const method = request.method;
  const pathname = new URL(request.url).pathname;

  switch (method) {
    case "POST": {
      const res = await postRouter(pathname, request);
      if (res !== undefined) {
        return res;
      }
      break;
    }
    case "PUT": {
      const res = await putRouter(pathname, request);
      if (res !== undefined) {
        return res;
      }
      break;
    }
    case "DELETE": {
      const res = await deleteRouter(pathname, request);
      if (res !== undefined) {
        return res;
      }
      break;
    }
  }

  return serveDir(
    request,
    {
      fsRoot: "./public/",
      urlRoot: "",
      enableCors: true,
    },
  );
});
