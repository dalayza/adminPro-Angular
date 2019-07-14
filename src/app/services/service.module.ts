import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';

import {
  SettingsService,
  SidebarService,
  SharedService,
  LoginGuardGuard,
  UsuarioService,
  HospitalService,
  MedicoService,
  AdminGuard,
  SubirArchivoService,
  VerificaTokenGuard
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadComponent,
    UsuarioService,
    HospitalService,
    MedicoService,
    AdminGuard,
    VerificaTokenGuard
  ]
})
export class ServiceModule { }
