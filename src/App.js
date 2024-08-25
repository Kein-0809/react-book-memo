import { BrowserRouter, Routes, Route } from "react-router-dom";

import { BookProvider } from "./contexts/BookContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Book from "./pages/Book";
import Page404 from "./pages/Page404";

const App = () => {
  return (
    <BrowserRouter>
      <BookProvider>
        <Header />
        <div className="container">
          <Routes>
            {/* URLのパスによって表示するコンポーネントを変える */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            {/* /books/1 のようにURLにIDが含まれている場合は、:idという名前のパスパラメータを定義します。 */}
            {/* Dynamic Routingという */}
            <Route path="/books/:id" element={<Book />} />
            <Route path="/*" element={<Page404 />} />
          </Routes>
        </div>
      </BookProvider>
    </BrowserRouter>
  );
};

export default App;
