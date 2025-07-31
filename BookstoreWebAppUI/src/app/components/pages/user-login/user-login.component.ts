import { Component } from '@angular/core';
import { UserLogin } from '../../../models/UserLogin.model';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserLoginResponse } from '../../../models/UserLoginResponse.model';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
userLogin:UserLogin ={
  EmailAddress:'',
  PasswordPlainText:''
};

userLoginResponse:UserLoginResponse = {
userId:'',
userName:'',
emailAddress:'',
token:''
}

constructor(private router:Router,private userService:UserService,private authService:AuthService){}

loginRequest(){
this.userService.userLogin(this.userLogin).subscribe({
  next:(userLoginResponse) =>{

    // logic for login starts here
    this.authService.login(userLoginResponse);
    //console.log("Inside next method",userLoginResponse);
    this.router.navigate(['/view-my-books']);
  },
  error:(err) =>{
    if(err.status == 404){
      alert("Invalid Email Address");
      return;
    }
    else
    {
      if(err.status == 400){
        alert("Invalid Credentials");
        return;
      }
      
    }
  }
});
}
}
