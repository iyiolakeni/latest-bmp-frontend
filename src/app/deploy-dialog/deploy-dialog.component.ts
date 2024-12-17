import { Component, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, UserResponse } from '../interface/books.model';
import { SharedServiceService } from '../services/shared-service/shared-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModelService } from '../services/model/model.service';
import { PtspService } from '../services/ptsp/ptsp.service';
import { ProcessorService } from '../services/processor/processor.service';
import { AccountService } from '../services/account/account.service';
import { DeployedTableService } from '../services/deployed-table/deployed-table.service';
import { SignUpService } from '../services/sign-up/sign-up.service';
@Component({
  selector: 'app-deploy-dialog',
  templateUrl: './deploy-dialog.component.html',
  styleUrl: './deploy-dialog.component.scss'
})
export class DeployDialogComponent {
  selectedIndex = 0;
  user!: UserResponse;
  formGroup: FormGroup = new FormGroup({});
  model: any;
  ptsp: any;
  account: any;
  processor: any;
  private subscriptions: Subscription[] = [];
  apiResponse: string = '';
  show: boolean = false;
  message: string = '';
  tabs = [{ label: 'DEPLOYMENT FORM' }];
  userId : string =  '';
  isLoading: boolean = false;
  posOfficers: any;

  constructor(
    public dialogRef: MatDialogRef<DeployDialogComponent>,
    private sharedService: SharedServiceService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private ptspService: PtspService,
    private processorService: ProcessorService,
    private accountService: AccountService,
    private service: DeployedTableService,
    private userService: SignUpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.fb.group({
      notes: [''],
      modelId: ['', Validators.required],
      ptspId: ['', Validators.required],
      processorId: ['', Validators.required],
      accountId: ['', Validators.required],
      assignedTo: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = this.sharedService.getUser();
    this.loadExtraData();
    this.userId = this.user.id;
    console.log(this.userId);
  }

  toTitleCase(str: string): string {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  selectTab(index: number) {
    this.selectedIndex = index;
  }

  loadExtraData() {
    this.modelList();
    this.ptspList();
    this.processorList();
    this.accountList();
    this.posOfficerList();
  }

  modelList() {
    this.subscriptions.push(this.modelService.getAll().subscribe((response: ApiResponse<any>) => {
      this.model = response.data.data;
    }));
  }

  ptspList() {
    this.subscriptions.push(this.ptspService.getAll().subscribe((response: ApiResponse<any>) => {
      this.ptsp = response.data.data;
    }));
  }

  posOfficerList() {
    this.subscriptions.push(this.userService.getAllPosOfficers(this.user.branchId).subscribe((response: ApiResponse<any>) => {
      this.posOfficers = response.data.data;
    }));
  }

  processorList() {
    this.subscriptions.push(
      this.processorService
        .getAll()
        .subscribe((response: ApiResponse<any>) => {
          this.processor = response.data.data;
        })
    );
  }

  accountList() {
    this.subscriptions.push(
      this.accountService
        .getAll()
        .subscribe((response: ApiResponse<any>) => {
          this.account = response.data.data;
        })
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.formGroup.valid) {
      const payload ={
        ...this.formGroup.value,
        status: 'deployed',
        approvedNoOfPos: this.data.approveNoOfPos,
        deployedById: this.userId,
      } 
      this.subscriptions.push(
        this.service.deployRequest(this.data.request.id,payload).subscribe((response: ApiResponse<any>) => {
          if (response.data.success) {
            this.show = true;
            this.message = 'success'
            this.apiResponse = response.data.message;
            this.isLoading = false;
            setTimeout(() =>{
              this.show = false;
              this.dialogRef.close();
            })
          } else {
            this.show = true;
            this.message = 'error'
            this.apiResponse = response.data.message;
            this.isLoading = false;
            setTimeout(() =>{
              this.show = false;
            }, 5000)
          }
        })
      );
    }else{
      this.show = true;
      this.isLoading = false;
      this.message = 'warning'
      this.apiResponse = 'Please fill all required fields';
      setTimeout(() =>{
        this.show = false;
      }, 5000)
    }
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
