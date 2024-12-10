import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../interface/books.model';
import { AUTH } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(formData: User): Observable<any>{
    return this.http.post<any>(`${AUTH}/login`,formData).pipe(
      catchError(this.errorHandler)
    )
  }

  forgetPassword(email: string): Observable<any>{
    return this.http.post<any>(`${AUTH}/forget-password`,{email}).pipe(
      catchError(this.errorHandler)
    )
  }

  resetPassword(password: string, token: string): Observable<any>{
    return this.http.post<any>(`${AUTH}/reset-password/${token}`,{password}).pipe(
      catchError(this.errorHandler)
    )
  }

  private errorHandler(error: HttpErrorResponse) {
    let errorMessage: string;
  
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Network error (ERR_INTERNET_DISCONNECTED falls here)
      errorMessage = `Network error - please check your internet connection`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
  
    // Log the full error object for debugging
    console.error('Full error object:', error);
    console.error('Error message:', errorMessage);
  
    // Return a user-friendly error message
    return throwError(() => new Error('Unable to complete the request. Please try again later.'));
  }
}
