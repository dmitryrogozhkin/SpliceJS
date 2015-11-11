/* global _*/
sjs({

required:[
	{'SpliceJS.UI':'{sjshome}/modules/splice.ui.js'}
],


definition:function(){
	var sjs = this.sjs;

	var Class = sjs.Class
	,	Controller = sjs.Controller
	,	Event = sjs.Event
	,	exports = sjs.exports;


	var DomIterator = Class(function DomIteratorController(args){
		this.super();

		this.conc = [];

		this.dom = null;
		if(args && args.dom) this.dom = args.dom;

		var self = this;

		this.template = args.dom;

		this.container = document.createElement('span');
		this.nodes = [];

		var contentTemplate = this.contentTemplate;
		if(!contentTemplate) contentTemplate = '';

		if(this.to != null && this.to != undefined) {
			var frm = this.from?this.from:0
			,	seq = 0;


			for(var i = frm; i < this.to; i++ ){

				this.conc.push(new args.dom({
					parent:this,
					content:{i:(contentTemplate+(i))}
				}));

				var style = this.onStyleSelect(i);
				if(style) {
					this.conc[seq].concrete.dom.className = style;
				}

				this.nodes.push(this.conc[seq++].concrete.dom);
			}
			this.concrete = {
				export:function(){
					return self.nodes;
				}
			};

		}
		else {
			this.concrete = {
				export:function(){
					return self.container;
				}
			};
		}

		if(!args.dom) return;

	}).extend(Controller);

	DomIterator.prototype.dataIn = function(data){
		if(this.sequential) return;

		var nToUpdate = Math.min(this.conc.length, data.length);
		var nExisting = this.conc.length;
		var nCreate = data.length - this.conc.length;

		for(var i=0; i < nToUpdate; i++){
			this.conc[i].concrete.applyContent(data[i]);
			this.conc[i].data = data[i];
		}

		if(nCreate > 0) //add new nodes
		for(var i=0; i < nCreate; i++) {
			var n = new this.template({parent:this});

			n.concrete.applyContent(data[nExisting + i]);
			n.data = data[i];
			this.container.appendChild(n.concrete.dom);
			this.conc.push(n);
		}

		if(nCreate < 0) //remove existing modes
		for(var i=this.conc.length-1; i >= nToUpdate; i--){
			this.container.removeChild(this.conc[i].concrete.dom);
			this.conc.splice(i,1);
		}
	};

	DomIterator.prototype.onStyleSelect = Event;



	//module exports
	exports.module(
		{DomIterator:DomIterator}
	);

}

}); //module declaration end
