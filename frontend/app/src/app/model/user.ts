export enum Role {
    Admin,
    // Ajoutez plus de catégories ici si nécessaire
  }
  export class User {
    constructor(
      public id?: number,
      public prenom?: string,
      public nom?: string,
      public email?: string,
      public password?: string,
      public role?: Role,
    ) {}
  }
  