# Q. useBooksの中ではどのようにしてbooksのデータを取得しているのですか?

[useBooks](file:///home/kane/dev/99_bookshelf/code_explain/explain_useBooks_and_useDispatchBooks.md#1%2C28-1%2C28)がどのようにして[books](file:///home/kane/dev/99_bookshelf/code_explain/explain_useBooks_and_useDispatchBooks.md#43%2C18-43%2C18)のデータを得ているかについて説明します。

[useBooks](file:///home/kane/dev/99_bookshelf/code_explain/explain_useBooks_and_useDispatchBooks.md#1%2C28-1%2C28)関数は以下のように定義されています：


```27:27:src/contexts/BookContext.js
// contextsフォルダには主に、Reactアプリケーション全体で共有される状態（state）や機能を管理するためのコンテキストファイルが含まれます。
// ReactのContext APIを使用してFluxに似たデザインパターンを実装
//? このファイルはState(状態)を管理するためのコンテキストファイルの役割と
//? アクションのタイプに応じて、現在の状態を新しい状態に更新する方法を定義するReducerの役割を持つ
//? つまり、このファイルではStateとReducer両方を管理するStoreの役割を果たす。
//? Store = Reducer + State

import { useEffect, useContext, createContext, useReducer } from "react";

import bookApi from "../api/book";
import { useState } from 'react';

// createContext()はReactのコンポーネント間で値を共有するための仕組み
// propsを使ってコンポーネント間で値を共有するのは面倒なので、createContext()を使ってコンポーネント間で値を共有する
// propsを使って値を他のコンポーネントと共有するとバケツリレーのようになって複雑で面倒になる

// 本の追加・更新・削除・初期化のコンテキスト
// 他のコンポーネントにpropsのバケツリレー無しに共有できる値(グローバルなprops)をcreateContext()で作成する
// それらを使う際に必要な変数名を"BookContext"と"BookDispatchContext"としている
// それらの名前を使って他のコンポーネントで値を参照する
const BookContext = createContext();
const BookDispatchContext = createContext();

//! 他のファイルからstateを参照できるようにエクスポート
//! useBooksを使用することで、コンポーネントは現在の本のリスト（books状態）にアクセスできます。
//!使用例: "const books = useBooks();""
const useBooks = () => useContext(BookContext);
//! useDispatchBooksを使用することで、コンポーネントはdispatch関数にアクセスでき、本のリストを更新するアクションをディスパッチできます。
//! 使用例: "const dispatch = useDispatchBooks();"
//! 使用例: "dispatch({ type: "book/add", book: newBook });"
const useDispatchBooks = () => useContext(BookDispatchContext);

// useReducer()の第一引数に与えられる関数
// "book/init","book/add","book/delete","book/update"はswitch文の条件分岐の判断材料として
// 使用するためにただただそのように命名しているだけ
//? この関数がReducerの役割を果たす
//? これは現在の状態と実行されたアクションに基づいて新しい状態を計算します。
const reducer = (books, action) => {
  switch (action.type) {
    case "book/init":
      // 初期化時に全ての本のリストを設定します
      return action.books;

    case "book/add":
      // 新しい本を既存のリストの先頭に追加します
      return [action.book, ...books];

    case "book/delete":
      // 指定されたIDの本をリストから削除します
      return books.filter((_book) => _book._id !== action.book._id);

    case "book/update":
      // 指定された本の情報を更新し、リストの先頭に移動させます
      const updatedBooks = books.filter(
        (_book) => _book._id !== action.book._id
      );
      updatedBooks.unshift(action.book);
      return updatedBooks;

    default:
      return books;
  }
};

// ------------------------------------------------------------------------------------------------

//? 明示的なストアは定義されていませんが、BookProviderコンポーネントが実質的にStoreの役割を果たしています
const BookProvider = ({ children }) => {
  // useReducerはuseStateと同じReactで使う値の状態管理の機能を持つ
  // useReducer は useState と同様に状態管理のために使用されますが、より複雑な状態ロジックを扱うのに適している
  // 違いはuseReducerではdispatchを使ってstateを更新する
  // つまりuseReducerは関数でstateを管理する
  // useStateは値をそのままstateとして管理する
  // dispatchはuseReducer()の第一引数に置いた関数を実行する
  // dispatchはuseReducer()の第一引数に置いた関数の中にactionを引数に取り、そのactionに応じてstateを更新する
  // reducer 関数と初期状態（空の配列 []）を引数として受け取ります。
  // books は現在の状態、dispatch は状態を更新するための関数です。
  //? この行でbooksという状態が定義されています。これがアプリケーション全体で共有される本のリストを表しています。
  const [books, dispatch] = useReducer(reducer, []);

  // 初期化
  // コンポーネントのマウント時に実行されます。

  useEffect(() => {
    // bookApi.getAll() を呼び出して全ての本の情報を取得します
    // "_books"はseeds/books.jsonのようなデータが返ってくる
    bookApi.getAll().then((_books) => {
      dispatch({ type: "book/init", books: _books });
    });
  }, []);

  // コンテキストを使うために、BookContext.ProviderとBookDispatchContext.Providerを使う
  // それらのvalueには、それぞれのコンテキストの値を渡す
  return (
    // "const BookContext = createContext()"で作成したBookContextを使う
    <BookContext.Provider value={books}>
      {/* "const BookDispatchContext = createContext()"で作成したBookDispatchContextを使う */}
      <BookDispatchContext.Provider value={dispatch}>
        {children}
      </BookDispatchContext.Provider>
    </BookContext.Provider>
  );
};
```


この関数は`useContext(BookContext)`を呼び出しています。`BookContext`の値は`BookProvider`コンポーネント内で設定されています：


```96:96:src/contexts/BookContext.js
// contextsフォルダには主に、Reactアプリケーション全体で共有される状態（state）や機能を管理するためのコンテキストファイルが含まれます。
// ReactのContext APIを使用してFluxに似たデザインパターンを実装
//? このファイルはState(状態)を管理するためのコンテキストファイルの役割と
//? アクションのタイプに応じて、現在の状態を新しい状態に更新する方法を定義するReducerの役割を持つ
//? つまり、このファイルではStateとReducer両方を管理するStoreの役割を果たす。
//? Store = Reducer + State

import { useEffect, useContext, createContext, useReducer } from "react";

import bookApi from "../api/book";
import { useState } from 'react';

// createContext()はReactのコンポーネント間で値を共有するための仕組み
// propsを使ってコンポーネント間で値を共有するのは面倒なので、createContext()を使ってコンポーネント間で値を共有する
// propsを使って値を他のコンポーネントと共有するとバケツリレーのようになって複雑で面倒になる

// 本の追加・更新・削除・初期化のコンテキスト
// 他のコンポーネントにpropsのバケツリレー無しに共有できる値(グローバルなprops)をcreateContext()で作成する
// それらを使う際に必要な変数名を"BookContext"と"BookDispatchContext"としている
// それらの名前を使って他のコンポーネントで値を参照する
const BookContext = createContext();
const BookDispatchContext = createContext();

//! 他のファイルからstateを参照できるようにエクスポート
//! useBooksを使用することで、コンポーネントは現在の本のリスト（books状態）にアクセスできます。
//!使用例: "const books = useBooks();""
const useBooks = () => useContext(BookContext);
//! useDispatchBooksを使用することで、コンポーネントはdispatch関数にアクセスでき、本のリストを更新するアクションをディスパッチできます。
//! 使用例: "const dispatch = useDispatchBooks();"
//! 使用例: "dispatch({ type: "book/add", book: newBook });"
const useDispatchBooks = () => useContext(BookDispatchContext);

// useReducer()の第一引数に与えられる関数
// "book/init","book/add","book/delete","book/update"はswitch文の条件分岐の判断材料として
// 使用するためにただただそのように命名しているだけ
//? この関数がReducerの役割を果たす
//? これは現在の状態と実行されたアクションに基づいて新しい状態を計算します。
const reducer = (books, action) => {
  switch (action.type) {
    case "book/init":
      // 初期化時に全ての本のリストを設定します
      return action.books;

    case "book/add":
      // 新しい本を既存のリストの先頭に追加します
      return [action.book, ...books];

    case "book/delete":
      // 指定されたIDの本をリストから削除します
      return books.filter((_book) => _book._id !== action.book._id);

    case "book/update":
      // 指定された本の情報を更新し、リストの先頭に移動させます
      const updatedBooks = books.filter(
        (_book) => _book._id !== action.book._id
      );
      updatedBooks.unshift(action.book);
      return updatedBooks;

    default:
      return books;
  }
};

// ------------------------------------------------------------------------------------------------

//? 明示的なストアは定義されていませんが、BookProviderコンポーネントが実質的にStoreの役割を果たしています
const BookProvider = ({ children }) => {
  // useReducerはuseStateと同じReactで使う値の状態管理の機能を持つ
  // useReducer は useState と同様に状態管理のために使用されますが、より複雑な状態ロジックを扱うのに適している
  // 違いはuseReducerではdispatchを使ってstateを更新する
  // つまりuseReducerは関数でstateを管理する
  // useStateは値をそのままstateとして管理する
  // dispatchはuseReducer()の第一引数に置いた関数を実行する
  // dispatchはuseReducer()の第一引数に置いた関数の中にactionを引数に取り、そのactionに応じてstateを更新する
  // reducer 関数と初期状態（空の配列 []）を引数として受け取ります。
  // books は現在の状態、dispatch は状態を更新するための関数です。
  //? この行でbooksという状態が定義されています。これがアプリケーション全体で共有される本のリストを表しています。
  const [books, dispatch] = useReducer(reducer, []);

  // 初期化
  // コンポーネントのマウント時に実行されます。

  useEffect(() => {
    // bookApi.getAll() を呼び出して全ての本の情報を取得します
    // "_books"はseeds/books.jsonのようなデータが返ってくる
    bookApi.getAll().then((_books) => {
      dispatch({ type: "book/init", books: _books });
    });
  }, []);

  // コンテキストを使うために、BookContext.ProviderとBookDispatchContext.Providerを使う
  // それらのvalueには、それぞれのコンテキストの値を渡す
  return (
    // "const BookContext = createContext()"で作成したBookContextを使う
    <BookContext.Provider value={books}>
      {/* "const BookDispatchContext = createContext()"で作成したBookDispatchContextを使う */}
      <BookDispatchContext.Provider value={dispatch}>
        {children}
      </BookDispatchContext.Provider>
    </BookContext.Provider>
  );
};
```


ここで、`BookContext.Provider`の`value`プロップに`books`が渡されています。この`books`は`useReducer`フックによって管理される状態です：


```79:79:src/contexts/BookContext.js
// contextsフォルダには主に、Reactアプリケーション全体で共有される状態（state）や機能を管理するためのコンテキストファイルが含まれます。
// ReactのContext APIを使用してFluxに似たデザインパターンを実装
//? このファイルはState(状態)を管理するためのコンテキストファイルの役割と
//? アクションのタイプに応じて、現在の状態を新しい状態に更新する方法を定義するReducerの役割を持つ
//? つまり、このファイルではStateとReducer両方を管理するStoreの役割を果たす。
//? Store = Reducer + State

import { useEffect, useContext, createContext, useReducer } from "react";

import bookApi from "../api/book";
import { useState } from 'react';

// createContext()はReactのコンポーネント間で値を共有するための仕組み
// propsを使ってコンポーネント間で値を共有するのは面倒なので、createContext()を使ってコンポーネント間で値を共有する
// propsを使って値を他のコンポーネントと共有するとバケツリレーのようになって複雑で面倒になる

// 本の追加・更新・削除・初期化のコンテキスト
// 他のコンポーネントにpropsのバケツリレー無しに共有できる値(グローバルなprops)をcreateContext()で作成する
// それらを使う際に必要な変数名を"BookContext"と"BookDispatchContext"としている
// それらの名前を使って他のコンポーネントで値を参照する
const BookContext = createContext();
const BookDispatchContext = createContext();

//! 他のファイルからstateを参照できるようにエクスポート
//! useBooksを使用することで、コンポーネントは現在の本のリスト（books状態）にアクセスできます。
//!使用例: "const books = useBooks();""
const useBooks = () => useContext(BookContext);
//! useDispatchBooksを使用することで、コンポーネントはdispatch関数にアクセスでき、本のリストを更新するアクションをディスパッチできます。
//! 使用例: "const dispatch = useDispatchBooks();"
//! 使用例: "dispatch({ type: "book/add", book: newBook });"
const useDispatchBooks = () => useContext(BookDispatchContext);

// useReducer()の第一引数に与えられる関数
// "book/init","book/add","book/delete","book/update"はswitch文の条件分岐の判断材料として
// 使用するためにただただそのように命名しているだけ
//? この関数がReducerの役割を果たす
//? これは現在の状態と実行されたアクションに基づいて新しい状態を計算します。
const reducer = (books, action) => {
  switch (action.type) {
    case "book/init":
      // 初期化時に全ての本のリストを設定します
      return action.books;

    case "book/add":
      // 新しい本を既存のリストの先頭に追加します
      return [action.book, ...books];

    case "book/delete":
      // 指定されたIDの本をリストから削除します
      return books.filter((_book) => _book._id !== action.book._id);

    case "book/update":
      // 指定された本の情報を更新し、リストの先頭に移動させます
      const updatedBooks = books.filter(
        (_book) => _book._id !== action.book._id
      );
      updatedBooks.unshift(action.book);
      return updatedBooks;

    default:
      return books;
  }
};

// ------------------------------------------------------------------------------------------------

//? 明示的なストアは定義されていませんが、BookProviderコンポーネントが実質的にStoreの役割を果たしています
const BookProvider = ({ children }) => {
  // useReducerはuseStateと同じReactで使う値の状態管理の機能を持つ
  // useReducer は useState と同様に状態管理のために使用されますが、より複雑な状態ロジックを扱うのに適している
  // 違いはuseReducerではdispatchを使ってstateを更新する
  // つまりuseReducerは関数でstateを管理する
  // useStateは値をそのままstateとして管理する
  // dispatchはuseReducer()の第一引数に置いた関数を実行する
  // dispatchはuseReducer()の第一引数に置いた関数の中にactionを引数に取り、そのactionに応じてstateを更新する
  // reducer 関数と初期状態（空の配列 []）を引数として受け取ります。
  // books は現在の状態、dispatch は状態を更新するための関数です。
  //? この行でbooksという状態が定義されています。これがアプリケーション全体で共有される本のリストを表しています。
  const [books, dispatch] = useReducer(reducer, []);

  // 初期化
  // コンポーネントのマウント時に実行されます。

  useEffect(() => {
    // bookApi.getAll() を呼び出して全ての本の情報を取得します
    // "_books"はseeds/books.jsonのようなデータが返ってくる
    bookApi.getAll().then((_books) => {
      dispatch({ type: "book/init", books: _books });
    });
  }, []);

  // コンテキストを使うために、BookContext.ProviderとBookDispatchContext.Providerを使う
  // それらのvalueには、それぞれのコンテキストの値を渡す
  return (
    // "const BookContext = createContext()"で作成したBookContextを使う
    <BookContext.Provider value={books}>
      {/* "const BookDispatchContext = createContext()"で作成したBookDispatchContextを使う */}
      <BookDispatchContext.Provider value={dispatch}>
        {children}
      </BookDispatchContext.Provider>
    </BookContext.Provider>
  );
};
```


そして、この`books`の初期値は空の配列`[]`ですが、コンポーネントのマウント時に`useEffect`フックを使用して`bookApi.getAll()`を呼び出し、本のデータを取得しています：


```84:90:src/contexts/BookContext.js
  useEffect(() => {
    // bookApi.getAll() を呼び出して全ての本の情報を取得します
    // "_books"はseeds/books.jsonのようなデータが返ってくる
    bookApi.getAll().then((_books) => {
      dispatch({ type: "book/init", books: _books });
    });
  }, []);
```


このように、`useBooks`は直接的にデータを取得するのではなく、`BookProvider`によって提供されるコンテキストの値にアクセスしています。`BookProvider`がアプリケーションのルートに近い場所で使用されていれば、その子孫コンポーネントはどこでも`useBooks`を使用して現在の`books`の状態にアクセスできます。

このパターンは、Reactのコンテキストを使用した状態管理の一般的な方法です。データの流れは以下のようになります：

1. `BookProvider`が`books`状態を管理し、更新します。
2. `books`の値が`BookContext.Provider`を通じて提供されます。
3. 子孫コンポーネントは`useBooks`（内部で`useContext(BookContext)`を使用）を呼び出すことで、この`books`の値にアクセスできます。