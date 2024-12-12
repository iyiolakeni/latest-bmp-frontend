import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import {
  bootstrapCaretDown,
  bootstrapCaretDownFill,
  bootstrapCheckCircle,
  bootstrapChevronRight,
  bootstrapDot,
  bootstrapDownload,
  bootstrapExclamationCircle,
  bootstrapEye,
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
  bootstrapFileEarmarkText,
  bootstrapFunnel,
  bootstrapHouseDoor,
  bootstrapInfoCircle,
  bootstrapPencilSquare,
  bootstrapPlus,
  bootstrapPower,
  bootstrapSearch,
  bootstrapSliders2Vertical,
  bootstrapSortUp,
  bootstrapTrash,
  bootstrapXCircle,
} from '@ng-icons/bootstrap-icons';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './loader/loader.component';
import { NewRequestComponent } from './pages/new-request/new-request.component';
import { AllRequestComponent } from './pages/all-request/all-request.component';
import { FormComponent } from './form/form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateFormComponent } from './create-form/create-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    LoaderComponent,
    NewRequestComponent,
    AllRequestComponent,
    FormComponent,
    CreateFormComponent,
    SnackbarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgIconsModule.withIcons({
      bootstrapEyeFill,
      bootstrapEyeSlashFill,
      bootstrapHouseDoor,
      bootstrapChevronRight,
      bootstrapFileEarmarkText,
      bootstrapSearch,
      bootstrapSliders2Vertical,
      bootstrapPower,
      bootstrapCaretDownFill,
      bootstrapCaretDown,
      bootstrapDot,
      bootstrapPlus,
      bootstrapDownload,
      bootstrapFunnel,
      bootstrapEye,
      bootstrapPencilSquare,
      bootstrapTrash,
      bootstrapSortUp,
      bootstrapCheckCircle,
      bootstrapExclamationCircle,
      bootstrapInfoCircle,
      bootstrapXCircle
    }),
    MatIconModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
