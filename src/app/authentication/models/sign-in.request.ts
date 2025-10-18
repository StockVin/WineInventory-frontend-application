/**
 * Model class for SignInRequest
 */
export class SignInRequest {
    public email: string;
    public password: string;
  
    /**
     * Constructor for SignInRequest
     * @param email The email of the user
     * @param password The password of the user
     */
    constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
  }
