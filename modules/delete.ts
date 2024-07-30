import { accessKv } from "./kv_getter.ts";

export const allDestroy = async (request: Request): Promise<Response> => {
  const payload = await request.json();

  const dbUrl: string = payload["url"];
  const accessToken: string = payload["token"];

  // Deno KVにアクセス
  const kv = await accessKv(dbUrl, accessToken);

  // データの全削除
  for await (const entry of kv.list({ prefix: [] })) {
    await kv.delete(entry.key);
  }

  return new Response(`${dbUrl}の全データを削除しました`);
};
