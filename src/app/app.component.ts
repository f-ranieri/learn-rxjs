import { Component } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { delay, filter, map, reduce, concatMap, concat, catchError, flatMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { mapTo } from 'rxjs/operator/mapTo';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor() {}

  start() {
    this.saveOrganizzatore()
      .pipe(
        concatMap(
          result => {
            this.handleSuccessfulResult(result);
            return this.saveOrganizzatoreAssociato();
          }
        ),
        catchError(val => of(`I caught: ${val}`))
        ,
        concatMap(result => {
          this.handleSuccessfulResult(result);
          return this.saveDocuments();
        }),
        map(result => {
          this.handleSuccessfulResults(result);
        }),
      )
      .subscribe();
  }

  saveOrganizzatore(): Observable<string> {
    const i = Math.floor(Math.random() * Math.floor(10));
    if (i < 5) {
      return Observable.of("Organizzatore Salvato" + i).pipe(delay(500));
    } else {
      return Observable.throw(new Error("oops!" + i));
    }
  }

  handleSuccessfulResult(result?: string | {}) {
    if (result) {
      console.log(result);
    }
  }

  handleSaveOrganizzatoreError(result: string) {
    console.log(result);
  }

  handleSuccessfulResults(results: string[]) {
    console.log(results);
  }

  saveOrganizzatoreAssociato(): Observable<string> {
    const i = Math.floor(Math.random() * Math.floor(10));
    if (i < 5) {
      return Observable.of("Organizzatore Associato Salvato" + i).pipe(
        delay(500)
      );
    } else {
      return Observable.throw(new Error("oops!" + i));
    }
  }

  saveDocument(): Observable<string> {
    const i = Math.floor(Math.random() * Math.floor(10));
    if (i < 5) {
      return Observable.of("Documento Salvato" + i).pipe(delay(i * 100));
    } else {
      return Observable.throw(new Error("oops!" + i));
    }
  }

  saveDocuments(): Observable<string[]> {
    return Observable.forkJoin([
      this.saveDocument().catch(error => of(error)),
      this.saveDocument().catch(error => of(error))
    ]);
  }
}

class SavingContext {



}
