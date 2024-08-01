const DENO_KV_ACCESS_TOKEN_KEY = "DENO_KV_ACCESS_TOKEN";

export const accessKv = async (
  url: string,
  token: string,
): Promise<Deno.Kv> => {
  // リクエストに応じて環境変数を設定する
  Deno.env.set(DENO_KV_ACCESS_TOKEN_KEY, token);

  // Deno KVの読み込み
  const kv = await Deno.openKv(url);

  // 環境変数を削除
  Deno.env.delete(DENO_KV_ACCESS_TOKEN_KEY);

  return kv;
};
