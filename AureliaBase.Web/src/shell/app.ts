import { autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

import { HttpConfig } from './../core/http-config';
import { Auth } from './../core/auth';

@autoinject
export class App {

    private httpConfig: HttpConfig;
    private auth: Auth;
    private router: Router;
    
    constructor(hcfg: HttpConfig, a: Auth, r: Router) {
        this.httpConfig = hcfg;
        this.auth = a;
        this.router = r;

        this.httpConfig.configure();
    }

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'AureliaBase Demo';
        config.map([
            { route: '',          name: 'preface',   moduleId: PLATFORM.moduleName('./preface'),   nav: false },
            { route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('./dashboard'), nav: false, title: 'Dashboard' }
        ]);
    }

    public activate(): void|Promise<void> {
        /*setTimeout(() => {
            this.httpClient
                .fetch(apiConfig.service + 'appSettings')
                .then((response) => {
                    response.text()
                        .then((data) => {
                            console.info(data);
                            debugger;
                        });
                })
        }, 2000);*/
    }

    public logout(): void {
        //this.auth.logout();
    }
}
