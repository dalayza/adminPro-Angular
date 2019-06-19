import { Component, OnInit } from '@angular/core';

import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';

import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// sweet alert 2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor(
// tslint:disable-next-line: variable-name
    public _hospitalService: HospitalService,
// tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe( () => this.cargarHospitales() );
  }

  crearHospital() {
    Swal.fire({
    title: 'Ingrese el nombre del hospital',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Crear',
    showLoaderOnConfirm: true,
    preConfirm: (valor) => {
      if ( !valor || valor.lenght === 0 ) {
        return;
      }

      this._hospitalService.crearHospital( valor )
                                  .subscribe( () => this.cargarHospitales() );
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        type: 'success',
        title: 'Hospital creado!',
        text: 'El hospital ha sido creado de forma correcta'
      });
    }
  });
  }

  buscarHospitales( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital( termino )
                         .subscribe( hospitales => this.hospitales = hospitales );
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales()
                         .subscribe( hospitales => this.hospitales = hospitales );
  }

  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital)
                         .subscribe();
  }

  borrarHospital( hospital: Hospital ) {
    this._hospitalService.borrarHospital( hospital._id )
                         .subscribe( () => this.cargarHospitales() );

  }

  actualizarImagen( hospital: Hospital ) {
    this._modalUploadService.mostrarModal( 'hospitales', hospital._id );
  }
}
