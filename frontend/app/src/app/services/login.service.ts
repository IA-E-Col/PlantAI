import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SignupRequest } from "../model/signup-request";
import { AuthenticationResponse } from "../model/authentication-response";
import { VerificationRequest } from "../model/verification-request";
import { AuthenticationRequest } from "../model/authentication-request";
import { catchError, Observable, of, throwError, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) { }

  register(registerRequest: SignupRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, registerRequest)
      .pipe(catchError(this.handleError));
  }

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest)
      .pipe(catchError(this.handleError));
  }

  verifyCode(verificationRequest: VerificationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/verify`, verificationRequest)
      .pipe(catchError(this.handleError));
  }

  confirm(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/activate-account?emailtoken=${token}`)
      .pipe(catchError(this.handleError));
  }

  public getUserImageUrl(email: string): Observable<string | null> {
    return this.http.get<string>(`${this.baseUrl}/${email}/image`)
      .pipe(catchError(() => of(null)));
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  
}
