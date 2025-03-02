import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user'; // Assurez-vous que le chemin est correct
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base URL de l'API backend pour les utilisateurs
  private baseUrl = 'http://localhost:8080/api/users';
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
      // Vous pouvez gérer ici le cas où le token n'existe pas, par exemple en redirigeant l'utilisateur
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
        catchError((error: any) => throwError('Erreur lors de la récupération des détails de l\'utilisateur'))
      );
  }

  /**
   * Ajoute un nouvel utilisateur.
   */
  ajouterUser(user: User): Observable<User> {
    return this.http.post<User>(this.ajouterUrl, user, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de l\'ajout de l\'utilisateur'))
      );
  }

  /**
   * Récupère la liste de tous les utilisateurs.
   */
  listUser(): Observable<User[]> {
    return this.http.get<User[]>(this.listUrl, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la récupération de la liste des utilisateurs'))
      );
  }

  /**
   * Supprime un utilisateur par son ID.
   */
  deleteUser(id: number): Observable<void> {
    const url = `${this.deleteUrl}/${id}`;
    return this.http.delete<void>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la suppression de l\'utilisateur'))
      );
  }

  /**
   * Met à jour un utilisateur par son ID.
   */
  modifierUser(id: number, user: User): Observable<User> {
    const url = `${this.modifierUrl}/${id}`;
    return this.http.put<User>(url, user, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la modification de l\'utilisateur'))
      );
  }

  /**
   * Récupère les détails d'un utilisateur à partir de son email.
   */
  getUserDetails(email: string): Observable<User> {
    const url = `${this.baseUrl}/getbyemail/${email}`;
    return this.http.get<User>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la récupération des détails de l\'utilisateur'))
      );
  }

  /**
   * Récupère un utilisateur par son ID.
   */
  getUser(id: number): Observable<User> {
    const url = `${this.baseUrl}/get/${id}`;
    return this.http.get<User>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la récupération de l\'utilisateur'))
      );
  }

  /**
   * Recherche des utilisateurs en fonction d'un mot-clé.
   */
  searchUsers(keyword: string): Observable<User[]> {
    const url = `${this.searchUrl}?keyword=${keyword}`;
    return this.http.get<User[]>(url, this.getHttpOptions())
      .pipe(
        catchError((error: any) => throwError('Erreur lors de la recherche d\'utilisateurs'))
      );
  }
}
