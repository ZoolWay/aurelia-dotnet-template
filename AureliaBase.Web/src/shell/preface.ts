import { autoinject, BindingEngine, Disposable } from 'aurelia-framework';

import { Auth } from './../core/auth';

@autoinject
export class Preface {
    private auth: Auth;
    private bindingEngine: BindingEngine;
    private subIsAuthenticated: Disposable;
    public state: 'detecting'|'not-authed'|'authed';

    constructor(a: Auth, be: BindingEngine) {
        this.auth = a;
        this.bindingEngine = be;
        this.state = 'detecting';
    }

    public attached(): void {
        this.subIsAuthenticated = this.bindingEngine.propertyObserver(this.auth, 'isAuthenticated').subscribe((n, o) => this.isAuthedChanged(n, o));
        this.updateState();
    }

    public detached(): void {
        if (this.subIsAuthenticated) { this.subIsAuthenticated.dispose(); this.subIsAuthenticated = null; }
    }

    public login(): void {
        this.auth.login();
    }

    private isAuthedChanged(n: boolean, o: boolean): void {
        this.updateState();
    }

    private updateState(): void {
        this.state = (this.auth.isAuthenticated) ? 'authed' : 'not-authed';
    }
}
