import React from 'react'
import { Route, Link } from 'react-router-dom'
import debounce from 'lodash/debounce'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import Search from './Search'

class BooksApp extends React.Component {
  //Initial state
  state = {
    query: '',
    books: [],
    results: []
  }

  //Find all the books based on a query.
  updateQuery = (query) => {
    this.setState(state => ({ query: query }));
    if(query !== '') {
      this.searchBooks(query);
    } else {
      this.setState({ results: [] });
    }
  }

  // Make sure the API is only called 250ms after last call.
  searchBooks = debounce((query) => {
      BooksAPI.search(query).then((books) => {
        if (this.state.query !== '' && books.error === undefined) {
          // Make sure the search results are showing the correct shelf.
          books = this.setResultsShelf(this.state.books, books);
          this.setState((query) => ({ results: books }));
        } else {
          this.setState({ results: [] });
        }
    })
  }, 250);

  // Give all the books that already have state in the main page the
  // correct shelf in the search page.
  setResultsShelf = (books, results) => {
    results.forEach((result) => {
      books.forEach((book) => {
        if (book.id === result.id) {
          result.shelf = book.shelf;
        }
      })
    })
    return results;
  }

  //Update the book with the API and set the state.
  updateBook = (updatedBook) => {
    BooksAPI.update(updatedBook, updatedBook.shelf).then((updates) => {
      this.setState((state) => ({ books: state.books.filter((book) => {
        return book.id !== updatedBook.id;
      }).concat(updatedBook) }));
      console.log(`The book with title ${updatedBook.title} is put on shelf ${updatedBook.shelf}`);
    });
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books: books})
    })
  }

  render() {
    return (
      <div className="app">
        <Route path='/search' render={() => (
          <Search books={this.state.results}
            query={this.state.query}
            onUpdateBook={(book, shelf) => { this.updateBook(book, shelf)}}
            onUpdateQuery={(query) => { this.updateQuery(query)}}
          />
        )}/>
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf shelf='currentlyReading'
                  books={this.state.books.filter((book) => book.shelf === 'currentlyReading')}
                  onUpdateBook={(book, shelf) => { this.updateBook(book, shelf) }}/>
                <BookShelf shelf='wantToRead'
                  books={this.state.books.filter((book) => book.shelf === 'wantToRead')}
                  onUpdateBook={(book, shelf) => { this.updateBook(book, shelf) }}/>
                <BookShelf shelf='read'
                  books={this.state.books.filter((book) => book.shelf === 'read')}
                  onUpdateBook={(book, shelf) => { this.updateBook(book, shelf) }}/>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
