import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from 'app/models/bookTrackerError';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
              private title: Title,
              private route:ActivatedRoute) { }
  
  ngOnInit() {
    //this.allBooks = this.dataService.getAllBooks();
    /* this.dataService.getAllBooks()
    .subscribe(
      (data:Book[] | BookTrackerError) => this.allBooks = <Book[]>data,
      (err:BookTrackerError) => console.log(err.friendlyMessage),
      () => console.log('all books are fetched')
    ); */
    let resolvedData:Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks'];
    
    if(resolvedData instanceof BookTrackerError){
      console.log(`Dashboard Component Eror: ${resolvedData.friendlyMessage}`);
    }
    else{
      this.allBooks = resolvedData;
    }

    this.allReaders = this.dataService.getAllReaders();
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    //console.warn(`Delete book not yet implemented (bookID: ${bookID}).`);

    this.dataService.deleteBook(bookID)
    .subscribe(
      (data:void) => {
      let index : number = this.allBooks.findIndex(book => book.bookID === bookID);
      this.allBooks.splice(index, 1);
      },
      (err:any) => console.log(err),
      () => console.log("Deletion process done")
    )
  }

  deleteReader(readerID: number): void {
    console.warn(`Delete reader not yet implemented (readerID: ${readerID}).`);
  }

}
