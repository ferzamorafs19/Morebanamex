/** jquery.easing.js **/
try{
	jQuery.Easing={easein:function(x,t,b,c,d){return c*(t/=d)*t+b},easeinout:function(x,t,b,c,d){if(t<d/2)return 2*c*t*t/(d*d)+b;var a=t-d/2;return-2*c*a*a/(d*d)+2*c*a/d+c/2+b},easeout:function(x,t,b,c,d){return-c*t*t/(d*d)+2*c*t/d+b},expoin:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(Math.exp(Math.log(c)/d*t))+b},expoout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(-Math.exp(-Math.log(c)/d*(t-d))+c+1)+b},expoinout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}if(t<d/2)return a*(Math.exp(Math.log(c/2)/(d/2)*t))+b;return a*(-Math.exp(-2*Math.log(c/2)/d*(t-d))+c+1)+b},bouncein:function(x,t,b,c,d){return c-jQuery.easing['bounceout'](x,d-t,0,c,d)+b},bounceout:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},bounceinout:function(x,t,b,c,d){if(t<d/2)return jQuery.easing['bouncein'](x,t*2,0,c,d)*.5+b;return jQuery.easing['bounceout'](x,t*2-d,0,c,d)*.5+c*.5+b},elasin:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},elasout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},elasinout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},backin:function(x,t,b,c,d){var s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},backout:function(x,t,b,c,d){var s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},backinout:function(x,t,b,c,d){var s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},linear:function(x,t,b,c,d){return c*t/d+b}};
	
	(function($){$.modalLogin=function(options){return $.modalLogin.impl.init(options);};$.modalLogin.close=function(){$.modalLogin.impl.close();};$.modalLogin.setContainerDimensions=function(resize){$.modalLogin.impl.setContainerDimensions(resize);};$.modalLogin.setDimentions=function(height,width){$.modalLogin.impl.setDimentions(height,width);};$.modalLogin.esconder=function(Contenido,height,width){$.modalLogin.impl.esconder(Contenido,height,width);};$.modalLogin.mostrar=function(){$.modalLogin.impl.mostrar();};$.modalLogin.defaults={focus:true,opacity:50,minHeight:30,minWidth:40,maxHeight:null,maxWidth:null,autoResize:true,autoPosition:true,zIndex:1000,close:true,closeClass:'CerrarVentanaEmergenteLogin',escClose:false,overlayClose:true,position:null,onOpen:null,onShow:null,flagDivIfrm:true,heightDivIfrm:'auto',widthDivIfrm:480,srcIfrm:'/bestbanking/spanishdir/if.htm'};$.modalLogin.impl={o:null,d:{},dim:null,timeoutDiv:"",init:function(options){var  s=this;s.o=$.extend({},$.modalLogin.defaults,options);if(!s.o.flagDiv)document.getElementById('mensajeError_contenido_ifrm_Login').setAttribute('src',s.o.srcIfrm);s.zIndex=s.o.zIndex;s.occb=false;s.crear();s.open();if($.isFunction(s.o.onShow)){s.o.onShow.apply(s,[s.d]);}return s;},crear:function(){var  s=this;w=s.getDimensions();$('.cerrarOverlayLogin').css({display:'none',opacity:s.o.opacity/100,height:w[0],width:w[1],position:'fixed',left:0,top:0,zIndex:s.o.zIndex+1});s.d.overlay=$('.cerrarOverlayLogin');$('.ventanaEmergenteLogin').css({display:'none',position:'fixed',zIndex:s.o.zIndex+2,top:'-2500px'});s.d.container=$('.ventanaEmergenteLogin');s.d.data=$('.ventanaEmergente-dataLogin');},bindEvents:function(){var  s=this;$('.'+s.o.closeClass).bind('click.ventanaEmergenteLogin',function(e){e.preventDefault();s.close();});if(s.o.close&&s.o.overlayClose){s.d.overlay.bind('click.ventanaEmergenteLogin',function(e){e.preventDefault();s.close();});}$(document).bind('keydown.ventanaEmergenteLogin',function(e){if(s.o.focus&&e.keyCode==9){s.watchTab(e);}if((s.o.close&&s.o.escClose)&&e.keyCode==27){e.preventDefault();s.close();}});$(window).bind('resize.ventanaEmergenteLogin',function(){w=s.getDimensions();s.setContainerDimensions(true);s.d.iframe&&s.d.iframe.css({height:w[0],width:w[1]});s.d.overlay.css({height:w[0],width:w[1]});});},unbindEvents:function(){$('.'+this.o.closeClass).unbind('click.ventanaEmergenteLogin');$(document).unbind('keydown.ventanaEmergenteLogin');$(window).unbind('resize.ventanaEmergenteLogin');this.d.overlay.unbind('click.ventanaEmergenteLogin');},focus:function(pos){var  s=this,p=pos||'first';var  input=$(':input:enabled:visible:'+p);input.length>0?input.focus():s.d.container.focus();},getDimensions:function(){var  el=$(window);var h=$.browser.opera&&$.browser.version>'9.5'&&$.fn.jquery<='1.2.6'?document.documentElement['clientHeight']:$.browser.opera&&$.browser.version<'9.5'&&$.fn.jquery>'1.2.6'?window.innerHeight:el.height();return[h,el.width()];},getVal:function(v){return v=='auto'?0:v.indexOf('%')>0?v:parseInt(v.replace(/px/,''));},setContainerDimensions:function(resize){var s=this;if(!resize||(resize&&s.o.autoResize)){var ch=s.getVal(s.d.container.css('height')),cw=s.getVal(s.d.container.css('width')),dh=s.d.data.outerHeight(true),dw=s.d.data.outerWidth(true);var mh=s.o.maxHeight&&s.o.maxHeight<w[0]?s.o.maxHeight:w[0],mw=s.o.maxWidth&&s.o.maxWidth<w[1]?s.o.maxWidth:w[1];if(!ch){if(!dh){ch=s.o.minHeight;}else{if(dh>mh){ch=mh;}if(dh<s.o.minHeight){ch=s.o.minHeight;}else{ch=dh;}}}else{ch=ch>mh?mh:ch;}if(!cw){if(!dw){cw=s.o.minWidth;}else{if(dw>mw){cw=mw;}if(dw<s.o.minWidth){cw=s.o.minWidth;}else{cw=dw;}}}else{cw=cw>mw?mw:cw;}}if(s.o.autoPosition){s.setPosition();}},setDimentions:function(height,width){$('#tabla_emergenteLogin,.ventanaEmergente-dataLogin').css({width:width+40,height:height=='auto'?'auto':+height+35});if($("#mensajeError_contenido_ifrm_Login").is(":visible"))$("#mensajeError_contenido_ifrm_Login").css({height:height,width:width});if($("#mensajeError_contenido_session_Login").is(":visible"))$("#mensajeError_contenido_session_Login").css({height:height,width:width});else $("#mensajeError_contenido_div_Login").css({height:height,width:width});$("#ventanaEmergenteLogin").css({height:height+35});$.modalLogin.impl.setContainerDimensions(true);},setPosition:function(){var s=this;if(w[0]>s.d.container.outerHeight(true)||document.getElementById('main')==undefined){$('html').css('overflow-y','hidden');s.d.container.css('position','fixed'); hc=(w[0]/2)-(s.d.container.outerHeight(true)/2); }else{$('html').css('overflow-y','scroll');s.d.container.css('position','absolute');try{if($('#wrapper_div').outerHeight(true)>s.d.container.outerHeight(true)){hc=($('#wrapper_div').outerHeight(true)/2)-(s.d.container.outerHeight(true)/2);}else{$('#ventanaEmergenteLogin').css('height',$('#ventanaEmergente-contenidoLogin').outerHeight()+60);hc=60;}}catch(e){return;}}s.d.container.stop().animate({top:hc},350,function(){s.d.container.css({top:hc})});},watchTab:function(e){var s=this;if($(e.target).parents('.ventanaEmergenteLogin').length>0){s.inputs=$(':input:enabled:visible:first,:input:enabled:visible:last',s.d.data[0]);if((!e.shiftKey&&e.target==s.inputs[s.inputs.length-1])||(e.shiftKey&&e.target==s.inputs[0])||s.inputs.length==0){e.preventDefault();var pos=e.shiftKey?'last':'first';setTimeout(function(){s.focus(pos);},10);}}else{e.preventDefault();setTimeout(function(){s.focus();},10);}},open:function(){var s=this;s.d.overlay.show();s.d.container.show();$('html').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});$('body').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});s.bindEvents();$('#tabla_emergenteLogin,.ventanaEmergente-dataLogin').css({width:s.o.widthDivIfrm+40,height:s.o.heightDivIfrm=='auto'?'auto':+s.o.heightDivIfrm+35});if(s.o.flagDiv){s.focus();showInput="div_Login";hiddeInput="ifrm_Login";}else{showInput="ifrm_Login";hiddeInput="div_Login";}$('#mensajeError_contenido_'+showInput).css({width:s.o.widthDivIfrm,height:s.o.heightDivIfrm,display:'block'});$('#mensajeError_contenido_'+hiddeInput).css({display:'none'});if(!s.o.flagDiv)setTimeout(function(){$.modalLogin.impl.setPosition();},550);else $.modalLogin.impl.timeoutDiv=setTimeout(function(){$.modalLogin.impl.setDimentions(document.getElementById("mensajeError_contenido_div_Login").offsetHeight,document.getElementById("mensajeError_contenido_div_Login").offsetWidth);},550);},close:function(){var s=this;if(document.getElementById('main')!=undefined){ajustarIframe();}s.unbindEvents();$('html').css('overflow-y','scroll');s.d.container.animate({top:"-"+(s.d.container.height()+100)},300,function(){s.d.overlay.fadeOut(350);setTimeout(function(){/*$('html').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});$('body').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});*/},400);});},esconder:function(Contenido,height,width){var s=this;$("#mensajeError_contenido_ifrm_Login").css("display","none");$.modalLogin.impl.setDimentions(height,width);$("#mensajeError_contenido_div_Login").html(Contenido).css("display","block");$('.ventanaEmergenteLogin').fadeIn("fast");},mostrar:function(){clearTimeout($.modalLogin.impl.timeoutDiv);$("#mensajeError_contenido_div_Login").css("display","none");$('.ventanaEmergenteLogin').fadeIn("fast");$("#mensajeError_contenido_ifrm_Login").css("display","block");}};})(jQuery);
} catch(error){}

