export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;
  public accountId: number;

  /**
   * Constructor.
   * @param id The user id.
   * @param username The username.
   * @param token The generated token.
   */
  constructor(id: number, username: string, token: string, accountId: number) {
    this.token = token;
    this.username = username;
    this.id = id;
    this.accountId = accountId;
  }
}