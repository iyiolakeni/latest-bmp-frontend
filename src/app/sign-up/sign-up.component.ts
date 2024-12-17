import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, JobPositionData, JobPositionResponse } from '../interface/books.model';
import { JobPositionService } from '../services/job-position/job-position.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpService } from '../services/sign-up/sign-up.service';
import { BranchService } from '../services/branch/branch.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  jobPosition: JobPositionResponse[] = [];
  private subscriptions: Subscription[] = []
  signUpForm: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  confirmPassword: boolean = false;
  apiResponse: string = '';
  submit: boolean = false;
  branch: any;
  constructor(
    private router: Router,
    private jobPositionService: JobPositionService,
    private signUpService: SignUpService,
    private fb: FormBuilder,
    private branchService: BranchService
  ){
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      password: ['', [
        Validators.required, 
        Validators.minLength(8)
      ]],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobPositionId: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      branchId: ['', Validators.required]
    })
  }

  ngOnInit(){
    this.getAllJobPosition()
    this.getAllBranch()
  }

  getAllJobPosition():void{
    this.subscriptions.push(
      this.jobPositionService.getAll().subscribe(
        (response: JobPositionData) => {
          this.jobPosition = response.data.data
        }
      )
    )
  }

  getAllBranch():void{
    this.subscriptions.push(
      this.branchService.getAll().subscribe(
        (response: ApiResponse<any>) => {
          this.branch = response.data.data
        }
      )
    )
  }

  login(): void{
    this.router.navigate(['login']);
  }

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }

  togglePassword1(): void{
    this.showPassword2 = !this.showPassword2;
  }
  
  confirmPasswordValue(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = inputElement.value;
    this.confirmPassword = password === confirmPassword;
  }

  onSubmit(): void{
    this.apiResponse = '';
    this.submit = true
    if (this.signUpForm.valid){
      const payload = {
        ...this.signUpForm.value,
        confirmPassword: undefined // Remove confirmPassword from payload
      };
      delete payload.confirmPassword; // Ensure it's removed

      this.subscriptions.push(
        this.signUpService.create(payload).subscribe({
          next: (response: JobPositionData) =>{
            this.submit = false
            if(response.data.success){
              this.router.navigate(['login'])
            }else{
              this.apiResponse = response.data.message
            }
          },
          error: (error: ApiResponse<any>) =>{
            this.apiResponse = error.data.message
            this.submit = false
          }
        })
      )
    }
  }

  // Optional: Add method to clean up subscriptions
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}