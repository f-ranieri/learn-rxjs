import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {}

  start() {
    this.saveOrganizzatore().concatMap( success => this.saveOrganizzatoreAssociato(), err => console.log('first Failed'))
      .subscribe(
        success => {
          console.log(success);
        },
        err => {
          console.log(err);
        }
      );
  }

  saveOrganizzatore(): Observable<string> {
    const i = Math.floor(Math.random() * Math.floor(10));
    if (i < 5) {
      return Observable.of('FirstSave' + i).pipe(delay(1000));
    } else {
      return Observable.throw(new Error('oops!' + i));
    }
  }

  saveOrganizzatoreAssociato(): Observable<string> {
    return Observable.create(observer => {
      setTimeout(() => {
        observer.next('Organizzatore Associato Salvato');
        observer.complete();
      }, 2000);
    });
  }

  saveDocumento(): Observable<string> {
    return Observable.create(observer => {
      setTimeout(() => {
        observer.next('Documento Salvato');
      }, 1000);
    });
  }

  saveDocuments(): Observable<string>[] {
    return [this.saveDocumento(), this.saveDocumento()];
  }
}
