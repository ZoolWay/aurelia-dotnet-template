import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';

import * as jwt_decode from 'jwt-decode';
import { UserAgentApplication, User } from 'msal';
import { AuthenticationRequestParameters } from 'msal/lib-commonjs/AuthenticationRequestParameters';

import { azureAdConfig } from './../settings';

@autoinject
export class Auth {
    private httpClient: HttpClient;
    private currentAuthenticated: boolean;
    private currentLoginName: string;
    private clientApplication: any;//UserAgentApplication;

    public get isAuthenticated(): boolean {
        return this.currentAuthenticated;
    }

    public get loginName(): string {
        return this.currentLoginName;
    }

    constructor(hc: HttpClient) {
        this.httpClient = hc;
        this.currentAuthenticated = false;
        this.clientApplication = new UserAgentApplication(azureAdConfig.clientId, azureAdConfig.authority, (errorDesc, token, error, tokenType) => {
            if (token) {
                this.currentAuthenticated = true;
            } else {
                //this.login(); // force login on creation of Auth?
            }
        }, { cacheLocation: 'localStorage', postLogoutRedirectUri: 'http://localhost:9000/#' });
    }

    public login() {
        window.location.hash = '';
        this.clientApplication.loginRedirect(['openid']);
    }

    public logout() {
        this.currentAuthenticated = false;
        this.clientApplication.logout();
    }

    public getToken(): string {
        if (this.currentAuthenticated) {
            return this._getTokentInternal();
        }
        return null;
    }

    public getDecodedToken() {
        let token = this.getToken();
        return jwt_decode(token);
    }

    public checkIsAuthenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let cachedUser: User = this.clientApplication.getUser();

            if (cachedUser == null) {
                this.currentAuthenticated = false;
                this.currentLoginName = null;
                return resolve(false);
            }

            let token = this._getTokentInternal();

            if (token) {
                this.currentAuthenticated = true;
                this.currentLoginName = cachedUser.displayableId;
                return resolve(true);
            } else {
                this.currentAuthenticated = false;
                this.currentLoginName = null;
                return resolve(false);
            }
        });
    }

    private _getTokentInternal(): string {
        let user = this.clientApplication.getUser();

        let ar = new AuthenticationRequestParameters(this.clientApplication.authorityInstance,
            this.clientApplication.clientId, [azureAdConfig.clientId],
            'id_token', this.clientApplication.redirectUri);

        let token = this.clientApplication.getCachedToken(ar, user);
        if (token === null) return null;
        return token.token;
    }

}
