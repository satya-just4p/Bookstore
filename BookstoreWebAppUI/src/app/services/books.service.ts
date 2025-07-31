import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BooksSummary } from '../models/booksSummary.model';
import { BookDetail } from '../models/BookDetail.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http:HttpClient) { }

  baseApiUrl:string = environment.baseApiUrl;

  // Getting the List of all Books present in the database

  getBooksSummary():Observable<BooksSummary[]>{
    return this.http.get<BooksSummary[]>(this.baseApiUrl + '/api/Books/getBooksSummary');
  }

  // Getting the book detail based on ISBN Number
  getBookDetail(ISBNNumber:string):Observable<BookDetail>{
    console.log("The ISBN Number of the book is :",ISBNNumber);
    return this.http.get<BookDetail>(this.baseApiUrl + '/api/Books/getBookDetail/' + ISBNNumber);
  }
}
