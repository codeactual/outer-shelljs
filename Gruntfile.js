module.exports = function(grunt) {
  'use strict';

  require('grunt-horde')
    .create(grunt)
    .demand('initConfig.projName', 'outer-shelljs')
    .demand('initConfig.instanceName', 'outerShelljs')
    .demand('initConfig.klassName', 'OuterShelljs')
    .loot('node-component-grunt')
    .attack();
};
