import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bmp-frontend';
  showSidebar: boolean = true;
  @Input() size: string = 'w-64';


  constructor (
    private router: Router
  ){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.showSidebar = !['/login', '/signup', '/', '/forget-password'].includes(event.urlAfterRedirects);
      }
    })
  }

  changeSize(){
    this.size = this.size === 'w-64' ? 'w-16' : 'w-64';
  }
}
