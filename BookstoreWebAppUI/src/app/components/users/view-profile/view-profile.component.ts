import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserDetails } from '../../../models/UserDetails.model';

@Component({
  selector: 'app-view-profile',
  standalone: false,
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent implements OnInit {

userId:string|null=null;

userDetails:UserDetails ={

  userId:'',
  userName:'',
  emailAddress:'',
  phone:0,
  address:'',
  city:'',
  country:'',
  zipCode:'',
  createdOn:''

};

  constructor(private router:Router,private userService:UserService){}

ngOnInit(): void {
  
  const user = localStorage.getItem('user');
  if(user){
    const userData = JSON.parse(user);
    if(userData.UserId)
    this.userId = userData.UserId;
    
    // Calling the GetDetails method of UserService
    if(this.userId){
      //alert("The UserId is :" + this.userId);
      this.userService.getUserDetailsRequest(this.userId).subscribe({
        next:(response) =>{

          this.userDetails = response;
          const createdDate = new Date(this.userDetails.createdOn);
          const formattedDate = createdDate.toISOString().split("T")[0];
          this.userDetails.createdOn = formattedDate;

          // storing the entire object in localstorage to use in edit profile page
          localStorage.setItem("userDetails",JSON.stringify({
            userName:this.userDetails.userName,
            phone:this.userDetails.phone,
            address:this.userDetails.address,
            zipCode:this.userDetails.zipCode,
            city:this.userDetails.city,
            country:this.userDetails.country
          }));
          

        },
        error:(err) =>{
          if(err.status == 404){
            alert(err.message);
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
}
  goBack(){
    this.router.navigate(['/view-my-books'])
  }
  goEdit(){
    this.router.navigate(['/edit-profile'])
  }
}
