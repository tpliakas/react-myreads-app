import React from 'react'
import Book from './Book'
import { shelfMap } from './ShelfMap'

let BookShelf = (props) => {

  const { books, shelf, onUpdateBook } = props;

  return (
    <div className="bookshelf">
      {shelf &&
      (<h2 className="bookshelf-title">{shelfMap[shelf]}</h2>)}
      <div className="bookshelf-books">
        <ol className="books-grid">
          { books.length > 0 &&
            books
            .map((book) => (
              <li key={book.id}>
                <Book book={book} onUpdateBook={onUpdateBook}/>
              </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default BookShelf;
