import { autoinject, BindingEngine, Disposable, PLATFORM } from 'aurelia-framework';
import { RedirectToRoute, NavigationCommand, RouterConfiguration, Router } from 'aurelia-router';
import { HttpClient } from 'aurelia-fetch-client';

import { Auth } from './../core/auth';

@autoinject
export class Dashboard {

    private httpClient: HttpClient;
    private bindingEngine: BindingEngine;
    private auth: Auth;
    private subLoginName: Disposable;

    public decodedToken: any;
    public expires: Date;
    public loginName: string;

    constructor(hc: HttpClient, a: Auth, be: BindingEngine) {
        this.httpClient = hc;
        this.auth = a;
        this.bindingEngine = be;
        this.loginName = 'Profile';
    }

    public configureRouter(config: RouterConfiguration, router: Router): void {
        config.map([
            { route: '',        name: 'db-home',    moduleId: PLATFORM.moduleName('../dashboard/home'),    nav: false },
            { route: 'profile', name: 'db-profile', moduleId: PLATFORM.moduleName('../dashboard/profile'), nav: false, title: 'Profile' },
        ]);
    }

    public canActivate(): boolean | Promise<boolean> | NavigationCommand {
        if (this.auth.isAuthenticated) return true;
        return new RedirectToRoute('preface');
    }

    public activate(): void | Promise<void> {
    }

    public attached(): void {
        this.subLoginName = this.bindingEngine.propertyObserver(this.auth, 'loginName').subscribe((n, o) => this.loginNameChanged(n, o));
        this.updateLoginName();


        this.decodedToken = this.auth.getDecodedToken();
        let exp = this.decodedToken['exp'];
        this.expires = new Date(0);
        this.expires.setUTCSeconds(exp);
    }

    public detached(): void {
        if (this.subLoginName) { this.subLoginName.dispose(); this.subLoginName = null; }
    }
    
    public logout(): void {
        this.auth.logout();
    }

    private loginNameChanged(n: string, o: string): void {
        this.updateLoginName();
    }

    private updateLoginName(): void {
        this.loginName = (!!(this.auth.loginName)) ? this.auth.loginName : 'Profile';
    }

}
