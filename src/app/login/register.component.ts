import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Service
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

// sweet alert 2
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
  styles: []
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
// tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      correo: new FormControl( null, Validators.email ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      condiciones: new FormControl( false ),
    }, { validators: this.sonIguales( 'password', 'password2' ) });

    // llenar el formulario de forma automatica
    // this.forma.setValue({
    //   nombre: 'Denis',
    //   correo: 'denis@denis.com',
    //   password: '123',
    //   password2: '1234',
    //   condiciones: true
    // });
  }

  registrarUsuario() {
    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.condiciones ) {
      // console.log('Debe de aceptar las condiciones' );
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Debe de aceptar las condiciones!'
      });

      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario( usuario )
                        .subscribe( resp => {
                          // console.log('Respuesta: ', resp);

                          this.router.navigate(['/login']);
                        });

    // console.log('Forma valida', this.forma.valid );
    // console.log( this.forma.value );
  }

  sonIguales( campo1: string, campo2: string ) {
    return ( group: FormGroup ) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }
      return {
        sonIguales: true
      };
    };
  }
}
