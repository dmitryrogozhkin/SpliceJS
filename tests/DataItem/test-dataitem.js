//node.js plug
$js.module({
required:[
  {'UI':'/{$jshome}/modules/splice.dataitem.js'}
]
,
definition:function(scope){
    "use strict";
    var scope = this;

    var log = scope.imports.$js.log;

    var
      DataItem = scope.imports.UI.DataItem
    , DelegateDataItem = scope.imports.UI.DelegateDataItem
    , ArrayDataItem = scope.imports.UI.ArrayDataItem
    ;

    var orders = [
      {id:1, desc:'Sample order', items:[{id:24, name:'note book', qty:1}]},
      {id:2, desc:'Sample order', items:[{id:7, name:'pencil', qty:3}]},
      {id:3, desc:'Di order',
             items:new DataItem().setValue({id:7, name:'di pencil', qty:3})}
    ];

    var orders2 = [
      {id:1, desc:'Sample order', items:[{id:24, name:'note book', qty:1}]},
      {id:2, desc:'Sample order', items:[{id:7, name:'pencil', qty:3}]}
    ];

    /*Test_PathTree();
    Test_ValueSetter();
    Test_ValueSetterRefSource();
    Test_ValueSetterPrimSource();
    Test_AppendValue();
    Test_RemoveValue();
    Test_GetChanges();
    Test_LargeData();
*/
    //Test_DataItemLink();
    Test_Path();
    Test_BlindPath();

    function Test_PathTree(){
      var d = new DataItem(orders);
      var item = d.path('1').path('items.0');
      if (d.path(item.fullPath()) == item ){
        log.info('Test_PathTree: Pass');
        return true;
      } else {
        log.info('Test_PathTree: Fail');
        return false;
      }
    }


    function Test_ValueSetter(){
      var d = new ArrayDataItem(orders);
      var d1 = d.path(1);
      var item = d.path('1').path('items.0');
      //set item id
      item.path('id').setValue(10);
      if( orders[1].items[0].id === item.path('id').source.id) {
        log.info('Test_ValueSetter: Pass');
        return true;
      } else {
        log.info('Test_ValueSetter: Fail');
        return false;
      }
    }


    function Test_ValueSetterRefSource(){
      var d = new DataItem(orders);
      try {
        d.setValue('test');
        log.info("Test_ValueSetterRefSource: Fail");
        return false;
      } catch(ex){
        log.info("Test_ValueSetterRefSource: Pass");
        return true;
      }
    }

    function Test_ValueSetterPrimSource(){
      var d = new DataItem(456);
      try {
        d.setValue('test');
        if(d.getValue() === 'test'){
          log.info("Test_ValueSetterPrimSource: Pass");
          return true;
        }
      } catch(ex){
        log.info("Test_ValueSetterPrimSource: Fail");
        return false;
      }
      return false;
    }

    function Test_AppendValue(){
      var d = new ArrayDataItem(['one','two','three']);
      var f = d.append().setValue('four');
      if(d.source[3] === 'four'){
        log.info("Test_AppendValue: Pass");
        return true;
      }
      log.info("Test_AppendValue: Fail");
      return false;
    }


    function Test_RemoveValue(){
      var d = new ArrayDataItem(['one','two','three']);
      var f = d.path('2');
      d.remove(f);
      if(f.getValue() == null){
        log.info("Test_RemoveValue: Pass");
        return true;
      }
      log.info("Test_RemoveValue: Fail");
      return false;
    }

    //count number of changes
    function Test_GetChanges(){
      var d = new ArrayDataItem(orders);

      d.path('1.items.0.name').setValue('black pencil');
      d.path('0.items.0.name').setValue('black pencil');


      d.changes(function(item){
          log.info(item.fullPath());
      });
      d.path('1.items.0.name').setValue('pencil 2');
      d.path('1.items.0.name').setValue('pencil');
      d.path('1.items.0.name').setValue('pencil 3');

      d.changePath(function(item){
          log.info(item);
      });
    }


    function Test_LargeData(){
      var bigData = new ArrayDataItem([]);

      for(var i=0; i<10000; i++){
        bigData.append().setValue({id:i, name:'sample'+i});
      }
    }

    function Test_DataItem2(){
        var d = new DataItem2(orders);
        d.path('1.items.0.name').setValue('black pencil');
    }

    function Test_BlindPath(){
      var bigData = new Array(1000000);
      for(var i=0; i<1000000; i++){
        bigData[i] = "Data " + i;
      }


      var dataItem = new DataItem();
      for(var i=0; i<1000000; i++){
        dataItem.path(''+i);
      }
      var blindItem = dataItem.path('100');
      blindItem.subscribe(function(item){
        console.log("Things changed " + this.getValue());
      },blindItem);

      dataItem.setValue(bigData);

      blindItem.setValue('haha new value 100');
      bigData[100] = "this was changed on the big data itself";

      dataItem.setValue(bigData);
    }

    function Test_Path(){
      var bigData = new Array(1000);
      var di = new DataItem(bigData);

      for(var i=0; i<1000; i++){
        bigData[i] = "Data" + i;
        di.path(i);
      }

    }

    function Test_DataItemLink(){
      log.info('Testing data item chaining');

      var source = new DataItem();
      var target = new DelegateDataItem(source);
      var target2 = new DelegateDataItem(source);

      /*
        event subscriber will get invoked when
        source data item value changes
      */
      target.subscribe(function(item){
        log.info('Chained call');
      }, target);

      /*
        event subscriber will get invoked when
        source data item value changes
      */
      target2.subscribe(function(item){
        log.info('Chained call 2');
      }, target2);


      source.setValue(orders);
      var originalValue = target.path('1.items.0.name').getValue();

      //
      var di = new DataItem().setValue(source);
      var temp1 = source.path('1.items.0');
      var temp = di.path('2.items.name').getValue();

      target.path('1.items.0.name').setValue('name set by a delegate');
      var di = target.path('1.items.0.name');
      var v = target.path('1.items.0.name').getValue();
      log.info("Original Value: " + originalValue + ' New Value ' + v);

      source.setValue(orders2);
      var v = target.path('1.items.0.name').getValue();
      log.info("Original Value: " + originalValue + ' New Value ' + v);
    }


    scope.exports(
      Test_PathTree,
      Test_ValueSetter,
      Test_ValueSetterRefSource,
      Test_ValueSetterPrimSource,
      Test_AppendValue,
      Test_RemoveValue,
      Test_GetChanges,
      Test_LargeData
    );

}})
