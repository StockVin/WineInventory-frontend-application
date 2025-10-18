export class SignInResponse {
    public id: number;
    public email: string;
    public token: string;
    public accountId: number;
  
    /**
     * Constructor.
     * @param id The user id.
     * @param email The email.
     * @param token The generated token.
     * @param accountId
     */
    constructor(id: number, email: string, token: string, accountId: number) {
      this.token = token;
      this.email = email;
      this.id = id;
      this.accountId = accountId;
    }
  }
