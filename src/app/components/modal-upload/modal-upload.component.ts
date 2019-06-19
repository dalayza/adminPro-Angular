import { Component, OnInit } from '@angular/core';

// sweet alert 2
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;

  constructor(
// tslint:disable-next-line: variable-name
    public _subirArchivoService: SubirArchivoService,
// tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }

  seleccionImage( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    // console.log( archivo );

    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'EL archivo seleccionado no es una imagen!'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => {
      // console.log( reader.result );
      this.imagenTemp = reader.result;
    };
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(
                                this.imagenSubir,
                                this._modalUploadService.tipo,
                                this._modalUploadService.id,
                                )
                              .then( resp => {
                                // console.log( resp );
                                this._modalUploadService.notificacion.emit( resp );

                                this.cerrarModal();
                              })
                              .catch( err => {
                                console.log('Error en la carga...');
                              });
  }
}
