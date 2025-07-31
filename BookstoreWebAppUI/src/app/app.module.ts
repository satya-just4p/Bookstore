import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './components/pages/user-login/user-login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { BooksSummaryComponent } from './components/books/books-summary/books-summary.component';
import { BookDetailComponent } from './components/books/book-detail/book-detail.component';
import { ViewProfileComponent } from './components/users/view-profile/view-profile.component';
import { EditProfileComponent } from './components/users/edit-profile/edit-profile.component';
import { MyUploadedBooksComponent } from './components/users/my-uploaded-books/my-uploaded-books.component';
import { EditBookComponent } from './components/users/edit-book/edit-book.component';
import { ViewBookComponent } from './components/users/view-book/view-book.component';

// Angular Material Imports starts here

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

// Angular Material Imports ends here

import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient,withInterceptorsFromDi,withInterceptors } from '@angular/common/http';
import { AddBookComponent } from './components/users/add-book/add-book.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { EditPasswordComponent } from './components/users/edit-password/edit-password.component';
import { jwtInterceptor } from './interceptor/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    RegisterComponent,
    BooksSummaryComponent,
    BookDetailComponent,
    ViewProfileComponent,
    EditProfileComponent,
    MyUploadedBooksComponent,
    EditBookComponent,
    ViewBookComponent,
    AddBookComponent,
    ForgotPasswordComponent,
    EditPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
       
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatFormField,
    MatInputModule

  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor]))
    /*{
      provide:HTTP_INTERCEPTORS,
      useValue:jwtInterceptor,
      multi:true

    }*/
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
