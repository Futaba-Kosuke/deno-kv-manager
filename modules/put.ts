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

  const notExistKeys: Deno.KvKey[] = [];
  for (const targetRow of targetRows) {
    // 既にデータが存在するか確認
    const exists: boolean = (await kv.get(targetRow.key)).value !== null;
    if (!exists) {
      notExistKeys.push(targetRow.key);
      continue;
    }

    // 既存データ更新
    kv.set(targetRow.key, targetRow.value);
  }

  return new Response(
    JSON.stringify({
      "message": notExistKeys.length === 0
        ? `データを更新しました`
        : `${
          notExistKeys.map((k) => `[${k}]`)
        }は削除されたかデータが更新されていたため、更新できませんでした。ページを読み込み直してください`,
    }),
  );
};
