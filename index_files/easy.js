function browserVersion(){
	var isIE = !!window.ActiveXObject;
	var isIE6 = isIE && !window.XMLHttpRequest;
	var isIE8 = isIE && !!document.documentMode;
	var isIE7 = isIE && !isIE6 && !isIE8;
	if(isIE7){
		return 7;
	} else if(isIE8){
	 	return 8;
	} else if(isIE6){
		return 6;
	} else if(isIE){
		return 5;
	} else {
		if(navigator.userAgent.indexOf("Firefox")>=0){
        	return "ff";
   		}
   		if(navigator.userAgent.indexOf("Safari")>=0) {
        	return "Safari";
   		}
   		if(navigator.userAgent.indexOf("Camino")>=0){
        	return "Camino";
   		}
		
		if(navigator.userAgent.indexOf("Opera")>=0){
        	return "Opera";
   		}
   		if(navigator.userAgent.indexOf("Gecko")>=0){
        	return "Gecko";
   		}else{
			return "Unknow";	
		}
	}
}

(function() {
	window.easy = window.Light = function(selector, parent) {
		return new Light.core.init(selector, parent);
	};
	Light.core = Light.prototype = {
		init : function(selector, parent) {
			var els;
			selector = selector || window;
			parent = parent || document;
			els = (typeof selector == 'string') ? Light.selector(selector,
					parent) : els = selector;
			this.els = [];
			if(els==null||els==undefined)
			return ;
			if (typeof els.length != 'undefined') {
				for ( var i = 0, max = els.length; i < max; i++)
					this.els.push(els[i]);
			} else {
				this.els.push(els);
			}
			return this;
		},

		get : function(index) {
			return (typeof index == 'undefined') ? this.els : this.els[index];
		},
		count : function() {
			return this.els.length;
		},
		val:function()
		{
		  return this.value;
		},
		isSet:function(value)
		{
		  if(value==undefined||value==null)
		  {
		  return false;
		  }
		  else
		  {
		  return true;
		  }
		},
		html:function(txt)
		{
		  if(this.isSet(txt))
		  {
		  this.els[0].innerHTML=txt;
		  }
		  else
		  {
		  return this.els[0].innerHTML;
		  }
		},
		text:function(txt)
		{
		  if(this.isSet(txt))
		  {
		  this.els[0].innerText=txt;
		  }
		  else
		  {
		  return this.els[0].innerText;
		  }
		},
		nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
		},
		each : function(fn) {
			for ( var x = 0, max = this.els.length; x < max; x++)
				fn.call(this, this.els[x],x);
			return this;
		},
		attr : function(name, value, type) {
			 if(!this.isSet(value))
			 return this.getattr(name);
			 else
			 return this.setattr(name, value, type);
		},
		getattr:function(name)
		{
		  return this.els[0].getAttribute(name);
		},
		setattr:function(name, value, type) {
			this.each(function(el) {
				if (typeof type == 'undefined') {
					el[name] = value;
				} else {
					el[type][name] = value;
				}
			});
			return this;
		},
		css : function(styles) {
			var that = this;
			this.each(function(el) {
				for ( var name in styles)
					that.attr(name, styles[name], 'style');
			});
			return this;
		},
		addClass : function(className) {
			this.each(function(el) {
				el.className += ' ' + className;
			});
			return this;
		},
		removeClass : function(className) {
			this.each(function(el) {
				el.className = el.className.replace(className, '');
			});
			return this;
		},
		on : function(event, fn) {
		//debugger;
			var addEvent = function(el) {
				if (window.addEventListener) {
					el.addEventListener(event, fn, false);
				} else if (window.attachEvent) {
					el.attachEvent('on' + event, function() {
						fn.call(el, window.event);
					});
				}
			};
			this.each(function(el) {
				addEvent(el);
			});
			return this;
		},
		ready : function(fn) {
			DOMReady.add(fn);
			return this;
		},
		remove : function() {
			this.each(function(el) {
				el.parentNode.removeChild(el);
			});
			return this;
		}
	};
	Light.selector = function(selector, context) {
		var sels = selector.split(','), el, op, s;
		for ( var x = 0; x < sels.length; x++) {
			var sel = sels[x].replace(/ /g, '');
			if (typeof sel == 'string') {
				op = sel.substr(0, 1);
				s = sel.substr(1);
				if (op == '#') {
					el = document.getElementById(s);
					el = (isDescendant(el, context)) ? el : null;
				} else if (op == '.') {
					el = getElementsByClassName(s, context);
				} else {
					el = context.getElementsByTagName(sel);
				}
			}
		}
		return el;
	};
	Light.core.init.prototype = Light.core;
	var DOMReady = (function() {
		var fns = [], isReady = false, ready = function() {
			isReady = true;
			for ( var x = 0; x < fns.length; x++)
				fns[x].call();
		};
		this.add = function(fn) {
			if (fn.constructor == String) {
				var strFunc = fn;
				fn = function() {
					eval(strFunc);
				};
			}
			if (isReady) {
				fn.call();
			} else {
				fns[fns.length] = fn;
			}
		};
		if (window.addEventListener)
			document.addEventListener('DOMContentLoaded', function() {
				ready();
			}, false);
		(function() {
			if (!document.uniqueID && document.expando)
				return;
			var tempNode = document.createElement('document:ready');
			try {
				tempNode.doScroll('left');
				ready();
			} catch (err) {
				setTimeout(arguments.callee, 0);
			}
		})();
		return this;
	})();
	Light.ready = DOMReady.add;
	function isDescendant(desc, anc) {
	    try
		{
		var rtn= ((desc.parentNode == anc) || (desc.parentNode != document)
				&& isDescendant(desc.parentNode, anc));
				return rtn;
		}
		catch(e)
		{
		return false;
		}
	}
	;
	function getElementsByClassName(className, parent) {
		var a = [], re = new RegExp('\\b' + className + '\\b'), els = parent
				.getElementsByTagName('*');
		parent = parent || document.getElementsByTagName('body')[0];
		for ( var i = 0, j = els.length; i < j; i++)
			if (re.test(els[i].className))
				a.push(els[i]);
		return a;
	}
	;
})();