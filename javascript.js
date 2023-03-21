/* 変数定義 */

var memo = ["\n", "\n", "\n"]; // メモの全内容（ローカルストレージ格納）
var title = ''; // メモタイトル（メモ編集画面内の要素）
var text = ''; // メモ内容（メモ編集画面内の要素）
var id = 0; // メモid（メモ一覧画面の行頭番号-1）

// メモ一覧画面のHTML要素
var list = [
    '<li><button name="memo_title" id="0" class="ol_common" onclick="load(0);">メモ 1</button></li><br>',
    '<li><button name="memo_title" id="1" class="ol_common" onclick="load(1);">メモ 2</button></li><br>',
    '<li><button name="memo_title" id="2" class="ol_common" onclick="load(2);">メモ 3</button></li><br>',
    '<li><input type="text" name="memo_title" id="new" value="新規メモ" class="ol_common"></li>'
];

// メモ一覧のHTML要素のフォーマット（初期化用）
const list_format = [
    '<li><button name="memo_title" id="', '0', '" class="ol_common" onclick="load', '(', '0', ')', ';">', '', '</button></li><br>'
];

// メモ一覧のHTML要素の正規表現（最終行を除く）
const list_regexp = new RegExp(`(${list_format[0]}).+(${list_format[2]}).+(${list_format[6]})`, 'g');

// メモ一覧のHTML要素１行分（最終行を除く）
var list_edit = list_format; // list_edit.join('')でリスト１行分になる

// メモ一覧のHTML要素１行分（最終行）
const list_end = '<li><input type="text" name="memo_title" id="new" value="新規メモ" class="ol_common"></li>';

// 各種操作ボタン（html要素）
const btn_create = '<button id="create" class="create" onclick="create();">追加</button>';
const btn_save = '<button id="save" class="" onclick="save();">保存</button>';
const btn_del = '<button id="del" class="del" onclick="del();">削除</button>';


/* 関数定義 */

// メモアプリの初期化
function reset() {
    // メモの全内容を初期化
    memo = ["\n", "\n", "\n"];
    localStorage.setItem('memo', memo);

    // メモ一覧画面を初期化
    list = [
        '<li><button name="memo_title" id="0" class="ol_common" onclick="load(0);">メモ 1</button></li><br>',
        '<li><button name="memo_title" id="1" class="ol_common" onclick="load(1);">メモ 2</button></li><br>',
        '<li><button name="memo_title" id="2" class="ol_common" onclick="load(2);">メモ 3</button></li><br>',
        '<li><input type="text" name="memo_title" id="new" value="新規メモ" class="ol_common"></li>'
    ];
    document.getElementById('list').innerHTML = list.join('\n');
    localStorage.setItem('list', list.join('\n,'));
    
    console.clear();
}

// データの取得
function open() {
    // ローカルストレージをチェック（データが無い場合はメモアプリの初期化を実行）
    if (!localStorage.getItem('memo') || !localStorage.getItem('list')) {
        console.log("error");
        reset();
    }
    
    // ローカルストレージから各メモ内容の末尾に改行を一つだけ付与
    memo = localStorage.getItem('memo').split('\n,');
    memo = memo.map(value => value + '\n');
    memo = memo.map(value => value.replace(/\n+$/, '\n'));
    
    console.log(`memo =\n${memo}`);

    list = localStorage.getItem('list').split('\n,');

    console.log(`list =\n${list.join('\n')}`);
}

// 読み込み
function load(id) {
    // 各種操作ボタンを表示
    document.getElementById('btn_create').innerHTML = btn_create;
    document.getElementById('btn_save').innerHTML = btn_save;
    if (memo.length > 1) document.getElementById('btn_del').innerHTML = btn_del;
    else document.getElementById('btn_del').innerHTML = ''; // メモが残り1枚のときに削除ボタンを隠す

    open();
    document.getElementById('list').innerHTML = list.join('\n');
    
    title = document.getElementById(String(id)).innerHTML;
    text = memo[id];

    console.log(`title = ${title}`);
    console.log(`text = ${text.replace(/\n$/, '')}`);
    console.log(`id = ${id}`);
    
    document.getElementById('title').value = title;
    document.getElementById('text').value = text.replace(/\n$/, ''); // メモ内容末尾の改行を削除
    document.getElementById('id').value = String(id);
}

// 保存
function save() {
    open();

    title = document.getElementById('title').value;
    text = document.getElementById('text').value;
    id = Number(document.getElementById('id').value);

    console.log(`title_in = ${title}`);
    console.log(`text_in = ${text}`);
    console.log(`id_in = ${id}`);

    // メモ一覧画面のタイトルを変更
    document.getElementById(String(id)).innerHTML = title;
    list = document.getElementById('list').innerHTML.split('\n');
    localStorage.setItem('list', list.join('\n,'));

    // 末尾に改行を付与してローカルストレージに保存
    memo.splice(id, 1, text + '\n');
    localStorage.setItem('memo', memo);

    load(id)
}

// 追加
function create() {
    open();
    
    title = document.getElementById('new').value;
    id = memo.length;

    console.log(`title_new = ${title}`);
    console.log(`id_new = ${id+1}`);
    
    // ローカルストレージに新規メモ内容を追加
    memo.push("\n");
    localStorage.setItem('memo', memo);

    // 新規メモタイトルを一覧画面のHTML要素に追加
    list_edit = list_format; // HTML要素をフォーマット
    list_edit[1] = list_edit[4] = String(id);
    list_edit[7] = title;
    list.pop();
    list.push(list_edit.join(''), list_end);

    document.getElementById('list').innerHTML = list.join('\n');
    localStorage.setItem('list', list.join('\n,'));
    
    console.log(`list_new =\n${list.join('\n')}`);

    load(id);
}

// 削除
function del() {
    open();

    title = document.getElementById('title').value;
    id = Number(document.getElementById('id').value);
    
    console.log(`title_del = ${title}`);
    console.log(`id_del = ${id+1}`);

    // ローカルストレージから指定のメモ内容を削除
    memo.splice(id, 1);
    console.log(`memo =\n${memo}`);
    localStorage.setItem('memo', memo);

    list.splice(id, 1); // メモ一覧画面から指定のタイトルを削除

    // メモidを修復
    for (id; id < memo.length; id++) {
        title = list[id];
        list[id] = title.replace(list_regexp, `$1${String(id)}$2(${String(id)})$3`);

        console.log(`${id}: ${list[id]}`);
    }
    document.getElementById('list').innerHTML = list.join('\n');
    localStorage.setItem('list', list.join('\n,'));

    console.log(`list =\n${list.join('\n')}`);

    load(0);
}
