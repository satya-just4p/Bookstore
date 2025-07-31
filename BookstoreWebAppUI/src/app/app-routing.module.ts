import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './components/pages/user-login/user-login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { BookDetailComponent } from './components/books/book-detail/book-detail.component';
import { ViewProfileComponent } from './components/users/view-profile/view-profile.component';
import { EditProfileComponent } from './components/users/edit-profile/edit-profile.component';
import { MyUploadedBooksComponent } from './components/users/my-uploaded-books/my-uploaded-books.component';
import { EditBookComponent } from './components/users/edit-book/edit-book.component';
import { ViewBookComponent } from './components/users/view-book/view-book.component';
import { AddBookComponent } from './components/users/add-book/add-book.component';
import { BooksSummaryComponent } from './components/books/books-summary/books-summary.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { EditPasswordComponent } from './components/users/edit-password/edit-password.component';
import { authGuard } from './authguard/auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'books-summary',pathMatch:'full'
  },
  {
    path:'books-summary',
    component:BooksSummaryComponent

  },
  {
    path:'login',
    component:UserLoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'book-detail/:ISBNNumber',
    component:BookDetailComponent
  },
  {
    path:'view-profile',
    component:ViewProfileComponent,
    canActivate:[authGuard]
  },
  {
    path:'edit-profile',
    component:EditProfileComponent,
    canActivate:[authGuard]
  },
  {
    path:'view-my-books',
    component:MyUploadedBooksComponent,
    canActivate:[authGuard]
  },
  {
    path:'edit-book/:ISBNNumber/:UserId',
    component:EditBookComponent,
    canActivate:[authGuard]
  },
  {
    path:'view-detail/:ISBNNumber/:UserId',
    component:ViewBookComponent,
    canActivate:[authGuard]
  },
  {
    path:'add-book',
    component:AddBookComponent,
    canActivate:[authGuard]
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },
  {
    path:'edit-password',
    component:EditPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
