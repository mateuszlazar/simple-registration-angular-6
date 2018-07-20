import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../../core/services';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['../../styles/_core.scss'],
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get controls() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                    this.alertService.success('Registration successful');
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
