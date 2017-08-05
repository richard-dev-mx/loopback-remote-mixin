'use strict';

module.exports = (Model, options) => {

  /**
   * Remote methods that will be disabled for readonly mode
   */
  const READ_ONLY_METHODS = [
    'create',
    'upsert',
    'upsertWithWhere',
    'updateAll',
    'prototype.updateAttributes',
    'deleteById',
    'replaceOrCreate',
    'replaceById',
    'createChangeStream'
  ];


  if (!Model) {
    return;
  }

  if (options.disable) {
    disableRemoteMethods();
  }

  if (options.descriptions && Model.sharedClass) {
    setupDescriptions();
  }

  /**
   * Assign the descriptions to the correct model
   */
  function setupDescriptions() {

    for (let methodName in options.descriptions) {
      let method = Model.sharedClass.findMethodByName(methodName);
      if(method) {
        method.description = options.descriptions[methodName];
      }
    }

  }

  /**
   * Disable built-in remote methods
   */
  function disableRemoteMethods() {

    let disableMethods = (methods) => {
      methods.forEach(methodName => {
        Model.disableRemoteMethodByName(methodName);
      });
    };

    if (options.disable.root) {

      if (Array.isArray(options.disable.root)) {
        disableMethods(options.disable.root);

      } else if (typeof(options.disable.root) === 'string') {

        if (options.disable.root === 'readOnly') {
          disableMethods(READ_ONLY_METHODS);
        }

      }
    }

    if (options.disable.nested) {
      disableNestedMethods()
    }

  }

  /**
   * Disable built-in remote methods of relations
   */
  function disableNestedMethods() {

    for (let nestedModelName in options.disable.nested) {
      options.disable.nested[nestedModelName].forEach(methodName => {
        let data = `prototype.__${methodName}__${nestedModelName}`;
        Model.disableRemoteMethodByName(data);
      });
    }

  }

};
