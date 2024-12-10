import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Subscription } from 'rxjs';
import { SharedServiceService } from '../services/shared-service/shared-service.service';
import { UserData } from '../interface/books.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private sharedService: SharedServiceService
  ){
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  signUp():void{
    this.router.navigate(['signup']);
  }

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }

  login(): void{
    if(this.loginForm.valid){
      this.subscriptions.push(
        this.loginService.login(this.loginForm.value).subscribe(
          (response: UserData) => {
            console.log(response);
            if(response.message === 'success'){
              this.sharedService.setUser(response.user);
              this.router.navigate(['dashboard']);
            }
          }
        )
      )
    }
    
  }
}
