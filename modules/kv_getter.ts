const DENO_KV_ACCESS_TOKEN_KEY = "DENO_KV_ACCESS_TOKEN";

export const accessKv = async (
  url: string,
  token: string,
): Promise<Deno.Kv> => {
  const prevToken = await Deno.env.get(DENO_KV_ACCESS_TOKEN_KEY);

  // リクエストに応じて環境変数を設定する
  await Deno.env.set(DENO_KV_ACCESS_TOKEN_KEY, token);

  // Deno KVの読み込み
  const kv = await Deno.openKv(url);

  // 環境変数を削除
  await Deno.env.delete(DENO_KV_ACCESS_TOKEN_KEY);

  if (prevToken !== undefined) {
    await Deno.env.set(DENO_KV_ACCESS_TOKEN_KEY, prevToken);
  }

  return kv;
};
