import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  ref = firebase.firestore().collection('users');

  constructor(private firestore: AngularFirestore) {
  }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  getCurrentUser(userId): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('uid', '==', userId)).snapshotChanges();
  }

  createUser(user) {
    return this.ref.add(user);
  }

}
