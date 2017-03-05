import {Aurelia} from 'aurelia-framework'
import environment from 'environment';
import { Singletons } from 'dependency-injection'

//Configure Bluebird Promises.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  // Register all singleton implementations
  Singletons.forEach(singleton => {
    aurelia.container.registerSingleton(singleton.interface, singleton.implementation)
  })

  aurelia.start().then(() => aurelia.setRoot());
}
