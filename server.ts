import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

const getRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
    // データ取得
    case "/values": {
      return new Response(
        JSON.stringify(
          [
            {
              "key": ["school", "classroom", 1],
              "value": { "grade": 1, "class": "A" },
            },
            {
              "key": ["school", "classroom", 2],
              "value": { "grade": 1, "class": "B" },
            },
            {
              "key": ["school", "classroom", 3],
              "value": { "grade": 2, "class": "A" },
            },
            {
              "key": ["school", "student", 1],
              "value": { "name": "田中", "classroom": 1 },
            },
            {
              "key": ["school", "student", 2],
              "value": { "name": "山田", "classroom": 2 },
            },
            {
              "key": ["school", "student", 3],
              "value": { "name": "じぐ太郎", "classroom": 2 },
            },
          ],
        ),
      );
    }
  }
  return undefined;
};

const postRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
    // データ挿入
    case "/new": {
      return new Response();
    }
  }
  return undefined;
};

const putRouter = async (
  path: string,
  request: Request,
): Promise<Response | undefined> => {
  switch (path) {
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
      return new Response();
    }
    // データ削除
    case "/delete": {
      return new Response();
    }
  }
  return undefined;
};

Deno.serve(async (request) => {
  const method = request.method;
  const pathname = new URL(request.url).pathname;

  switch (method) {
    case "GET": {
      const res = await getRouter(pathname, request);
      if (res !== undefined) {
        return res;
      }
      break;
    }
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
