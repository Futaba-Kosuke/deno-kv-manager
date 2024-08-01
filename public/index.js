/**
 * データを全取得してhtmlに設置
 * @returns なし
 */
const getAll = async () => {
  const url = getUrl();
  const token = getToken();

  const response = await fetchServer("PUT", "/get_all", { url, token });

  const rows = await response.json();

  // 要素内を空に
  $("#kv-rows").empty();
  // 要素内にデータ挿入
  for (const row of rows) {
    const key = row["key"];
    const value = row["value"];
    const type = typeof (row["value"]);

    $("#kv-rows").append(`
      <tr class="exists-kv-row">
        <td><input class="checkbox is-target" type="checkbox"></td>
        <td><input class="input kv-key" type="text" value='${JSON.stringify(key)}' disabled></td>
        <td><textarea class="textarea kv-value">${type === "object" ? JSON.stringify(value, null, 2) : value}</textarea></td>
        <td>
          <select class="select kv-value-type">
            <option value="json" ${
      type === "object" ? "selected" : ""
    }>json</option>
            <option value="string" ${
      type === "string" ? "selected" : ""
    }>string</option>
            <option value="number" ${
      type === "number" ? "selected" : ""
    }>number</option>
          </select>
        </td>
      </tr>
    `);
  }

  return;
};

/**
 * 新規行のHTML要素を追加
 */
const addRowElement = () => {
  const rows = $("#kv-rows");

  const rowCount = rows.children().length;
  rows.append(`
    <tr class="tr new-kv-row">
      <td><input class="checkbox is-target" type="checkbox" checked></td>
      <td><input class="input kv-key" type="text" value="[]"></td>
      <td><textarea class="textarea kv-value">{}</textarea></td>
      <td>
        <select class="select kv-value-type">
          <option value="json">json</option>
          <option value="string">string</option>
          <option value="number">number</option>
        </select>
      </td>
    </tr>
  `);
};

/**
 * データの新規作成・及び最新データの取得
 * @returns なし
 */
const insertRows = async () => {
  const url = getUrl();
  const token = getToken();
  const rows = [];

  $("#kv-rows .new-kv-row").each((index, element) => {
    const isTarget = $(element).find(".is-target").is(":checked");

    if (isTarget) {
      const key = JSON.parse($(element).find(".kv-key").val());
      let value;
      switch ($(element).find(".kv-value-type").val()) {
        case "string":
          value = $(element).find(".kv-value").val();
          break;
        case "number":
          value = Number($(element).find(".kv-value").val());
          break;
        case "json":
          value = JSON.parse($(element).find(".kv-value").val());
          break;
      }
      rows.push({ key, value });
    }
  });

  // データを挿入
  await fetchServer("POST", "/rows", { url, token, rows });

  // 1秒待つ
  await setTimeout(async () => {
    // 最新データを取得
    await getAll();
  }, 1000);

  return;
};

const updateRows = async () => {
  const url = getUrl();
  const token = getToken();
  const rows = [];

  $("#kv-rows .new-kv-row, #kv-rows .exists-kv-row").each((index, element) => {
    const isTarget = $(element).find(".is-target").is(":checked");

    if (isTarget) {
      const key = JSON.parse($(element).find(".kv-key").val());
      let value;
      switch ($(element).find(".kv-value-type").val()) {
        case "string":
          value = $(element).find(".kv-value").val();
          break;
        case "number":
          value = Number($(element).find(".kv-value").val());
          break;
        case "json":
          value = JSON.parse($(element).find(".kv-value").val());
          break;
      }
      rows.push({ key, value });
    }
  });

  // データを更新
  await fetchServer("PUT", "/rows", { url, token, rows });

  // 1秒待つ
  await setTimeout(async () => {
    // 最新データを取得
    await getAll();
  }, 1000);
};

const deleteRows = async () => {
  const url = getUrl();
  const token = getToken();
  const target_keys = [];

  $("#kv-rows .exists-kv-row").each((index, element) => {
    const isTarget = $(element).find(".is-target").is(":checked");

    if (isTarget) {
      const key = JSON.parse($(element).find(".kv-key").val());
      target_keys.push(key);
    }
  });

  // データを更新
  await fetchServer("DELETE", "/rows", { url, token, target_keys });

  // 1秒待つ
  await setTimeout(async () => {
    // 最新データを取得
    await getAll();
  }, 1000);
};

const allDestroy = async () => {
  const url = getUrl();
  const token = getToken();

  const response = await fetchServer("DELETE", "/all_destroy", { url, token });

  // 要素内を空に
  $("#kv-rows").empty();

  return response;
};

/**
 * サーバーへのアクセス
 * @param {string} method GET, POST, PUT...
 * @param {string} pathname /hoge
 * @param {Object} payload request-body object
 * @returns レスポンス
 */
const fetchServer = (method, pathname, payload) => {
  return fetch(pathname, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/**
 * htmlからurl取得
 * @returns url
 */
const getUrl = () => {
  const url = $("#database-url").val();
  return url;
};

/**
 * htmlからtoken取得
 * @returns token
 */
const getToken = () => {
  const token = $("#deno-deploy-token").val();
  return token;
};
