import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobPosition } from '../../interface/books.model';
import { catchError, Observable, throwError } from 'rxjs';
import { JOB_POSITION } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class JobPositionService {

  constructor(
    private http: HttpClient
  ) { }

  create(payload: JobPosition ): Observable<any>{
    return this.http.post(`${JOB_POSITION}/create`,payload).pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<any>{
    return this.http.get<any>(`${JOB_POSITION}/get-all`).pipe(
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
