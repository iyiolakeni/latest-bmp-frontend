import { Injectable } from '@angular/core';
import { DEPLOYED_TABLE } from '../../constants/url.constants';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeployedTableService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getAll(): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-all`).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  deployRequest(id: string, formData: any): Observable<any>{
    return this.http.put(`${DEPLOYED_TABLE}/approve-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  deliverRequest(id: string, formData: any): Observable<any>{
    return this.http.put(`${DEPLOYED_TABLE}/delivery-status/${id}`, formData).pipe(
      catchError(
        this.errorHandler.errorHandler
      )
    )
  }

  getRequestById(id: string): Observable<any>{
    return this.http.get(`${DEPLOYED_TABLE}/get-one/${id}`).pipe(
      catchError(
        this.errorHandler.errorHandler)
      )
  }

}
