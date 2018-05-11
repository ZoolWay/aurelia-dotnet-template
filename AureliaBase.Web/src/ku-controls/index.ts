import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

import 'jquery';
import 'kendo-ui-core';

import 'kendo-ui-core/css/web/kendo.common.core.min.css';
import 'kendo-ui-core/css/web/kendo.default.min.css';
//import 'kendo-ui-core/css/web/kendo.default.mobile.min.css';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([PLATFORM.moduleName('ku-controls/ku-button')]);
}
