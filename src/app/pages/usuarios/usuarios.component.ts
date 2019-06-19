import { Component, OnInit } from '@angular/core';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// sweet alert 2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
// tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
// tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
                        .subscribe( (resp: any) => {
                          // console.log( resp );
                          this.totalRegistros = resp.total;
                          this.usuarios = resp.usuarios;
                          this.cargando = false;
                        });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    // console.log( termino );

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino )
                        .subscribe( (usuarios: Usuario[]) => {
                          // console.log( usuarios );

                          this.usuarios = usuarios;
                          this.cargando = false;
                        });
  }

  borrarUsuario( usuario: Usuario ) {
    // console.log( usuario );

    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire({
        type: 'error',
        title: 'No puede borrar el usuario!',
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }

    Swal.fire({
      title: 'Estas seguro?',
      text: 'Estas a punto que deseas borrar a '  + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario( usuario._id )
                            .subscribe( borrado => {
                              // console.log( borrado );

                              this.cargarUsuarios();
                            });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario )
                        .subscribe();
  }
}
