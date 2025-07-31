import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '../../../models/UserLogin.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-password',
  standalone: false,
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.css'
})
export class EditPasswordComponent implements OnInit {

  userId:string |null = null;
  emailAddress:string|null = null;
  isReadOnly:boolean = false;

  userPasswordReset:UserLogin={
    EmailAddress:'',
    PasswordPlainText:''
  };

  constructor(private router:Router,private userService:UserService,private authService:AuthService){}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if(user){
      
      const userData = JSON.parse(user);
      this.userId = userData.userId;
      this.emailAddress = userData.EmailAddress;
      
      if(this.emailAddress)
      {
        this.userPasswordReset.EmailAddress = this.emailAddress;
        this.isReadOnly = true;
        

      }
        
    }
  }

  goCancel(){
    this.router.navigate(['/view-my-books']);
  }

  updatePasswordRequest(){

    this.userService.updateUserPasswordRequest(this.userPasswordReset).subscribe({
      next :(response) =>{

        alert(response.message);
        //localStorage.removeItem('token');
        //localStorage.removeItem('user');
        this.authService.logout();
        this.router.navigate(['/login']);
        
      },
      error :(err) =>{
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
