import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AddBook } from '../models/AddBook.model';
import { Observable } from 'rxjs';
import { BooksSummary } from '../models/booksSummary.model';
import { UserBookDetail } from '../models/UserBookDetail.model';

@Injectable({
  providedIn: 'root'
})
export class UserbooksService {
private baseApiUrl = environment.baseApiUrl;

  constructor(private http:HttpClient) { }

  // adding a new book
  addNewBookRequest(addBook:AddBook):Observable<AddBook>{
    return this.http.post<AddBook>(this.baseApiUrl + '/api/UserBooks/addNewBook',addBook);
  }
   // Getting books uploaded by the user

   getAllBooks(UserId:string):Observable<BooksSummary[]>{
    return this.http.get<BooksSummary[]>(this.baseApiUrl + '/api/UserBooks/getAllBooks/' + UserId,
      {headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}}
    );
   }

   // Viewing the detail of the User Book
   getUserBookDetail(isbnNumber:string,userId:string):Observable<UserBookDetail>{
    //return this.http.get<UserBookDetail>(this.baseApiUrl + '/api/UserBooks/getUserBookDetail/'+ isbnNumber + '/' + userId);
    return this.http.get<UserBookDetail>(`${this.baseApiUrl}/api/UserBooks/getUserBookDetail/${isbnNumber}/${userId}`);
   }

   // deleting the book
   deleteBookRequest(isbnNumber:string,userId:string):Observable<any>{
        
    return this.http.delete(`${this.baseApiUrl}/api/UserBooks/deleteBook/${isbnNumber}/${userId}`);
    
   }

   //Updating a book
   updateBookRequest(userBookDetail:any):Observable<any>{
    return this.http.put(this.baseApiUrl + '/api/UserBooks/updateBook',userBookDetail);
   }
}
