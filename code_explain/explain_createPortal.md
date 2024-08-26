# createModalとMordalPortalについての説明

これらのコードについて詳しく説明いたします。

1. 状態管理とトグル関数:

```javascript
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
```

- `isEditModalOpen`と`isDeleteModalOpen`は、それぞれ編集モーダルと削除モーダルの表示状態を管理するための状態変数です。
- `toggleEditModal`と`toggleDeleteModal`は、各モーダルの表示状態を切り替えるための関数です。
- `(prev) => !prev`は、現在の状態の反対の値を設定します（trueならfalse、falseならtrue）。

2. ナビゲーション関数:

```javascript
const navigate = useNavigate();
const goToBooksPage = () => navigate("/books");
```

- `useNavigate`はReact Routerのフックで、プログラムによるナビゲーションを可能にします。
- `goToBooksPage`関数は、"/books"ページへのナビゲーションを行います。

3. ボタンとモーダルの表示:

```jsx
<div className="footer">
  <Button className="blue mr-16" onClick={toggleEditModal}>
    編集
  </Button>
  <Button className="red" onClick={toggleDeleteModal}>
    削除
  </Button>
</div>
```

- 「編集」ボタンをクリックすると`toggleEditModal`が呼び出され、編集モーダルの表示状態が切り替わります。
- 「削除」ボタンをクリックすると`toggleDeleteModal`が呼び出され、削除モーダルの表示状態が切り替わります。

4. モーダルの条件付きレンダリング:

```jsx
{isEditModalOpen && (
  <ModalPortal>
    <EditModal
      book={book}
      setBook={setBook}
      toggleEditModal={toggleEditModal}
    />
  </ModalPortal>
)}

{isDeleteModalOpen && (
  <ModalPortal>
    <DeleteModal book={book} toggleDeleteModal={toggleDeleteModal} />
  </ModalPortal>
)}
```

- `isEditModalOpen`が`true`の場合のみ、編集モーダルが表示されます。
- `isDeleteModalOpen`が`true`の場合のみ、削除モーダルが表示されます。
- モーダルは`ModalPortal`コンポーネントを通じてレンダリングされ、DOM内の別の場所に配置されます。
- 各モーダルには必要なプロップ（本の情報、状態更新関数、トグル関数など）が渡されています。

5. 一覧ページへの戻るボタン:

```jsx
<div className="detail__btnToBooks">
  <Button className="gray" onClick={goToBooksPage}>
    一覧へ
  </Button>
</div>
```

- 「一覧へ」ボタンをクリックすると`goToBooksPage`関数が呼び出され、本の一覧ページにナビゲートします。

これらのコードは、本の詳細ページにおいて、編集・削除機能へのアクセス、モーダルの表示制御、そして一覧ページへの戻る機能を提供しています。ユーザーインターフェースの操作性と状態管理を効果的に組み合わせて実装されています。

このコードについて説明いたします。

[ModalPortal](file:///home/kane/dev/99_bookshelf/src/pages/Book.js#15%2C7-15%2C7)は、Reactの[createPortal](file:///home/kane/dev/99_bookshelf/src/pages/Book.js#17%2C10-17%2C10)を使用してモーダルウィンドウを実装するためのコンポーネントです。

1. [ModalPortal](file:///home/kane/dev/99_bookshelf/src/pages/Book.js#15%2C7-15%2C7)の定義:
   - 関数コンポーネントとして定義されています。
   - [children](file:///home/kane/dev/99_bookshelf/src/contexts/BookContext.js#68%2C25-68%2C25)プロップを受け取ります。これは、ポータル経由でレンダリングされる内容を表します。

2. `document.querySelector(".container")`:
   - DOMから`.container`クラスを持つ要素を選択します。
   - これがポータルの対象となる要素（ターゲット）です。

3. `createPortal(children, target)`:
   - Reactの`createPortal`関数を使用しています。
   - `children`（ポータルの内容）を`target`（`.container`要素）にレンダリングします。

4. ポータルの役割:
   - 通常のReactのレンダリングツリーの外部にコンポーネントをレンダリングすることができます。
   - これは特にモーダルウィンドウやツールチップなど、親コンポーネントのDOM階層外に表示したい要素に有用です。

使用例：
```jsx
{isModalOpen && (
  <ModalPortal>
    <ModalContent />
  </ModalPortal>
)}
```

この例では、`isModalOpen`が`true`の時、`ModalContent`が`.container`要素内にレンダリングされます。これにより、モーダルを親コンポーネントのz-indexやoverflow設定に関係なく表示することができます。

ポータルを使用することで、モーダルやダイアログなどのUIコンポーネントをアプリケーションの主要なDOM階層外に配置しつつ、Reactのイベント系統内に保持することができます。これにより、柔軟なレイアウト管理とイベントハンドリングが可能になります。