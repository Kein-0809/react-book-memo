import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../utils/config";
import bookApi from "../api/book";

import Button from "../components/Button";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";

const ModalPortal = ({ children }) => {
  const target = document.querySelector(".container");
  return createPortal(children, target);
};

const Book = () => {
  const { id } = useParams();

  const [book, setBook] = useState({});
  const [error, setError] = useState('');

  // まず初めにページが読み込まれたら、APIから本の情報を取得する
  useEffect(() => {
    bookApi.get(id).then((_book) => {
      setBook(_book);
    }).catch((e) => {
      console.log('error occured!', e);
      setError('URLが不正です。');
    });
  }, []);

  // "編集"ボタンによって編集モーダルの状態を管理する
  // (prev) => !prevは、現在の状態の反対の値を設定します（trueならfalse、falseならtrue）
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

  // "削除"ボタンによって削除モーダルの状態を管理する
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  // "一覧"ボタンによって"/books"に戻るためのナビゲーションを管理する
  const navigate = useNavigate();
  const goToBooksPage = () => navigate("/books");

  return (
    <>
      <div className="detail">
        <h3 className="book-title">{book.title}</h3>
        <div className="error-msg text-center">{error}</div>

        <div className="sub-title">本の概要</div>
        <p className="text">{book.description}</p>

        <div className="sub-title">本の感想</div>
        <p className="text">{book.comment}</p>

        <div className="sub-title">本の評価</div>
        <div className="detail__stars">
          {
            <Rating
              emptySymbol={
                <FontAwesomeIcon icon={faStar} color={COLORS.star.empty} />
              }
              fullSymbol={
                <FontAwesomeIcon icon={faStar} color={COLORS.star.full} />
              }
              fractions={1} // 星をいくつに分割するか。2にしたら星の半分も評価に入る
              initialRating={book.rating}
              readonly={true}
            />
          }
        </div>

        <div className="footer">
          <Button className="blue mr-16" onClick={toggleEditModal}>
            編集
          </Button>
          <Button className="red" onClick={toggleDeleteModal}>
            削除
          </Button>
        </div>
      </div>

      {/* 編集モーダルが開いている場合、編集モーダルを表示する */}
      {isEditModalOpen && (
        <ModalPortal>
          <EditModal
            book={book}
            setBook={setBook}
            toggleEditModal={toggleEditModal}
          />
        </ModalPortal>
      )}

      {/* 削除モーダルが開いている場合、削除モーダルを表示する */}
      {isDeleteModalOpen && (
        <ModalPortal>
          <DeleteModal book={book} toggleDeleteModal={toggleDeleteModal} />
        </ModalPortal>
      )}

      <div className="detail__btnToBooks">
        <Button className="gray" onClick={goToBooksPage}>
          一覧へ
        </Button>
      </div>
    </>
  );
};

export default Book;
