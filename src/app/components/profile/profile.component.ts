import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../../core/models';
import { UserService } from '../../core/services';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['../../styles/_core.scss'],
})
export class ProfileComponent implements OnInit {
    authenticatedUser: User;
    users: User[] = [];

    constructor(
        private userService: UserService,
        private router: Router,
    ) {
        this.authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
        this.router.navigate(['/login']);
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
}