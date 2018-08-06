import React from 'react'

const handleChange = (event, book, onUpdateBook) => {
  book.shelf = event.target.value;
  onUpdateBook(book);
}

const getThumbnail = (book) => {
  if (typeof(book.imageLinks) !== 'undefined') {
    return book.imageLinks.smallThumbnail;
  } else {
    return 'http://via.placeholder.com/128x193?text=No%20Cover'
  }
}

const Book = (props) => {
  const { book, onUpdateBook } = props;
  return(
    <div className="book">
      <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${getThumbnail(book)})` }}></div>
        <div className="book-shelf-changer">
          <select value={book.shelf ? book.shelf === 'none' ? 'move' : book.shelf : "move"} onChange={(event) => {handleChange(event, book, onUpdateBook)}}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors ? book.authors.join(', ') : ''}</div>
    </div>
  )
}

export default Book;
