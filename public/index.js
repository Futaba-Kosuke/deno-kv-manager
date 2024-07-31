const getAll = async () => {
  const url = getUrl();
  const token = getToken();

  const response = await fetchServer("PUT", "/get_all", { url, token });

  console.log(await response.text());

  return response;
};

const insertRows = async () => {
  const url = getUrl();
  const token = getToken();
  const rows = [
    { "key": ["X", "B"], "value": Math.random() },
    { "key": ["Y", "B"], "value": Math.random() },
    { "key": ["Z", "B"], "value": Math.random() },
  ];

  const response = await fetchServer("POST", "/rows", { url, token, rows });

  console.log(await response.text());

  return response;
};

const updateRows = async () => {
  const url = getUrl();
  const token = getToken();
  const rows = [
    { "key": ["X", "B"], "value": Math.random() },
    { "key": ["Z", "B"], "value": Math.random() },
  ];

  const response = await fetchServer("PUT", "/rows", { url, token, rows });

  console.log(await response.text());

  return response;
};

const deleteRows = async () => {
  const url = getUrl();
  const token = getToken();
  const target_keys = [["Z", "B"]];

  const response = await fetchServer("DELETE", "rows", {
    url,
    token,
    target_keys,
  });

  console.log(await response.text());

  return response;
};

const allDestroy = async () => {
  const url = getUrl();
  const token = getToken();

  const response = await fetchServer("DELETE", "/all_destroy", { url, token });

  console.log(await response.text());

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
