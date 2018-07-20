import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './core/auth';
import { JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor } from './core/helpers';
import { AlertService, AuthenticationService, UserService } from './core/services';

import { AlertComponent } from './components/alert';
import { ProfileComponent } from './components/profile';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        ProfileComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }