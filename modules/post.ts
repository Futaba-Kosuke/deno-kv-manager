import { accessKv } from "./kv_getter.ts";
import { KvRowType } from "./types.ts";

export const createNewRow = async (request: Request): Promise<Response> => {
  const payload = await request.json();

  const dbUrl: string = payload["url"];
  const accessToken: string = payload["token"];
  const newRows: KvRowType[] = payload["rows"];

  // Deno KVにアクセス
  const kv = await accessKv(dbUrl, accessToken);

  const existKeys: Deno.KvKey[] = [];
  for (const newRow of newRows) {
    // 既にデータが存在しないか確認
    const exists: boolean = (await kv.get(newRow.key)).value !== null;
    if (exists) {
      existKeys.push(newRow.key);
      continue;
    }

    // 新規データ作成
    kv.set(newRow.key, newRow.value);
  }

  return new Response(
    JSON.stringify({
      "message": existKeys.length === 0
        ? `データを新規作成しました`
        : `${
          existKeys.map((k) => `[${k}]`)
        }は既に存在していたため、作成できませんでした。ページを読み込み直してください`,
    }),
  );
};
