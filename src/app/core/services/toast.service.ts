import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export type ToastLevel = 'primary' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  value: string;
}

export namespace ToastAction {
  export const CLOSE = {label: $localize `:@@TOAST_ACTION_CLOSE:Close`, value: 'close'};
  export const DISMISS = {label: $localize `:@@TOAST_ACTION_DISMISS:Dismiss`, value: 'dismiss'};
  export const CONFIRM = {label: $localize `:@@TOAST_ACTION_CONFIRM:Confirm`, value: 'confirm'};
  export const CANCEL = {label: $localize `:@@TOAST_ACTION_CANCEL:Cancel`, value: 'cancel'};
  export const YES = {label: $localize `:@@TOAST_ACTION_YES:Yes`, value: 'yes'};
  export const NO = {label: $localize `:@@TOAST_ACTION_NO:No`, value: 'no'};
  export const OK = {label: $localize `:@@TOAST_ACTION_OK:OK`, value: 'ok'};
  export const ERROR = {label: $localize `:@@TOAST_ACTION_ERROR:Error`, value: 'error'};
  export const SUCCESS = {label: $localize `:@@TOAST_ACTION_SUCCESS:Success`, value: 'success'};
  export const WARNING = {label: $localize `:@@TOAST_ACTION_WARNING:Warning`, value: 'warning'};
}

export interface ToastConfig {
  message: string;
  level?: ToastLevel;
  duration?: number;
  actions?: ToastAction[];
}

export interface Toast extends ToastConfig {
  id: number;
  duration: number;
}

export interface ToastRef {
  id: number;
  afterClose: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;
  private actionSubjects = new Map<number, Subject<string>>();

  toasts$ = this.toasts.asObservable();

  show(config: ToastConfig): ToastRef {
    const id = this.nextId++;
    const actionSubject = new Subject<string>();
    this.actionSubjects.set(id, actionSubject);

    const toast: Toast = {
      id,
      message: config.message,
      level: config.level || 'primary',
      duration: config.actions && config.actions.length > 0 ? 0 : (config.duration ?? 5000),
      actions: config.actions
    };

    this.toasts.next([...this.toasts.value, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return {
      id,
      afterClose: actionSubject.asObservable()
    };
  }

  dismiss(id: number, value?: string): void {
    const subject = this.actionSubjects.get(id);
    if (subject) {
      subject.next(value || ToastAction.DISMISS.value);
      subject.complete();
      this.actionSubjects.delete(id);
    }
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toasts.value.forEach(toast => this.dismiss(toast.id));
  }
} 