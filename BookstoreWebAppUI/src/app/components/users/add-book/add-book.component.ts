import { Component, OnInit } from '@angular/core';
import { AddBook } from '../../../models/AddBook.model';
import { Router } from '@angular/router';
import { UserbooksService } from '../../../services/userbooks.service';

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent implements OnInit {
  userId:string | null = null;

addBookRequest:AddBook={
    Title:'',
    Author:'',
    Synopsis:'',
    PublishedOn:null,
    Price:0,
    PublishedBy:'',
    ISBNNumber:'',
    UserId:'',
};

constructor(private router:Router,private userbook:UserbooksService){}

ngOnInit():void{

  const user = localStorage.getItem('user');

if(user){
  const userData = JSON.parse(user);
  this.userId = userData.UserId;
  this.addBookRequest.UserId = userData.UserId;
   //console.log('UserId from the localstorage',this.addBookRequest.UserId);
  
}
}

addNewBookRequest(){
    this.userbook.addNewBookRequest(this.addBookRequest).subscribe(
      {
        next:(response) =>
          {
          console.log(response);
          this.router.navigate(['/view-my-books']);
          },
        error:(err) =>
          {
            if(err.status == 401)
            {
              alert("Book exists");
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
