import { Component, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, UserResponse } from '../interface/books.model';
import { SharedServiceService } from '../services/shared-service/shared-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MerchantService } from '../services/merchant/merchant.service';
import { BusinessCategoryService } from '../services/business-category/business-category.service';
import { CardTypeService } from '../services/card-type/card-type.service';
import { Subscription } from 'rxjs';
import { RequestsService } from '../services/requests/requests.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
})
export class CreateFormComponent {
  selectedIndex = 0;
  user!: UserResponse;
  formGroup: FormGroup = new FormGroup({});
  merchant: any;
  cardType: any;
  businessCategory: any;
  private subscriptions: Subscription[] = [];
  apiResponse: string = '';
  show: boolean = false;
  message: string = '';
  tabs = [{ label: 'REQUEST FORM' }];

  constructor(
    public dialogRef: MatDialogRef<CreateFormComponent>,
    private sharedService: SharedServiceService,
    private fb: FormBuilder,
    private merchantService: MerchantService,
    private businessCategoryService: BusinessCategoryService,
    private cardTypService: CardTypeService,
    private service: RequestsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.fb.group({
      noOfPos: [0, Validators.required],
      terminalLocation: [[], Validators.required],
      contactPerson: ['', Validators.required],
      contactNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      notes: [''],
      cardTypeId: ['', Validators.required],
      businessCategoryId: ['', Validators.required],
      merchantId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = this.sharedService.getUser();
    this.loadExtraData();
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
    this.merchantList();
    this.cardList();
    this.businessCategoryList();
  }

  merchantList() {
    this.subscriptions.push(this.merchantService.getAll().subscribe((response: ApiResponse<any>) => {
      this.merchant = response.data.data;
    }));
  }

  cardList() {
    this.subscriptions.push(this.cardTypService.getAll().subscribe((response: ApiResponse<any>) => {
      this.cardType = response.data.data;
    }));
  }

  businessCategoryList() {
    this.subscriptions.push(
      this.businessCategoryService
        .getAll()
        .subscribe((response: ApiResponse<any>) => {
          this.businessCategory = response.data.data;
        })
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const payload ={
        ...this.formGroup.value,
        userId: this.user.id,
      } 
      this.subscriptions.push(
        this.service.create(payload).subscribe((response: ApiResponse<any>) => {
          if (response.data.success) {
            this.show = true;
            this.message = 'success'
            this.apiResponse = response.data.message;
            setTimeout(() =>{
              this.show = false;
              this.dialogRef.close();
            })
          } else {
            this.show = true;
            this.message = 'error'
            this.apiResponse = "Error creating request, try again";
            setTimeout(() =>{
              this.show = false;
            }, 5000)
          }
        })
      );
    }else{
      this.show = true;
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
