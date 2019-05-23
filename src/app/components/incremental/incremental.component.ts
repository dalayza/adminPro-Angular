import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incremental',
  templateUrl: './incremental.component.html',
  styles: []
})
export class IncrementalComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

// tslint:disable-next-line: no-input-rename
    @Input('nombre') leyenda: string = 'Leyenda';
    @Input() progreso: number = 50;

    @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log('Leyenda: ', this.leyenda);
    // console.log('Progreso: ', this.progreso);
  }

  ngOnInit() {
    // console.log('Leyenda: ', this.leyenda);
    // console.log('Progreso: ', this.progreso);
  }

  onChanges( newValue: number) {
    //   console.log( newValue );

    // const elemHTML: any = document.getElementsByName('progreso')[0];
    //   console.log( elemHTML.value );
    //   console.log( this.txtProgress );

    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    // elemHTML.value = this.progreso;

    this.txtProgress.nativeElement.value = this.progreso;

    // this.cambiarValor.emit( this.progreso ); // descomentar
  }

  cambiarValor( valor: number ) {
    if ( this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }

    if ( this.progreso <= 0  && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;

    // this.cambiarValor.emit( this.progreso ); // descomentar

    this.txtProgress.nativeElement.focus();
  }

}
