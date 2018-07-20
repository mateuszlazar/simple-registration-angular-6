import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.subject.next();
            }
        });
    }

    error(message: string) {
        this.subject.next({ type: 'error', text: message });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string) {
        this.subject.next({ type: 'success', text: message });
    }

}