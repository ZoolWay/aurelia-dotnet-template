import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import { Auth } from './auth';
import { apiConfig } from './../settings';

@autoinject
export class HttpConfig {
    private http: HttpClient;
    private auth: Auth;

    constructor(http: HttpClient, auth: Auth) {
        this.http = http;
        this.auth = auth;
    }

    public configure(): void {
        let a = this.auth;
        this.http.configure(httpConfig => {
            httpConfig.withDefaults({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .withInterceptor({
                request(request) {
                    if (!request.url.startsWith(apiConfig.service)) return request; // intercept only api-call to us
                    if (a.isAuthenticated) {
                        let token = a.getToken();
                        token = `Bearer ${token}`;
                        request
                            .headers
                            .append('Authorization', token);
                    }

                    return request;
                },
                response(response) {
                    if (!response.url.startsWith(apiConfig.service)) return response; // intercept only api-call to us
                    if (response.status === 401) {
                        //a.login();
                    }
                    return response;
                }
            });
        });
    }
}
