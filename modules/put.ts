import { accessKv } from "./kv_getter.ts";
import { KvRowType } from "./types.ts";

export const getAll = async (request: Request): Promise<Response> => {
  const payload = await request.json();

  const dbUrl: string = payload["url"];
  const accessToken: string = payload["token"];

  // Deno KVにアクセス
  const kv = await accessKv(dbUrl, accessToken);

  // データを全取得
  const data = await kv.list({ prefix: [] });

  // リザルトに格納
  const result: KvRowType[] = [];
  for await (const entry of data) {
    result.push({
      key: entry.key,
      value: entry.value,
    });
  }

  return new Response(JSON.stringify(result));
};

export const updateRows = async (request: Request): Promise<Response> => {
  const payload = await request.json();

  const dbUrl: string = payload["url"];
  const accessToken: string = payload["token"];
  const targetRows: KvRowType[] = payload["rows"];

  // Deno KVにアクセス
  const kv = await accessKv(dbUrl, accessToken);

  for (const targetRow of targetRows) {
    // データ更新
    kv.set(targetRow.key, targetRow.value);
  }

  return new Response(
    JSON.stringify({
      "message": `データを更新しました`,
    }),
  );
};
