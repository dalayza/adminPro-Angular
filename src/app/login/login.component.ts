import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: []
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;
  auth2: any;

  constructor(
    public router: Router,
// tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '570571722662-n4sa2t1i571nmgeenercmcjqakth9fch.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler( element , {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;
      // console.log( profile );
      this._usuarioService.loginGoogle( token )
                          .subscribe( resp => {
                            // console.log( resp );
                            this.router.navigate(['/dashboard']); // enrutamiento 1
                            // window.location.href = '#/dashboard'; // enrutamiento 2
                          });
      // console.log( token );
    });
  }

  ingresar( forma: NgForm ) {
    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario( null, forma.value.email, forma.value.password );
    this._usuarioService.login( usuario, forma.value.recuerdame )
                        .subscribe( correcto => this.router.navigate(['/dashboard']) );

    // console.log( forma.valid );
    // console.log( forma.value );
    // console.log("Ingresando");
    // this.router.navigate(['dashboard']);
  }
}
