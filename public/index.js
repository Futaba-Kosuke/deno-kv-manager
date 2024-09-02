const rows = [];

class KvRow {
  constructor(key, value, type, isNew = false) {
    this.key = key;
    this.value = value;
    this.type = type;
    this.isNew = isNew;
    this.element = this.createRowElement();
    this.bindEvents();
    if (this.isNew) console.log("new")
  }

  createRowElement() {
    const row = document.createElement('tr');
    row.className = 'kv-row';

    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox is-target';
    checkboxCell.appendChild(checkbox);

    const keyCell = document.createElement('td');
    const keyInput = document.createElement('input');
    keyInput.className = 'input kv-key';
    keyInput.type = 'text';
    keyInput.value = JSON.stringify(this.key);
    if (!this.isNew) keyInput.disabled = true;
    keyCell.appendChild(keyInput);

    const valueCell = document.createElement('td');
    const valueTextarea = document.createElement('textarea');
    valueTextarea.className = 'textarea kv-value';
    valueTextarea.value = this.type === 'object' ? JSON.stringify(this.value, null, 2) : String(this.value);
    valueCell.appendChild(valueTextarea);

    const typeCell = document.createElement('td');
    const typeSelect = document.createElement('select');
    typeSelect.className = 'select kv-value-type';
    typeSelect.innerHTML = `
      <option value="json" ${this.type === 'object' ? 'selected' : ''}>json</option>
      <option value="string" ${this.type === 'string' ? 'selected' : ''}>string</option>
      <option value="number" ${this.type === 'number' ? 'selected' : ''}>number</option>
    `;
    typeCell.appendChild(typeSelect);

    row.appendChild(checkboxCell);
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(typeCell);

    return row;
  }

  bindEvents() {
    const checkbox = this.element.querySelector('.is-target');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        this.element.classList.add('has-background-success-90');
      } else {
        this.element.classList.remove('has-background-success-90');
      }
      console.log(`Checkbox checked: ${checkbox.checked}`);
    });
  }

  getElement() {
    return this.element;
  }

  isChecked() {
    const checkbox = this.element.querySelector('.is-target');
    return checkbox.checked;
  }

  getData() {
    const key = JSON.parse(this.element.querySelector('.kv-key').value);
    const valueTextarea = this.element.querySelector('.kv-value');
    const typeSelect = this.element.querySelector('.kv-value-type');
    let value;

    switch (typeSelect.value) {
      case 'string':
        value = valueTextarea.value;
        break;
      case 'number':
        value = Number(valueTextarea.value);
        break;
      case 'json':
        value = JSON.parse(valueTextarea.value);
        break;
    }

    return { key, value };
  }
}

window.onload = () => {
  $("#database-url").change(() => {
    canDispatchChecker();
  });

  $("#deno-deploy-token").change(() => {
    canDispatchChecker();
  });

  setTimeout(() => {
    canDispatchChecker();
  }, 1000);
};

const canDispatchChecker = () => {
  const url = getUrl();
  const token = getToken();

  if (url.length > 0 && token.length > 0) {
    $(".dispatcher").each((index, element) => {
      $(element).removeAttr("disabled");
    });
  } else {
    $(".dispatcher").each((index, element) => {
      $(element).attr("disabled", "1");
    });
  }
};

/**
 * データを全取得してhtmlに設置
 * @returns なし
 */
const getAll = async () => {
  const url = getUrl();
  const token = getToken();

  const response = await fetchServer("PUT", "/get_all", { url, token });
  const rowsData = await response.json();

  $("#kv-rows").empty();
  rows.length = 0;

  for (const row of rowsData) {
    const key = row["key"];
    const value = row["value"];
    const type = typeof (row["value"]);

    const kvRow = new KvRow(key, value, type);
    rows.push(kvRow);
    $("#kv-rows").append(kvRow.getElement());
  }
};

/**
 * 新規行のHTML要素を追加
 */
const addRowElement = () => {
  const kvRow = new KvRow([], {}, 'json', true);
  rows.push(kvRow);
  $("#kv-rows").append(kvRow.getElement())
};

/**
 * データの更新
 */
const updateRows = async () => {
  const url = getUrl();
  const token = getToken();

  const rowsData = rows.filter(row => row.isChecked()).map(row => row.getData());

  await fetchServer("PUT", "/rows", { url, token, rows: rowsData });

  // 1秒待つ
  await setTimeout(async () => {
    // 最新データを取得
    await getAll();
  }, 1000);
};

const deleteRows = async () => {
  const url = getUrl();
  const token = getToken();

  const target_keys = rows.filter(row => row.isChecked()).map(row => row.getData().key);

  await fetchServer('DELETE', '/rows', { url, token, target_keys });

  // 1秒待つ
  await setTimeout(async () => {
    // 最新データを取得
    await getAll();
  }, 1000);
};

const allDestroy = async () => {
  const url = getUrl();
  const token = getToken();

  if (!window.confirm("Deno KV内のデータがすべて削除されます。本当に実行しますか？")) {
    return
  }

  const response = await fetchServer("DELETE", "/all_destroy", { url, token });

  // 要素内を空に
  $("#kv-rows").empty();
  rows.length = 0;

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
