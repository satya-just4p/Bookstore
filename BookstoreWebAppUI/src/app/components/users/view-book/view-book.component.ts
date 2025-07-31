import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserBookDetail } from '../../../models/UserBookDetail.model';
import { UserbooksService } from '../../../services/userbooks.service';

@Component({
  selector: 'app-view-book',
  standalone: false,
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css'
})
export class ViewBookComponent implements OnInit {
  userId:string|null = null;

  constructor(private router:Router,private route:ActivatedRoute,private userBooksService:UserbooksService){}

userBookDetail:UserBookDetail = {
    bookId:'',
    title:'',
    author:'',
    synopsis:'',
    publishedOn:'',
    publishedBy:'',
    price:0,
    isbnNumber:'',
    userId:''
};

  ngOnInit(): void {
    
    const user = localStorage.getItem('user');
    
    if(user){
      const userData = JSON.parse(user);
      this.userId = userData.UserId;

      // calling the Service class function
      this.route.paramMap.subscribe({
        next:(params) =>{
          const isbnNumber = params.get('ISBNNumber');
          const userId = params.get('UserId');

          if(isbnNumber && this.userId){
            // calling the UserBooksService function
            this.userBooksService.getUserBookDetail(isbnNumber,this.userId).subscribe({
              next:(bookDetail) =>{
                this.userBookDetail = bookDetail;

                if(this.userBookDetail.publishedOn)
                {
                  const formattedDate = new Date(this.userBookDetail.publishedOn);
                  const newFormattedDate = formattedDate.toISOString().split('T')[0];
                  this.userBookDetail.publishedOn = newFormattedDate;
                }
              },
              error:(err) =>{
                if(err.status == 404){
                  alert("Record Not Found");
                }
                else
                {
                  alert("Something went wrong");
                }
              }

            })
          }
          
        }
      });
    }
    
  }// OnInit method ends here

  goBack(){
    this.router.navigate(['/view-my-books']);
  }
  goUpdatePage(){
    this.router.navigate(['/edit-book',this.userBookDetail.isbnNumber,this.userBookDetail.userId])
  }

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
    
  }

}
