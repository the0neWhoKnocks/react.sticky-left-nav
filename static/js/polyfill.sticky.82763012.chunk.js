(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{55:function(t,e){!function(e,i){"use strict";var o=function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}();var n,s=!1,r="undefined"!==typeof e;r&&e.getComputedStyle?(n=i.createElement("div"),["","-webkit-","-moz-","-ms-"].some(function(t){try{n.style.position=t+"sticky"}catch(e){}return""!=n.style.position})&&(s=!0)):s=!0;var a=!1,f="undefined"!==typeof ShadowRoot,l={top:null,left:null},h=[];function d(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])}function c(t){return parseFloat(t)||0}function p(t){for(var e=0;t;)e+=t.offsetTop,t=t.offsetParent;return e}var u=function(){function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!(e instanceof HTMLElement))throw new Error("First argument must be HTMLElement");if(h.some(function(t){return t._node===e}))throw new Error("Stickyfill is already applied to this node");this._node=e,this._stickyMode=null,this._active=!1,h.push(this),this.refresh()}return o(t,[{key:"refresh",value:function(){if(!s&&!this._removed){this._active&&this._deactivate();var t=this._node,o=getComputedStyle(t),n={position:o.position,top:o.top,display:o.display,marginTop:o.marginTop,marginBottom:o.marginBottom,marginLeft:o.marginLeft,marginRight:o.marginRight,cssFloat:o.cssFloat};if(!isNaN(parseFloat(n.top))&&"table-cell"!=n.display&&"none"!=n.display){this._active=!0;var r=t.style.position;"sticky"!=o.position&&"-webkit-sticky"!=o.position||(t.style.position="static");var a=t.parentNode,l=f&&a instanceof ShadowRoot?a.host:a,h=t.getBoundingClientRect(),u=l.getBoundingClientRect(),g=getComputedStyle(l);this._parent={node:l,styles:{position:l.style.position},offsetHeight:l.offsetHeight},this._offsetToWindow={left:h.left,right:i.documentElement.clientWidth-h.right},this._offsetToParent={top:h.top-u.top-c(g.borderTopWidth),left:h.left-u.left-c(g.borderLeftWidth),right:-h.right+u.right-c(g.borderRightWidth)},this._styles={position:r,top:t.style.top,bottom:t.style.bottom,left:t.style.left,right:t.style.right,width:t.style.width,marginTop:t.style.marginTop,marginLeft:t.style.marginLeft,marginRight:t.style.marginRight};var m=c(n.top);this._limits={start:h.top+e.pageYOffset-m,end:u.top+e.pageYOffset+l.offsetHeight-c(g.borderBottomWidth)-t.offsetHeight-m-c(n.marginBottom)};var _=g.position;"absolute"!=_&&"relative"!=_&&(l.style.position="relative"),this._recalcPosition();var v=this._clone={};v.node=i.createElement("div"),d(v.node.style,{width:h.right-h.left+"px",height:h.bottom-h.top+"px",marginTop:n.marginTop,marginBottom:n.marginBottom,marginLeft:n.marginLeft,marginRight:n.marginRight,cssFloat:n.cssFloat,padding:0,border:0,borderSpacing:0,fontSize:"1em",position:"static"}),a.insertBefore(v.node,t),v.docOffsetTop=p(v.node)}}}},{key:"_recalcPosition",value:function(){if(this._active&&!this._removed){var t=l.top<=this._limits.start?"start":l.top>=this._limits.end?"end":"middle";if(this._stickyMode!=t){switch(t){case"start":d(this._node.style,{position:"absolute",left:this._offsetToParent.left+"px",right:this._offsetToParent.right+"px",top:this._offsetToParent.top+"px",bottom:"auto",width:"auto",marginLeft:0,marginRight:0,marginTop:0});break;case"middle":d(this._node.style,{position:"fixed",left:this._offsetToWindow.left+"px",right:this._offsetToWindow.right+"px",top:this._styles.top,bottom:"auto",width:"auto",marginLeft:0,marginRight:0,marginTop:0});break;case"end":d(this._node.style,{position:"absolute",left:this._offsetToParent.left+"px",right:this._offsetToParent.right+"px",top:"auto",bottom:0,width:"auto",marginLeft:0,marginRight:0})}this._stickyMode=t}}}},{key:"_fastCheck",value:function(){this._active&&!this._removed&&(Math.abs(p(this._clone.node)-this._clone.docOffsetTop)>1||Math.abs(this._parent.node.offsetHeight-this._parent.offsetHeight)>1)&&this.refresh()}},{key:"_deactivate",value:function(){var t=this;this._active&&!this._removed&&(this._clone.node.parentNode.removeChild(this._clone.node),delete this._clone,d(this._node.style,this._styles),delete this._styles,h.some(function(e){return e!==t&&e._parent&&e._parent.node===t._parent.node})||d(this._parent.node.style,this._parent.styles),delete this._parent,this._stickyMode=null,this._active=!1,delete this._offsetToWindow,delete this._offsetToParent,delete this._limits)}},{key:"remove",value:function(){var t=this;this._deactivate(),h.some(function(e,i){if(e._node===t._node)return h.splice(i,1),!0}),this._removed=!0}}]),t}(),g={stickies:h,Sticky:u,forceSticky:function(){s=!1,m(),this.refreshAll()},addOne:function(t){if(!(t instanceof HTMLElement)){if(!t.length||!t[0])return;t=t[0]}for(var e=0;e<h.length;e++)if(h[e]._node===t)return h[e];return new u(t)},add:function(t){if(t instanceof HTMLElement&&(t=[t]),t.length){for(var e=[],i=function(i){var o=t[i];return o instanceof HTMLElement?h.some(function(t){if(t._node===o)return e.push(t),!0})?"continue":void e.push(new u(o)):(e.push(void 0),"continue")},o=0;o<t.length;o++)i(o);return e}},refreshAll:function(){h.forEach(function(t){return t.refresh()})},removeOne:function(t){if(!(t instanceof HTMLElement)){if(!t.length||!t[0])return;t=t[0]}h.some(function(e){if(e._node===t)return e.remove(),!0})},remove:function(t){if(t instanceof HTMLElement&&(t=[t]),t.length)for(var e=function(e){var i=t[e];h.some(function(t){if(t._node===i)return t.remove(),!0})},i=0;i<t.length;i++)e(i)},removeAll:function(){for(;h.length;)h[0].remove()}};function m(){if(!a){a=!0,s(),e.addEventListener("scroll",s),e.addEventListener("resize",g.refreshAll),e.addEventListener("orientationchange",g.refreshAll);var t=void 0,o=void 0,n=void 0;"hidden"in i?(o="hidden",n="visibilitychange"):"webkitHidden"in i&&(o="webkitHidden",n="webkitvisibilitychange"),n?(i[o]||r(),i.addEventListener(n,function(){i[o]?clearInterval(t):r()})):r()}function s(){e.pageXOffset!=l.left?(l.top=e.pageYOffset,l.left=e.pageXOffset,g.refreshAll()):e.pageYOffset!=l.top&&(l.top=e.pageYOffset,l.left=e.pageXOffset,h.forEach(function(t){return t._recalcPosition()}))}function r(){t=setInterval(function(){h.forEach(function(t){return t._fastCheck()})},500)}}s||m(),"undefined"!=typeof t&&t.exports?t.exports=g:r&&(e.Stickyfill=g)}(window,document)}}]);
//# sourceMappingURL=polyfill.sticky.82763012.chunk.js.map