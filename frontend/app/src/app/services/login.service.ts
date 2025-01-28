import { Injectable } from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  message! : string
  private isAuthenticated = false;
  constructor(private http:HttpClient) { }

  public login(p :any):Observable<any>{

    let email = p.email
    return   this.http.get<any>(`http://localhost:8080/api/users/email/${email}`).pipe(
      catchError(error => {
        return error;   // ici je dois faire test pour verifier password, c objectif de pipe
      })               // faire des traitments ici
    );

  }



  public authenticateUser(p :any):Observable<any>{
    localStorage.setItem("authUser", JSON.stringify({user:p}))
    return of(true)
  }

  public isauthenticated(): boolean {
    return this.isAuthenticated;
  }
  public authenticatedOK(): void {
    this.isAuthenticated = true ;
  }

  public isadmin() : boolean{
    // code
    return true
  }

  public inscr(p :any):Observable<any>{
    delete p.password1;
    p.username = p.prenom +"."+p.nom
    return this.http.post<any>("http://localhost:8080/api/users/", p).pipe(
      catchError(error => {
        return error;
      })
    );
  }




}
