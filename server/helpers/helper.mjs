export const requestErrorHandler = function(controller) {
  return async function(req, res, next) {
    try {
      // コントローラーを実行
      // "controller"は、それぞれのerequestErrorHandlerを呼ぶときに
      // 引数になる関数 (e.g, "getAllBooks"や"getBookById"などの関数)
      return await controller(req, res);
    } catch (err) {
      // エラーを次のミドルウェア(エラーハンドラー)に渡す
      // エラーハンドラーは、エラーをキャッチして、エラーを返す
      // 今回の場合、エラーハンドラーは、"app.js"に定義されている
      // "app.use()"でエラーハンドラーを定義しているので、
      // "app.js"に定義されているエラーハンドラーが実行される
      next(err.stack);
    }
  };
};
