define(
[
    'preload|../module-loading/extension-module',
    {'Test':'../test-fixture/test-fixture'},
    {'virtual':'!module.virt'}
],
function(scope){
    var imports = this.imports;
    imports.Test.log('Calling function imported from ".virt"',imports.virtual.virtualCall());
});