import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import '../vendor/fontawesome5/css/fontawesome-all.min.css'

import { apiConfig } from './settings';
import { HttpConfig } from './http-config';
import { Auth } from './auth';
import { setTimeout } from 'timers';

@autoinject
export class App {

    private httpClient: HttpClient;
    private httpConfig: HttpConfig;
    private auth: Auth;
    private expires: Date;
    public decodedToken: any;
    public message: string = 'Hello World!';
    public entries: Array<any>;
    
    constructor(hc: HttpClient, hcfg: HttpConfig, a: Auth) {
        this.httpClient = hc;
        this.httpConfig = hcfg;
        this.auth = a;

        this.httpConfig.configure();
        this.expires = new Date(0);
    }

    public activate(): void|Promise<any> {
        setTimeout(() => {
            this.httpClient
                .fetch(apiConfig.service + 'people')
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            this.entries = data;
                            this.decodedToken = this.auth.getDecodedToken();
                            let exp = this.decodedToken['exp'];
                            this.expires = new Date(0);
                            this.expires.setUTCSeconds(exp);
                        })
                });
        }, 2000);
    }

    public logout(): void {
        this.auth.logout();
    }

    public testAlert(): void {
        alert('test alert');
    }
}