var desplegables = new Array();
function optieneAlturas(){
	$('.expand').each(
		function(i){
			desplegables[i] = $('.expand:eq('+i+')').height();
		}
	);
}
function slide(navegacion_id, pad_out, pad_in){
	var listaElementos = $(navegacion_id + ' div');
	var claseTexto = $(navegacion_id).parent().find('div:eq(2)').attr('class');
	$(listaElementos).each(
		function(i){
			//if(!detectaDispositivoMobile()){
				$(this).hover(
					function(){
						$(this).animate({ paddingLeft: pad_out, opacity: 0.7 },{ duration: 150, "Easing": "easein", complete: function(){}});
					},		
					function(){
						$(this).animate({ paddingLeft: pad_in, opacity: 1 },{ duration: 150, "Easing": "elasinout", complete: function(){}});
					}
				);
			//}
		}
	);	
	$('.'+claseTexto+' span').each(
		function(i){
			//if(!detectaDispositivoMobile()){
				$(this).hover(
					function(){
						$(this).parent().parent().find('div:eq(0)').find('div').animate({ paddingLeft: pad_out, opacity: 0.7 },{ duration: 150, "Easing": "easein", complete: function(){}});
						
					},		
					function(){
						$(this).parent().parent().find('div:eq(0)').find('div').animate({ paddingLeft: pad_in, opacity: 1 },{ duration: 150, "Easing": "elasinout", complete: function(){}});
					}
				);
			//}
		}
	);
}
function desple1(idBtn, idConte, indiceAltura,estado){
	if(estado == 0){
		$('#'+idBtn).removeClass().addClass('saldos_bloque2_f1_btnH');
		$('#'+idBtn+' div').fadeOut('fast');
		$('#'+idConte).animate({ height: 0},{ duration: 400, "Easing": "easein", complete: function(){$('#'+idConte).css({height: 'auto',display:'none'});}});
		setTimeout( function(){try{window.parent.ajustarIframe()}catch(e){}}, 600);
	}else{
		$('#'+idBtn).removeClass().addClass('saldos_bloque2_f1_btn');
		$('#'+idBtn+' div').fadeOut('fast');
		$('#'+idConte).css({height: 0,display:'block'});
		$('#'+idConte).animate({ height: desplegables[indiceAltura]},{ duration: 400, "Easing": "easein", complete: function(){$('#'+idConte).css({height: 'auto'});}});

		setTimeout( function(){window.parent.ajustarIframe()}, 600);
	}
}
function desple2(idBtn, idConte, indiceAltura, estado){
	if(estado == 0){
		$('#'+idConte).animate({ height: 0},{ duration: 400, "Easing": "easein", 
			complete: function(){
				$('#'+idConte).css({height: 'auto',display:'none'});
				$('#'+idBtn).parent().parent().css({'border-bottom':'#FFF 1px solid'});
				$('#'+idBtn).parent().parent().find('.titularTabla').fadeIn();																															
			}
		});
		setTimeout( function(){window.parent.ajustarIframe()}, 600);
	}else{
		$('#'+idConte).animate({ height: desplegables[indiceAltura]},{ duration: 400, "Easing": "easein", complete: function(){$('#'+idConte).css({height: 'auto'});
		$('#'+idBtn).parent().parent().find('.titularTabla').fadeOut();
		}});
		setTimeout( function(){window.parent.ajustarIframe()}, 600);
	}
}
function desple3(idBtn, idConte, indiceAltura, estado){
	if(estado == 0){
		$('#'+idConte).animate({ height: 0},{ duration: 400, "Easing": "easein", complete: function(){$('#'+idConte).css({height: 'auto',display:'none'});
		$('#'+idBtn).parent().parent().parent()
		.css({'background':'#7386ad url(/bestbanking/BB/images/bg2.svg) -30px -279px no-repeat'});
		$('#'+idBtn).parent().parent()
		.css({'background':'url(/bestbanking/BB/images/bg2.svg) right -309px no-repeat'});
		$('#'+idConte+'b').hide();
		$('#'+idBtn).parent().parent().find('.titularTabla').fadeIn();
		}});
		setTimeout( function(){window.parent.ajustarIframe()}, 600);
	}else{
		$('#'+idConte).animate({ height: desplegables[indiceAltura]},{ duration: 400, "Easing": "easein", complete: function(){$('#'+idConte).css({height: 'auto'});
		$('#'+idBtn).parent().parent().find('.titularTabla').fadeOut();
		}});
		setTimeout( function(){window.parent.ajustarIframe()}, 600);
	}
}
function desplegable(idBtn, idConte, tipo){
	var indiceAltura = $('#'+idConte).index('.expand')
	var alturaArray = desplegables;
	if(tipo == 0){
		if($('#'+idBtn).hasClass('saldos_bloque2_f1_btn')){
			$('#'+idBtn+' div').fadeIn('fast',
				function(){
					desple1(idBtn, idConte, indiceAltura,0);
				}
			);
		}else{
			$('#'+idBtn+' div').fadeIn('fast', 
				function(){
					desple1(idBtn, idConte, indiceAltura, 1);
				}
			);
		}
	}else{
		if(tipo == 1){		
			if($('#'+idBtn).hasClass('saldos_bloque4_f1_btn')){
				$('#'+idBtn+' div').fadeIn('fast',
					function(){
						$('#'+idBtn).removeClass().addClass('saldos_bloque4_f1_btnH');
						$('#'+idBtn+' div').fadeOut('fast');
						desple2(idBtn, idConte, indiceAltura, 0);
					}
				);
			}else{
				$('#'+idBtn+' div').fadeIn('fast', 
					function(){
						$('#'+idBtn).removeClass().addClass('saldos_bloque4_f1_btn');
						$('#'+idBtn+' div').fadeOut('fast');
						$('#'+idConte).css({height: 0,display:'block'});
						$('#'+idBtn).parent().parent().css({'border-bottom':'none'});
						desple2(idBtn, idConte, indiceAltura, 1);
					}
				);
			}		
		}else{
			if(tipo == 2){
				if($('#'+idBtn).hasClass('saldos_btn5')){
					$('#'+idBtn+' div').fadeIn('fast',
						function(){
							$('#'+idBtn).removeClass().addClass('saldos_btn6');
							$('#'+idBtn+' div').fadeOut('fast');
							$('#'+idConte).hide();
							//$('#'+idBtn).parent().parent().find('td').removeClass('bgF0F4F9b');
							optieneAlturas();
							window.parent.ajustarIframe();
						}
					);
				}else{
					$('#'+idBtn+' div').fadeIn('fast', 
						function(){
							$('#'+idBtn).removeClass().addClass('saldos_btn5');
							$('#'+idBtn+' div').fadeOut('fast');
							$('#'+idConte).show();
							//$('#'+idBtn).parent().parent().find('td').addClass('bgF0F4F9b');
							optieneAlturas();
							window.parent.ajustarIframe();
						}
					);
				}
			}else{			
				if(tipo == 3){		
					if($('#'+idBtn).hasClass('saldos_bloque4_f1_btn')){
						$('#'+idBtn+' div').fadeIn('fast',
							function(){
								$('#'+idBtn).removeClass().addClass('saldos_bloque4_f1_btnH');
								$('#'+idBtn+' div').fadeOut('fast');
								desple3(idBtn, idConte, indiceAltura, 0);
							}
						);
					}else{
						$('#'+idBtn+' div').fadeIn('fast', 
							function(){
								$('#'+idBtn).removeClass().addClass('saldos_bloque4_f1_btn');
								$('#'+idBtn+' div').fadeOut('fast');
								$('#'+idConte).css({height: 0,display:'block'});
								$('#'+idConte+'b').show();
								$('#'+idBtn).parent().parent().parent()
								.css({background:'#7386ad'});
								$('#'+idBtn).parent().parent()
								.css({background:'none'});
								desple3(idBtn, idConte, indiceAltura, 1);
							}
						);
					}		
				}			
			}
		}
	}
}

