/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>

import { Aurelia } from 'aurelia-framework'
import { PLATFORM } from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import environment from './environment';
import { Auth } from './core/auth';

import '../vendor/fontawesome5/css/fontawesome-all.min.css'
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
    setup(aurelia);
    launch(aurelia);
}

function setup(aurelia: Aurelia): void {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('resources/index'))
        .feature(PLATFORM.moduleName('ku-controls/index'))
        ;

    // Uncomment the line below to enable animation.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    // if the css animator is enabled, add swap-order="after" to all router-view elements

    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
    }
}

async function launch(aurelia: Aurelia): Promise<void> {
    try {
        await aurelia.start();
        let auth: Auth = aurelia.container.get(Auth);
        let authed: boolean = await auth.checkIsAuthenticated();
        // normally it is not possible to be authed here but the auth system does some initial steps
        // also we could enforce auth.login() here but that would force auth on start
        aurelia.setRoot(PLATFORM.moduleName('shell/app'));
    } catch (ex) {
        console.error('Launch error:', ex);
    }
}
