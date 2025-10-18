import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {SignUpRequest} from '../models/sign-up.request';
import {SignUpResponse} from '../models/sign-up.response';
import {SignInResponse} from '../models/sign-in.response';
import {SignInRequest} from '../models/sign-in.request';
import {Injectable} from '@angular/core';

/**
 * Service for handling authentication operations.
 * @summary
 * This service is responsible for handling authentication operations like sign-up, sign-in, and sign-out.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  basePath: string = `${environment.baseServerUrl}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Constructor for the AuthenticationService.
   * @param router The router service.
   * @param http The HttpClient service.
   */
  constructor(
    private router: Router, 
    private http: HttpClient,
  ) {
    this.initializeAuthState();
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  /**
   * Sign up a new user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the user's id and username are logged and the user is navigated to the sign-in page.
   * If the request fails, an error message is logged and the user is navigated to the sign-up page.
   * @param signUpRequest The {@link SignUpRequest} object containing the user's username and password.
   * @returns The {@link SignUpResponse} object containing the user's id and username.
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log('Response backend:', response);
          console.log(`Signed up as ${response.username} with id ${response.accountId}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  private initializeAuthState() {
    const token = localStorage.getItem('token');
    const accountId = localStorage.getItem('accountId');
    const username = localStorage.getItem('username');
    const accountRole = localStorage.getItem('accountRole');

    if (token && accountId) {
      this.signedIn.next(true);
      this.signedInUserId.next(Number(accountId));
      this.signedInUsername.next(username || '');

      console.log('Usuario restaurado desde localStorage: ', {
        username, accountId, accountRole
      });
    }
  }

  /**
   * Sign in a user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the signedIn, signedInUserId, and signedInUsername are set to true,
   * the user's id, and the user's username respectively.
   * The token is stored in the local storage and the user is navigated to the home page.
   * If the request fails, the signedIn, signedInUserId, and signedInUsername are set to false, 0, and
   * an empty string respectively.
   * An error message is logged and the user is navigated to the sign-in page.
   * @param signInRequest The {@link SignInRequest} object containing the user's username and password.
   * @returns The {@link SignInResponse} object containing the user's id, username, and token.
   */
  signIn(signInRequest: SignInRequest) {
    this.http.post<any>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          const { id, username, token, accountId } = response;

          this.signedIn.next(true);
          this.signedInUserId.next(id);
          this.signedInUsername.next(username);

          localStorage.setItem('token', token);
          localStorage.setItem('accountId', accountId.toString());
          localStorage.setItem('username', username);

          console.log('✅ Account status:', status);

              if (status === 'INACTIVE') {
                this.router.navigate(['/subscription-choose']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            },
            error: (err: any) => {
              console.error('❌ Error fetching account status:', err);
              this.router.navigate(['/sign-in']);
            }
          });
        }

  /**
   * Sign out the user.
   * @summary
   * This method sets the signedIn, signedInUserId, and signedInUsername to their default values,
   * removes the token from the local storage, and navigates to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('accountId');
    this.router.navigate(['/sign-in']).then();
  }

  getCurrentUser() {
    return {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      accountId: Number(localStorage.getItem('accountId')),
      accountRole: localStorage.getItem('accountRole')
    };
  }
}

// auth-utils.ts
export function getAccountIdFromStorage(): number | null {
  const id = localStorage.getItem('accountId');
  return id ? Number(id) : null;
}