function expandirTodo(){
	var claseBoton = '';
	$('.expand').each(
		function(i){
			$(this).show();
		}
	);
	$('.saldos_bloque4_f1_btnH').removeClass().addClass('saldos_bloque4_f1_btn');
	$('.saldos_bloque2_f1_btnH').removeClass().addClass('saldos_bloque2_f1_btn');
	$('.saldos_btn6').removeClass().addClass('saldos_btn5');
	$('.bordeInfContrae').css({'border-bottom':'none'});
	$('.saldos_bloque4').css({background:'#7386ad'});
	$('.saldos_bloque4b').css({background:'none'});
	$('.titularTabla').fadeOut();	
	setTimeout( function(){window.parent.ajustarIframe()}, 351);
}

function contraerTodo(){
	var claseBoton = '';
	$('.expand').each(
		function(i){
			$(this).hide();
		}
	);
	$('.saldos_bloque4_f1_btn').removeClass().addClass('saldos_bloque4_f1_btnH');
	$('.saldos_bloque2_f1_btn').removeClass().addClass('saldos_bloque2_f1_btnH');
	$('.saldos_btn5').removeClass().addClass('saldos_btn6');
	
	$('.saldos_bloque4b').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -309px no-repeat'})
	.parent().css({background:'#7386ad url(/bestbanking/BB/images/bg2.svg) -30px -279px no-repeat'});
	$('.bordeInfContrae').css({'border-bottom':'#FFFFFF 1px solid'});
	$('.titularTabla').fadeIn();	
	setTimeout( function(){window.parent.ajustarIframe()}, 351);
}

