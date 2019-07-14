import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable().subscribe(
      numero => console.log("subs: ", numero),
      error => console.error("Error en el obs", error),
      () => console.log("El observable termino!"),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La pagina se va cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next( salida );
        // if ( contador === 3 ) {
        //   clearInterval( intervalo );
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   observer.error("Auxilio!");
        // }
      }, 500);
    })
    .pipe(
      map( (resp: any) => {
        return resp.valor;
      }),
      filter( ( valor, index ) => {
        // console.log("Filter: ", valor, index);
        if ( (valor % 2) === 1) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      })
    );
  }
}
