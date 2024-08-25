//! api-routesフォルダはRESTful APIのルーティングを設定するために使用
//! books.mjsファイルは、本に関連する具体的なAPIエンドポイント（GET、POST、PATCH、DELETE）を定義しています。
//! Router (Controller の一部として考えられる):
//! このファイルはルーティングを担当しており、Controllerの一部と見なすことができます。
//! HTTPリクエストを適切なControllerの関数にマッピングしています

import express from "express";
// express-validatorは、リクエストボディのバリデーションを行うために使用
// body()は、リクエストボディのフィールドを確認できる
import { body } from "express-validator";
// requestErrorHandlerは、エラーハンドリングを行うために使用
import { requestErrorHandler } from "../helpers/helper.mjs";
import {
  deleteBook,
  getAllBooks,
  getBookById,
  registerBook,
  updateBook,
} from "../controllers/books.mjs";

const router = express.Router();

// router.use(express.urlencoded({ extended: true }));

//! REST APIの記述をする

// "/api/books"
// "helper.mjs"の"requestErrorHandler"を使用して、エラーハンドリングを行いながら、
// "controllers/books.mjs"にある"registerBook"関数を実行する
router.get("/", requestErrorHandler(getAllBooks));

// "/api/books/1"
router.get("/:id", requestErrorHandler(getBookById));

// "/api/books"
router.post(
  "/",
  // 新しい本を登録するときに送るフォームの"title"フィールドが空でないことを確認
  body("title").notEmpty().withMessage('タイトルを入力してください。'),
  body("description").notEmpty(),
  // int型を使うように指定
  body("rating").notEmpty().isInt(),
  body("comment").notEmpty(),
  // "helper.mjs"の"requestErrorHandler"を使用して、エラーハンドリングを行いながら、
  // "controllers/books.mjs"にある"registerBook"関数を実行する
  requestErrorHandler(registerBook)
);

// "/api/books/1"
router.patch(
  "/:id",
  // 本の情報を更新するときに送るフォームの"title"フィールドが空でないことを確認
  // optional()は、フィールドが空でもエラーにならないようにする
  body("title").optional().notEmpty(),
  body("description").optional().notEmpty(),
  body("rating").optional().notEmpty().isInt(),
  body("comment").optional().notEmpty(),
  requestErrorHandler(updateBook)
);

// "/api/books/1"
router.delete("/:id", requestErrorHandler(deleteBook));

export default router;
