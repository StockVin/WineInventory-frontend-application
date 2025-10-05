/**
 * Model for sign up request
 */
export class SignUpRequest {
    public username: string;
    public email: string;
    public password: string;
    public validatePassword: string;
    public accountRole: string;
  
    /**
     * Constructor.
     * @param username The username.
     * @param password The password.
     * @param email The email.
     * @param validatePassword The validate password.
     * @param accountRole The account role.
     */
    constructor(username: string, password: string, email: string, validatePassword: string, accountRole: string) {
      this.password = password;
      this.username = username;
      this.email = email;
      this.validatePassword = validatePassword;
      this.accountRole = accountRole;
    }
  }
