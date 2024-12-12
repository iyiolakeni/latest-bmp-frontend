import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
@Input() message: string = '';
@Input() apiResponse: string = '';
@Input() show: boolean = false;
}
