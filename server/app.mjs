import 'dotenv/config';
import path from "path";
import express from "express";
import apiRoutes from "./api-routes/index.mjs";
import "./helpers/db.mjs";

const app = express();

// ポート番号が.envファイルに記載されている場合はそのポート番号を使用し、記載されていない場合は8080番を使用する
const port = process.env.PORT || 8080;

// corsエラーの設定 ここから↓
import cors from "cors";

// app.use(cors({
//   // どこからのアクセスを許可するか。オリジン(スキーマ、ドメイン、ポート)を記す。
//   origin: "http://localhost:3000",
//   // どのメソッドを許可するかは配列で記述。書かない場合は全て通す。
//   // methods: ["GET", "POST", "PUT", "DELETE"],
//   // クッキーを残すかどうか
//   // credentials: true,
// }));
// corsエラーの設定 ここまで

app.use(express.static('build'));

app.use(express.json());

//! "./api-routes/index.mjs"に記載されているREST APIの親ルートを"/api"に設定
//! "/api" (このファイル) -> "/api/books" (index.mjs) -> "/api/books/1" (books.mjs)
//! つまり、"/api/books"というURLにアクセスすると、books.mjsに記載されているREST APIが実行される
app.use("/api", apiRoutes);

app.get('*', (req, res) => {
  const pathIndex = path.resolve('build', 'index.html');
  res.sendFile(pathIndex);
});

// エラーハンドラーのミドルウェア
// 404エラーが発生した場合は、404エラーを返す
app.use(function(req, res) {
  res.status(404).send("Page Not Found");
});

// エラーハンドラーのミドルウェア
// エラーが発生した場合は、500エラーを返す
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).json({ msg: "予期せぬエラーが発生しました。" });
});

app.listen(port, () => {
  console.log(`Server start: http://localhost:${port}`);
});
