import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditUserProfile } from '../../../models/EditUserProfile.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userId:string|null=null;

  editUserProfile:EditUserProfile = {
    userName:'',
    address:'',
    phone:0,
    zipCode:'',
    city:'',
    country:''

  }
  constructor(private router:Router, private userService:UserService){}

ngOnInit(): void {
  const user = localStorage.getItem('user');
  if(user){
    const userData = JSON.parse(user);
    this.userId = userData.UserId;

    if(this.userId){
      const editDetails = localStorage.getItem('userDetails');
      if(editDetails)
      this.editUserProfile = JSON.parse(editDetails);
    console.log("The Object : ", this.editUserProfile);
    }
  }
  

}
  goCancel(){
    this.router.navigate(['/view-my-books']);
  }

  editUser(){
    if(this.userId)
    this.userService.editUserDetailsRequest(this.userId,this.editUserProfile).subscribe({
      next:(response) =>{

        alert(response.message);
        localStorage.removeItem('userDetails');
        this.router.navigate(['/view-profile']);
      },
      error:(err) =>{
        if(err.status == 404)
        {
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
