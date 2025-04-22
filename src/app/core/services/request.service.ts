import { Injectable } from "@angular/core";
import { BehaviorSubject, debounceTime, Observable, share } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private requests: string[] = [];
  private _isBusy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isBusy$ = this._isBusy.asObservable().pipe(debounceTime(1), share());

  push(url: string) {
    if (url) {
      this.requests.push(url);
      this._isBusy.next(!!this.requests.length);
    }
  }

  remove(url: string) {
    const idx = this.requests.indexOf(url);
    if (idx !== -1) {
      this.requests.splice(idx, 1);
    }
    this._isBusy.next(!!this.requests.length);
  }
}
