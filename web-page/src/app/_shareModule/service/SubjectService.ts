import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SubjectService {
    private subject = new BehaviorSubject<any>(0);
    sendMessage(message: any) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next(0);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getSubject(): BehaviorSubject<any> {
        return this.subject;
    }


}
