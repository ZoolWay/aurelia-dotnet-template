import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';

import * as jwt_decode from 'jwt-decode';
import { UserAgentApplication } from 'msal';
import { AuthenticationRequestParameters } from 'msal/lib-commonjs/AuthenticationRequestParameters';

import { azureAdConfig } from './../settings';

@autoinject
export class Auth {
    private httpClient: HttpClient;
    public authenticated: boolean;
    private clientApplication: any; // Msal.UserAgentApplication;

    constructor(hc: HttpClient) {
        this.httpClient = hc;
        this.authenticated = false;
        this.clientApplication = new UserAgentApplication(azureAdConfig.clientId, azureAdConfig.authority, (errorDesc, token, error, tokenType) => {
            if (token) {
                this.authenticated = true;
            } else {
                this.login();
            }
        }, { cacheLocation: 'localStorage', postLogoutRedirectUri: 'http://localhost:9000/#' });
    }

    public login() {
        window.location.hash = '';
        this
            .clientApplication
            .loginRedirect(['openid']);
    }

    public logout() {
        this.authenticated = false;
        this
            .clientApplication
            .logout();
    }

    public getToken(): string {
        if (this.authenticated) {
            return this._getTokentInternal();
        }
        return null;
    }

    public getDecodedToken() {
        let token = this.getToken();
        return jwt_decode(token);
    }

    private _getTokentInternal(): string {
        let user = this
            .clientApplication
            .getUser();

        let ar = new AuthenticationRequestParameters(this.clientApplication.authorityInstance,
            this.clientApplication.clientId, [azureAdConfig.clientId],
            'id_token', this.clientApplication.redirectUri);

        let token = this
            .clientApplication
            .getCachedToken(ar, user);

        return token.token;
    }

    public isAuthenticated() {
        return new Promise((resolve, reject) => {
            let cachedUser = this
                .clientApplication
                .getUser();

            if (cachedUser == null) {
                this.authenticated = false;
                return reject();
            }

            let token = this._getTokentInternal();

            if (token) {
                this.authenticated = true;
                return resolve();
            } else {
                return reject();
            }
        });
    }
}
