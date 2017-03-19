import { DI, Singletons } from 'dependency-injection'
import {Aurelia} from 'aurelia-framework'
import environment from 'environment';

//Configure Bluebird Promises.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  //Register all singleton implementations
  Singletons.forEach(singleton => {
    aurelia.container.registerSingleton(singleton.interface, singleton.implementation)
  })

  await aurelia.start()
  aurelia.setRoot('app')
}
