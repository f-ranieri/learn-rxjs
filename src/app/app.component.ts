import { Component } from "@angular/core";
import { Observable, pipe } from "rxjs";
import { delay, filter, map, reduce, concatMap, concat, catchError, flatMap, defaultIfEmpty, mergeMap } from "rxjs/operators";
import { forkJoin } from "rxjs/observable/forkJoin";
import { of } from "rxjs/observable/of";
import { mapTo } from "rxjs/operator/mapTo";
import { switchMap } from "rxjs/operator/switchMap";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  saveItemRequest1: SaveItemRequest = { id: "1", name: "apple" };

  saveItemRequest2: SaveItemRequest = { id: "0", name: "banana" };

  constructor() {}


  start() {
    this.saveItem(this.saveItemRequest1)
      .catch(error => this.handleFailResult(this.saveItemRequest1, error))
      .pipe(
        concatMap(result => {
          this.handleSuccessfulResult(this.saveItemRequest1, result);
          return this.saveItem(this.saveItemRequest2).catch(error => this.handleFailResult(this.saveItemRequest2, error));
        }),
        concatMap(result => {
          this.handleSuccessfulResult(this.saveItemRequest2, result);
          return this.saveMultipleItems();
        }),
        map(result => console.table(result))
      )
      .subscribe();
  }

  saveItem(request: SaveItemRequest): Observable<SaveItemResponse> {
    if (request.id == "9") {
      return Observable.of(new SaveItemResponse());
    }
    if (request.id != "0") {
      const response = new SaveItemResponse();
      response.message = `${request.name} saved!`;
      return Observable.of(response).pipe(delay(1000));
    } else {
      return Observable.throw(new Error(`${request.name} not saved!`));
    }
  }

  handleFailResult(request: SaveItemRequest, error: any): Observable<{}> {
    console.log(`${request.id} failed with error: ${error}`);
    return Observable.empty();
  }

  handleSuccessfulResult(request: SaveItemRequest, result: string|{}) {
    console.log(`${request.id} result: `, result);
  }

  saveMultipleItems(): Observable<string[]> {
    return Observable.forkJoin([
      this.saveItem({ id: "3", name: "pear" }).catch(error => of(error)),
      this.saveItem({ id: "9", name: "cherry" }).catch(error => of(error))
    ]);
  }
}

class SaveItemRequest {
  id: string;
  name: string;
}

class SaveItemResponse {
  message: string;
}
