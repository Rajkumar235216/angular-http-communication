import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Book } from 'app/models/book';
import { oldBook } from 'app/models/oldBook';
import { DataService } from 'app/core/data.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styles: []
})
export class EditBookComponent implements OnInit {

  selectedBook: Book;

  constructor(private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    let bookID: number = parseInt(this.route.snapshot.params['id']);
    //this.selectedBook = this.dataService.getBookById(bookID);
    this.dataService.getBookById(bookID)
    .subscribe(
      (data:Book) => this.selectedBook = data,
      (err:any) => console.log(err),
      () => console.log('fetched one record from books')
    );

    this.dataService.getoldBookById(bookID)
    .subscribe(
      (data:oldBook) => console.log(data),
      (err:any) => console.log(err),
      () => console.log('fetched one record from books')
    );
  }

  setMostPopular(): void {
    this.dataService.setMostPopularBook(this.selectedBook);
  }

  saveChanges(): void {
    //console.warn('Save changes to book not yet implemented.');
    this.dataService.updateBook(this.selectedBook)
    .subscribe(
      (data:void) => console.log(this.selectedBook.author + "updated successfully"),
      (err:any) => console.log(err),
      () => console.log("updating of book successfull")
    );
  }
}
