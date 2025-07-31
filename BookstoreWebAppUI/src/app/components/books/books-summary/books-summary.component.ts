import { Component, OnInit } from '@angular/core';
import { BooksSummary } from '../../../models/booksSummary.model';
import { BooksService } from '../../../services/books.service';

@Component({
  selector: 'app-books-summary',
  standalone: false,
  templateUrl: './books-summary.component.html',
  styleUrl: './books-summary.component.css'
})
export class BooksSummaryComponent implements OnInit {

  booksSummary:BooksSummary[]=[];

  constructor(private booksService:BooksService){}
  ngOnInit(): void {
    this.booksService.getBooksSummary().subscribe({

      next:(books) =>{
        this.booksSummary = books;
        console.log(this.booksSummary);
      },
      error:(response) =>{
        console.log(response);
      }
    });
  }

}
