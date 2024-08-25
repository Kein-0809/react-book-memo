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

export { useBooks, useDispatchBooks, BookProvider };