function soloNumLetras(id){
	var texto = document.getElementById(id).value;
	var caracteres="0123456789abcdefghijklmn�opqrstuvwxyz";
	var flagOk= false;
	if(texto.length > 0){
		texto = texto.toLowerCase();
		for(i=0; i<texto.length; i++){
			if (caracteres.indexOf(texto.charAt(i),0)!=-1 || texto.charAt(i)==" " || texto.charAt(i)=="&nbsp;"){			
				flagOK=true;
			}else{
				return false;
			}
		}
		if(flagOK)
			return true;
		else
			return false;
	}
	else{
		return true;
	}
}
function validaBuscar(id){
	var estado = soloNumLetras(id);
	var estado;
	if(estado){
		$('.saldos_bloque2_f4_error span').hide();
		$('.saldos_bloque2_f4_error').slideUp('fast')
		return true;		
	}else{
		$('.saldos_bloque2_f4_error').slideDown('fast', 
			function(){
				$('.saldos_bloque2_f4_error span').show();
				window.parent.ajustarIframe();
			}
		)
		return false;
	}
	if(document.getElementById(id).value == 456){}
}
function regresar(esc,url,fn){
	window.parent.cargaDoc(url)
	switch(esc){
		case 0:
			window.parent.soloConteIfr();
			break;
		case 1:
			window.parent.conteIfrConteVg();
			break;
		case 2:
			window.parent.conteIfrConteVg();
			break;
	}
}
function irAdministrac(){
	window.parent.eventoNivel1ifr();
}
function inputClic(cls){
	var textTemp = $('#'+cls).val()
	if(document.getElementById(cls).value == '' || document.getElementById(cls).value == textTemp){
		document.getElementById(cls).value = '';
	}
	$('body').click(
		function(event){
			if(!( $(event.target).is('#'+cls) )){
				if( document.getElementById(cls).value == ''){
					document.getElementById(cls).value = textTemp;
				}
			}
		}
	);
}

function pintaTablas(){
	$(".pinta1 tr").even("td").css("background-color", "#F0FDFF");
	$(".pinta1 tr").odd("td").css("background-color", "#FFF");
	$(".pinta2 tr").even("td").css("background-color", "#FFF");
	$(".pinta2 tr").odd("td").css("background-color", "#F0FDFF");
}

function activaHoverIcos(){
		$('.saldos_btn1').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -102px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -102px no-repeat'});			
			}		
		);
		$('.saldos_btn1b').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -102px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -102px no-repeat'});			
			}		
		);
		$('.saldos_btn2').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});			
			}		
		);
		$('.saldos_btn2b').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});			
			}		
		);
		$('.saldos_btn3').hover(
			function(){
				$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) right -53px no-repeat'});
			},
			function(){
				$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) left -53px no-repeat'});			
			}		
		);
		$('.saldos_btn4').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -77px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -77px no-repeat'});			
			}		
		);
		$('.inputBtn1').hover(
			function(){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -827px no-repeat'})
			},
			function(){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -827px no-repeat'})
			}
		);
		$('.inputBtn2').hover(
			function(){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -852px no-repeat'})
			},
			function(){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -852px no-repeat'})
			}
		);
		$('.saldos_bordeInfCe5 a').hover(
			function(){
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -249px'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -249px'});
				posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -194px'});
			},
			function(){
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -224px'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -224px'});
				posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -169px'});
			}
		);
		$('.saldos_bordeInfCe5_2 a').hover(
			function(){
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfDe5_2.gif) bottom'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfIz5_2.gif) bottom'});
				posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfCe5_2.gif) bottom'});
			},
			function(){
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfDe5_2.gif)'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfIz5_2.gif)'});
				posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/saldos_bordeInfCe5_2.gif)'});
			}
		);
	$('.saldos_btn1').click(
		function(){			
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -102px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -102px no-repeat'});
					}
				,350);			
		}
	);
	$('.saldos_btn2').click(
		function(){			
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});
					}
				,350);
		}
	);
	$('.saldos_btn2b').click(
		function(){			
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});
					}
				,350);
		}
	);
	$('.saldos_btn3').click(
		function(){			
				$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) right -53px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) left -53px no-repeat'});
					}
				,350);
		}
	);
	$('.saldos_btn4').click(
		function(){			
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -77px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -77px no-repeat'});
					}
				,350);
		}
	);
	$('.inputBtn1').click(
		function(){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -827px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -827px no-repeat'});
					}
				,350);
		}
	);
	$('.inputBtn2').click(
		function(){			
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -852px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -852px no-repeat'})
					}
				,350);
			}
	);
	$('.btnExportar1').click(
		function(){			
				$(this).css({'background':'url(/bestbanking/BB/images/icoExp1.svg)'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/icoExp1h.svg)'})
					}
				,350);
		}
	);
	$('.btnExportar2').click(
		function(){			
				$(this).css({'background':'url(/bestbanking/BB/images/icoExp1.svg)'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/icoExp1h.svg)'})
					}
				,350);
		}
	);
	$('.saldos_bordeInfCe5 a').click(
		function(){			
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -249px'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -249px'});
				posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -194px'});
				setTimeout(
					function(){
					posMad.find('td:eq(0)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -224px'});
					posMad.find('td:eq(2)').find('div').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -224px'});
					posMad.find('td:eq(1)').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -169px'});
					}
				,350);
		}
	);
}
function desabilitarArea(){
	var alto1 = $('.cortinaEspec1i').height();
	$('.cortinaEspec1').css({height:alto1+'px', opacity:0.6, 'margin-top':'-'+alto1+'px'})
}

