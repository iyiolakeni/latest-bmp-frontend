import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarItem } from '../interface/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isOpen = true;
  @Output() size= new EventEmitter< string>();

  constructor(
    private router: Router
  ){
  }
  sidebarItem: SidebarItem[] =[
    {
      icon: 'home',
      text: 'Home',
      route: '/'
    },
    {
      icon: 'book',
      text: 'Books',
      route: '/books'
    },
  ]

  toggleSidebar(){
    this.isOpen = !this.isOpen;
    if(this.isOpen){
      this.size.emit('w-64');
    }else{
      this.size.emit('w-16');
    }
  }

  navigateTo(route: string){
    this.router.navigate([route]);
  }
}
