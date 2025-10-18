export class SignUpResponse {
    public accountId: number;
    public username: string;
    public email: string;
  
    constructor(accountId: number, username: string, email: string) {
      this.username = username;
      this.accountId = accountId;
      this.email = email;
    }
  }