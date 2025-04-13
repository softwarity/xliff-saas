import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type ToastLevel = 'primary' | 'secondary' | 'tertiary' | 'warning';

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

  constructor(private router: Router) {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.dismissAll();
      }
    });
  }

  // Méthodes utilitaires pour les cas courants
  success(message: string, duration: number = 5000): ToastRef {
    return this.show({
      message,
      level: 'primary',
      duration
    });
  }

  warning(message: string, duration: number = 5000): ToastRef {
    return this.show({
      message,
      level: 'warning',
      duration
    });
  }

  secondary(message: string, duration: number = 5000): ToastRef {
    return this.show({
      message,
      level: 'secondary',
      duration
    });
  }

  tertiary(message: string, duration: number = 5000): ToastRef {
    return this.show({
      message,
      level: 'tertiary',
      duration
    });
  }

  confirm(message: string): ToastRef {
    return this.show({
      message,
      actions: [ToastAction.YES, ToastAction.NO]
    });
  }

  error(message: string): ToastRef {
    return this.show({
      message,
      level: 'warning',
      actions: [ToastAction.CLOSE]
    });
  }

  // Méthode principale
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