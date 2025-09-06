import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private usersListUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';
  selectedUser = signal<any | null>(null);

  constructor(private http: HttpClient) { }

  fetchUsersList(): Observable<User[]> {
    return this.http.get<User[]>(this.usersListUrl);
  }

  setSelectedUser(user: User | null) {
    this.selectedUser.set(user);
  }

 
}