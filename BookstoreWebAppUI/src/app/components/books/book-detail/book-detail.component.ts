import { Component, OnInit } from '@angular/core';
import { BookDetail } from '../../../models/BookDetail.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../../services/books.service';

@Component({
  selector: 'app-book-detail',
  standalone: false,
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
bookDetail:BookDetail = {
    bookId:'',
    title:'',
    author:'',
    synopsis:'',
    publishedOn: '',
    publishedBy:'',
    price:0,
    isbnNumber:''

}
constructor(private router:Router,private route:ActivatedRoute,private bookService:BooksService){}
ngOnInit(): void {

  this.route.paramMap.subscribe({
    next:(params) =>{
      const isbnNumber = params.get('ISBNNumber');

      if(isbnNumber){
        this.bookService.getBookDetail(isbnNumber).subscribe({
          next:(bookDetail) =>{
            //console.log(bookDetail);
            //console.log("Published On is :", bookDetail.publishedOn);
            this.bookDetail = bookDetail;
            if(this.bookDetail.publishedOn){
              
              //this.bookDetail.publishedOn = new Date(this.bookDetail.publishedOn);
              const formattedDate = new Date(this.bookDetail.publishedOn);
              const newformattedDate = formattedDate.toISOString().split('T')[0];
              this.bookDetail.publishedOn = newformattedDate;
              //console.log("AFter formatting :", this.bookDetail.publishedOn);
            }
         //console.log("The value of the Published On is: ",this.bookDetail.publishedOn);
            
          },
          error:(err) =>{
            if(err.status == 404){
              alert("Record Not Found");
              return;
            }
            else
            {
              alert("Something went wrong");
              return;
            }
          }
        });
      }
    }
  });
  
}

goBack()
{
  this.router.navigate(['/books-summary']);
}
}
