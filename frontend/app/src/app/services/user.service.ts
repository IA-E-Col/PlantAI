import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user'; // Vérifiez que le chemin est correct
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base URL de l'API backend pour les utilisateurs
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private ajouterUrl = `${this.baseUrl}/add`;
  private listUrl = `${this.baseUrl}/all`;
  private modifierUrl = `${this.baseUrl}/update`;
  private deleteUrl = `${this.baseUrl}/delete`;
  // Pour la recherche, on suppose que l'endpoint est : /searchUser?keyword=
  private searchUrl = `${this.baseUrl}/searchUser`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère le token stocké dans le localStorage.
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Configure les options HTTP avec les en-têtes nécessaires.
   * Si un token est présent, il est ajouté dans l'en-tête Authorization.
   */
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.getToken();
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      };
    } else {
      throw new Error('Token not found');
    }
  }

  /**
   * Récupère l'ID d'un utilisateur à partir de son email.
   */
  getUserID(email: string): Observable<number> {
    const url = `${this.baseUrl}/getidbyemail/${email}`;
    return this.http.get<number>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de la récupération des détails de l\'utilisateur'));
        })
      );
  }

  /**
   * Ajoute un nouvel utilisateur.
   */
  ajouterUser(user: User): Observable<User> {
    return this.http.post<User>(this.ajouterUrl, user, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de l\'ajout de l\'utilisateur'));
        })
      );
  }

  /**
   * Récupère la liste de tous les utilisateurs.
   */
  listUser(): Observable<User[]> {
    return this.http.get<User[]>(this.listUrl, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la récupération de la liste des utilisateurs', error);
          return throwError(() => new Error('Erreur lors de la récupération de la liste des utilisateurs'));
        })
      );
  }

  /**
   * Supprime un utilisateur par son ID.
   */
  deleteUser(id: number): Observable<void> {
    const url = `${this.deleteUrl}/${id}`;
    return this.http.delete<void>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de la suppression de l\'utilisateur'));
        })
      );
  }

  /**
   * Met à jour un utilisateur par son ID.
   */
  modifierUser(id: number, user: User): Observable<User> {
    const url = `${this.modifierUrl}/${id}`;
    return this.http.put<User>(url, user, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la modification de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de la modification de l\'utilisateur'));
        })
      );
  }

  /**
   * Récupère les détails d'un utilisateur à partir de son email.
   */
  getUserDetails(email: string): Observable<User> {
    const url = `${this.baseUrl}/getbyemail/${email}`;
    return this.http.get<User>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de la récupération des détails de l\'utilisateur'));
        })
      );
  }

  /**
   * Récupère un utilisateur par son ID.
   */
  getUser(id: number): Observable<User> {
    const url = `${this.baseUrl}/get/${id}`;
    return this.http.get<User>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la récupération de l\'utilisateur', error);
          return throwError(() => new Error('Erreur lors de la récupération de l\'utilisateur'));
        })
      );
  }

  /**
   * Recherche des utilisateurs en fonction d'un mot-clé.
   */
  searchUsers(keyword: string): Observable<User[]> {
    const url = `${this.searchUrl}?keyword=${keyword}`;
    return this.http.get<User[]>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de la recherche d\'utilisateurs', error);
          return throwError(() => new Error('Erreur lors de la recherche d\'utilisateurs'));
        })
      );
  }

  /**
   * Récupère l'URL de l'image de profil d'un utilisateur via son email.
   * NB: Assurez-vous que le backend expose un endpoint GET correspondant.
   */
  getUserImageByEmail(email: string): Observable<string | null> {
    const url = `${this.baseUrl}/getUserImageByEmail/${email}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob) => {
        return new Observable<string>(observer => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // On obtient la base64
            observer.next(reader.result as string);
            observer.complete();
          };
          reader.onerror = err => observer.error(err);
          reader.readAsDataURL(blob);
        });
      }),
      catchError(() => of(null))
    );
  
  }
  
  uploadUserImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    // Récupération du token JWT
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.post<string>(`${this.baseUrl}/uploadImage`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Image upload error:', error);
        return throwError(() => new Error('Error uploading image'));
      })
    );
  }
// Par exemple dans user.service.ts
public getUserImageUrlByEmail(email: string): Observable<string | null> {
  return this.http.get<string>(`${this.baseUrl}/getUserImageUrlByEmail/${email}`).pipe(
    catchError(() => of(null))
  );
}

}
