import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { environmentConfig } from '../services/config-asset-loader.service';
import { ContentLoaderService, MODAL_FORM_SERVICE, MODAL_MESSAGE_SERVICE, RIGHT_PANE_SERVICE } from '../services/content-loader.service';
import { HttpManagerService } from '../services/http-manager.service';
import { WINDOW } from '../services/window.service';
import { DialogComponent } from '../layouts/dialog/dialog.component';

export const enum authEvent {
    NO_AUTH_TOKEN,
    GUEST_TOKEN_ACQUIRED,
    GUEST_TOKEN_EXPIRED,
    GUEST_TOKEN_REFRESHED
}

const storageKeys = {
    authToken: 'as-token'
};

interface ITokenRequest {
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface ITokenResponse {
    access_token: string;
    expires_in: string;
    token_type: string;
    acquired?: moment.Moment;
}

class AuthToken {
    public accessToken: string;
    public expiresIn: string;
    public tokenType: string;
    public acquired: moment.Moment;

    constructor(_token: ITokenResponse) {
        this.accessToken = _token.access_token;
        this.expiresIn = _token.expires_in;
        this.tokenType = _token.token_type;
        this.acquired = _token.acquired ? moment(_token.acquired) : moment();
    }

    /**
     * Verifies if a token is valid.
     * @param token - The token to check
     * returns - A boolean value whether or not the token is valid.
     */
    public isValid(): boolean {
        // We are currently only checking whether or not the expiration date is valid
        const tokenExpiration = moment(this.acquired).add(+this.expiresIn, 'seconds');
        const now = moment();

        return tokenExpiration.isSameOrAfter(now);
    }

    /**
     * Gets the amount of seconds until this token should expire
     * returns - Seconds left until expiration
     */
    public getExpirationTimeSeconds(): number {
        // Find out the time when the token shouljd expire
        const expiresAtTime = this.acquired.add(+this.expiresIn, 'seconds');

        // Calculate how many seconds until the expire time
        return expiresAtTime.diff(moment(), 'seconds');
    }

