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

  return new Response(JSON.stringify({ "message": `全データを削除しました` }));
};

export const deleteTargetRows = async (request: Request): Promise<Response> => {
  const payload = await request.json();

  const dbUrl: string = payload["url"];
  const accessToken: string = payload["token"];
  const targetKeys: Deno.KvKey[] = payload["target_keys"];

  // Deno KVにアクセス
  const kv = await accessKv(dbUrl, accessToken);

  // データの全削除
  for (const targetKey of targetKeys) {
    await kv.delete(targetKey);
  }

  return new Response(
    JSON.stringify({
      "message": `${targetKeys.map((k) => `[${k}]`)}を削除しました`,
    }),
  );
};
