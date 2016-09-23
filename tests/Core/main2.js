$js.module({
type:'component'
,
required:[
  {Inheritance: '/{$jshome}/modules/splice.inheritance.js'},
  {Component:'/{$jshome}/modules/splice.component.js'},
  {Controls : '/{$jshome}/modules/splice.component.controls.js'},
  'main2.html'
]
,
definition:function(sjs){

    var
      scope = this.scope
    ;

    var
      Class = scope.Inheritance.Class
    , Controller = scope.Component.Controller
    ;

    var MainController = Class(function MainController(){

    }).extend(Controller);

    MainController.prototype.buttonClick = function(item){
      sjs.log.info('Click');
    };


    sjs.exports.scope(
      MainController
    );

    new this.scope.Component.DocumentApplication(this.scope).run();


}});
