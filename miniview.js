/*
* Author: Sangeetha Jeganathan
* Email: sangeetha.jeganathan@gmail.com
* This plugin is used to create a miniview of the supplied nodes within the wrapper. Also provides functionality to rearrange based on drag of the nodes.
* Copyright © 2012 SangeethaJ. All rights reserved.
**/
(function($){
	$.fn.miniview = function(nodes) {
		var parentDom = this,container,port,width,height,x,y,l,t,w,h,eventMove,eventUp,flag = false;
		container = $('#miniview');
		width = container.width() - 2;
		height = container.height() - 2;
		var port = "";
		port = $('<div></div>').addClass("port").css('z-index',1);
		container.append(port);
		synchronize();
		parentDom.on("resize",synchronize);
		parentDom.on("drag",init);
		parentDom.on("scroll",synchronize);
		container.on("mousedown",down);
		container.on("touchstart",down);
		container.on("touchmove",function(e){
			e.preventDefault();
		});

		function down(e){
			flag = true;
			container.css('cursor',"move");
			var pos = container.position();

			x = Math.round(pos.left + l + w/2);
			y = Math.round(pos.top + t + h/2);
			move(e);
			
			if (e.type == "touchstart") {
				eventMove = "touchmove";
				eventUp = "touchend";
			} else {
				eventMove = "mousemove";
				eventUp = "mouseup";
			}
			container.on(eventMove,move);
			container.on(eventUp,up);
		}

		function move(e){
			if (!flag) { return; }
			e.preventDefault();
			
			if (e.type.match(/touch/)) {
				if (e.touches.length > 1) { return; }
				var event = e.touches[0];
			} else {
				var event = e;
			}
			
			var dx = event.clientX - x;
			var dy = event.clientY - y;
			if (l + dx < 0) { dx = -l; }
			if (t + dy < 0) { dy = -t; }
			if (l + w + 4 + dx > width) { dx = width - 4 - l - w; }
			if (t + h + 4 + dy > height) { dy = height - 4 - t - h; }
			
			
			x += dx;
			y += dy;
			
			l += dx;
			t += dy;
			
			var coefX = width / parentDom[0].scrollWidth;
			var coefY = height / parentDom[0].scrollHeight;
			var left = l / coefX;
			var top = t / coefY;
			
			if (!!navigator.userAgent.match(/webkit/i)) {
				parentDom[0].scrollLeft = Math.round(left);
				parentDom[0].scrollTop = Math.round(top);
			} else {
				parentDom[0].scrollLeft = Math.round(left);
				parentDom[0].scrollTop = Math.round(top);
			}
			
			redraw();
		}

		function up(e){
			flag = false;
			container.css('cursor','default');
		}

		function synchronize(){
			var dims= [parentDom.width(), parentDom.height()];
			var scroll = [parentDom.scrollLeft(),parentDom.scrollTop()]
			var scaleX = width / parentDom[0].scrollWidth;
			var scaleY = height / parentDom[0].scrollHeight;

			var lW = dims[0] * scaleX - 4 - 0;
			var lH = dims[1] * scaleY - 4 - 0;
			var lX = scroll[0] * scaleX;
			var lY = scroll[1] * scaleY;
			
			w = Math.round(lW);
			h = Math.round(lH);
			l = Math.round(lX);
			t = Math.round(lY);
			//set the mini viewport dimesions
			redraw();
			
		}

		function redraw(){
			port.css('width',w+"px");
			port.css('height',h+"px");
			port.css('left',l+"px");
			port.css('top',t+"px");
		}

		function init(){
			container.find('.mini').remove();
			//creating mini version of the supplied nodes
			nodes.each(function(){
				debugger;
				var mini = $('<div></div>').addClass("mini")
				container.append(mini);
				var ratioX = width / parentDom[0].scrollWidth;
				var ratioY = height / parentDom[0].scrollHeight;
				
				var wM = $(this).width() * ratioX;
				var hM = $(this).height() * ratioY;
				var xM = ($(this).position().left + parentDom.scrollLeft())* ratioX;
				var yM = ($(this).position().top + parentDom.scrollTop())* ratioY;
				
				mini.css('width', Math.round(wM)+"px");
				mini.css('height', Math.round(hM)+"px");
				mini.css('left', Math.round(xM)+"px");
				mini.css('top', Math.round(yM)+"px");
			});
			return this; // to maintain chainability
		}

		init();

	}
})(jQuery);

