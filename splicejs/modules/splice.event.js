sjs({


definition:function(){



  /*

  ----------------------------------------------------------

  	SpliceJS Event Model

  */

  	function mousePosition(e){
          //http://www.quirksmode.org/js/events_properties.html#position
  		var posx = 0
  		,   posy = 0;

  		if (e.pageX || e.pageY) 	{
  			posx = e.pageX;
  			posy = e.pageY;
  		}
  		else if (e.clientX || e.clientY) 	{
  			posx = e.clientX + document.body.scrollLeft
  				+ document.documentElement.scrollLeft;
  			posy = e.clientY + document.body.scrollTop
  				+ document.documentElement.scrollTop;
  		}

  		return {x:posx,y:posy};
  	};


  	function domEventArgs(e){
  		return {
  			mouse: mousePosition(e),
  		  source: e.srcElement,
        domEvent:e,     // source event
  			cancel: function(){
              	this.cancelled = true;
              	e.__jsj_cancelled = true;
              }
  		}
  	};

  	/**
  		@param {object} instance - taget object instance to
  		receive event configuration
  	*/
  	function Event(instance){
  		if(!(this instanceof Event))
  		return {
  			attach:function(configuration){
  				var keys = Object.keys(configuration);
  				for(var i=0; i<keys.length; i++){
  					var evt = configuration[keys[i]];
  					if(!(evt instanceof Event) ) continue;
  					evt.attach(instance, keys[i]);
  				}
  				return instance;
  			}
  		}


  		this.eventType = 'multicast';
  		this.isStop = false;
  	};

  	Event.prototype.transform = function(fn){
  		var e = mixin(new Event(),this)
  		e.transformer = fn;
  		return e;
  	};

  	Event.prototype.stop = function(fn){
  		var e = mixin(new Event(),this)
  		e.transformer = fn;
  		e.isStop = true;
  		return e;
  	};

  	Event.multicast = (function(){
  		var e = mixin(new Event(),this)
  		e.eventType= 'multicast';

  		e.stop = mixin(new Event(),e);
  		e.stop.isStop = true;

  		return e;
  	})();

  	Event.unicast = (function(){
  		var e = mixin(new Event(),this)
  		e.eventType= 'unicast';

  		e.stop = mixin(new Event(),e);
  		e.stop.isStop = true;

  		return e;
  	})();





  	Event.prototype.attach = function(object, property, cancelBubble){

  		var callbacks = [[]], instances = [[]];
  		var cleanup = {fn:null, instance:null };
  		var transformer = this.transformer;

  		cancelBubble = this.isStop;

  		var MulticastEvent = function MulticastEvent(){
  			var idx = callbacks.length-1;

  			/*
  				Grab callbacks and instance reference
  				stacks may be popped during handler execution
  				by another handler that subscribed to the currently
  				bubbling event inside an already invoked event handler
  			*/
  			var cbak = callbacks[idx]
  			,	inst = instances[idx]
  			,	eventBreak = false
  			,	callback_result = null;


  			// nothing to do here, callback array is empty
  			if(!cbak || cbak.length <=0 ) return;


  			for(var i=0; i < cbak.length; i++) {
  				/*check if event was cancelled and stop handing */
  				if(arguments.length > 0 && arguments[0])
  				if(arguments[0].cancelled || (arguments[0].e &&
  				   							  arguments[0].e.__jsj_cancelled == true)) {

  					eventBreak = true;
  					break;
  				}

  				//invocation parameters
  				var _args = arguments;
  				var _callback = cbak[i].callback;
  				var _inst = inst[i];

  				if(MulticastEvent.argumentFilter) {
  					if(!MulticastEvent.argumentFilter.apply(_inst, _args)) return;
  				}

  				//pass arguments without transformation
  				if(!transformer) {
  					if(cbak[i].is_async) {
  						setTimeout(function(){_callback.apply(_inst, _args);},1);
  					}
  					else
  						callback_result = _callback.apply(_inst, _args);
  				}
  				else {
  					if(cbak[i].is_async) {
  						setTimeout(function(){_callback.call(_inst, transformer.apply(_inst,_args));},1)
  					}
  					else
  						callback_result = _callback.call(_inst, transformer.apply(_inst,_args));
  				}
  			}

  			if(!eventBreak && typeof cleanup.fn === 'function') {
  				cleanup.fn.call(cleanup.instance, MulticastEvent );
  				cleanup.fn 		 = null;
  				cleanup.instance = null;
  			}

  			return callback_result;
  		}

  		MulticastEvent.__sjs_event__ = true;

  		/*
  			"This" keyword migrates between assigments
  			important to preserve the original instance
  		*/
  		MulticastEvent.subscribe = function(callback, instance){
  			if(!callback) return;
  			if(typeof callback !== 'function') throw 'Event subscriber must be a function';

  			if(!instance) instance = this;

  			var idx = callbacks.length-1;

  			for(var i=0; i<callbacks[idx].length; i++){
  				if( callbacks[idx][i].callback === callback &&
  					  instances[idx][i] === instance
  				) return object;
  			}

  			callbacks[idx].push({callback:callback,is_async:false});
  			instances[idx].push(instance);
  			return object;
  		};

  		MulticastEvent.subscribeAsync = function(callback,instance){
  			if(!callback) return;
  			if(typeof callback !== 'function') throw 'Event subscriber must be a function';

  			if(!instance) instance = this;

  			var idx = callbacks.length-1;

  			callbacks[idx].push({callback:callback,is_async:true});
  			instances[idx].push(instance);
  			return this;
  		};

  		MulticastEvent.unsubscribe = function(callback){
  			var idx = callbacks.length-1;
  			for(var i=0; i < callbacks[idx].length; i++) {
  				if( callbacks[idx][i].callback == callback ) {
  					logging.debug.log('unsubscribing...');
  					callbacks[idx].splice(i,1);
  					instances[idx].splice(i,1);
  					break;
  				}
  			}
  		};

  		MulticastEvent.push = function(){
  			callbacks.push([]);
  			instances.push([]);
  			return this;
  		};

  		MulticastEvent.pop = function(){
  			if(callbacks.length == 1) return;
  			callbacks.pop();
  			instances.pop();
  			return this;
  		};

  		MulticastEvent.cleanup = function(callback, instance){
  			cleanup.fn 		 = callback;
  			cleanup.instance = instance;
  			return this;
  		};

  		MulticastEvent.purge = function(){
  			for(var i=0; i<callbacks.length; i++) {
  				callbacks.splice(0,1);
  				instances.splice(0,1);
  			}
  		};
  		MulticastEvent.__sjs_event_name__ = property;

  		if(!object || !property) return MulticastEvent;

  		/* handle object and property arguments */
  		var val = object[property];

  		if(val && val.__sjs_event__) return val;

  		if(typeof val ===  'function') {
  			MulticastEvent.subscribe(val, object);
  		}

  		/*
  			if target object is a dom element
  			collect event arguments
  		*/
  		if(isHTMLElement(object) || object === window) {
  			/*
  				wrap DOM event
  			*/
  			object[property] = function(e){

  				if(!e) e = window.event;
  				if(cancelBubble) {
  					e.cancelBubble = true;
  					if (e.stopPropagation) e.stopPropagation();
  				}
  				setTimeout((function(){
  					MulticastEvent(this);
  				}).bind(domEventArgs(e)),1);
  			};
  			object[property].__sjs_event__ = true;

  			// expose subscribe method
  			object[property].subscribe = function(){
  				MulticastEvent.subscribe.apply(MulticastEvent,arguments);
  			}

  		} else if(object instanceof View){
  			object[property] = MulticastEvent;

  			object.htmlElement[property] = (function(e){
  				if(!e) e = window.event;
  				if(cancelBubble){
  					e.cancelBubble = true;
  					if (e.stopPropagation) e.stopPropagation();
  				}
  				var eventArgs = domEventArgs(e);
  				eventArgs.view = object;
  				setTimeout((function(){
  					this.fn(this.args);
  				}).bind({fn:this[property], args:eventArgs}),1);
  				//this[property](eventArgs);
  			}).bind(object);
  		}
  		else {

  			object[property] = MulticastEvent;

  		}



  		return MulticastEvent;

  	};
  	var EventSingleton = new Event(null);







}})