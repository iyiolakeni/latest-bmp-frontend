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
  expandedItems: { [key: string]: boolean } = {};

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
      icon: 'request',
      text: 'Request',
      route: '/all-request',
      // caret: 'caret',
      // children:[{
      //   icon: 'pending',
      //   text: 'Pending',
      //   route: '/pending-request'
      // },
      // {
      //   icon: 'approved',
      //   text: 'Approved',
      //   route: '/approved-request'
      // },
      // {
      //   icon: 'rejected',
      //   text: 'Rejected',
      //   route: '/rejected-request'
      // },
      // {
      //   icon: 'delivered',
      //   text: 'Delivered',
      //   route: '/delivered-request'
      // },
      // {
      //   icon: 'deployed',
      //   text: 'Deployed',
      //   route: '/deployed-request'
      // }
    // ]
    },
    {
      icon: 'logout',
      text: 'Logout',
      route: '/'
    }
  ]

  toggleSidebar(){
    this.isOpen = !this.isOpen;
    if(this.isOpen){
      this.size.emit('w-64');
    }else{
      this.size.emit('w-16');
    }
  }

  toggleSubmenu(item: SidebarItem) {
    if (item.text) {
      this.expandedItems[item.text] = !this.expandedItems[item.text];
    }
  }

  navigateTo(route: string){
    this.router.navigate([route]);
  }
}
