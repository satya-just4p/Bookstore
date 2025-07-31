import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserbooksService } from '../../../services/userbooks.service';
import { UserBookDetail } from '../../../models/UserBookDetail.model';

@Component({
  selector: 'app-edit-book',
  standalone: false,
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css'
})
export class EditBookComponent implements OnInit {

  userId:string|null =null;

userBookDetail:UserBookDetail={
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
  constructor(private router: Router, private route: ActivatedRoute,private userBooksService: UserbooksService){}

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

  updateBookDetails(){
    if(confirm("Are you sure you want to update the details?"))
    {
      // converting the string to date datatype before passing the data to the API
      const updateBookDetail = {
        ...this.userBookDetail,
        PublishedOn:new Date(this.userBookDetail.publishedOn)
      };

      console.log("The details of the object:",updateBookDetail);

      // calling the userBooksService method that calls the API method
      this.userBooksService.updateBookRequest(updateBookDetail).subscribe({

        next:(response) =>{
          if(response.message){
            alert("Book Details updated Successfully");
            this.router.navigate(['/view-my-books']);
          }
        },
        error :(err) =>{
          if(err.status == 401){
            alert("Book Details not found");
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
  } // update method ends here


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
