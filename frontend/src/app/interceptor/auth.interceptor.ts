import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { UserService } from '../services';
import { Router } from '@angular/router';
import { KeycloakToken } from '../models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing;
    private refreshTokenSubject: BehaviorSubject<any>;


    constructor(private userService: UserService, private router: Router) {
        this.isRefreshing = false;
        this.refreshTokenSubject = new BehaviorSubject<any>(null);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.userService.getAuthToken();
        const authReq = this.addTokenHeader(request, token);

        return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
            if (error && !this.isRefresh(authReq) && error.status === 401) {
                return this.handle401Error(authReq, next);
            }

            return throwError(() => new Error(error.message));
        }));
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = this.userService.getAuthToken();

            if (token) {
                return this.userService.refreshToken().pipe(switchMap(token => {
                    this.isRefreshing = false;

                    this.userService.setAuthToken(token);
                    this.refreshTokenSubject.next(token);

                    return next.handle(this.addTokenHeader(request, token));
                }), catchError((error) => {
                    this.isRefreshing = false;

                    return throwError(() => {
                        this.userService.clearAuthToken();
                        this.router.navigate(["login"]);
                    });
                }));
            }
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: KeycloakToken | null) {
        return token && !this.isRefresh(request) ? request.clone({ headers: request.headers.set('Authorization', `${token.token_type} ${token.access_token}`) }) : request;
    }

    private isRefresh(request: HttpRequest<any>): boolean {
        return request.url.includes("/auth/token");
    }
}
