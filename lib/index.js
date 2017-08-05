'use strict';
const setupRemoteMethods = require('./setupRemoteMethods');

module.exports = app => {
  app.loopback.modelBuilder.mixins.define = deprecate.function(app.loopback.modelBuilder.mixins.define,
    'app.modelBuilder.mixins.define: Use mixinSources instead');

  app.loopback.modelBuilder.mixins.define('SetupRemoteMethods', setupRemoteMethods);
};
