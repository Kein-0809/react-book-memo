//! 本（book）に関するフロントエンドからバックエンドへのAPIリクエストを処理するためのファイル
//! このファイルがReactコンポーネント（View）とバックエンドのAPI（Controller）の間の通信を担当してい

import axios from "axios";

axios.interceptors.response.use(function(response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function(error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error.response.data.msg || '時間をおいてお試しください。');
});

// バックエンドのAPIのエンドポイントURLを定義
const ENDPOINT_URL = "/api/books";

const bookApi = {

  async get(id) {
    // 指定されたURLにGETリクエストを送信
    // バックエンドのserver/api-routes/books.mjsで定義されているバックエンドAPIを呼ぶ
    // "router.get("/:id")" from server/api-routes/books.mjs -> "getBook()" from server/controllers/books.mjs
    const result = await axios.get(ENDPOINT_URL + "/" + id);
    return result.data;
  },
  async getAll() {
    // 指定されたURLにGETリクエストを送信
    // バックエンドのserver/api-routes/books.mjsで定義されているバックエンドAPIを呼ぶ
    // "router.get("/")" from server/api-routes/books.mjs -> "getAllBooks()" from server/controllers/books.mjs
    const result = await axios.get(ENDPOINT_URL);
    // Axiosのレスポンスのオブジェクトの"data"プロパティからJSONデータを取得する
    return result.data;
  },
  // フォームで送るBookのオブジェクトを引数で受け取る
  async post(book) {
    // 指定されたURLにPOSTリクエストを送信
    // バックエンドのserver/api-routes/books.mjsで定義されているバックエンドAPIを呼ぶ
    // "router.post("/")" from server/api-routes/books.mjs -> "createBook()" from server/controllers/books.mjs
    const result = await axios.post(ENDPOINT_URL, book);
    return result.data;
  },
  async delete(book) {
    // 指定されたURLにDELETEリクエストを送信
    // バックエンドのserver/api-routes/books.mjsで定義されているバックエンドAPIを呼ぶ
    // "router.delete("/:id")" from server/api-routes/books.mjs -> "deleteBook()" from server/controllers/books.mjs
    const result = await axios.delete(ENDPOINT_URL + "/" + book._id);
    return result.data;
  },
  async patch(book) {
    // 指定されたURLにPATCHリクエストを送信
    // バックエンドのserver/api-routes/books.mjsで定義されているバックエンドAPIを呼ぶ
    // "router.patch("/:id")" from server/api-routes/books.mjs -> "updateBook()" from server/controllers/books.mjs
    const result = await axios.patch(ENDPOINT_URL + "/" + book._id, book);
    return result.data;
  },
};

export default bookApi;