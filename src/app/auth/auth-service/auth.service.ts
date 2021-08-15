import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import UserModel from '../model/User.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventComing = 'coming';
  private userSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(new UserModel());
  private userObservable = this.userSubject.asObservable();

  constructor(private socket: Socket,
              private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      Email: email,
      Password: password
    };
    return this.http.post(`${environment.serverURL}/api/login`, body);
  }

  setUser(user: UserModel): void {
    this.userSubject.next(user);
  }

  getUserObservable(): Observable<UserModel> {
    return this.userObservable;
  }

  sendComing(data: any): void {
    this.socket.emit(this.eventComing, data);
  }

}
