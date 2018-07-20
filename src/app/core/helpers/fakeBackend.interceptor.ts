import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

const passwordHash = require('password-hash');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // delayed observable to simulate API call
        return of(null).pipe(mergeMap(() => {

            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                let filteredUsers = users.filter(user => {
                    return user.email === request.body.email && passwordHash.verify(request.body.password, user.password);
                });

                if (filteredUsers.length) {
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        email: user.email,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'Email or password is incorrect' } });
                }
            }

            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                let newUser = request.body;
                const duplicateUser = users.filter(user => { return user.email === newUser.email; }).length;

                if (duplicateUser) {
                    return throwError({ error: { message: 'Email "' + newUser.email + '" already exist in database' } });
                }

                newUser.id = users.length + 1;
                newUser.password = passwordHash.generate(request.body.password);
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return of(new HttpResponse({ status: 200 }));
            }

            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);

                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            return next.handle(request);
        }))
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}
