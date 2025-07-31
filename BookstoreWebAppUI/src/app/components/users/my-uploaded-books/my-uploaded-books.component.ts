import { Component, OnInit } from '@angular/core';
import { BooksSummary } from '../../../models/booksSummary.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserbooksService } from '../../../services/userbooks.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-my-uploaded-books',
  standalone: false,
  templateUrl: './my-uploaded-books.component.html',
  styleUrl: './my-uploaded-books.component.css'
})
export class MyUploadedBooksComponent implements OnInit {
userId:string|null = null;

bookSummary : BooksSummary []=[];

constructor(private router : Router,private userBooksService:UserbooksService){}

  ngOnInit(): void {

    this.loadBooks();

    //Listen for router events to re-fetch books on same route navigation
    this.router.events
    .pipe(filter(event =>event instanceof NavigationEnd))
    .subscribe(()=>{
      console.log("Inside the router events function");
      this.loadBooks();
    });
  } // ngOnInit Method block ends here

  loadBooks(){
    const user = localStorage.getItem('user');
    if(user){
      const userData = JSON.parse(user);
      this.userId = userData.UserId;

      // Calling the service method

        if(this.userId)
        {
            this.userBooksService.getAllBooks(this.userId).subscribe({
          next:(booksList) =>{
            this.bookSummary = booksList;
          },
          error: (err) =>{
            if(err.status == 400){
              console.log("No Books Found");
              return;
            }
            else
            {
              alert("Something went wrong");
            }
          }
        });
        
      } // If block ends here



    }
  } // loadBooks() ends here

  deleteBookRequest(isbnNumber:string,userId:string){
    
    if(confirm("Are you sure you want to delete this book?"))
    {

      this.userBooksService.deleteBookRequest(isbnNumber,userId).subscribe({

      next : (response) =>{

        //console.log("Inside the response",response);
        alert(response.message);

        //this.router.navigate(['/view-my-books']);
        this.router.navigateByUrl('/',{skipLocationChange:true})
        .then(() => {this.router.navigate(['/view-my-books'])});
        
        
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
    // Need to call the service method
    
  }// delete method ends here

}
