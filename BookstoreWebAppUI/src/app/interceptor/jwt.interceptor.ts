import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('Token');
  if(token){
    req = req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    });
  }
  return next(req);
};
