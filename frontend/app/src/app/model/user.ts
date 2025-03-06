export enum Role {
  ADMIN,
  Expert,
  Avance,
  Intermediaire,
  Debutant,
  Amateur,
  }
  export class User {
    constructor(
      public id?: number,
      public prenom?: string,
      public nom?: string,
      public email?: string,
      public password?: string,
      public role?: Role,
      public departement?: string,
      public image?: string,
    ) {}
  }
  
  