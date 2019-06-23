import { Injectable } from '@angular/core';

// models
import { Usuario } from '../../models/usuario.model';

// servicios
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// sweet alert 2
import Swal from 'sweetalert2';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
// tslint:disable-next-line: variable-name
    public _subirArchivoService: SubirArchivoService
  ) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  estaLogeado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(
      id: string,
      token: string,
      usuario: Usuario,
      menu: any
    ) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                        // console.log( resp );

                        return true;
                      })
                    );
  }

  login( usuario: Usuario, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email); // boton recordar en el localstorage
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );

                        return true;
                      })
                    ).pipe(
                      catchError(err =>
                        of([
                          console.log('HTTP Error', err.status),
                          Swal.fire(
                            'Error Login',
                            err.error.mensaje,
                            'error'
                          )
                        ])
                      )
                      );
  }

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
                    .pipe(
                      map( (resp: any) => {
                        Swal.fire({
                          type: 'success',
                          title: 'Usuario creado con exito!',
                          showConfirmButton: false,
                          timer: 2500
                        });
                        return resp.usuario;
                      })
                    ).pipe(
                      catchError(err =>
                        of([
                          console.log('HTTP Error', err.status),
                          Swal.fire(
                            err.error.mensaje,
                            err.error.errors.mensaje,
                            'error'
                          )
                        ])
                      )
                      );
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    // console.log( url );

    return this.http.put( url, usuario )
                    .pipe(
                      map( (resp: any) => {
                        // this.usuario = resp.usuario;

                        if ( usuario._id === this.usuario._id ) {
                          const usuarioDB: Usuario = resp.usuario;

                          this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
                        }

                        Swal.fire({
                          type: 'success',
                          title: 'Usuario actualizado con exito!',
                          showConfirmButton: false,
                          timer: 2500
                        });

                        return true;
                      })
                    ).pipe(
                      catchError(err =>
                        of([
                          console.log('HTTP Error', err.status),
                          Swal.fire(
                            err.error.mensaje,
                            err.error.errors.mensaje,
                            'error'
                          )
                        ])
                      )
                      );
  }

  cambiarImagen( archivo: File, id: string ) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
                             .then( (resp: any) => {
                              // console.log( resp );

                              this.usuario.img = resp.usuario.img;
                              Swal.fire({
                                type: 'success',
                                title: 'Imagen actualizada con exito!',
                                showConfirmButton: false,
                                timer: 2500
                              });

                              this.guardarStorage( id, this.token, this.usuario, this.menu );
                             })
                             .catch( resp => {
                              // console.log( resp );
                             });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {
    // console.log( termino );

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.usuarios ) );
  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        Swal.fire(
                          'Eliminado!',
                          'Tu usuario ha sido eliminado.',
                          'success'
                        );

                        return true;
                      })
                    );
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }
}
