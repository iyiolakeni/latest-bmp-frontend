import { Injectable } from '@angular/core';
import {  UserData, UserResponse } from '../../interface/books.model';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  user!: UserResponse;
  constructor() { }

  setUser(user: UserResponse): void{
    this.user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
    console.log(this.user);
  }

  getUser(): UserResponse{
    const user = sessionStorage.getItem('user');
    if(user){
      return JSON.parse(user);
    }
    return {} as UserResponse;
  }
}
