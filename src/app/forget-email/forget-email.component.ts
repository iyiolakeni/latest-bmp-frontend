import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../interface/books.model';

@Component({
  selector: 'app-forget-email',
  templateUrl: './forget-email.component.html',
  styleUrl: './forget-email.component.scss'
})
export class ForgetEmailComponent {
submit: boolean = false;
apiResponse: string = '';
resetPassword: FormGroup = new FormGroup({});
private subscriptions: Subscription[] = [];
success: boolean = false;

constructor(
  private authService: LoginService,
  private fb: FormBuilder
){
  this.resetPassword = this.fb.group({
    email: ['', Validators.required]
  })
}

reset(): void {
this.submit = true
this.apiResponse = ''
this.subscriptions.push(
  this.authService.forgetPassword(this.resetPassword.value).subscribe(
    (response: ApiResponse<any>) => {
      if(response.data.success){
        this.apiResponse = response.data.message;
        this.submit = false;
        this.success = true;
      } else {
        this.submit = false;
        this.apiResponse = response.data.message;
      }
    }, 
    (error) => {
      this.submit = false;
      this.apiResponse = error.message;
    }
  )
)

}
}
