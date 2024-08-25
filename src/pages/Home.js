import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import bookApi from "../api/book";
import { useDispatchBooks } from "../contexts/BookContext";
import {
  InputBookTitle,
  InputBookDesc,
  InputBookComment,
  InputBookRating,
} from "../components/forms";

import Button from "../components/Button";

const Home = () => {
  // コンポーネントが"BookContext.js"のBookContextのdispatch関数にアクセスできるようにする
  const dispatch = useDispatchBooks();

  // ページ遷移を行うためのuseNavigateフックを使用する
  const navigate = useNavigate();

  // 本の評価(rating)の初期値を1にして、useStateで管理する
  const [rating, setRating] = useState(1);
  // リアルタイムで本の評価(rating)の値を変更するための関数
  const handleChangeRating = (rating) => setRating(rating);

  // "useForm"という"react-hook-form"のメソッドを使って、フォームの入力を管理する
  // フォームの初期化
  // 分割代入を使って値を初期化する
  // register, handleSubmit, formState: {errors}, resetはReact Hook Formというライブラリが提供する機能
  // register関数は、フォームのフィールドをReact Hook Formに登録するために使用されます。これにより、フィールドの値の追跡、バリデーション、エラー処理が可能になります
  // handleSubmitは、フォームの送信処理を行う関数です。バリデーションが成功した場合にのみ、指定したコールバック関数を実行します。
  // errorsは、フォームのバリデーションエラーを管理するためのオブジェクトです。
  // resetは、フォームの入力をデフォルト値にリセットするための関数です。
  const { register, handleSubmit, formState: { errors }, reset, } = useForm({
    // criteriaMode: エラーの表示方法を設定します。
    // "firstError"（デフォルト）は各フィールドの最初のエラーのみを表示し、"all"はすべてのエラーを表示します
    criteriaMode: "firstError",
    // mode: バリデーションのタイミングを設定します。"onSubmit"（デフォルト）は送信時、
    // "onChange"は値が変更されるたび、"onBlur"はフィールドからフォーカスが外れたときにバリデーションを行います。
    mode: "onSubmit",
    // reValidateMode: エラー後の再バリデーションのタイミングを設定します。
    // デフォルトは"onChange"です。
    reValidateMode: "onSubmit",
  });

  const [error, setError] = useState("");
  const onSubmit = (formInputs) => {
    // 現在の本の評価(rating)の値をformInputsに追加する
    formInputs.rating = rating;

    // _newBookパラメータは、APIコールの結果として返される新しく作成された本のデータを表しています
    bookApi.post(formInputs).then((_newBook) => {
      // フォームで送られてきたBookのオブジェクトをBookContextに追加する
      dispatch({ type: "book/add", book: _newBook });
      // フォームの入力をリセットする
      reset();
      // 本の一覧ページに遷移する
      navigate("/books");
    }).catch((e) => {
      console.log('error occured!', e)
      setError(e);
    });

  };

  return (
    <div className="small-container">
      <h2 className="page-title">新規投稿フォーム</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <InputBookTitle register={register} errors={errors} />
        <InputBookDesc register={register} errors={errors} />
        <InputBookComment register={register} errors={errors} />
        {/* クリックで本の評価(rating)の値を変更する */}
        <InputBookRating rating={rating} onChange={handleChangeRating} />

        <div className="error-msg text-center">{error}</div>

        <div className="footer">
          <Button className="blue">追加する</Button>
        </div>
      </form>
    </div>
  );
};

export default Home;
