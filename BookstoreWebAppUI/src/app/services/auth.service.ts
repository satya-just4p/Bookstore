import { Injectable } from '@angular/core';
import { UserLoginResponse } from '../models/UserLoginResponse.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private isLoggedInSubject = new BehaviorSubject<boolean> (this.hasToken());
  public isLoggedIn$:Observable<boolean> = this.isLoggedInSubject.asObservable();

  private hasToken():boolean{
    return !!localStorage.getItem("Token");
  }
  login(userLoginResponse:UserLoginResponse):void{

    /*console.log(" 1. From the Login Function:", userLoginResponse.userId);
    console.log(typeof(userLoginResponse));
    console.log("userLoginResponse keys:",Object.keys(userLoginResponse));
    console.log("userLoginResponse",userLoginResponse);

    if(!userLoginResponse){
      console.error("login() called with undefined or null");
    }*/

    localStorage.setItem("Token",userLoginResponse.token);
        

    //console.log("2. Token : From the Login function : AuthService",localStorage.getItem("Token"));

    localStorage.setItem("user",JSON.stringify({
      UserId:userLoginResponse.userId,
      UserName:userLoginResponse.userName,
      EmailAddress:userLoginResponse.emailAddress}));

    //console.log("3. To check if user data is stored:AuthService",localStorage.getItem("user"));

    this.isLoggedInSubject.next(true);

  }
  logout():void{

    localStorage.removeItem("Token");
    localStorage.removeItem("user");

    if(localStorage.getItem('userDetails'))
      localStorage.removeItem("userDetails");
    
    this.isLoggedInSubject.next(false);
  }
  getToken():any{
    const token = localStorage.getItem("Token");
    //return token ? JSON.parse(token):null;
    //console.log("The value of the Token is :",token);
    return token;
  }
}
