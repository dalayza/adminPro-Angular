import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { UsuarioService } from 'src/app/services/service.index';
import { Hospital } from '../../models/hospital.model';

import { map } from 'rxjs/operators';

// sweet alert 2
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
// tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService
    ) { }

  crearHospital( nombre: string ) {
    let url = URL_SERVICIOS + '/hospital/';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, { nombre } )
                    .pipe( map( (resp: any) => resp.hospital ) );
  }

  buscarHospital( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get( url )
                    .pipe( map( (resp: any) => resp.hospitales ) );
  }

  cargarHospitales() {
    const url = URL_SERVICIOS + '/hospital';
    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => {
                        this.totalHospitales = resp.total;
                        return resp.hospitales;
                      })
                    );
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url )
                    .pipe( map( (resp: any) => resp.hospital ) );
  }

  borrarHospital( id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( map( resp => {
                      Swal.fire({
                        type: 'success',
                        title: 'Hospital Borrado!',
                        text: 'El hospital ha sido eliminado de forma correcta'
                      });
                    }) );
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital )
                    .pipe( map( (resp: any) => {
                        Swal.fire({
                          type: 'success',
                          title: 'Hospital Actualizado!',
                          text: hospital.nombre
                        });
                        return resp.hospital;
                      })
                    );
  }
}
