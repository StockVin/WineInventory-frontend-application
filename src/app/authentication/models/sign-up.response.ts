export class SignUpResponse {
  public accountId: number;
  public username: string;

  constructor(accountId: number, username: string) {
    this.username = username;
    this.accountId = accountId;
  }
}