export class SignUpRequest {
  public username: string;
  public password: string;
  public validatePassword: string;
  public businessName: string;
  public accountRole: string;

  /**
   * Constructor.
   * @param username The username.
   * @param password The password.
   */
  constructor(username: string, password: string, validatePassword: string, businessName: string, accountRole: string) {
    this.password = password;
    this.username = username;
    this.validatePassword = validatePassword;
    this.businessName = businessName;
    this.accountRole = accountRole;
  }
}