    /** Transform this token into the server response format of ITokenResponse */
    public asTokenResponse(): ITokenResponse {
        return {
            access_token: this.accessToken,
            acquired: this.acquired,
            expires_in: this.expiresIn,
            token_type: this.tokenType
        };
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isSessionStorageAvailable: boolean = !!this._window.sessionStorage;
    private _token: AuthToken = null;
    private _guestAuthTimeout: any = null;
    private _router: Router;
    private _rightPaneService: ContentLoaderService;
    private _modalFormService: ContentLoaderService;
    private _modalMessageService: ContentLoaderService;

    get authorizationHeader(): string {
        return this._token
            ? `${this._token.tokenType} ${this._token.accessToken}`
            : '';
    }

    public authStatus: BehaviorSubject<authEvent> = new BehaviorSubject(authEvent.NO_AUTH_TOKEN);

    constructor(
        private _httpManager: HttpManagerService,
        private _injector: Injector,
        @Inject(WINDOW) private _window: Window
    ) {
        // On window focus, reset the token timer as many browsers pause the timeout counter
        // when the browser in minimized, not active, or the computer goes to sleep.
        this._window.onfocus = () => {
            if (this._token && this._guestAuthTimeout) {
                if (this._token.isValid() && this.setTokenExpirationTimer()) {
                    // Token timer was successfully renewed
                } else {
                    // Token is no longer valid, so call the expiration method
                    this.onGuestTokenExpiration();
                }
            } else {
                // Fallback in case the user doesn't have a token. Unsure how this might happen?
                this.onGuestTokenExpiration();
            }
        };
    }

    /**
     * Obtains a guest token. This will resue an existing token from storage if valid
     * otherwise it will request a new one from the server
     * returns - A promise that will be resolved when a calid token is obtained
     */
    public obtainGuestToken(): Promise<AuthToken> {
        // Attempt to find an existing valid token from storage prior to requesting a new one
        const existingToken = this.retrieveTokenFromStorage();
        if (existingToken) {
            if (existingToken.isValid()) {
                // Set the token to be the existing one from storage
                this._token = existingToken;
                this.setTokenExpirationTimer();
                this.authStatus.next(authEvent.GUEST_TOKEN_ACQUIRED);
                return Promise.resolve(existingToken);
            } else {
                // Since it's not valid, destroy the existing token, but continue on to retrieve a new one
                this.destroyToken();
            }
        }

        const requestObj: ITokenRequest = {
            client_id: environmentConfig.guestAuthClientId,
            client_secret: environmentConfig.guestAuthClientSecret,
            grant_type: environmentConfig.guestAuthGrantType
        };

        return this._httpManager
            .post<ITokenResponse>(`${environmentConfig.baseApi}/oauth/token`, requestObj)
            .then<AuthToken>((response: ITokenResponse) => {
                const token: AuthToken = new AuthToken(response);

                if (token.isValid()) {
                    this._token = token;
                    this.saveTokenToStorage(token);
                    this.setTokenExpirationTimer();
                    this.authStatus.next(authEvent.GUEST_TOKEN_ACQUIRED);
                    return token;
                } else {
                    return Promise.reject('Token obtained is not valid.');
                }
            })
            .catch(err => {
                /* TODO (JAL): Error handling? */
                return err;
            });

    }

    /**
     * Sets a timer so it will automatically expire the token
     * returns - Boolean result whether or not the new timer setup was successful.
     */
    private setTokenExpirationTimer(): boolean {
        try {
            // Calculate how many seconds until the expire time (Subtract 5 sec for a buffer)
            const expiresInSec = this._token.getExpirationTimeSeconds() - 5;

            if (expiresInSec <= 0) {
                throw new Error('Token expiration (with buffer) has already passed.');
            }

            if (this._guestAuthTimeout) {
                clearTimeout(this._guestAuthTimeout);
            }

            // Set a timeout for the expiration of the token to get a new token and send user to the menu
            this._guestAuthTimeout = setTimeout(() => this.onGuestTokenExpiration(), expiresInSec * 1000);
            return true;
        } catch (ex) {
            return false;
        }
    }

    private ensureInjectedServices(): void {
        if (!this._router) {
            this._router = this._injector.get(Router);
        }

        if (!this._rightPaneService) {
            this._rightPaneService = this._injector.get<ContentLoaderService>(RIGHT_PANE_SERVICE);
        }

        if (!this._modalFormService) {
            this._modalFormService = this._injector.get<ContentLoaderService>(MODAL_FORM_SERVICE);
        }

        if (!this._modalMessageService) {
            this._modalMessageService = this._injector.get<ContentLoaderService>(MODAL_MESSAGE_SERVICE);
        }
    }

    /** Callback method for when the guest token expires */
    private onGuestTokenExpiration(): void {
        this._guestAuthTimeout = null;
        this.destroyToken();
        this.authStatus.next(authEvent.GUEST_TOKEN_EXPIRED);

        this.ensureInjectedServices();
        this._modalMessageService.cancelAndClose();

        // Alert the user that their token has been expired
        const dialogComponentRef = this._modalMessageService.navigate(DialogComponent);
        dialogComponentRef.instance.dialog = {
            titleText: 'Session Timeout',
            bodyText: 'Your session has timed out.',
            allowClose: false,
            actions: [
                {
                    buttonText: 'Okay',
                    isDefaultedChoice: true,
                    callbackFunction: () => {
                        // Close all content loaders
                        this._modalMessageService.completeAndClose();
                        this._rightPaneService.cancelAndClose();
                        this._modalFormService.cancelAndClose();

                        // Obtain new guest token and route the user back to the landing page
                        this.obtainGuestToken();
                        this._router.navigate(['']);
                    }
                }
            ]
        };
    }

    /** Destroys the token object and session storage for existing token */
    private destroyToken(): void {
        this._token = null;
        if (this._isSessionStorageAvailable) {
            this._window.sessionStorage.removeItem(storageKeys.authToken);
        }
        this.authStatus.next(authEvent.NO_AUTH_TOKEN);
    }

    /** Ensures that all of the injected services have been done */
    private saveTokenToStorage(token: AuthToken): void {
        if (this._isSessionStorageAvailable) {
            // Store the token in the same format as the response from the server
            this._window.sessionStorage.setItem(storageKeys.authToken, JSON.stringify(token.asTokenResponse()));
        }
    }

    /**
     * Attempts to retrieve a valid token from session storage
     * returns - A IAuthToken object if a valid token exists in session storage otherwise null
     */
    private retrieveTokenFromStorage(): AuthToken {
        try {
            if (this._isSessionStorageAvailable) {
                // Get the token from storage
                const tokenFromStorage = JSON.parse(this._window.sessionStorage.getItem(storageKeys.authToken)) as ITokenResponse;
                return new AuthToken(tokenFromStorage);
            }
        } catch (ex) {
            return null;
        }
    }
}

