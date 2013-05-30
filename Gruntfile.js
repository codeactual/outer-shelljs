module.exports = function(grunt) {
  'use strict';

  require('grunt-horde')
    .create(grunt)
    .demand('projName', 'outer-shelljs')
    .demand('instanceName', 'outerShelljs')
    .demand('klassName', 'OuterShelljs')
    .loot('node-component-grunt')
    .attack();
};
