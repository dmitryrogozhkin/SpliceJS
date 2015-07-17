_.Module({

required:[	
			
	'splice.ui.js',
	'splice.controls/splice.controls.css',
  	'splice.controls/splice.controls.html',
	'splice.controls/splice.controls.datatable.js',
	'splice.controls/splice.controls.scrollpanel.js',
	'splice.controls/splice.controls.chart.js',
	'splice.controls/splice.controls.listbox.js',
	'splice.controls/splice.controls.drawerpanel.js',
	'splice.controls/splice.controls.viewpanel.js',
	'splice.controls/splice.controls.map.js',
	'splice.controls/splice.controls.gridlayout.js',
	'splice.controls/splice.controls.codeeditor.js',
	'splice.controls/splice.controls.d3canvas.js'
], 	

definition:function(){
	
	var localScope = this;
	
	var Button = _.Namespace('SpliceJS.Controls').Class(function Button(args){
		
		SpliceJS.Controls.UIControl.apply(this,arguments);
		
			
		var self = this;
		this.elements.controlContainer.onclick = function(){
			if(self.isDisabled == true) return;
			self.onClick(self.dataItem);

		};
		
		if(this.isDisabled) this.disable();
		
	}).extend(SpliceJS.Controls.UIControl);

	
	Button.prototype.handleContent = function(content){
		if(!content) return;
		
		if(content['label']){
			this.elements.controlContainer.value = content['label']; 
		} else {
			this.elements.controlContainer.value = 'button';
		}
	};

	Button.prototype.setLabel = function(label){
		this.elements.controlContainer.value = label;
	};
	
	Button.prototype.onClick = _.Event;
	
	Button.prototype.enable = function(){
		this.elements.controlContainer.className = '-splicejs-button';
		this.isDisabled = false;
		this.onDomChanged();
	};
	
	Button.prototype.disable = function(){
		this.elements.controlContainer.className = '-splicejs-button-disabled';
		this.isDisabled = true;
		this.onDomChanged();
	}
	
	
	
	var TextField = _.Namespace('SpliceJS.Controls').Class(function TextField(){
		SpliceJS.Controls.UIControl.apply(this,arguments);

		var self = this;
		
		var f = function(){
			if(self.dataPath) {
				self.dataItem[self.dataPath] = this.value;
			}
			else {
				self.dataItem = {value:this.value};
			}
			self.onData(self.dataItem);
		};

		if(this.isRealTime){
			this.elements.controlContainer.onkeyup = f;
		}
		else { 
			this.elements.controlContainer.onchange = f;
		}

	}).extend(SpliceJS.Controls.UIControl);
	
	TextField.prototype.onData = _.Event;
		
	TextField.prototype.dataIn = function(dataItem){
		SpliceJS.Controls.UIControl.prototype.dataIn.call(this,dataItem);
		var value = this.dataItem[this.dataPath];
		
		if(value) this.elements.controlContainer.value = value;
	};
	
	TextField.prototype.clear = function(){
		this.elements.controlContainer.value = '';
	};
	
	
	/**
	 * 
	 * Check box
	 * */
	var CheckBox = _.Namespace('SpliceJS.Controls').Class(function CheckBox(args){
		SpliceJS.Controls.UIControl.apply(this,arguments);

		var self = this;
		
		
		
		this.concrete.dom.onclick = function(){
			_.debug.log('I am check box');
			var isChecked = self.concrete.dom.checked; 
			if(self.dataItem) {
				self.dataItem[self.dataPath] = isChecked;
			}
			
			if(self.dataOut) 	self.dataOut(self.dataItem);
			if(self.onCheck)	self.onCheck(isChecked);
		};
	
	}).extend(SpliceJS.Controls.UIControl);

	
	CheckBox.prototype.dataIn = function(dataItem){
		this.dataItem = dataItem;
		if(this.dataItem && (this.dataItem[this.dataPath] === true)){
			this.concrete.dom.checked = true;
		}
		else this.concrete.dom.checked = false; 
	};
	
	CheckBox.prototype.clear = function(){
		this.concrete.dom.checked = false;
	};
	

	/**
	 * RadioButton
	 * */
	var RadioButton = _.Namespace('SpliceJS.Controls').Class(function RadioButton(args){
		SpliceJS.Controls.UIControl.apply(this,arguments);
	
		var self = this;
		this.elements.controlContainer.onclick = function(){

			if(self.elements.controlContainer.checked) {
				if(self.dataPath)
				self.dataItem[self.dataPath] = true
			} else {
				if(self.dataPath)
				self.dataItem[self.dataPath] = false;
			}
			self.dataOut(self.dataItem);
		}
	
	}).extend(SpliceJS.Controls.UIControl);
	
	
	RadioButton.prototype.dataIn = function(dataItem){
		SpliceJS.Controls.UIControl.prototype.dataIn.call(this,dataItem);

		if(!this.dataPath) {
			this.elements.controlContainer.checked = false;
			return;
		}

		if(this.dataItem[this.dataPath] === true) {
			this.elements.controlContainer.checked = true;
		}
		else {
			this.elements.controlContainer.checked = false;	
		}
	};



	/**
	 * Drop down list
	 * */
	var DropDownList = _.Namespace('SpliceJS.Controls').Class(function DropDownList(args){
		this.dom = this.concrete.dom;
	}).extend(SpliceJS.Controls.UIControl); 





	DropDownList.prototype.show = function(args){
		if(!args || !args.parent) return;
		
		var parent_size 	= _.Doc.elementSize(args.parent);
		var parent_position = _.Doc.elementPosition(args.parent);
		var documentHeight 	= _.Doc.getHeight();
		
		this.dom.style.maxHeight = (documentHeight - parent_position.y - parent_size.height - 5) + 'px';
		
		
		document.body.appendChild(this.dom);
		
		if(typeof(args.content) ==  'string') {
			this.dom.innerHTML = args.content;
		} else if( typeof(args.content) == 'object'){
			this.dom.innerHTML = '';
			this.dom.appendChild(args.content);
		}
		
		
		var style = this.dom.style;
		style.left = parent_position.x + 'px';
		style.top  = parent_position.y + parent_size.height + 'px';
		
		this.dom.className = '-sc-drop-down-list -sc-show';
		
		
		/* remove list on defocus*/
		
		document.body.onmousedown = (function(){
			this.hide();
			document.body.onmousedown = '';
		}).bind(this); 
		
	};
	

	DropDownList.prototype.dataIn = function(data){



	};
	
	DropDownList.prototype.hide = function() {
		this.dom.className = '-sc-drop-down-list -sc-hide';
	};


	/*
	 *	Image Selector
     *
	 * */
	var ImageSelector = _.Namespace('SpliceJS.Controls').Class(function ImageSelector(){
		
		var container = this.elements.controlContainer;

		if(this.width) 	container.width = this.width;
		if(this.height) container.height = this.height;

		if(this.src) this.elements.controlContainer.src = this.src;


	});

	ImageSelector.prototype.dataIn = function(dataItem) {
		if(!this.dataPath) return;

		this.elements.controlContainer.src = dataItem[this.dataPath];

	};




	var DomIterator = _.Namespace('SpliceJS.Controls').Class( function DomIterator(args){

		this.conc = [];

		this.dom = null; 
		if(args && args.dom) this.dom = args.dom;

		var self = this;

		this.template = args.dom;
		this.container = document.createElement('span');

/*
		for(var i = 0; i < 100; i++ ){
			this.conc.push(new args.dom({parent:this}));
			nodes.push(this.conc[i].concrete.dom);
		}
*/	
		this.concrete = {
			export:function(){
				return self.container;
			}
		};

		if(!args.dom) return;

	}).extend(SpliceJS.Core.Controller);

	DomIterator.prototype.dataIn = function(data){
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

	}

	SpliceJS.Controls.DomIterator = localScope.createComponent(DomIterator,null);



	var PullOutPanel = _.Namespace('SpliceJS.Controls').Class( function PullOutPanel(){
		SpliceJS.Controls.UIControl.call(this);
	}).extend(SpliceJS.Controls.UIControl);


	PullOutPanel.prototype.onOpen = _.Event;
	PullOutPanel.prototype.onClose = _.Event;


	PullOutPanel.prototype.open = function(){
		this.elements.controlContainer.style.left = '0px';
		this.onOpen();

	};

	PullOutPanel.prototype.close = function(){
		this.elements.controlContainer.style.left = '-500px';
		this.onClose();
	};




	var DropDownSelector = _.Namespace('SpliceJS.Controls').Class( function DropDownSelector(){
		SpliceJS.Core.Controller.call(this);
	}).extend(SpliceJS.Core.Controller)


	DropDownSelector.prototype.dataIn = function(data){
		this.data = data;
		this.elements.selector.innerHTML = data.toString();		
	};





// end module definition		
}});