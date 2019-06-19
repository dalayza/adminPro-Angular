import { Component, OnInit } from '@angular/core';

import { MedicoService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../models/medico.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    // tslint:disable-next-line: variable-name
        public _medicoService: MedicoService,
    // tslint:disable-next-line: variable-name
        public _hospitalService: HospitalService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
        public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe( params => {
      const id = params[' id '];

      if ( id !== 'nuevo' ) {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
        .subscribe( hospitales => this.hospitales = hospitales );

    this._modalUploadService.notificacion
        .subscribe( resp => {
          // console.log( resp );

          this.medico.img = resp.medico.img;
        });
  }

  cargarMedico( id: string ) {
    this._medicoService.cargarMedico( id )
                       .subscribe( medico => {
                        //  console.log( medico );

                          this.medico = medico;
                          this.medico.hospital = medico.hospital._id;
                          this.cambioHospital( this.medico.hospital );
                        });
  }

  guardarmedico( f: NgForm ) {
    // console.log( f.valid );
    // console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico )
        .subscribe( medico => {
          // console.log( medico );

          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital( id: string ) {
    this._hospitalService.obtenerHospital( id )
                         .subscribe( hospital => {
                          //  console.log( hospital );

                           this.hospital = hospital;
                         });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }
}
