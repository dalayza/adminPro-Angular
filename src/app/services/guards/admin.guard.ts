import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AdminGuard implements  CanActivate {

  constructor(
// tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      if ( this._usuarioService.usuario.role === 'ADMIN_ROLE' ) {
      return true;
    } else {
      console.log("Bloqueado por el ADMIN GUARD");

      this._usuarioService.logout();

      return false;
    }
  }
}
