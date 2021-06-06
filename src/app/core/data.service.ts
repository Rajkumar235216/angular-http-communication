import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Operator, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { oldBook } from 'app/models/oldBook'
import { BookTrackerError } from 'app/models/bookTrackerError';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  allBooks: Book[];

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    //return allBooks;
    console.log('getting all the data from books');
   // return this.http.get<Book[]>('/api/books');
   return this.http.get<Book[]>('/api/books')
   .pipe(
     catchError(err=> this.handlehttpErrors(err))
   );
    
  }

  private handlehttpErrors(error: HttpErrorResponse):Observable<BookTrackerError>{
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = "An error occurred when retrieving data";
    return throwError(dataError);
  }

  getBookById(id: number): Observable<Book> {
    //return allBooks.find(book => book.bookID === id);

    return this.http.get<Book>(`/api/books/${id}`,{
      headers: new HttpHeaders({
        'Accept' : 'application/JSON',
        'authorization': 'my-token'
      })
    });
  }  

  getoldBookById(id: number): Observable<oldBook> {
    //return allBooks.find(book => book.bookID === id);

    return this.http.get<Book>(`/api/books/${id}`)
    .pipe(
      map(b=><oldBook>{
        bookTitle:b.title,
        year:b.publicationYear,
        }),
      tap(classicBook => console.log(classicBook))
    );
  }

  addBook(newBook:Book): Observable<Book>{
    return this.http.post<Book>(`/api/books/`, newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  
  updateBook(updatedBook:Book): Observable<void>{
    return this.http.put<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteBook(bookID:number):Observable<void>{
    return this.http.delete<void>(`/api/books/${bookID}`);
  }
}


