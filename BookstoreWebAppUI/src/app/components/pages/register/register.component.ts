import { Component } from '@angular/core';
import { UserRegister } from '../../../models/UserRegister.model';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  addUserRequest:UserRegister={
    UserName:'',
    EmailAddress:'',
    PasswordPlainText:'',
    Address:'',
    Phone:0,
    City:'',
    Country:'',
    ZipCode:'',
};
constructor(private userService: UserService,private router:Router){}

registerUser(){
  this.userService.addUserRequest(this.addUserRequest).subscribe({
    next:(user) =>{
      this.router.navigate(['/login']);
    },
    error:(response) =>{
     if(response.status == 404)
     {
        alert("Email Address exists");
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
