webix.protoUI({
	//https://github.com/kazzkiq/CodeFlask#usage
	name:"CodeFlask",
	defaults:{

	},
	$init:function(config){
		this.$view.innerHTML = "<div style='width:100%;height:100%'></div>";
		this._waitEditor = webix.promise.defer();
		this.$ready.push(this._render_cm_editor);
	},
	$setSize: function(w, h) {
		if (webix.ui.view.prototype.$setSize.call(this, w, h)) {
			if (this._editor) {
				//this._editor.resize();
			}
		}
	},
	_render_cm_editor:function(){		
		if (this.config.cdn === false){
			this._render_when_ready();
			return;
		};

		this._cdn = this.config.cdn || "https://unpkg.com/codeflask/build";

		webix.require([
			this._cdn + "/codeflask.min.js"
		]).then( webix.bind(this._render_when_ready, this) ).catch(function(e){
		  console.log(e);
		});
	},
	_render_when_ready:function(){
		this._editor = new CodeFlask(this.$view.firstChild, { language: 'js',lineNumbers: true });
		if(this.config.value) this.setValue(this.config.value);
		this._waitEditor.resolve(this._editor);
	},

	setValue:function(value){
		if(!value && value !== 0)
			value = "";

		this.config.value = value;
		if(this._editor){
			this._editor.updateCode(value);
		}
	},
	getValue:function(){
		return this._editor ? this._editor.getCode() : this.config.value;
	},

	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._editor;
	}
}, webix.ui.view);