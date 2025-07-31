import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserRegister } from '../models/UserRegister.model';
import { UserLogin } from '../models/UserLogin.model';
import { UserLoginResponse } from '../models/UserLoginResponse.model';
import { UserDetails } from '../models/UserDetails.model';
import { EditUserProfile } from '../models/EditUserProfile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseApiUrl:string = environment.baseApiUrl;

  constructor(private http:HttpClient) { }

  addUserRequest(addUserRequest:UserRegister):Observable<UserRegister>{
    console.log(addUserRequest);
    return this.http.post<UserRegister>(this.baseApiUrl + '/api/Auth/register',addUserRequest);
  }

  // Method for login starts here
  userLogin(userLogin:UserLogin):Observable<UserLoginResponse>{
    console.log(userLogin);
    return this.http.post<UserLoginResponse>(this.baseApiUrl + '/api/Auth/login',userLogin);
  }

  // Method for Password Reset starts here
  updateUserPasswordRequest(userLogin:UserLogin):Observable<any>{
    return this.http.put(this.baseApiUrl + '/api/Auth/userPasswordReset',userLogin);
  }

  // Method for getting the User Details starts here
  getUserDetailsRequest(userId:string):Observable<UserDetails>{
    return this.http.get<UserDetails>(this.baseApiUrl + '/api/User/getUserDetails/' + userId);
  }

  // Method for Updating the User Details starts here
  editUserDetailsRequest(userId:string,editUserProfile:EditUserProfile):Observable<any>{
    return this.http.put(this.baseApiUrl + '/api/User/updateProfile/' + userId,editUserProfile);
  }

  // Method for deleting the User's Account starts here
  deleteUserAccountRequest(userId:string):Observable<any>{
    return this.http.delete(this.baseApiUrl + '/api/User/deleteAccount/' + userId);
  }
}
