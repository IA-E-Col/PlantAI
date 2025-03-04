import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  message!: string;
  private isAuthenticated = false;

  constructor(private http: HttpClient) { }

  public login(p: any): Observable<any> {
    let email = p.email;
    return this.http.get<any>(`http://localhost:8080/api/users/email/${email}`).pipe(
      catchError(error => throwError(() => new Error('Login failed')))
    );
  }

  public authenticateUser(p: any): Observable<any> {
    localStorage.setItem("authUser", JSON.stringify({ user: p }));
    return of(true);
  }

  public isauthenticated(): boolean {
    return this.isAuthenticated;
  }

  public authenticatedOK(): void {
    this.isAuthenticated = true;
  }

  public isadmin(): boolean {
    return true;
  }

  public inscr(p: any): Observable<any> {
    delete p.password1;
    p.username = p.prenom + "." + p.nom;
    return this.http.post<any>("http://localhost:8080/api/users/", p).pipe(
      catchError(error => throwError(() => new Error('User creation failed')))
    );
  }

  public uploadImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    console.log(file);
    formData.append("files", file);
    console.log(formData);
    
    return this.http.post<any>(`http://localhost:8080/api/users/${userId}/uploadImage`, formData).pipe(
      catchError(error => throwError(() => new Error('Image upload failed')))
    );
  }

  public getUserImage(userId: number): Observable<string | null> {
    return this.http.get(`http://localhost:8080/api/users/${userId}/image`, { responseType: 'blob' }).pipe(
      switchMap((imageBlob: Blob) => {
        return new Observable<string>(observer => {
          const reader = new FileReader();
          reader.readAsDataURL(imageBlob);
          reader.onloadend = () => {
            observer.next(reader.result as string);
            observer.complete();
          };
        });
      }),
      catchError(() => of(null)) // Gestion des erreurs si l'image est introuvable
    );
  }
}
