import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../interface/books.model';
import { USERS } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private http: HttpClient
  ) { }

  create(payload: User): Observable<any>{
    return this.http.post<any>(`${USERS}/create`,payload).pipe(
      catchError(this.errorHandler)
    )
  }

  get(): Observable<any>{
    return this.http.get<any>(`${USERS}/get-all`).pipe(
      catchError(this.errorHandler)
    )
  }

  getArchivedUsers(): Observable<any>{
    return this.http.get<any>(`${USERS}/get-archived-users`).pipe(
      catchError(this.errorHandler)
    )
  }

  getAllPosOfficers(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get<any>(`${USERS}/get-pos-officers-by-branch/${branchId}`, {params}).pipe(
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