var valor_actual = 1;
var pxbloque = 0;
var total_paginas = 0;
var bloque = ['-5','+5'];
if(parent.BB_LANG == '1')
	BBPAG = ['Anterior', 'Siguiente'];
else
	BBPAG = ['Previous', 'Next'];
function ir_pag( pag_ir , total, tabla , form , id, sigant){
	valor_ant = pag_ir-1;
	valor_actual = pag_ir;
	valor_sig = pag_ir+1;
    valor_max = 5;
    (total > valor_max)?pxbloque = valor_max:pxbloque=total;
	cant_paginas = total_paginas = total;
	(id=="undefined" || id==null)?id="paginacion":id=id;
	(sigant=="undefined" || sigant==null)?sigant=0:sigant=sigant;
	if( valor_actual == 1 ){
		retorno = '<a href="JavaScript:void(0);" class="antsig_d">&laquo; '+BBPAG[0]+'</a>&nbsp;&nbsp;&nbsp;';
	}else{
		retorno = '<a href="JavaScript:ir_pag('+valor_ant+' , '+total+' , ' + "'" + tabla + "'" + ' , ' + "'" + form + "'" + ' , ' + "'" + id + "'" +' , ' + sigant + ');EPagingPrevious('+ form +' ,' + "'" + tabla + "'" + ');" class="antsig">&laquo; '+BBPAG[0]+'</a>&nbsp;&nbsp;&nbsp;';
	}
	if( valor_actual < valor_max-1){
		for( i=1; i<=pxbloque; i++ ){
			if( valor_actual == i ){
				retorno += '<a href="JavaScript:EPagingGotoPage('+ "'" + form + "'" + ' ,' + "'" + tabla + "'" + ',' + i + ');" class="sel_num">'+i+'</a>';
			}else{
				retorno += '<a href="JavaScript:ir_pag('+i+'  , '+total+' , ' + "'" + tabla + "'" + ' , ' + "'" + form + "'" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');EPagingGotoPage('+ form +' ,' + "'" + tabla + "'" + ',' + i + ');" class="num">'+i+'</a>';
			}
		}
	}else{
		if( valor_actual > cant_paginas-2){
			for( i=(cant_paginas-4); i<=cant_paginas; i++ ){
				if(i > 0){
					if( valor_actual == i ){
						retorno += '<a href="JavaScript:EPagingGotoPage('+ "'" + form + "'" +' ,' + "'" + tabla + "'" + ',' + i + ');" class="sel_num">'+i+'</a>';
					}else{
						retorno += '<a href="JavaScript:ir_pag('+i+'  , '+total+' , ' + "'" + tabla + "'" + ' , ' + "'" + form + "'" + ' , ' + "'" + id + "'" + ' , ' + sigant + '); EPagingGotoPage('+ form +' ,' + "'" + tabla + "'" + ',' + i + ');" class="num">'+i+'</a>';
					}
				}
			}	
		}else{
			for( i=(valor_actual-2); i<=(valor_actual+2); i++ ){
				if( valor_actual == i ){
					retorno += '<a href="JavaScript:EPagingGotoPage('+ "'" + form + "'" +' ,' + "'" + tabla + "'" + ',' + i + ');" class="sel_num">'+i+'</a>';
				}else{
					retorno += '<a href="JavaScript:ir_pag('+i+'  , '+total+' , ' + "'" + tabla + "'" + ' , ' + "'" + form + "'" + ' , ' + "'" + id + "'" + ' , ' + sigant + '); EPagingGotoPage('+ form +' ,' + "'" + tabla + "'" + ',' + i + ');" class="num">'+i+'</a>';
				}
			}	
		}
	}
	if( valor_actual == cant_paginas ){
		retorno += '&nbsp;&nbsp;&nbsp;<a href="JavaScript:void(0);" class="antsig_d">'+BBPAG[1]+' &raquo;</a>';
	}else{
		retorno += '&nbsp;&nbsp;&nbsp;<a href="JavaScript:ir_pag('+valor_sig+'  , '+total+' , ' + "'" + tabla + "'" + ' , ' + "'" + form + "'" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');EPagingNext('+ form +' ,'  + "'" + tabla + "'" + ');" class="antsig">'+BBPAG[1]+' &raquo;</a>';
	}
	
	document.getElementById(id).innerHTML = retorno ;
	
	
	retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque(\'-\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">&laquo; '+bloque[0]+'</div>'+
			'<div class="sig_bloque floatL" onclick="ir_bloque(\'+\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">'+bloque[1]+' &raquo;</div>';

	if( valor_actual >= cant_paginas ){
		retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque(\'-\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">&laquo; '+bloque[0]+'</div>'+
			'<div class="sig_bloque_d floatL">'+bloque[1]+' &raquo;</div>';
	}
	if( valor_actual <= 1){
		retorno_bloques = '<div class="ant_bloque_d floatL">&laquo; '+bloque[0]+'</div>'+
			'<div class="sig_bloque floatL" onclick="ir_bloque(\'+\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">'+bloque[1]+' &raquo;</div>';
	}
	
	if(cant_paginas <= 5 )
				retorno_bloques = '<div class="ant_bloque_d floatL">&laquo; '+bloque[0]+'</div>'+
			'<div class="sig_bloque_d floatL">'+bloque[1]+' &raquo;</div>';
	
	if(sigant==0)document.getElementById('bloqueSigAnt').innerHTML = retorno_bloques;
	if(cant_paginas <5)
		$("#bloqueSigAnt").addClass("displayN");
	else
		$("#bloqueSigAnt").removeClass("displayN");
	if(screen.width!="1366")
		$(".num").css("padding-left","3px").css("padding-right","3px");
}

function ir_bloque( mov , tabla , form, id, sigant){
	retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque(\'-\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">&laquo; '+bloque[0]+'</div>'+
			'<div class="sig_bloque floatL" onclick="ir_bloque(\'+\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">'+bloque[1]+' &raquo;</div>';
			
	if( mov=='+' ){
		ir_a = valor_actual+5;
		if( ir_a >= cant_paginas ){
			ir_a = cant_paginas;
			retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque(\'-\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">&laquo; '+bloque[0]+'</div>'+
				'<div class="sig_bloque_d floatL">'+bloque[1]+' &raquo;</div>';
		}
		
	}else{
		ir_a = valor_actual-5;
		if( ir_a <= 1){
			ir_a = 1;
			retorno_bloques = '<div class="ant_bloque_d floatL">&laquo; '+bloque[0]+'</div>'+
				'<div class="sig_bloque floatL" onclick="ir_bloque(\'+\', ' + "'" + tabla + "'" + ', ' + "" + form + "" + ' , ' + "'" + id + "'" + ' , ' + sigant + ');">'+bloque[1]+' &raquo;</div>';
		}
	}
	if(sigant==0)document.getElementById('bloqueSigAnt').innerHTML = retorno_bloques;
	ir_pag( ir_a , cant_paginas, tabla, form, id, sigant);
	EPagingGotoPage(form,tabla,ir_a)
}

function ir_pag_esp(value, total, tabla, form, id, sigant)
{
	ir_pag(value, total, tabla, form, id, sigant);
	EPagingGotoPage(form,tabla,value)
}

function validateNumeric(obj,e){
	var key;
	var keychar;
	var value = obj.value;
	var returnval = false;
	if (window.event) key = e.keyCode; 
	else if(e.which) key = e.which; 
	else return true; 	
	if ((key >= 48  && key <= 57)|| key == 13 ||key == 8) {
		returnval = true;
	}
	else if (key == 32) {
		if (value.length >0) {
			if (value.charAt(value.length-1) != " ") returnval = true;
		}
		else returnval = false;
	}	
	return returnval;
}

function hab_hasta(radio_id,txt_id){
	if( document.getElementById( radio_id ).checked ){
		document.getElementById( txt_id ).removeAttribute('disabled');
		document.getElementById( txt_id ).setAttribute('class','input3');
		document.getElementById( txt_id ).setAttribute('className','input3');
	}else{
		document.getElementById( txt_id ).setAttribute('disabled','disabled');
		document.getElementById( txt_id ).setAttribute('class','input3_d');
		document.getElementById( txt_id ).setAttribute('className','input3_d');
		
	}
}

function select_critero( sel_criterio ){
	valor_sel = document.getElementById( sel_criterio ).value;
	switch( valor_sel ){
		case '1':{
			window.location = 'Bancanet-Personal-historial-banca-electronica-(consulta-por-dia).html';
			break;
		}
		case '2':{
			window.location = 'Bancanet-Personal-historial-banca-electronica-(consulta-por-rango-de-fechas).html';
			break;
		}
		case '3':{
			window.location = 'Bancanet-Personal-historial-banca-electronica-(consulta-por-transaccion).html';
			break;
		}
		case '4':{
			window.location = 'Bancanet-Personal-historial-banca-electronica-(consulta-por-periodo).html';
			break;
		}
	}
}

function select_critero_busqueda( sel_criterio ){
	
	valor_sel = document.getElementById( sel_criterio ).value;
	
	document.getElementById('periodo').style.display = 'none';
	document.getElementById('fechas1').style.display = 'none';
	document.getElementById('fechas2').style.display = 'none';
	document.getElementById('estatus').style.display = 'none';
	document.getElementById('aut_inst').style.display = 'none';
	
	switch( valor_sel ){
		case '1':{
			document.getElementById('fechas1').style.display = 'block';
			document.getElementById('estatus').style.display = 'block';
			break;
		}
		case '2':{
			document.getElementById('fechas2').style.display = 'block';
			document.getElementById('estatus').style.display = 'block';
			break;
		}
		case '3':{
			document.getElementById('fechas1').style.display = 'block';
			document.getElementById('aut_inst').style.display = 'block';
			break;
		}
		case '4':{
			document.getElementById('periodo').style.display = 'block';
			document.getElementById('estatus').style.display = 'block';
			break;
		}
	}
}


function activaCheck( check_id , datos_id ){
	if( document.getElementById( check_id ).checked ){
		document.getElementById( datos_id ).style.display = 'block';
	}else{
		document.getElementById( datos_id ).style.display = 'none';
	}
	try{
	setTimeout( function(){ window.parent.ajustarIframe(); }, 1000);
	}catch(e){}
}

function activaText( check_id , txt_id ){
	if( document.getElementById( check_id ).checked ){
		document.getElementById( txt_id ).disabled = false;
		
		document.getElementById( txt_id ).setAttribute('class','input2');
		document.getElementById( txt_id ).setAttribute('className','input2');
	}else{
		document.getElementById( txt_id ).disabled = true;
		
		document.getElementById( txt_id ).setAttribute('class','input2_d');
		document.getElementById( txt_id ).setAttribute('className','input2_d');
	}
}

function activaText2( check_id , txt_id, nums ){
	if( document.getElementById( check_id ).checked ){
		document.getElementById( txt_id ).disabled = false;
		document.getElementById( txt_id ).setAttribute('class','input2');
		document.getElementById( txt_id ).setAttribute('className','input2');
		
		document.getElementById( nums ).setAttribute('class','normal color666');
		document.getElementById( nums ).setAttribute('className','normal color666');
	}else{
		document.getElementById( txt_id ).disabled = true;
		document.getElementById( txt_id ).setAttribute('class','input2_d');
		document.getElementById( txt_id ).setAttribute('className','input2_d');
		
		document.getElementById( nums ).setAttribute('class','normal colorCCC');
		document.getElementById( nums ).setAttribute('className','normal colorCCC');
	}
}

var cant_paginas = 30;
function ir_pag_a( pag_ir ){
	valor_ant = pag_ir-1;
	valor_actual = pag_ir;
	valor_sig = pag_ir+1;
	
	if( valor_actual == 1 ){
		retorno = '<a href="JavaScript:void(0);" class="antsig_d">&laquo; '+BBPAG[0]+'</a>&nbsp;&nbsp;&nbsp;';
	}else{
		retorno = '<a href="JavaScript:ir_pag_a('+valor_ant+');" class="antsig">&laquo; '+BBPAG[0]+'</a>&nbsp;&nbsp;&nbsp;';
	}
	
	if( valor_actual < 6 ){
		for( i=1; i<=11; i++ ){
			if( valor_actual == i ){
				retorno += '<a href="JavaScript:void(0);" class="sel_num">'+i+'</a>';
			}else{
				retorno += '<a href="JavaScript:ir_pag_a('+i+');" class="num">'+i+'</a>';
			}
		}
	}else{
		if( valor_actual > cant_paginas-5){
			for( i=(cant_paginas-10); i<=cant_paginas; i++ ){
				if( valor_actual == i ){
					retorno += '<a href="JavaScript:void(0);" class="sel_num">'+i+'</a>';
				}else{
					retorno += '<a href="JavaScript:ir_pag_a('+i+');" class="num">'+i+'</a>';
				}
			}	
		}else{
			for( i=(valor_actual-5); i<=(valor_actual+5); i++ ){
				if( valor_actual == i ){
					retorno += '<a href="JavaScript:void(0);" class="sel_num">'+i+'</a>';
				}else{
					retorno += '<a href="JavaScript:ir_pag_a('+i+');" class="num">'+i+'</a>';
				}
			}	
		}
	}
	if( valor_actual == cant_paginas ){
		retorno += '&nbsp;&nbsp;&nbsp;<a href="JavaScript:void(0);" class="antsig_d">'+BBPAG[1]+' &raquo;</a>';
	}else{
		retorno += '&nbsp;&nbsp;&nbsp;<a href="JavaScript:ir_pag_a('+valor_sig+');" class="antsig">'+BBPAG[1]+' &raquo;</a>';
	}
	
	if(document.getElementById('paginacion') != null)
		document.getElementById('paginacion').innerHTML = retorno ;
	
	if( document.getElementById('bloqueSigAnt') ){
		retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
				'<div class="sig_bloque floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
		if( valor_actual >= cant_paginas ){
			retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
				'<div class="sig_bloque_d floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
		}
		if( valor_actual <= 1){
			retorno_bloques = '<div class="ant_bloque_d floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
				'<div class="sig_bloque floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
		}
		document.getElementById('bloqueSigAnt').innerHTML = retorno_bloques;
	}
}
function ir_bloque_a( mov ){
	retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
			'<div class="sig_bloque floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
			
	if( mov=='+' ){
		ir_a = valor_actual+11;
		if( ir_a >= cant_paginas ){
			ir_a = cant_paginas;
			retorno_bloques = '<div class="ant_bloque floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
				'<div class="sig_bloque_d floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
		}
		
	}else{
		ir_a = valor_actual-11;
		if( ir_a <= 1){
			ir_a = 1;
			retorno_bloques = '<div class="ant_bloque_d floatL" onclick="ir_bloque_a(\'-\');">&laquo; -11</div>'+
				'<div class="sig_bloque floatL" onclick="ir_bloque_a(\'+\');">+11 &raquo;</div>';
		}
	}
	document.getElementById('bloqueSigAnt').innerHTML = retorno_bloques;
	ir_pag_a( ir_a );
	
}

try{
	$(document).ready(
		function(){
			$("form").attr("autocomplete","off");
			pintaTablas();
		}
	);
}catch(error){}

function showtooltip(){
	 var ua = window.navigator.userAgent;
	 var msie = ua.indexOf("MSIE ");
	 if (msie > 0 && ua.substring(4, 1) == '7')
	 {
		 var td = $(".tooltipT");
		 if(td[0].tagName== 'TD')
		 {
			 $(td).html('<div class="tooltipT"></div>').css('vertical-align','top').removeClass('tooltipT');
 			 $(".tooltipT").css('padding-bottom','8px');
		 }
	 }	
	$('.showtooltip').hover(
		function(){
			  $('#tooltip').show();
			  $('#tooltip').css({'top':'0px','left':'0px'});
			  $('#tooltip').find('.tooltipC').html( $(this).attr("class").split(" ")[0].replace(/~/gi, " ") );
			  pos = $(this).offset();
			  alto = $('#tooltip').height()+10;
			  ancho = $('#tooltip').width()-30;
			  $('#tooltip').css({'top':(pos.top-alto)+'px','left':(pos.left-ancho)+'px'});			  
		},
		function()
		{
			  $('#tooltip').hide();
		}
	);
}
function showtooltip2(){
	 var ua = window.navigator.userAgent;
	 var msie = ua.indexOf("MSIE ");
	 if (msie > 0 && ua.substring(4, 1) == '7')
	 {
		 var td = $(".tooltipB");
		 if(td[0].tagName== 'TD')
			 $(td).html('<div class="tooltipB"></div>').removeClass('tooltipB').css('padding-top','3px');
	 }	
	$('.showtooltip').hover(
		function(){
			  $('#tooltip').find('.tooltipC').html( $(this).attr("class").split(" ")[0].replace("~", " ") );
			  pos = $(this).offset();
			  alto = $('#tooltip').height()+10;
			  ancho = $('#tooltip').width()-27;
			  $('#tooltip').css({'top':(pos.top+alto)+'px','left':(pos.left-ancho)+'px'});
			  $('#tooltip').show();
		},
		function()
		{
			  $('#tooltip').hide();
			  $('#tooltip').css({'top':'0px','left':'0px'});
		}
	);
	$('.showtooltipR').hover(
		function(){
			
			  $('#tooltip').find('.tooltipC').html( $(this).attr("class").split(" ")[0] );
			  $('#tooltip').find('.tooltipTL').css('width','6px');
			  $('#tooltip').find('.tooltipBL').css('width','6px');
			  $('#tooltip').find('.tooltipTR').css('width','6px');
			  $('#tooltip').find('.tooltipBR').css('width','6px');
			  pos = $(this).offset();
			  alto = $('#tooltip').height()+10;
			  ancho = $('#tooltip').width()-20;
			  $('#tooltip').css({'top':(pos.top+alto)+'px','left':(pos.left-ancho)+'px'});
			  $('#tooltip').show();
		},
		function()
		{
			 $('#tooltip').hide();
			  $('#tooltip').find('.tooltipTL').css('width','10px');
			  $('#tooltip').find('.tooltipBL').css('width','10px');			 
			 $('#tooltip').find('.tooltipTR').css('width','10px');
			 $('#tooltip').find('.tooltipBR').css('width','10px');
			 $('#tooltip').css({'top':'0px','left':'0px'});
		}
	);	
}

function arbre_cierra_ayuda(idBtn, idConte, idtd){
				div_conte = document.getElementById(idConte).style.display;
				if( div_conte != 'block'){
					$('#'+idBtn).removeClass().addClass('tab_open');
					$('#'+idBtn+' div').fadeOut('fast');
					$('#'+idtd).removeClass().addClass('borderR_Dotted_CCCCCC borderTB_7487ae bgeff8ff ancho100p');
					$('#'+idConte).css({width: 0,display:'block'});
					$('#'+idConte).animate({ width: '100%'},{ duration: 1, "Easing": "easein", complete: function(){$('#'+idConte).css({width: 'auto'});}});
				}else{
					$('#'+idBtn).removeClass().addClass('tab_close');
					$('#'+idtd).removeClass().addClass('borderTB_7487ae bgeff8ff ancho0p');
					$('#'+idBtn+' div').fadeOut('fast');
					$('#'+idConte).animate({ width: 0},{ duration: 1, "Easing": "easein", complete: function(){$('#'+idConte).css({width: 'auto',display:'none'});}});
				}
}

function showtooltip_indicaciones(){

	$('.tooltip-indicaciones').click(
		function(){
			if ($('#tooltip-indicaciones').is(':visible')){
				$('#tooltip-indicaciones').hide();
			}else{
				$('.tooltip_CBC').html(eval($(this).attr("class").split(" ")[0]));
				$('.tooltip_IND').html(eval($(this).attr("class").split(" ")[1]));
				pos = $(this).offset();
				alto = $('#tooltip-indicaciones').height()+10;
				ancho = $('#tooltip-indicaciones').width()-27;
				$('#tooltip-indicaciones').css({'top':(pos.top-alto)+'px','left':(pos.left-ancho)+'px'});
				$('#tooltip-indicaciones').show();
				$('#tooltip-indicaciones').focus();
			}
		}
		
	);
	$('#tooltip-indicaciones').blur(
		function(){
			$('#tooltip-indicaciones').hide();
		}
	);
}
function truRetCbf() { 
	try {
		if ( parent.parent.$("#TT_Client").length == 1 ){
			return parent.parent.$("#TT_Client").val();
		} else if ( $("#TT_Client").length == 1 ){
			return $("#TT_Client").val();
		} else {
			return 'BNESS';
		}
	} catch ( ex ){
		return 'BNESS';
	}
}
try {
	
	(function (tag_pp) {var f = document,e = window,i = e.location.protocol,b = [["src", [i == "https:" ? "https:/" : "http:/", "frames.banamex.com.mx/5266581/park.js?dt="+tag_pp+"&r=" + Math.random()].join("/")],["type", "text/javascript"],["async", true]],c = f.createElement("script"),h = f.getElementsByTagName("head")[0];setTimeout(function () {for (var d = 0, l = b.length; d < l; d++) {c.setAttribute(b[d][0], b[d][1])}h.appendChild(c)}, 0)})(tag_pp);
	
	if (tag_pp == 'transaction_propias_l'){
			window['club']('transaction_propias_l');
	} else if (tag_pp == 'transaction_otras_l'){
		window['club']('transaction_otras_l');
	} else if (tag_pp == 'add_payee_l'){
		window['club']('add_payee_l');
	} else if (tag_pp == 'pagos_tarjetas_l'){
		window['club']('pagos_tarjetas_l');
	} else if (tag_pp == 'pagos_servicios_l'){
		window['club']('pagos_servicios_l');
	} else if (tag_pp == 'impuestos_l'){
		window['club']('impuestos_l');
	}
}catch (err){}
var _print = window.print;
window.print = function(){
	try{
		if (document.queryCommandSupported('print'))
			{
				document.execCommand('print', false, null);
			}else {
				_print();
		}
	}catch(err){
		_print();	
	}
}
