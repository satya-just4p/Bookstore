import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BookstoreWebApp.UI';

  isLoggedIn:boolean = false;
  userId:string|null = null;

  constructor(private router:Router,private authService:AuthService,private userService:UserService){}

  ngOnInit():void{
    this.authService.isLoggedIn$.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
  }
  logout():void{
    this.authService.logout();
    this.router.navigate(['/books-summary']);
  }
  deleteAccount(){

    if(confirm("Are you sure you want to delete your Account?")){

        const user = localStorage.getItem('user');
    if(user){
      
      const userData = JSON.parse(user);
            
      this.userId = userData.UserId;
      if(this.userId)
      this.userService.deleteUserAccountRequest(this.userId).subscribe({
        next:(response) =>{
          //alert(response.message);
          this.authService.logout();
          this.router.navigate(['/books-summary']);
        }
    });

    } // if condition ends here

    }
   

  }
}
