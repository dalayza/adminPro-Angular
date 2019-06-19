import { Injectable } from '@angular/core';

// models
import { Usuario } from '../../models/usuario.model';

// servicios
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map, switchAll } from 'rxjs/operators';
import { Router } from '@angular/router';

// sweet alert 2
import Swal from 'sweetalert2';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

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
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(
      id: string,
      token: string,
      usuario: Usuario,
    ) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.usuario = usuario;
      this.token = token;
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage( resp.id, resp.token, resp.usuario );

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
                        this.guardarStorage( resp.id, resp.token, resp.usuario );

                        return true;
                      })
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
                        // swal('Usuario creado', usuario.email, 'success');
                        return resp.usuario;
                      })
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

                          this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                        }

                        Swal.fire({
                          type: 'success',
                          title: 'Usuario actualizado con exito!',
                          showConfirmButton: false,
                          timer: 2500
                        });

                        return true;
                      })
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

                              this.guardarStorage( id, this.token, this.usuario );
                             })
                             .catch( resp => {
                              console.log( resp );
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

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }
}
