import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {}

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/register`, user);
    }
}