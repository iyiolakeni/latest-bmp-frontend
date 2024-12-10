import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  errorHandler(error: HttpErrorResponse) {
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
