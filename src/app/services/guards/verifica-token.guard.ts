import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate  {

  constructor(
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {
    // console.log('Token Guard');

    const token = this._usuarioService.token;
    const payload = JSON.parse( atob( token.split('.')[1] ) );
    const expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    // console.log( payload );

    return this.verificaRenueva( payload.exp );
  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 2 * 60 * 60 * 1000 ) ); // Tiempo de Renovar el Token

      // console.log( tokenExp );
      // console.log( ahora );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve( true );
      } else {
        this._usuarioService.renuevaToken()
                            .subscribe( () => {
                              resolve();
                            }, () => {
                              reject();
                              this.router.navigate(['/login']);
                            });
      }

      resolve ( true );
    });
  }

  expirado( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }
}
