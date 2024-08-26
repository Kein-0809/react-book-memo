# useFormの使い方について

react-hook-formとuseFormの使い方について詳しく説明いたします。

react-hook-formは、Reactアプリケーションでフォーム処理を簡単に行うためのライブラリです。useFormはreact-hook-formの主要なフックで、フォームの状態管理や検証を行うために使用されます。

useFormの基本的な使い方は以下の通りです:

1. フォームの初期化:

```javascript
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  criteriaMode: "firstError",
  mode: "onSubmit",
  reValidateMode: "onSubmit",
});
```

2. オプションの説明:

- `criteriaMode`: エラーの表示方法を設定します。"firstError"（デフォルト）は各フィールドの最初のエラーのみを表示し、"all"はすべてのエラーを表示します。

- `mode`: バリデーションのタイミングを設定します。"onSubmit"（デフォルト）は送信時、"onChange"は値が変更されるたび、"onBlur"はフィールドからフォーカスが外れたときにバリデーションを行います。

- `reValidateMode`: エラー後の再バリデーションのタイミングを設定します。デフォルトは"onChange"です。

3. フォームフィールドの登録:

```javascript
<input {...register("username", { required: "ユーザー名は必須です" })} />
```

`register`関数を使用してフィールドを登録し、バリデーションルールを設定します。

4. フォームの送信処理:

```javascript
const onSubmit = (data) => {
  console.log(data);
};

<form onSubmit={handleSubmit(onSubmit)}>
  {/* フォームフィールド */}
  <button type="submit">送信</button>
</form>
```

`handleSubmit`関数でフォームの送信を処理します。

5. エラー表示:

```javascript
{errors.username && <span>{errors.username.message}</span>}
```

`errors`オブジェクトを使用してバリデーションエラーを表示します。

6. フォームのリセット:

```javascript
reset();
```

`reset`関数を使用してフォームをリセットできます。

useFormは非常に柔軟で、多くのオプションがあります。詳細な使用方法や高度な機能については、[公式ドキュメント](https://react-hook-form.com/docs/useform)を参照することをお勧めします。

また、制御されたコンポーネントを使用する場合は、`useController`フックを使用することもできます。これは個々の制御されたフィールド/入力に対して使用されます。

[公式ドキュメント](https://react-hook-form.com/docs/useform)によると、useFormは以下のような機能も提供しています：

- デフォルト値の設定
- 非同期バリデーション
- フォーカス管理
- エラーの遅延表示
- カスタムバリデーションスキーマの使用

react-hook-formは、パフォーマンスと使いやすさを重視して設計されており、多くのReactプロジェクトでフォーム処理に広く使用されています。

# Q. register, handleSubmit, formState: {errors}, resetについて教えてください

[useForm](file:///home/kane/dev/99_bookshelf/src/pages/Home.js#29%2C7-29%2C7)フックから返される[register](file:///home/kane/dev/99_bookshelf/src/pages/Home.js#25%2C5-25%2C5), [handleSubmit](file:///home/kane/dev/99_bookshelf/src/pages/Home.js#26%2C5-26%2C5), `formState: { errors }`, `reset`の各機能について説明いたします。

1. `register`:
`register`関数は、フォームのフィールドをReact Hook Formに登録するために使用されます。これにより、フィールドの値の追跡、バリデーション、エラー処理が可能になります。

使用例：
```javascript
<input {...register("username", { required: "ユーザー名は必須です" })} />
```

2. `handleSubmit`:
`handleSubmit`は、フォームの送信処理を行う関数です。バリデーションが成功した場合にのみ、指定したコールバック関数を実行します。

使用例：
```javascript
<form onSubmit={handleSubmit(onSubmit)}>
```

3. `formState: { errors }`:
`errors`オブジェクトには、フォームのバリデーションエラーが格納されます。各フィールドのエラーメッセージを表示するのに使用できます。

使用例：
```javascript
{errors.username && <span>{errors.username.message}</span>}
```

4. `reset`:
`reset`関数は、フォームをデフォルト値にリセットするために使用されます。フォームの送信後やキャンセル時に呼び出すことができます。

使用例：
```javascript
const onSubmit = (data) => {
  console.log(data);
  reset(); // フォームをリセット
};
```

これらの機能を使用することで、効率的にフォームの状態を管理し、バリデーションを行うことができます。詳細な情報は[React Hook Formの公式ドキュメント](https://react-hook-form.com/api)で確認できます。

# Q. register, handleSubmit, formState: {errors}, resetはReactにもともと備わっている機能ですか?

いいえ、[register](file:///home/kane/dev/99_bookshelf/src/pages/Home.js#25%2C5-25%2C5), [handleSubmit](file:///home/kane/dev/99_bookshelf/src/pages/Home.js#26%2C5-26%2C5), `formState: {errors}`, `reset`はReactの標準機能ではありません。これらは[React Hook Form](https://react-hook-form.com/)というライブラリが提供する機能です。

React Hook Formは、Reactアプリケーションでフォーム処理を簡単に行うためのサードパーティのライブラリです。このライブラリを使用することで、フォームの状態管理やバリデーションを効率的に行うことができます。

これらの機能の概要は以下の通りです：

1. `register`: フォームのフィールドをReact Hook Formに登録するための関数です。

2. `handleSubmit`: フォームの送信処理を行う関数です。バリデーションが成功した場合にのみ、指定したコールバック関数を実行します。

3. `formState: {errors}`: フォームのバリデーションエラーを含むオブジェクトです。

4. `reset`: フォームの入力をデフォルト値にリセットするための関数です。

これらの機能の詳細な使用方法は、[React Hook Formの公式ドキュメント](https://react-hook-form.com/docs/useform)で確認できます。

React Hook Formを使用することで、フォーム処理に関連する多くのボイラープレートコードを削減し、パフォーマンスの最適化されたフォーム処理を実現することができます。

[出典: https://react-hook-form.com/docs/useform/formstate]