//! MVCモデルのModelの役割
//! Mongooseを使用してBookのスキーマを定義しています。
//! これがデータの構造とデータベースとのやり取りを担当するModelの部分です。

import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Book = model("Book", bookSchema);
