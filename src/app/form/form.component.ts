import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, UserResponse } from '../interface/books.model';
import { SharedServiceService } from '../services/shared-service/shared-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MerchantService } from '../services/merchant/merchant.service';
import { BusinessCategoryService } from '../services/business-category/business-category.service';
import { CardTypeService } from '../services/card-type/card-type.service';
import { RequestsService } from '../services/requests/requests.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  selectedIndex = 0;
  user!: UserResponse;
  formGroup: FormGroup = new FormGroup({});
  merchant: any;
  cardType:any
  businessCategory:any
  private subscriptions: Subscription[] = []

  
  tabs = [
    { label: 'REQUEST DETAILS' },
    { label: 'BUSINESS DETAIL' }
  ];

  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    private sharedService: SharedServiceService,
    private fb: FormBuilder,
    private merchantService: MerchantService,
    private businessCategoryService: BusinessCategoryService,
    private requestService: RequestsService,
    private cardTypService: CardTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.fb.group({
      accountNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      businessCategoryId: ['', Validators.required],
      cardTypeId: ['', Validators.required],
      contactNumber: ['', Validators.required],
      contactPerson: ['', Validators.required],
      createdAt: [''],
      merchantId: ['', Validators.required],
      noOfPos: [0, Validators.required],
      notes: ['', Validators.required],
      requestId: [''],
      status: [''],
      supportingDocument: [''],
      terminalLocation: [[], Validators.required],
      updatedAt: [''],
      userName: [''],
      approvedNoOfPos: [],
  })
}

  ngOnInit() {
    this.user = this.sharedService.getUser();
    this.loadExtraData();
    if (this.data) {
      this.formGroup.patchValue({
        accountNumber: this.data.request.accountNumber,
      bankName: this.data.request.bankName,
      businessCategoryId: this.data.request.businessCategoryId,
      cardTypeId: this.data.request.cardTypeId,
      contactNumber: this.data.request.contactNumber,
      contactPerson: this.data.request.contactPerson,
      createdAt: this.getFormattedDate(this.data.request.createdAt),
      merchantId: this.data.request.merchantId,
      noOfPos: this.data.request.noOfPos,
      notes: this.data.request.notes,
      requestId: this.data.request.requestId,
      status: this.data.request.status,
      supportingDocument: this.data.request.supportingDocument,
      terminalLocation: this.data.request.terminalLocation,
      updatedAt: this.getFormattedDate(this.data.request.updatedAt),
      userName: this.data.request.userName,
      approvedNoOfPos: this.data.request.approvedNoOfPos || 0,
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toTitleCase(str: string): string {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  selectTab(index: number, event: Event) {
    event?.preventDefault();
    this.selectedIndex = index;
  }

  loadExtraData() {
    this.merchantList();
    this.cardList();
    this.businessCategoryList();
  }

  merchantList(){
    this.merchantService.getAll().subscribe((response: ApiResponse<any>) => {
      this.merchant = response.data.data;
    })
  }

  cardList(){
    this.cardTypService.getAll().subscribe((response: ApiResponse<any>) => {
      this.cardType = response.data.data;
    })
  }

  businessCategoryList(){
    this.businessCategoryService.getAll().subscribe((response: ApiResponse<any>) => {
      this.businessCategory = response.data.data;
    })
  }

  onSubmit() {
    // console.log(this.formGroup.value);
    const payload = {
        noOfPos: this.formGroup.value?.noOfPos,
        terminalLocation: this.formGroup.value?.terminalLocation,
        contactPerson: this.formGroup.value?.contactPerson,
        contactNumber: this.formGroup.value?.contactNumber,
        bankName: this.formGroup.value?.bankName,
        accountNumber: this.formGroup.value?.accountNumber,
        notes: this.formGroup.value?.notes,
        userId: this.data.request.userId,
        cardTypeId: this.formGroup.value?.cardTypeId,
        businessCategoryId: this.formGroup.value?.businessCategoryId,
        merchantId: this.formGroup.value?.merchantId,
      
    }
    this.subscriptions.push(
      this.requestService.update(this.data.request.id, payload).subscribe(
        (response: any) => {
          console.log('Request updated:', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating request:', error);
        }
      )
    )
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
}