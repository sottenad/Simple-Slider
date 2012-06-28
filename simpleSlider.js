
(function($){$.tiny=$.tiny||{};$.tiny.carousel={options:{start:1,display:1,axis:'x',controls:true,pager:false,interval:false,intervaltime:3000,rewind:false,animation:true,duration:1000,callback:null}};$.fn.tinycarousel=function(options){var options=$.extend({},$.tiny.carousel.options,options);this.each(function(){$(this).data('tcl',new Carousel($(this),options));});return this;};$.fn.tinycarousel_start=function(){$(this).data('tcl').start();};$.fn.tinycarousel_stop=function(){$(this).data('tcl').stop();};$.fn.tinycarousel_move=function(iNum){$(this).data('tcl').move(iNum-1,true);};function Carousel(root,options){var oSelf=this;var oViewport=$('.viewport:first',root);var oContent=$('.overview:first',root);var oPages=oContent.children();var oBtnNext=$('.next:first',root);var oBtnPrev=$('.prev:first',root);var oPager=$('.pager:first',root);var iPageSize,iSteps,iCurrent,oTimer,bPause,bForward=true,bAxis=options.axis=='x';function initialize(){iPageSize=bAxis?$(oPages[0]).outerWidth(true):$(oPages[0]).outerHeight(true);var iLeftover=Math.ceil(((bAxis?oViewport.outerWidth():oViewport.outerHeight())/(iPageSize*options.display))-1);iSteps=Math.max(1,Math.ceil(oPages.length/options.display)-iLeftover);iCurrent=Math.min(iSteps,Math.max(1,options.start))-2;oContent.css(bAxis?'width':'height',(iPageSize*oPages.length));oSelf.move(1);setEvents();return oSelf;};function setEvents(){if(options.controls&&oBtnPrev.length>0&&oBtnNext.length>0){oBtnPrev.click(function(){oSelf.move(-1);return false;});oBtnNext.click(function(){oSelf.move(1);return false;});}if(options.interval){root.hover(oSelf.stop,oSelf.start);}if(options.pager&&oPager.length>0){$('a',oPager).click(setPager);}};function setButtons(){if(options.controls){oBtnPrev.toggleClass('disable',!(iCurrent>0));oBtnNext.toggleClass('disable',!(iCurrent+1<iSteps));}if(options.pager){var oNumbers=$('.pagenum',oPager);oNumbers.removeClass('active');$(oNumbers[iCurrent]).addClass('active');}};function setPager(oEvent){if($(this).hasClass('pagenum')){oSelf.move(parseInt(this.rel),true);}return false;};function setTimer(){if(options.interval&&!bPause){clearTimeout(oTimer);oTimer=setTimeout(function(){iCurrent=iCurrent+1==iSteps?-1:iCurrent;bForward=iCurrent+1==iSteps?false:iCurrent==0?true:bForward;oSelf.move(bForward?1:-1);},options.intervaltime);}};this.stop=function(){clearTimeout(oTimer);bPause=true;};this.start=function(){bPause=false;setTimer();};this.move=function(iDirection,bPublic){iCurrent=bPublic?iDirection:iCurrent+=iDirection;if(iCurrent>-1&&iCurrent<iSteps){var oPosition={};oPosition[bAxis?'left':'top']=-(iCurrent*(iPageSize*options.display));oContent.animate(oPosition,{queue:false,duration:options.animation?options.duration:0,complete:function(){if(typeof options.callback=='function')options.callback.call(this,oPages[iCurrent],iCurrent);}});setButtons();setTimer();}};return initialize();};})(jQuery);
(function($){
	$.fn.simpleSlideshow = function(options){
		var methods = {			
			thumbClicked: function(e){
				var imgs = $(e).parents('.ss_wrap').find('.ss_img');
				$(imgs).hide();
				$(imgs).eq( $(e).index() ).show();
				$('.overview li').removeClass('selected');
				$(e).addClass('selected');
			},
			nextImage: function(e){
				var images = $(e).parent().find('.ss_img');
				var ind = $(e).parent().find('.ss_img:visible').index();
				var len = $(images).length;
				if(ind+1 <= len){
					$(images).hide();
					$(images).eq(ind+1).show();
					$('main_prev').show();
					$('.overview li').removeClass('selected');
					$('.overview li').eq(ind+1).addClass('selected');
					var viewportwidth = $('.viewport').width();
					var viewportoffset = $('.overview').css('left').replace('px','')*-1;
					var pos = $('.overview li').eq(ind+1).position();
					
					console.log([pos.left, viewportoffset]);
					if( pos.left > viewportwidth+viewportoffset  ){
						console.log('not viz, move right');
						console.log($('#slider-code').tinycarousel.methods);
						$('#slider-code').tinycarousel_move(3);
					}else if( pos.left < viewportoffset  ){
						console.log('not viz, move left');
						$('#slider-code').tinycarousel_move(-1);
					}
				}
				if(ind+1 == len){
					$('main_next').hide();
				}

			},
			previousImage: function(e){
				var images = $(e).parent().find('.ss_img');
				var ind = $(e).parent().find('.ss_img:visible').index();
				if(ind-1 >= 0){
					$(images).hide();
					$(images).eq(ind-1).show();
					$('main_next').show();
					$('.overview li').removeClass('selected');
					$('.overview li').eq(ind-1).addClass('selected');
					var viewportwidth = $('.viewport').width();
					var viewportoffset = $('.overview').css('left').replace('px','')*-1;
					var pos = $('.overview li').eq(ind-1).position();

					console.log([pos.left, viewportoffset+viewportwidth]);

					if( pos.left > viewportoffset+viewportwidth  ){
						$('#slider-code').tinycarousel_move(1);
					}else if( pos.left < viewportoffset  ){
						$('#slider-code').tinycarousel_move(-1);
					}
				}
				if(ind-1 == 0){
					$('main_prev').hide();
				}
				
			}			
		};
		var settings = $.extend( {
			'captions': false,
			'height' : 200,
			'width' : 300
		}, options);
		return this.each(function(){
				var el = this;
				
				var wrapper = $(el).wrap('<div class="ss_wrap" />');
				$(el).after('<a href="#" id="main_next">next</a>');
				$(el).before('<a href="#" id="main_prev">prev</a>');

				$(wrapper).css({'height':settings.height+'px', 'width':settings.width+'px'});
				var thumbs = '';
				var height = '';
				$(el).find('img').each(function(){
					var imgTag = this;
					$(imgTag).css({'height':settings.height+'px', 'width':settings.width+'px'});
					$(imgTag).wrap('<div class="ss_img"></div>');
					var thumbUrl = $(imgTag).attr('data-thumb');
					if(thumbUrl){
						var thumbnail = '<li><img src="'+thumbUrl+'" /></li>';
						
						thumbs += thumbnail;
					}
				});
				$(el).after('<div id="slider-code"><a class="buttons prev" href="#">left</a><div class="viewport"><ul class="overview">'+thumbs+'</ul></div><a class="buttons next" href="#">right</a></div>');
				$(el).find('.ss_img').eq(0).show();
				$('.overview li').eq(0).addClass('selected');
				$('.overview li').bind('click', function(){
					methods.thumbClicked(this);
				});
				$('#main_prev').bind('click', function(){
					methods.previousImage(this);
				});
				$('#main_next').bind('click', function(){
					methods.nextImage(this);
				});
		});
	}; 
})(jQuery);