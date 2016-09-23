$js.module({
required:[
  {Inheritance : '/{$jshome}/modules/splice.Inheritance.js'},
  {Core : '/{$jshome}/modules/splice.component.core.js'},
  {Controls : '/{$jshome}/modules/splice.component.controls.js'}
],
definition:function(){

  var scope = this;

  var imports = scope.imports;

  var Class = imports.Inheritance.Class
  ,   ComponentTemplate = imports.Core.Template
  ,   Controller = imports.Core.Controller
  ;

  var DocumentApplication = Class(function DocumentApplication(_scope){
    this.scope = _scope;
    if(!this.scope.components)
      this.scope.components = sjs.namespace();
  });

  DocumentApplication.prototype.run =  function(){
    var bodyTemplate = new ComponentTemplate(sjs.document.body);
    bodyTemplate.compile(this.scope);
    var controller = new Controller();
    bodyTemplate.processIncludeAnchors(sjs.document.body,controller,this.scope);
    controller.onDisplay();
  };

  scope.exports(
    DocumentApplication, 
    Controller, 
    imports.Core.defineComponents
  );
}});
