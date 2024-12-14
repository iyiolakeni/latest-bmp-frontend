import { Component } from '@angular/core';
import { RequestsService } from '../../services/requests/requests.service';
import { SharedServiceService } from '../../services/shared-service/shared-service.service';
import { ApiResponse, UserResponse } from '../../interface/books.model';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { ApproveRequestService } from '../../services/approve-request/approve-request.service';
import { DeployedTableService } from '../../services/deployed-table/deployed-table.service';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../../form/form.component';
import { CreateFormComponent } from '../../create-form/create-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeployDialogComponent } from '../../deploy-dialog/deploy-dialog.component';


@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrl: './all-request.component.scss'
})
export class AllRequestComponent {
loading: boolean = false;
user!: UserResponse;
error: string = '';
currentPage = 1;
itemsPerPage = 10;
totalItems = 0;
isView: boolean = false;
data: any = {};
rejectForm: FormGroup = new FormGroup({});
isLoading: boolean = false;

readonly STATUS_COLORS: { [key: string]: string } = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'deployed': 'bg-blue-100 text-blue-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'delivered': 'bg-purple-100 text-purple-800'
};

sortDirection: 'asc' | 'desc' = 'desc';
sortBy: 'createdAt' | 'updatedAt ' | 'requestDate' = 'createdAt';
private subscriptions: Subscription[] = [];
showDialog: boolean = false;
accept: boolean = false;

private destroy$ = new Subject<void>();

allRequests: any;

constructor(
  private requestService: RequestsService,
  private sharedService: SharedServiceService,
  private approveService: ApproveRequestService,
  private deployService: DeployedTableService,
  public dialog: MatDialog,
  private fb: FormBuilder
){
  this.rejectForm = this.fb.group({
    notes: [''],
    approvedNoOfPos: ['']
  })
}

ngOnInit(){
  this.user = this.sharedService.getUser()

  if(this.user.jobPosition === 'Account Officer'){
    this.getAllRequests();
  }else if(this.user.jobPosition === 'Business Developer'){
    this.getApprovedRequest();
  }else{
    this.getDeployedRequest();
  }
}

getAllRequests(
){
  this.loading = true;
  this.error = '';
  this.subscriptions.push(
    this.requestService.getAll(
      this.currentPage,
      this.itemsPerPage,
      this.sortBy = 'createdAt',
      this.sortDirection
    ).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: ApiResponse<[]>) => {
        this.allRequests = response.data.data;
        this.totalItems = response.data.data.length;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.error = error.message;
        this.loading = false
      }
})
  )
}

getDeployedRequest(){
  this.loading = true;
  this.subscriptions.push(
    this.deployService.getAll( this.currentPage,
      this.itemsPerPage,
      this.sortBy = 'requestDate',
      this.sortDirection
    ).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: ApiResponse<[]>) => {
        this.allRequests = response.data.data;
        this.totalItems = response.data.data.length;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.error = error.message;
        this.loading = false
      }
})
  )
}

getApprovedRequest(){
  this.loading = true;
  this.subscriptions.push(
    this.approveService.getAll( this.currentPage,
      this.itemsPerPage,
      this.sortBy = 'requestDate',
      this.sortDirection
    ).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: ApiResponse<[]>) => {
        this.allRequests = response.data.data;
        this.totalItems = response.data.data.length;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.error = error.message;
        this.loading = false
      }
})
  )
}

// onSort(column: keyof any): void {
//   // If same column, toggle direction
//   if (this.sortColumn === column) {
//     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//   } else {
//     this.sortColumn = column;
//     this.sortDirection = 'desc';
//   }
  
  // Reload requests with new sorting
//   this.getAllRequests();
// }

// Pagination methods
previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getAllRequests();
  }
}

nextPage(): void {
  const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  if (this.currentPage < totalPages) {
    this.currentPage++;
    this.getAllRequests();
  }
}

getMinValue(a: number, b: number): number {
  return Math.min(a, b);
}

getStatusClass(status: any['status']): string {
  return this.STATUS_COLORS[status] || '';
}

getFormattedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const formattedDate = date
      .toLocaleDateString('en-GB', options)
      .replace(/\//g, '-');

    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

viewRequest(request: any): void {
  this.dialog.open(FormComponent, {
    width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: {request, isView: true}
  })
}

editRequest(request: any): void {
  const dialogRef = this.dialog.open(FormComponent, {
    width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: {request, isView: false}
  })

  dialogRef.afterClosed().subscribe(result => {
    this.getAllRequests();
  })
}

deployModal(request: any): void {
  const dialogRef = this.dialog.open(DeployDialogComponent, {
    width: '900px',
      maxHeight: '90vh',
      panelClass: 'dialog-container',
      data: {request, isView: false}
  })

  dialogRef.afterClosed().subscribe(result => {
    this.getDeployedRequest();
  })
}


createRequest(): void {
  const dialogRef = this.dialog.open(CreateFormComponent, {
    width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
  })

  dialogRef.afterClosed().subscribe(result => {
    this.getAllRequests();
  })
}

openModal(request: any): void {
  this.showDialog = true;
  this.data = request;
}

approveModal(request: any): void {
  this.showDialog = true;
  this.accept = true;
  this.rejectForm.patchValue({
    approvedNoOfPos: request.noOfPos
  })
  this.data = request;
}

closeModal(): void {
  this.showDialog = false;
}

disapproveRequest(): void {
  this.isLoading = true;
  const payload = {
    status: 'rejected',
    notes: this.rejectForm.value.notes,
    approvedById: this.user.id
  }
this.subscriptions.push(
  this.approveService.approveRequest(this.data.id, payload).subscribe(
    (response) => {
      this.getApprovedRequest();
      this.data = {};
      this.showDialog = false;
  this.isLoading = false;

    },
    (error) => {
      console.log(error);
  this.isLoading = false;

    }
  )
)
}

approveRequest(): void {
  this.isLoading = true;

  const payload = {
    status: 'approved',
    approvedNoOfPos: this.rejectForm.value.approvedNoOfPos,
    notes: this.rejectForm.value.notes,
    approvedById: this.user.id
  }
this.subscriptions.push(
  this.approveService.approveRequest(this.data.id, payload).subscribe(
    (response) => {
      this.getApprovedRequest();
      this.data = {};
      this.showDialog = false;
  this.isLoading = false;

    },
    (error) => {
      console.log(error);
  this.isLoading = false;

    }
  )
)
}


}
