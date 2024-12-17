import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { APPROVE_REQUEST } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ApproveRequestService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getAll(
    branchId: string = '',
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId)
    .set('page', page)
    .set('limit', limit)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);
    return this.http.get(`${APPROVE_REQUEST}/get-all`, {params}).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  approveRequest(id: string, formData: any): Observable<any>{
    return this.http.patch(`${APPROVE_REQUEST}/update-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getRequestById(id: string): Observable<any>{
    return this.http.get(`${APPROVE_REQUEST}/get-by-id/${id}`).pipe(
      catchError(
        this.errorHandler.errorHandler)
      )
  }

  getApprovedRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${APPROVE_REQUEST}/get-all-approved-request/${branchId}`, {params}).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getPendinRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${APPROVE_REQUEST}/get-all-pending-request/${branchId}`, {params}).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getRejectedRequest(branchId: string): Observable<any>{
    let params = new HttpParams()
    .set('branchId', branchId);
    return this.http.get(`${APPROVE_REQUEST}/get-all-rejected-request/${branchId}`, {params}).pipe(
       catchError(this.errorHandler.errorHandler)
    )
  }

}
