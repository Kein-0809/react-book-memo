//! api-routesフォルダはRESTful APIのルーティングを設定するために使用
//! index.mjsファイルは、APIのメインルーターを設定し、books.mjsからのルートを/api/booksパスにマウントしています。

import express from "express";
import booksRoutes from "./books.mjs";

const router = express.Router();

// books.mjsに記載されているREST APIの親ルートを/api/booksに設定
router.use("/books", booksRoutes);

export default router;
