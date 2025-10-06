if(menus == null)var menus="";
var primera = false;
var pntabact=0;
var operfueraMenu = false;
var ventanasOpenNIE = new Array();

function detectaConexion(pos){
}

function paginaLanding(mostrar_multipagos){
	var emptyTMP="NoMostrar";
	if(parent.document.getElementById("FLG_EMPTY")){

		emptyTMP=parent.document.getElementById("FLG_EMPTY").value;
	}

	if(anularTriggerPadding == false){
		if ( anularTriggerNiv2 == false ){
			if(document.getElementById("CURRENT_MODULE").value	== "ZMTP" && emptyTMP==""){

				document.getElementById("CURRENT_MODULE_IR").value = "menu";
				$.modal(				
					{
						closeHTML: '',
						opacity:60,
						overlayClose:false,
						flagDiv:false,
						widthDivIfrm:460,
						heightDivIfrm:148,
						srcIfrm:'/bestbanking/spanishdir/modalSalida.htm'
					}


				);	
			}else{
			if(mostrar_multipagos)
				llamaMultipagos();
			else
				cargaDocD('/bestbanking/BB/modal/EsquemaMenu.htm');
			}			
		}
	} else {
		anularTriggerPadding = false;
	}
}

function procesarLigasBanamex(deseaMostrar)
{
	if(deseaMostrar)
	{
		$("#sepDigitem1").hide();
		$("#sepDigitem2").hide();
		$("#ligaSucursal").hide();
		$("#ligaBanamex").hide();
	}
	else
	{	
		$("#sepDigitem1").show();
		$("#sepDigitem2").show();
		$("#ligaSucursal").show();
		$("#ligaBanamex").show();
	}
	
}

function crearTituloSeccion()
{
		
	var cuerpoDeTitulo =
						'<div class="saldos_bloque1_tit1">'
					 +      '<div class="saldos_bloque1_tit1_btnBox activaflecha2"><div class="saldos_bloque1_tit1_btn">&nbsp;</div></div>'
					 +	    '<div class="saldos_bloque1_tit1_txt"><span id ="tituloSeccionTexto"></span></div>'
					 +  '</div>'
				     +	'<div class="saldos_bloque1_box1">'
					 +	botonesTituloSeccion
					 +	'</div>';
		
	return cuerpoDeTitulo;
}

function contenidoVistaGeneral(tipo){
	var str;
	switch ( tipo ){
		case 0:{
			str = '<div class="nuevoBNE-noticias">'+
				'<h2>&Uacute;ltimas Noticias</h2>'+ 
				'<a href="https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/saldos1.htm"  target="_blank">'+
				'<span class="sprite-ultnoticias-esp sprite-ultnoticias-esp-bancanet"> </span>'+
				'</a><br>'+
				'<a href="https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/saldos3.htm"  target="_blank">'+
				'<span class="sprite-ultnoticias-esp sprite-ultnoticias-esp-multipago"> </span>'+
				'</a><br>'+
				'<a href="https://www.citibanamex.com/sitios/aclaraciones-cargos-tarjetas/index.html"  target="_blank">'+
				'<span class="sprite-ultnoticias-esp sprite-ultnoticias-esp-spei"> </span>'+
				'</a>' + 
				'</div>';
			break;
		}
	}
	return str;
}
//
/** jquery.easing.js **/
jQuery.Easing={easein:function(x,t,b,c,d){return c*(t/=d)*t+b},easeinout:function(x,t,b,c,d){if(t<d/2)return 2*c*t*t/(d*d)+b;var a=t-d/2;return-2*c*a*a/(d*d)+2*c*a/d+c/2+b},easeout:function(x,t,b,c,d){return-c*t*t/(d*d)+2*c*t/d+b},expoin:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(Math.exp(Math.log(c)/d*t))+b},expoout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(-Math.exp(-Math.log(c)/d*(t-d))+c+1)+b},expoinout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}if(t<d/2)return a*(Math.exp(Math.log(c/2)/(d/2)*t))+b;return a*(-Math.exp(-2*Math.log(c/2)/d*(t-d))+c+1)+b},bouncein:function(x,t,b,c,d){return c-jQuery.easing['bounceout'](x,d-t,0,c,d)+b},bounceout:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},bounceinout:function(x,t,b,c,d){if(t<d/2)return jQuery.easing['bouncein'](x,t*2,0,c,d)*.5+b;return jQuery.easing['bounceout'](x,t*2-d,0,c,d)*.5+c*.5+b},elasin:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},elasout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},elasinout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},backin:function(x,t,b,c,d){var s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},backout:function(x,t,b,c,d){var s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},backinout:function(x,t,b,c,d){var s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},linear:function(x,t,b,c,d){return c*t/d+b}};

$(document).ready(function(){
	//$('#ventanaEmergente-contenido').pngFix();
	defineNuevosMenus();
	menu_header_bancanet();
	setTimeout( function(){
		showtooltip();
		showtooltipCopy();
	}, 4000);
});

(function(jQuery){
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}
			if ( fx.start )
				fx.elem.style[attr] = "rgb(" + [
					Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
					Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
					Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
				].join(",") + ")";
		}
	});
	function getRGB(color){
		var result;
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		return colors[jQuery.trim(color).toLowerCase()];
	}	
	function getColor(elem, attr) {
		var color;
		do {
			color = jQuery.curCSS(elem, attr);

			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break;

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
})(jQuery);

(function($) {
$.fn.lavaLamp = function(o) {
    o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});
    return this.each(function() {
        var me = $(this), noop = function(){},
            $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
            $li = $(">li", this), curr = $("li", this)[0] || $($li[0]);

        $li.not(".back").click(function(){
            move(this);
        });
		setCurr(curr);

        function setCurr(el){
            $back.css({ "left": el.offsetLeft+"px", "width": el.offsetWidth+"px" });
            curr = el;
        };
        function move(el){
			var btnPre;
			try { btnPre = $(el).children('a').attr("id").indexOf("btnPremiumBNE"); } catch (ex) { btnPre = -1; }
			//alert($(el).children('a').attr("id"));
			if ( btnPre < 0) {
				$back.each(function(){
					$.dequeue(this, "fx");}
				).animate({
					width: el.offsetWidth,
					left: el.offsetLeft
				}, o.speed, o.fx);
			}
        };
    });
};
})(jQuery);

var activaClass = 'segNivel1';
var tabActual = null;
var contTiempo;
var anularTriggerNiv2 = null;
var anularTriggerNiv3 = false;
var anularTriggerPadding = false;
var anularTriggerNiv4 = false;
function activarMenuS(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	
	var $ = jQuery;
    $.fn.retarder = function(delay, method){
    	var node = this;
        if (node.length){
            if (node[0]._timer_) clearTimeout(node[0]._timer_);
            node[0]._timer_ = setTimeout(function(){ method(node); }, delay);
        }
        return this;
    };
    $('#menu').addClass('js-active');
    $('ul div', '#menu').css('visibility', 'hidden');
    if(detectaDispositivoMobile()){
		var links = $('.menu>li>a, .menu>li>a span', '#menu').css({background: 'none'});
	}
	$('#menu ul.menu').lavaLamp({ speed: 400 });

	if (msie && ua.substr(4, 1) == '6'){
		$('ul a span', '#menu').click(
            function(event){
				operfueraMenu = false;
				var btnPre;
				try { btnPre = $(event.target).parent('a').attr("id").indexOf("btnPremiumBNE"); } catch (ex) { btnPre = -1; }
				if ( btnPre < 0) {
					procesarCaracteristicasNiv1(this);
					activaClass = $(this).attr('class');
					activaClass = str_replace(activaClass,'noh','');
					activaClass = str_replace(activaClass,'sih','');
					activaClass = str_replace(activaClass,' ','');
					if( $(this).hasClass("noh") ){
						$('span.sih').animate({color: 'rgb(255,255,255)'});
						$(this).animate({color: 'rgb(0,48,102)'},
							function(){
								$('span.sih').css({color: '#FFFFFF'}).removeClass('sih').addClass('noh');
								$(this).css({color: '#003066'}).removeClass('noh').addClass('sih');
							}
						);
					}else{
						$(this).animate({color: 'rgb(0,48,102)'},
							function(){
								$(this).css({color: '#003066'});
							}
						);
					}
				}
			}
    	);
    }else{
		$('ul a span', '#menu').click(
            function(event){
				operfueraMenu = false;
				procesarCaracteristicasNiv1(this);
				var btnPre;
				try { btnPre = $(event.target).parent('a').attr("id").indexOf("btnPremiumBNE"); } catch (ex) { btnPre = -1; }
				if ( btnPre < 0) {
					moverTab(this);
				}
			}
    	);
   	}
	$('#operFueraMenu').hover(
		function(){
		},
		function()
		{
			if(operfueraMenu==true){
				$('.contenedor_menuSN').hide(); 
				$('.sih').css('color','#FFFFFF');
				$('.back').hide();
			}
		}
	);
	$('ul a', '#menu').hover(
		function(){
			$('.contenedor_menuSN').show();
			$('.back').show();
			$('.sih').css('color','#003066');
			clearTimeout(contTiempo);
			mostrarMenuN2(this);
			tabActual = this;
			anularTriggerPadding = false;
			anularTriggerNiv2 = false;
		},
		function()
		{
			ocultarMenuN2(this);
			contTiempo =  setInterval(anularMostrarMenuN2,100);
			anularTriggerPadding = false;
			anularTriggerNiv2 = false;
		}
	);
	
	$('.ContieneSN').hover(
		function(){
			clearTimeout(contTiempo);
			
			if(tabActual != null)
			{
				$(tabActual).addClass('tabMarcada_a');
				mostrarMenuN2(tabActual);
					$(tabActual).find('span').addClass('tabMarcada_span');
			}
			anularTriggerPadding = true;
		},
		function(){
			if(tabActual != null)
			{
				$(tabActual).find('span').removeClass('tabMarcada_span');
				ocultarMenuN2(tabActual);
				$(tabActual).removeClass('tabMarcada_a');
				tabActual = null;
				if(tabPermanente != null)
				{
					var span = $(tabPermanente).find("span");
					anularTriggerNiv2 = true;
					anularTriggerPadding = true;
					$(span).trigger('click');
					anularTriggerPadding = true;
					tabPermanente = null;
					$('#menuSegundoNivel a:eq('+segNivPermanente +')' ).removeClass().addClass('colorFF5C00');
				}
			}
			anularTriggerNiv2 = false;
			anularTriggerPadding = false;
		}
	);
	
	$('.btnSalir').hover(
		function(){
			if(!detectaDispositivoMobile()){
				if (msie && ua.substr(4, 1) == '6'){
					$('.icoBtnIn').show();
				}else{
					$('.icoBtnIn').show();
				}
				$('#cmsn').css({background:'url(/bestbanking/BB/images/bg1.svg) right -680px no-repeat'});
				$('.btnSalir a').css({color:'#FFF'});
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				if (msie && ua.substr(4, 1) == '6'){
					$('.icoBtnIn').hide();
				}else{
					$('.icoBtnIn').hide();
				}
				$('#cmsn').css({background:'url(/bestbanking/BB/images/bg1.svg) right -717px no-repeat'});
				$('.btnSalir a').css({color:'#CC0000'});
			}
		}
	);
	$('.btnSalir').click(
		function(){
			if(detectaDispositivoMobile()){
				$('#cmsn').css({background:'url(/bestbanking/BB/images/bg1.svg) right -680px no-repeat'});
				$('.btnSalir a').css({color:'#FFF'});
				$('.icoBtnIn').fadeIn(400,
					function(){
						$('.icoBtnIn').fadeOut(400);
						$('#cmsn').css({background:'url(/bestbanking/BB/images/bg1.svg) right -717px no-repeat'});
						$('.btnSalir a').css({color:'#CC0000'});
					}
				);
			}
		}
	);

	$(window).bind('resize', function(){
		igualarDimenc2();
		if( !((document.all)? true:false) ){}
		if (msie && ua.substr(4, 1) == '6'){}
	});
	
}

function procesarCaracteristicasNiv1(contexto)
{

	tituloNivel = $(contexto).html();

	if(tituloNivel == "Digitem")
	{
	   procesarImagenesDigitem(true);	   
	   procesarBannerFondos(true);
	   procesarLigasBanamex(true);
	}
	else
	{
		procesarImagenesDigitem(false);
		procesarBannerFondos(false);
		procesarLigasBanamex(false);
		
	}
	
	if(tituloNivel == "Transferencias y Pagos")
		activarBotonDescargar = true;
	else
		activarBotonDescargar = false;	
}
function procesarImagenesDigitem(activarImagenes)
{

	if(activarImagenes)
	{
		$('.btnBlanc_ico1').css({background:'url(/bestbanking/BB/images/autoDiag.png) 9px 7px no-repeat'});
		$('.btnBlanc_ico2').css({background:'url(/bestbanking/BB/images/digiOff.png) 7px 7px no-repeat'});
		$("#btnIzqNv2").removeClass("btnBlanc_ico1").addClass("btnAutoDiag_ico1");
		$("#btnDerNv2").removeClass("btnBlanc_ico2").addClass("btnDigiOff_ico1");
		$("#btnIzqNv2Txt").css({'padding-left':'2px','padding-top':'4px'});
		$("#btnIzqNv2Txt").html("Auto-<br>diagnostico");
		$("#btnDerNv2Txt").html("Eliminar<br>firma digital");		
	}
	else
	{
		$('.btnAutoDiag_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) 2px -14px no-repeat'});
		$('.btnDigiOff_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) -54px -14px no-repeat'});
		
		$("#btnIzqNv2").removeClass("btnAutoDiag_ico1").addClass("btnBlanc_ico1");
		$("#btnDerNv2").removeClass("btnDigiOff_ico1").addClass("btnBlanc_ico2");
		$("#btnIzqNv2Txt").css({'padding-left':'0px','padding-top':'10px'});
		$("#btnIzqNv2Txt").html("Cont&aacute;ctanos");
		$("#btnDerNv2Txt").html("Asistencia<br />en l&iacute;nea");			
	}

}
function procesarBannerFondos(quitarBanner)
{

	if(quitarBanner)
	{
		$("#bannerFondosHorizonte").hide();
		$("#marcoBannerFondos").removeClass("panelIz2_conten1");
		$("#marcoBannerFondos").addClass("panelIz2_conten1Min");
	}
	else
	{
		$("#marcoBannerFondos").removeClass("panelIz2_conten1Min");
		$("#marcoBannerFondos").addClass("panelIz2_conten1");
		$("#bannerFondosHorizonte").show();
	}
	
}
function moverTab(contexto)
{
			activaClass = $(contexto).attr('class');
				activaClass = str_replace(activaClass,'noh','');
				activaClass = str_replace(activaClass,'sih','');
				activaClass = str_replace(activaClass,' ','');
				if( $(contexto).hasClass("noh") ){
					$('span.sih').animate({color: 'rgb(255,255,255)'}, 500);
					$(contexto).animate({color: 'rgb(0,48,102)'}, 500,
						function(){
							$('span.sih').css({color: '#FFFFFF'}).removeClass('sih').addClass('noh');
							$(contexto).css({color: '#003066'}).removeClass('noh').addClass('sih');
						}
					);
				}else{
					$(contexto).animate({color: 'rgb(0,48,102)'}, 500,
						function(){
							$(contexto).css({color: '#003066'});
						}
					);
				}	
}
var tabPermanente = null;
var segNivPermanente = null;
function cambiarBloques()
{
	var span = $(tabPermanente).find("span");
	$(span).trigger('click');
	//alert(segNivPermanente);
	$('#menuSegundoNivel a:eq('+segNivPermanente +')' ).removeClass().addClass('colorFF5C00');
}
function anularMostrarMenuN2()
{
	tabActual = null;
	clearTimeout(contTiempo);
}

function mostrarMenuN2(contexto)
{
	var $ = jQuery;
	if(!detectaDispositivoMobile()){
				
		if( $(contexto).find('span').hasClass("noh") ){
			$(contexto).find('span').css({color: '#003066'});
		}
		var extraeClass = $(contexto).find('span').attr('class');
		extraeClass = str_replace(extraeClass,'noh','');
		extraeClass = str_replace(extraeClass,'sih','');
		extraeClass = str_replace(extraeClass,' ','');
		
		$('#'+activaClass).hide();
		$('#'+extraeClass).show();
		$('.contenedor_menuSN').css({background:'#FFF url(/bestbanking/BB/images/bgBottom.gif) left bottom repeat-x'});
		$('.btnBlanc').hide();
		$('.separacionBlanc').hide();
		$('.separacionFin').show();
	}	
		
}
function ocultarMenuN2(contexto)
{	
	if(!detectaDispositivoMobile()){	
		if( $(contexto).find('span').hasClass("noh") ){
			$(contexto).find('span').css({color: '#FFFFFF'});
		}
		var extraeClass = $(contexto).find('span').attr('class');
		extraeClass = str_replace(extraeClass,'noh','');
		extraeClass = str_replace(extraeClass,'sih','');
		extraeClass = str_replace(extraeClass,' ','');
		$('#'+extraeClass).hide();
		$('#'+activaClass).show();
		$('.contenedor_menuSN').css({background:'#FFF url(/bestbanking/BB/images/bg1.svg) left -919px'});
		$('.btnBlanc').show();
		$('.separacionBlanc').show();
		$('.separacionFin').hide();	
	}
}

function cargaDocD(pRuta){
	try {document.getElementById("loader_act").style.display = "none";} catch ( ex ) {}
	igualarDimenc2($(".column"));
	$('.ifrContenedor').attr('src',pRuta);
	activaFlechas();
}

function cargaDoc(pRuta){
	igualarDimenc2($(".column"));
	activaFlechas();
	
}

function eventoNivel1(segNivel){
	anularTriggerNiv2 = true;
	if(segNivPermanente == null)
		segNivPermanente = 0;
	$('.oculto').hide();	
	$('#menuSegundoNivel a').removeClass().addClass('exLiga');
	$('#'+segNivel).show();
	if(anularTriggerNiv2 != true)
	{
		$('#'+segNivel+' a:eq('+segNivPermanente+')').removeClass().addClass('colorFF5C00');
		$('#'+segNivel+' a:eq(0)').trigger('click');
	}
}


function IsNumeric(expression){
	return (String(expression).search(/^\d+$/) != -1);
}

function llamaMultipagos(){
	$('.panelIzquierdo').hide();
	$('.panelDerecho').hide();
	$('#msn2PMultipagos').trigger('click');
	$('#msn2PMultipagos').removeClass('exLiga').addClass('colorFF5C00');
}

function creaPrimerNivel(){
	var strMenu = '';
	for (i=0;i<menus.length;i++){
		if(i==0){
			strMenu += '<li><a href="#" class="parent" onclick="paginaLanding();" ><span class="sih  segNivel'+(i+1)+'">'
			+ menus[i][1]
			+ '</span></a></li>\n'
		}else{
			if(menus[i][1]=="Premium")
			{
				strMenu += '<li><a href="#" id="btnPremiumBNE" ><span class="noh  segNivel'+(i+1)+'">'
				+ menus[i][1]
				+ '</span></a></li>\n'
			}
			else if(menus[i][1]=="Transferencias y Pagos")
			{
				strMenu += '<li><a href="#" onclick="paginaLanding(true);"'+'><span class="noh  segNivel'+(i+1)+'">'+ menus[i][1]+ '</span></a></li>\n'
			}
			else
			{
				strMenu += '<li><a href="#" onclick="paginaLanding();"><span class="noh  segNivel'+(i+1)+'">'
				+ menus[i][1]
				+ '</span></a></li>\n'
			}
		}
	}
	return strMenu;
}

function creaPrimerNivelPie(){
	var strMenu = '';
	for (i=0;i<menus.length;i++){
		if(menus[i][1] =="Premium"){
			strMenu += '<a id="pnp' + menus[i][1] + '" >'
			+ menus[i][1];
	    }
		else{
			strMenu += '<a id="pnp' + menus[i][1] + '" href="#" onclick="anularTriggerNiv2=false;paginaLanding();" >'
			+ menus[i][1];
		}
		if(i == (menus.length-1)){
			strMenu += '</a>\n'
		}else{
			strMenu += '</a> | \n'
		}
	}
	return strMenu;
}
function creaSegundoNivel(){
	var strMenu2 = '';
	var segundoNivel;
	for (i=0;i<menus.length;i++){
		segundoNivel = menus[i][2];
		strMenu2 += '<div id="segNivel'+ (i+1) +'" class="oculto">\n'
		for(j=0; j<segundoNivel.length; j++){
			if(menus[i][1]=="Premium")
			{
				if(j==0){
					strMenu2 += '<div><a id="msn'+ (i+1) +'PPrem'+j+'">'
					+ segundoNivel[j][1] + '</a></div>\n'
				}else{
					strMenu2 += '<div><a id="msn'+ (i+1) +'PPrem'+j+'" class="exLiga">' 
					+ segundoNivel[j][1] + '</a></div>\n'
				}			
			}
			else
			{
			if(j==0){
					strMenu2 += '<div><a id="msn'+ (i+1) +'P' + segundoNivel[j][1] + '" href="#" onclick="'
					+ segundoNivel[j][2] + '">'
					+ segundoNivel[j][1] + '</a></div>\n'
				}else{
					strMenu2 += '<div><a id="msn'+ (i+1) +'P' + segundoNivel[j][1] + '" href="#" class="exLiga" onclick="'
					+ segundoNivel[j][2] + '">' 
					+ segundoNivel[j][1] + '</a></div>\n'
				}	
			}
			
		}
		strMenu2 += '</div>\n'
	}
	return strMenu2;
}

var pos3N = new Array();
var content3N = new Array();
function creaTercerNivel(){
	var strMenu3 = '';
	var tercerNivel;
	var acumulado = 0;
	var cuartoNivel;
	var cuartoNivelCont = 0;
	for(i=0;i<menus.length;i++){
		tercerNivel = menus[i][2];
		for(j=0; j<tercerNivel.length; j++){
			if(tercerNivel[j][0] == 0){
				pos3N[acumulado] = 0;
				content3N[acumulado] = 0;
			}else{
				if(tercerNivel[j][0] == 2){
					pos3N[acumulado] = 2;
					content3N[acumulado] = 0;
				}else{
					if(tercerNivel[j][0] == 3){
						pos3N[acumulado] = 3;
						content3N[acumulado] = 3;
					}else{
					pos3N[acumulado] = 1;
					arrayTemp = tercerNivel[j][3];
					for(k=0; k<arrayTemp.length; k++){
						if(k==0){
							if(arrayTemp[k][0] == 1){
								cuartoNivelCont++
								cuartoNivel = arrayTemp[k][3];
								strMenu3 = '\n <div class="menu3N_p7"> \n <div class="menu3N_p7in pest4n" id="pest4n_'
								+ cuartoNivelCont
								+ '">'
								+ arrayTemp[k][1]
								+ '</div>\n</div>\n<div class="menu4NConte" id="pest4n_'
								+ cuartoNivelCont 
								+ 'b">\n';
								for(h=0; h<cuartoNivel.length; h++){
									if(h == cuartoNivel.length-1){
										strMenu3  += '<div class="menu3N_p5b"><a href="#" onclick=" '
										+ cuartoNivel[h][2]
										+'">'
										+ cuartoNivel[h][1]
										+ '</a></div>';
									}else{
										strMenu3  += '<div class="menu3N_p5"><a href="#" onclick=" '
										+ cuartoNivel[h][2]
										+'">'
										+ cuartoNivel[h][1]
										+ '</a></div>';
									}
								}
								strMenu3 += '</div>';
								// inicio
							}else{
								strMenu3 = '<div class="menu3N_p1"><a href="#" onclick="'
								+ arrayTemp[k][2] + '"'						
								+' class="colorFF5C00">'
								+ arrayTemp[k][1]
								+'</a></div>\n';
							}
						}else{
							if(k==(arrayTemp.length-1)){
								if(arrayTemp[k][0] == 1){
									cuartoNivelCont++
									cuartoNivel = arrayTemp[k][3];
									strMenu3 += '\n <div class="menu3N_p6"> \n <div class="menu3N_p6in pest4n" id="pest4n_'
									+ cuartoNivelCont
									+ '">'
									+ arrayTemp[k][1]
									+ '</div>\n</div>\n<div class="menu4NConte" id="pest4n_'
									+ cuartoNivelCont 
									+ 'b">\n';
									for(h=0; h<cuartoNivel.length; h++){
										if(h == cuartoNivel.length-1){
											strMenu3  += '<div class="menu3N_p5b"><a href="#" onclick=" '
											+ cuartoNivel[h][2]
											+'">'
											+ cuartoNivel[h][1]
											+ '</a></div>';
										}else{
											strMenu3  += '<div class="menu3N_p5"><a href="#" onclick=" '
											+ cuartoNivel[h][2]
											+'">'
											+ cuartoNivel[h][1]
											+ '</a></div>';
										}
									}
									strMenu3 += '</div>';
								}else{
									strMenu3 += '<div class="menu3N_p3"><a href="#" onclick="'
									+ arrayTemp[k][2] + '">'
									+ arrayTemp[k][1]
									+'</a></div>\n';
								}								
							}else{
								if(arrayTemp[k][0] == 1){
									cuartoNivelCont++
									cuartoNivel = arrayTemp[k][3];
									strMenu3 += '\n <div class="menu3N_p4">\n<div class="menu3N_p4in pest4n" id="pest4n_'
									+ cuartoNivelCont
									+ '">'
									+ arrayTemp[k][1]
									+'</div>\n</div>\n<div class="menu4NConte" id="pest4n_'
									+ cuartoNivelCont 
									+'b">\n';
									for(h=0; h<cuartoNivel.length; h++){
										if(h == cuartoNivel.length-1){
											strMenu3  += '<div class="menu3N_p5b"><a href="#" onclick=" '
											+ cuartoNivel[h][2]
											+'">'
											+ cuartoNivel[h][1]
											+ '</a></div>';
										}else{
											strMenu3  += '<div class="menu3N_p5"><a href="#" onclick=" '
											+ cuartoNivel[h][2]
											+'">'
											+ cuartoNivel[h][1]
											+ '</a></div>';
										}
									}
									strMenu3 += '</div>';
								}else{
									strMenu3 += '<div class="menu3N_p2"><a href="#" onclick="'
									+ arrayTemp[k][2] + '">'
									+ arrayTemp[k][1]
									+'</a></div>\n';
								}
							}
						}					
					}
					content3N[acumulado] = strMenu3;
					}
				}
			}
			acumulado++;
		}
	}
}
function str_replace(cadena, cambia_esto, por_esto) {
  	return cadena.split(cambia_esto).join(por_esto);
}
function activaEventosNivel1() {
	var extraeClass;
	$('ul.menu').click(
		function(event){
			operfueraMenu = false;
			if($(event.target).is('span')){
				extraeClass = $(event.target).attr('class');
				extraeClass = str_replace(extraeClass,'noh','');
				extraeClass = str_replace(extraeClass,'sih','');
				extraeClass = str_replace(extraeClass,' ','');
				eventoNivel1(extraeClass);
			}
		}
	);
}
var anula = true
function activaEventosSegNivel() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	$('#menuSegundoNivel').click(
		function(event){
			operfueraMenu = false;
			if($(event.target).is('a') && $(event.target).attr("id").indexOf("PPrem") < 0){
				var tituloNiv2 = $(event.target).html();
				procesarTituloNiv2(tituloNiv2);				
				if(tabActual != null)
				{
					
						tabPermanente = tabActual;
						segNivPermanente = $(event.target).index('#menuSegundoNivel a');
						anularTriggerPadding = true;
						$(tabActual).trigger('click');
						anularTriggerPadding = true;
						for(i=0;i<8;++i)
						{
							var tabActiva = $('ul a:eq('+i+')', '#menu').find('span');
							
							var tab1 = $(tabActiva).html();
							var tab2 = $(tabActual).find('span').html();
							
								
							if($(tabActiva).hasClass("sih"))
								if( tab1 != tab2)
								{
										$(tabActiva).css('color','#FFFFFF');
									break;
								}
						}
		
				}
				indiceLiga = $(event.target).index('#menuSegundoNivel a');
				igualarDimenc2()
						var anchoTabla = $('.paneles').width();
						var anchocelIz = $('.panelCentro2').width();
						var anchocelDe = $('.panelDerecho').width();
						var anchoifr = $('.ifrContenedor').width();
						if(pos3N[indiceLiga] == 0){
							$('.panelIzquierdo').hide()
							$('.panelDerecho').hide();
							content3N[indiceLiga]
							if(msie && ua.substr(4, 1) == '7'){
								$('#main').css({width: anchoTabla+'px'});
								setTimeout( function(){ $('#main').css({width: '100%'}); }, 50)			
							}
						}else{
							if(pos3N[indiceLiga] == 1){
								
								$('.menu3N').html(content3N[indiceLiga]);
								if($('.menu3N div:eq(0)').hasClass('menu3N_p7')){
									if ( anularTriggerNiv4 != true ){
										$('.pest4n:eq(0)').trigger('click')
									}
								}
								$('.panelIzquierdo').show();
								$('.panelDerecho').hide();
							}else{
								if(pos3N[indiceLiga] == 2){
									var contenVG = contenidoVistaGeneral(indiceLiga);
									$('.panelDerecho').html(contenVG);
									$('.panelIzquierdo').hide();
									$('.panelDerecho').show();
									activaFlechas()
								}else{
									if(pos3N[indiceLiga] == 3){
										$('.panelIzquierdo').show();
										$('.panelDerecho').hide();
										$('.menu3N').hide();
									}
								}
							}
						}
			//		}
			//	);
			}
		}
	);
}

function activaPest4N(){
	var alturas = new Array();
	var indiceBloque;
	var tamannoMenu;
	$('.pest4n').each(
		function(i){
			alturas[i] = $('#pest4n_'+(i+1)+'b').height();
		}
	)
	$('.menu3N').click(
		function(event){
			operfueraMenu = false;
			indiceBloque = $(event.target).index('.pest4n');
			idBloque = $(event.target).attr("id");
			tamannoMenu = $('.pest4n').length;
			if( $(event.target).is('.pest4n') ){
				if( (tamannoMenu-1) ==  indiceBloque && $(event.target).hasClass('menu3N_p6in') ){
					if( $(event.target).hasClass('menu3N_p6inH2') ){
						$(event.target).removeClass('menu3N_p6inH2');
						$(event.target).parent().removeClass('menu3N_p6h');
						$('#'+idBloque + 'b').hide();
					}else{
						$(event.target).addClass('menu3N_p6inH2');
						$(event.target).parent().addClass('menu3N_p6h');
						$('.menu4NConte').each(
							function(t){
								if(t == indiceBloque){
									$('#'+ idBloque + 'b').show();
									$('#'+ idBloque + 'b').find('a:eq(0)').trigger('click');	
								}else{
									$('.pest4n:eq('+t+')').removeClass('menu3N_p4inH2');
									$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p4h');
									$('.pest4n:eq('+t+')').removeClass('menu3N_p6inH2');
									$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p6h');
									$('.pest4n:eq('+t+')').removeClass('menu3N_p7inH');
									$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p7h');
									$(this).hide();
								}
							}
						);
					}						
				}else{
					if( indiceBloque == 0 && $(event.target).hasClass('menu3N_p7in') ){
						if( $(event.target).hasClass('menu3N_p7inH') ){
							$(event.target).removeClass('menu3N_p7inH');
							$(event.target).parent().removeClass('menu3N_p7h');
							$('#'+ idBloque + 'b').hide();
						}else{
							$(event.target).addClass('menu3N_p7inH');
							$(event.target).parent().addClass('menu3N_p7h');
							$('.menu4NConte').each(
								function(t){
									if(t == indiceBloque){
										$('#'+ idBloque + 'b').show();
										$('#'+ idBloque + 'b').find('a:eq(0)').trigger('click');	
									}else{
										$('.pest4n:eq('+t+')').removeClass('menu3N_p4inH2');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p4h');
										$('.pest4n:eq('+t+')').removeClass('menu3N_p6inH2');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p6h');
										$('.pest4n:eq('+t+')').removeClass('menu3N_p7inH');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p7h');
										$(this).hide();
									}
								}
							);
						}
					}else{
						if( $(event.target).hasClass('menu3N_p4inH2') ){
							$(event.target).removeClass('menu3N_p4inH2');
							$(event.target).parent().removeClass('menu3N_p4h');
							$('#'+ idBloque + 'b').hide();
						}else{
							$(event.target).addClass('menu3N_p4inH2');
							$(event.target).parent().addClass('menu3N_p4h');
							$('.menu4NConte').each(
								function(t){
									if(t == indiceBloque){
										$('#'+ idBloque + 'b').show();
										$('#'+ idBloque + 'b').find('a:eq(0)').trigger('click');	
									}else{
										$('.pest4n:eq('+t+')').removeClass('menu3N_p4inH2');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p4h');
										$('.pest4n:eq('+t+')').removeClass('menu3N_p6inH2');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p6h');
										$('.pest4n:eq('+t+')').removeClass('menu3N_p7inH');
										$('.pest4n:eq('+t+')').parent().removeClass('menu3N_p7h');
										$(this).hide();
									}
								}
							);
						}
					}
				}					
			}
		}
	)
}

function defineMenus(){
	var primerNivel = creaPrimerNivel();
	var segundoNivel = creaSegundoNivel();
	var tercerNivel = creaTercerNivel();
	var primerNivelPie = creaPrimerNivelPie();
	$('div#menu ul.menu').html(primerNivel);
	activarMenuS();
	$('#menuSegundoNivel').html(segundoNivel);
	$('#segNivel1').show().find('a:eq(0)').addClass('colorFF5C00');
	$('.contenedorPie2_ligas1').html(primerNivelPie);
	activaEventosNivel1()
	activaEventosSegNivel();
	activaPest4N();
}

function activaFlechas(){		
	$('#btnCeles1').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel2In').fadeIn('fast');			
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
				$('.ligaPanel2In').fadeOut('fast');
			}
		}
	);
	$('#btnCeles2').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel3In').fadeIn('fast');
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
				$('.ligaPanel3In').fadeOut('fast');
			}
		}
	);
	$('#btnCeles3').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel4In').fadeIn('fast');
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
				$('.ligaPanel4In').fadeOut('fast');
			}
		}
	);
	$('#btnCeles4').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel5In').fadeIn('fast');
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
				$('.ligaPanel5In').fadeOut('fast');
			}
		}
	);
	$('#btnCeles1').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel2In').fadeIn('fast',
					function(){
						$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
						$('.ligaPanel2In').fadeOut('fast');
					}
				);			
			}
		}
	);
	$('#btnCeles2').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel3In').fadeIn('fast',
					function(){
						$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
						$('.ligaPanel3In').fadeOut('fast');
					}
				);
			}
		}
	);
	$('#btnCeles3').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel4In').fadeIn('fast',
					function(){
						$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
						$('.ligaPanel4In').fadeOut('fast');	
					}
				);
			}
		}
	);
	$('#btnCeles4').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).find('.ligaPanel1 a').css({color:'#09347a'});
				$('.ligaPanel5In').fadeIn('fast',
					function(){
						$(this).find('.ligaPanel1 a').css({color:'#1e87dd'});
						$('.ligaPanel5In').fadeOut('fast')
					}
				);
			}
		}
	);
}
//
function colorLigas1(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	$('.exLiga').hover(     
		function(){
			if(!detectaDispositivoMobile()){	
				if(msie && ua.substr(4, 1) == '6'){
					$(this).animate({color: 'rgb(9,52,122)'});
				}else{
					$(this).animate({color: 'rgb(9,52,122)'}, 'fast');
				}				 
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				if(msie && ua.substr(4, 1) == '6'){
					$(this).animate({color: 'rgb(30,135,221)'});
				}else{
					$(this).animate({color: 'rgb(30,135,221)'}, 'fast');
				} 
			}
		}
	);
	$('.exLiga2').hover(     
		function(){
			if(!detectaDispositivoMobile()){
				if(msie && ua.substr(4, 1) == '6'){
					$(this).css({color: '#09347a'});
				}else{
					$(this).css({color: '#09347a'}, 'fast');
				}
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				if(msie && ua.substr(4, 1) == '6'){
					$(this).css({color: '#1e87dd'});
				}else{
					$(this).css({color: '#1e87dd'}, 'fast');
				}
			}
		}
	);
	$('.msj').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$('.contenedor_menuTN_infoDe_text2_b3 a').css({color:'#09347a'});
				$('.contenedor_menuTN_infoDe_text2_b2').css({background:'url(/bestbanking/BB/images/bg1.svg) 0px 4px no-repeat'});
				$('.contenedor_menuTN_infoDe_text2_b2 div').css({background:'url(/bestbanking/BB/images/bg1.svg) right -14px no-repeat'});
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$('.contenedor_menuTN_infoDe_text2_b3 a').css({color:'#1e87dd'});
				$('.contenedor_menuTN_infoDe_text2_b2').css({background:'url(/bestbanking/BB/images/bg1.svg) -40px 4px no-repeat'});
				$('.contenedor_menuTN_infoDe_text2_b2 div').css({background:'url(/bestbanking/BB/images/bg1.svg) right 3px no-repeat'});
			}
		}
	);
	$('.btnBlanc').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$(this).css({background:'url(/bestbanking/BB/images/bg1.svg) right -347px no-repeat'});
				if($(this).index('.btnBlanc') == 1){
					$('.btnBlanc_txt2').css({color:'#1e87dd'});
					$('.btnBlanc_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) -27px -14px no-repeat'});
				}else{
					$('.btnBlanc_txt').css({color:'#1e87dd'});
					$('.btnBlanc_ico2').css({background:'url(/bestbanking/BB/images/bg1.svg) -83px -14px no-repeat'});
				}
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).css({background:'url(/bestbanking/BB/images/bg1.svg) right -312px no-repeat'});
				if($(this).index('.btnBlanc') == 1){
					$('.btnBlanc_txt2').css({color:'#666666'});
					$('.btnBlanc_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) 2px -14px no-repeat'});
				}else{
					$('.btnBlanc_txt').css({color:'#666666'});
					$('.btnBlanc_ico2').css({background:'url(/bestbanking/BB/images/bg1.svg) -54px -14px no-repeat'});
				}
			}
		}
	);
	$('.contenedor_menuTN_vertDe a').hover(
		function(){
			if(!detectaDispositivoMobile()){
				$('.contenedor_menuTN_vertDe').css({background:'url(/bestbanking/BB/images/bg1.svg) right -382px no-repeat'});
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$('.contenedor_menuTN_vertDe').css({background:'url(/bestbanking/BB/images/bg1.svg) right -262px no-repeat'});
			}
		}
	);
	$('.contenedor_menuTN_vertDe a').click(
		function(){
			if(detectaDispositivoMobile()){
				$('.contenedor_menuTN_vertDe').css({background:'url(/bestbanking/BB/images/bg1.svg) right -382px no-repeat'});
				setTimeout(
					function(){
						$('.contenedor_menuTN_vertDe').css({background:'url(/bestbanking/BB/images/bg1.svg) right -262px no-repeat'});
					}
				,400);
			}
		}
	);
	//
	$('.exLiga').click(     
		function(){
			if(detectaDispositivoMobile()){	
				$(this).animate({color: 'rgb(9,52,122)'}, 'fast',
					function(){
						$(this).animate({color: 'rgb(30,135,221)'}, 'fast');	
					}
				);				 
			}
		}
	);
	$('.exLiga2').click(     
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({color: '#09347a'}, 'fast',
					function(){
						$(this).css({color: '#1e87dd'}, 'fast');	
					}
				);				
			}
		}
	);
	$('.btnBlanc').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({background:'url(/bestbanking/BB/images/bg1.svg) right -347px no-repeat'});
				if($(this).index('.btnBlanc') == 1){
					$('.btnBlanc_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) -27px -14px no-repeat'});
					$('.btnBlanc_txt2').animate({color:'rgb(30,135,221)'}, 'fast');
					setTimeout(
						function(){
							$('.btnBlanc').css({background:'url(/bestbanking/BB/images/bg1.svg) right -312px no-repeat'});
							$('.btnBlanc_txt2').css({color:'#666666'});
							$('.btnBlanc_ico1').css({background:'url(/bestbanking/BB/images/bg1.svg) 2px -14px no-repeat'});
						}
					,400);
				}else{
					$('.btnBlanc_ico2').css({background:'url(/bestbanking/BB/images/bg1.svg) -83px -14px no-repeat'});
					$('.btnBlanc_txt').animate({color:'rgb(30,135,221)'},'fast');
					setTimeout(
						function(){
							$('.btnBlanc_txt').css({color:'#666666'});
							$('.btnBlanc_ico2').css({background:'url(/bestbanking/BB/images/bg1.svg) -54px -14px no-repeat'});
							$('.btnBlanc').css({background:'url(/bestbanking/BB/images/bg1.svg) right -312px no-repeat'});
						}
					,400);
				}
			}
		}
	);
	$('.msj').click(
		function(){
			if(detectaDispositivoMobile()){
				$('.contenedor_menuTN_infoDe_text2_b3 a').css({color:'#09347a'});
				$('.contenedor_menuTN_infoDe_text2_b2').css({background:'url(/bestbanking/BB/images/bg1.svg) 0px 4px no-repeat'});
				$('.contenedor_menuTN_infoDe_text2_b2 div').css({background:'url(/bestbanking/BB/images/bg1.svg) right -14px no-repeat'});
				setTimeout(
					function(){
						$('.contenedor_menuTN_infoDe_text2_b3 a').css({color:'#1e87dd'});
						$('.contenedor_menuTN_infoDe_text2_b2').css({background:'url(/bestbanking/BB/images/bg1.svg) -40px 4px no-repeat'});
						$('.contenedor_menuTN_infoDe_text2_b2 div').css({background:'url(/bestbanking/BB/images/bg1.svg) right 3px no-repeat'});
					}
				,350);
			}
		}
	);
}
function colorLigas2(){
	$('.exLiga3').hover(     
		function(){
			if(!detectaDispositivoMobile()){
				$(this).css({color: 'var(--granate-300)'});
			}
		},
		function(){
			if(!detectaDispositivoMobile()){
				$(this).css({color: 'var(--granate-300)'});
			}
		}
	);
	$('.exLiga3').click(     
		function(){
			if(detectaDispositivoMobile()){
				$(this).animate({color: 'var(--granate-300)'},'fast',
					function(){
						$(this).css({color: 'var(--granate-300)'});
					}
				);				
			}
		}
	);
}

function igualarDimenc2() {
	var valor1 = $('.contenedorPrincipal').height();
	var margenN = '-'+valor1+'px';
	$('.cortiContPrincipal').css({height:valor1, 'margin-top': margenN});
}

var dispositivoIphone = "iphone";
var dispositivoIpod = "ipod";
var dispositivoS60 = "series60";
var dispositivoSymbian = "symbian";
var dispositivoAndroid = "android";
var dispositivoWinMob = "windows ce";
var dispositivoBB = "blackberry";
var dispositivoPalm = "palm";
var dispositivoIpad = "ipad";
var engineWebKit = "webkit";
var uagent = navigator.userAgent.toLowerCase();

function DetectaPalmOS(){
   if (uagent.search(dispositivoPalm) > -1)
      return true;
   else
      return false;
}

function DetectaBlackBerry(){
   if (uagent.search(dispositivoBB) > -1)
      return true;
   else
      return false;
}

function DetectaWindowsMobile(){
   if (uagent.search(dispositivoWinMob) > -1)
      return true;
   else
      return false;
}

function DetectaAndroid(){
   if (uagent.search(dispositivoAndroid) > -1)
      return true;
   else
      return false;
}

function DetectaWebkit(){
   if (uagent.search(engineWebKit) > -1)
      return true;
   else
      return false;
}

function DetectaAndroidWebKit(){
   	if (DetectaAndroid()){
     	if (DetectaWebkit()){
        	return true;
		}else{
        	return false;
		}
   	}else{
  		return false;
   	}
}

function DetectaS60Oss(){
   	if (uagent.search(engineWebKit) > -1){
     	if ((uagent.search(dispositivoS60) > -1 || uagent.search(dispositivoSymbian) > -1))
        	return true;
     	else
        	return false;
   	}else
      return false;
}

function DetectaIphone(){
   if (uagent.search(dispositivoIphone) > -1)
      return true;
   else
      return false;
}

function DetectaIpod(){
   if (uagent.search(dispositivoIpod) > -1)
      return true;
   else
      return false;
}

function DetectaIpad(){
   if (uagent.search(dispositivoIpad) > -1  && DetectaWebkit())
      return true;
   else
      return false;
}

function detectaDispositivoMobile(){
    if (DetectaIphone()){
		return true;
	}else{
		if(DetectaIpod()){
       		return true;
		}else{
			if(DetectaS60Oss()){
				return true;
			}else{
				if(DetectaAndroidWebKit()){
					return true;
				}else{
					if(DetectaWindowsMobile()){
						return true;
					}else{
						if(DetectaBlackBerry()){
							return true;
						}else{
							if(DetectaPalmOS()){
								return true;
							}else{
								if(DetectaIpad()){
									return true;
								}else{
									return false;
								}
							}
						}
					}
				}
			}
		}
	}
}

$(document).ready(
	function(){
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		showtooltipCopy();
		defineMenus();
		var anchoTabla = $('.paneles').width();
		var anchocelIz = $('.panelCentro2').width();	
		$('.panelDerecho').html(contenidoVistaGeneral(0));
		$('.panelIzquierdo').hide();
		$('.panelDerecho').show();
		activaFlechas();
		colorLigas1();				
		$('body').click(
			function(event){				
				if($(event.target).is('#menuSegundoNivel a')){					
					var idSelect = $(event.target).parent().parent().attr("id");
					var ligaSelect = $(event.target).index('#'+idSelect+' a');
					if( $($(event.target)).hasClass("exLiga") ){
						$($(event.target)).parent().parent().find('a').each(
							function(k){
								if(k == ligaSelect){
									$(this).removeClass().animate({color: 'rgb(255,92,0)'}, 500,
										function(){
											$(this).css({color: 'var(--color-white)'}).addClass('colorFF5C00');
										}
									);	
								}else{
									$(this).removeClass().animate({color: 'rgb(30,135,221)'}, 500,
										function(){
											$(this).css({color: 'var(--color-white)'}).addClass('exLiga');
										}
									);								
								}
							}
						)
					}				
				}
				if($(event.target).is('.menu3N a')){					
					var ligaSelect = $(event.target).index('.menu3N a');
					$('.menu3N a').each(
						function(f){
							if(f == ligaSelect){
								$('.menu3N a:eq('+f+')').removeClass().css({color: 'var(--color-white)'}).addClass('colorFF5C00');
							}else{
								$('.menu3N a:eq('+f+')').removeClass().css({color: 'var(--granate-300)'}).addClass('exLiga3');							
							}
						}
					);
					colorLigas2();
				}
				if($(event.target).is('.contenedorPie2_ligas1 a')){
					var ligaPieSelect = $(event.target).index('.contenedorPie2_ligas1 a');
					$('ul li:eq('+ligaPieSelect+')', '#menu').trigger('click');
					$('ul a span:eq('+ligaPieSelect+')', '#menu').trigger('click');
				}
			}
		);
		
		try
		{
		$('#main').on('load',
			function(){Resize();setTimeout(function(){ajustarIframe();},4000);});
		}
		catch(e){}
			
		if(msie && ua.substr(4, 1) == '6'){
			$('.icoBtn').css({'background':'url(/bestbanking/BB/images/bg2.svg) right -421px no-repeat'});
			$('.icoBtnIn').css({'background':'url(/bestbanking/BB/images/bg2.svg) left -421px no-repeat'});
		}
		$("form").attr("autocomplete","off");
	}
);
var time;

function Resize(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	try
	{
		if(!document.getElementById('main').contentWindow.document.getElementById('wrapper_div')){return;}
		alturaContIfr=document.getElementById('main').contentWindow.document.getElementById('wrapper_div').offsetHeight; 
	}
	catch(e){return;}
	$("#SubirTranWrapperDiv").hide();
		if(alturaContIfr>1000)
		$("#SubirTranWrapperDiv").show();
	var anchoTemp = $('.contenedor_menuTN').outerWidth() - ($('.panelIzquierdo').is(':visible')? $('.panelIzquierdo').outerWidth() : 0) - ($('.panelDerecho').is(':visible')? $('.panelDerecho').outerWidth() : 0);// Cambio para que se ajuste el Iframe main, independientemente del div '.iframeCli' que lo encierra
	//var anchoTemp = $('.iframeCli').width()-320;
	alturaAltualIfr = $('#main').height();
	if(alturaContIfr<410)
		alturaContIfr=410;

	if(alturaContIfr > alturaAltualIfr)
	{
		time = (alturaContIfr - alturaAltualIfr) * 2.5;
	}
	else
	{
		time = (alturaAltualIfr - alturaContIfr) * 3.5;	
	}
	time = time > 4000 ? 4000 : time;
	if ( msie && ua.substr(4, 1) == '7'){
		$('#main').css({height: alturaContIfr+'px'});
		$('#main').css({width: anchoTemp  +'px'});
		if(primera)ajustar();
		primera=true;
	}else{
		if(alturaContIfr > 410){
			$('#main').stop().animate({ 
				height: alturaContIfr+'px' 
			},{ 
				duration: time, 
				"Easing": "easein", 
				complete: function(){
					$(this).css({height:alturaContIfr+'px'});
				}
			});
		}else{
			$('#main').css({height:'410px'});
		}
	}				   
}

function pintaTablas(){
	$(".pinta1 tr:even td").css("background-color", "#F0FDFF");
	$(".pinta1 tr:odd td").css("background-color", "#FFF");
	$(".pinta2 tr:even td").css("background-color", "#FFF");
	$(".pinta2 tr:odd td").css("background-color", "#F0FDFF");
}

function ajustar(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	try
	{
		if( !document.getElementById('main').contentWindow.document.getElementById('wrapper_div') )
			return;
		var alturaContIfr=document.getElementById('main').contentWindow.document.getElementById('wrapper_div').offsetHeight;
	}
	catch(e){return;}
	var anchoTemp = $('.iframeCli').width();	
	alturaAltualIfr = $(this).height();
	if(alturaContIfr<410)
		alturaContIfr=410;
	if(alturaContIfr > alturaAltualIfr){
		time = (alturaContIfr - alturaAltualIfr) * 2.5;
	}else{
		time = (alturaAltualIfr - alturaContIfr) * 3.5;	
	}	
	if (msie && msie && ua.substr(4, 1) == '7'){
		$('#main').css({height: alturaContIfr+'px'});
		$('#main').css({width: anchoTemp  +'px'});
	}	
	$('panelCentro2').show();
}

(function($){
	
	$.modal = function(options){
		try{
			top.document.getElementById("main").contentWindow.$("applet").hide();
			top.document.getElementById("main").contentWindow.$("#VALIDA").hide();
		}catch(e){}
		return $.modal.impl.init(options);
	};
	$.modal.close = function(){try{
			top.document.getElementById("main").contentWindow.$("applet").show();
			top.document.getElementById("main").contentWindow.$("#VALIDA").show();
		}catch(e){}$.modal.impl.close();};
	$.modal.setContainerDimensions = function(resize){$.modal.impl.setContainerDimensions(resize);};
	$.modal.setDimentions = function(height, width){$.modal.impl.setDimentions(height, width);};	
	$.modal.esconder = function(Contenido,height, width){$.modal.impl.esconder(Contenido,height,width);};	
	$.modal.mostrar = function(){$.modal.impl.mostrar();};	
	$.modal.defaults = {
		focus:true,
		opacity:50,
		minHeight:30,
		minWidth:40,
		maxHeight:null,
		maxWidth:null,
		autoResize:true,
		autoPosition:true,
		zIndex:1000,
		close:true,
		closeClass:'CerrarVentanaEmergente',
		escClose:false,
		overlayClose:true,
		position:null,
		onOpen:null,
		onShow:null,
		flagDivIfrm:true,
		heightDivIfrm:'auto',
		widthDivIfrm:480,
		srcIfrm:'/bestbanking/spanishdir/if.htm'
	};
	$.modal.impl={
		o:null,
		d:{},
		dim:null,
		timeoutDiv:"",
		init:function(options){
			var s = this;
			s.o = $.extend({},$.modal.defaults,options);
			if(!s.o.flagDiv)
				document.getElementById('mensajeError_contenido_ifrm').setAttribute('src',s.o.srcIfrm);
			s.zIndex = s.o.zIndex;
			s.occb=false;
			s.crear();
			//data=null;
			s.open();
			if($.isFunction(s.o.onShow)){
				s.o.onShow.apply(s,[s.d]);
			}
			try{
				document.getElementById("loader_act").style.display="none"
			} catch ( ex ) {}
			return s;
		},
		crear:function(){
			var s = this;
			w = s.getDimensions();
			$('.cerrarOverlay')
			.css(
				{
					display:'none',
					opacity:s.o.opacity/100,
					height:w[0],
					width:w[1],
					position: 'fixed',
					left:0,
					top:0,
					zIndex:s.o.zIndex+1
				}
			)
			s.d.overlay=$('.cerrarOverlay')
			$('.ventanaEmergente')
			.css(
					{
						display:'none',
						position: 'fixed',
						zIndex:s.o.zIndex+2,
						top:'-2500px'		
					}
			)
			s.d.container=$('.ventanaEmergente')
			s.d.data = $('.ventanaEmergente-data')			
		},
		bindEvents:function(){
			var s = this;
			$('.'+s.o.closeClass).bind('click.ventanaEmergente',function(e){e.preventDefault(); s.close();});
			if(s.o.close&&s.o.overlayClose){
				s.d.overlay.bind('click.ventanaEmergente',
					function(e){
						e.preventDefault();
						s.close();
					}
				);
			}
			$(document).bind('keydown.ventanaEmergente',
				function(e){
					if(s.o.focus&&e.keyCode==9){
						s.watchTab(e);
					}else if((s.o.close&&s.o.escClose)&&e.keyCode==27){
						e.preventDefault();
						s.close();
					}
				}
			);
			$(window).bind('resize.ventanaEmergente',
				function(){
						w=s.getDimensions();
						s.setContainerDimensions(true);
						s.d.iframe&&s.d.iframe.css({height:w[0],width:w[1]});
						s.d.overlay.css({height:w[0],width:w[1]});
				}
			);
		},
		unbindEvents:function(){
			$('.'+this.o.closeClass).unbind('click.ventanaEmergente');
			$(document).unbind('keydown.ventanaEmergente');
			$(window).unbind('resize.ventanaEmergente');
			this.d.overlay.unbind('click.ventanaEmergente');
		},
		focus:function(pos){
			var s=this,p=pos||'first';
			var input=$(':input:enabled:visible:'+p);
			input.length>0?input.focus():s.d.container.focus();
		},
		getDimensions:function(){
			var ua = window.navigator.userAgent;
			var opera = ua.indexOf("OPR");
			if(opera == "1"){
				opera = true;
			}
			var posicion = 0;
			for(var cont = 0;cont < ua.length; cont++){
				if(ua.charAt(cont) == "O"){
					if(ua.charAt(cont+1) == "P"){
						if(ua.charAt(cont+2) == "R"){
							posicion = cont+4;
						}
					}
				}
			}
			var versionO = ua.substring(posicion, posicion+4);
			var el=$(window);
			var h= opera&&versionO>'9.5'&&$.fn.jquery<='1.2.6'?document.documentElement['clientHeight']:opera&&versionO<'9.5'&&$.fn.jquery>'1.2.6'?window.innerHeight:el.height();
			return[h,el.width()];
		},
		getVal:function(v){
			return v == 'auto'?0:v.indexOf('%')>0?v:parseInt(v.replace(/px/,''));
		},
		setContainerDimensions:function(resize){
			var s=this;
			if(!resize||(resize&&s.o.autoResize)){
				var ch=s.getVal(s.d.container.css('height')),cw=s.getVal(s.d.container.css('width')),dh=s.d.data.outerHeight(true),dw=s.d.data.outerWidth(true);
				var mh=s.o.maxHeight&&s.o.maxHeight<w[0]?s.o.maxHeight:w[0],mw=s.o.maxWidth&&s.o.maxWidth<w[1]?s.o.maxWidth:w[1];				
				if(!ch){
					if(!dh){
						ch=s.o.minHeight;
					}else{
						if(dh>mh){
							ch=mh;
						}else if(dh<s.o.minHeight){
							ch=s.o.minHeight;
						}else{
							ch=dh;
						}
					}
				}else{
					ch = ch>mh?mh:ch;
				}
				if(!cw){
					if(!dw){
						cw=s.o.minWidth;
					}else{
						if(dw>mw){
							cw=mw;
						}else if(dw<s.o.minWidth){
							cw=s.o.minWidth;
						}else{
							cw=dw;
						}
					}
				}else{
					cw=cw>mw?mw:cw;
				}
			}
			if(s.o.autoPosition){
				s.setPosition();
			}
		},
		setDimentions:function(height, width){
			$('#tabla_emergente, .ventanaEmergente-data').css(
				{
					width : width + 40,
					height : height == 'auto' ? 'auto' : + height + 40
				}				
			);
			if($("#mensajeError_contenido_ifrm").is(":visible"))
				$("#mensajeError_contenido_ifrm").css({height: height + 15,width:width});
			else if ($("#mensajeError_contenido_session").is(":visible"))
				$("#mensajeError_contenido_session").css({height: height,width:width});
			else
				$("#mensajeError_contenido_div").css({height: height + 15,width:width});
			$("#ventanaEmergente").css({height: height+40});
			$.modal.impl.setContainerDimensions(true);
		},
		setPosition:function(){
			var s = this;

			if(w[0]>s.d.container.outerHeight(true) || document.getElementById('main')==undefined)
			{
				$('html').css('overflow-y','hidden')
				s.d.container.css('position','fixed')
				hc=(w[0]/2)-(s.d.container.outerHeight(true)/2)
			}	
			else
			{				
				$('html').css('overflow-y','scroll')
				s.d.container.css('position','absolute')
				try
				{
					if($('#wrapper_div').outerHeight(true) > s.d.container.outerHeight(true))
					{
						hc=($('#wrapper_div').outerHeight(true)/2)-(s.d.container.outerHeight(true)/2)				
					}	
					else
					{
						$('#ventanaEmergente').css('height', $('#ventanaEmergente-contenido').outerHeight()+60)
						hc=60;
					}
				}
				catch(e){return;}
			}
			s.d.container.stop().animate({top:hc}
				, 350,
				function(){
					s.d.container.css({top:hc})
				}
			);		
		},
		watchTab:function(e){
			var s=this;
			if($(e.target).parents('.ventanaEmergente').length>0){
				s.inputs = $(':input:enabled:visible:first, :input:enabled:visible:last',s.d.data[0]);
				if((!e.shiftKey&&e.target==s.inputs[s.inputs.length-1])||(e.shiftKey&&e.target==s.inputs[0])||s.inputs.length==0){
					e.preventDefault();
					var pos=e.shiftKey?'last':'first';
					setTimeout(function(){s.focus(pos);},10);
				}
			}else{
				e.preventDefault();
				setTimeout(function(){s.focus();},10);
			}
		},
		open: function () {
			var s = this;
			s.d.overlay.show();
			s.d.container.show();
			if(detectaDispositivoMobile()){
				$('html').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});
				$('body').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});
			}			
			s.bindEvents();
			
			$('#tabla_emergente, .ventanaEmergente-data').css(
				{
					width : s.o.widthDivIfrm + 40,
					height : s.o.heightDivIfrm == 'auto' ? 'auto' : + s.o.heightDivIfrm + 35
				}				
			);
			
			if(s.o.flagDiv)
			{
				s.focus();
				showInput = "div"
				hiddeInput = "ifrm"
			}
			else
			{
				showInput = "ifrm"
				hiddeInput = "div"			
			}			
			
			$('#mensajeError_contenido_' + showInput).css(
				{
					width : s.o.widthDivIfrm,
					height : s.o.heightDivIfrm,
					display : 'block'
				}				
			);
			
			$('#mensajeError_contenido_' + hiddeInput).css(
				{
					display : 'none'
				}				
			);
			if(!s.o.flagDiv)
				setTimeout(
					function(){
						$.modal.impl.setPosition();
					}
					,550
				);
			else
				$.modal.impl.timeoutDiv = setTimeout(
					function(){
						$.modal.impl.setDimentions(document.getElementById("mensajeError_contenido_div").offsetHeight,document.getElementById("mensajeError_contenido_div").offsetWidth);
					}
					,550
				);
		},
		close: function () {
			var s = this;
			if(document.getElementById('main')!=undefined)
				ajustarIframe();
			try{
				s.unbindEvents();
			} catch(ex) {return;}
			$('html').css('overflow-y','scroll')
			s.d.container.animate(
				{top:"-" + (s.d.container.height() + 100)},
				300,
				function () {
					s.d.overlay.fadeOut(350);					
					setTimeout( 
						function(){
							//s.close();							
							if(detectaDispositivoMobile()){
								$('html').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});
								$('body').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});				
							}
						}
					,400);				 
				}
			);
		},
		esconder: function(Contenido,height,width){
			var s = this;
			$("#mensajeError_contenido_ifrm").css("display","none");
			$.modal.impl.setDimentions(height,width);
			$("#mensajeError_contenido_div").html(Contenido).css("display","block");
			$('.ventanaEmergente').fadeIn("fast");
		},
		mostrar: function(){
			clearTimeout($.modal.impl.timeoutDiv);
			$("#mensajeError_contenido_div").css("display","none");
			$('.ventanaEmergente').fadeIn("fast");
			$("#mensajeError_contenido_ifrm").css("display","block");
		}
	};
})(jQuery);
/* jQuery(function ($) {
	$("a.mensajeError,").click(function (e) {
		e.preventDefault();
		$("#ventanaEmergente-contenido").modal({
			closeHTML: '',
			opacity:60,
			overlayClose:false,
			onOpen:mensajeError.open,
			onClose:mensajeError.close
		});
	});
	var mensajeError = {
		container: null,
		open: function (d) {
			var self = this;
			self.container = d.container[0];
			d.overlay.show();
			d.container.show();
			if(detectaDispositivoMobile()){
				$('html').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});
				$('body').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});
			}
			d.container.css({'top':'-400px'});
			setTimeout( 
				function(){
					$('#mensajeError_contenido').show();
					$("#ventanaEmergente-contenido", self.container).show();
					$('#ventanaEmergente-contenido').css(
						{
							height:$('#mensajeError_contenido').height()+40+'px',
							width: $('#mensajeError_contenido').width() + 40 +'px'
						}
					);
					$.modal.impl.setPosition();
				}
				, 550 
			);
		},
		close: function (d) {
			var self = this;
			d.container.animate(
				{top:"-" + (d.container.height() + 100)},
				300,
				function () {
					d.overlay.fadeOut(350);
					setTimeout( 
						function(){
							self.close();
							if(detectaDispositivoMobile()){
								$('html').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});
								$('body').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});				
							}
						}
					,400);
				}
			);
		}
	};
	if(detectaDispositivoMobile()){
		$('.contenedor').bind('resize',
		function(){
			var anchoXc = $('body').width();
			var altoXc = $('.contenedor').height();
			$('#cortinaOverlay').css({
				width:anchoXc,
				height:altoXc
			});
		});
	}
	
}); */

function conteIfrConteVg(){
	var anchoTabla = $('.paneles').width();
	var anchoTDde = $('.panelDerecho').width();
	var anchoTDce = $('.panelCentro2').width();
	var anchoTDiz = $('.panelIzquierdo').width();
	var tempCamb=$('.nuevoBNE-footer').width()-25;
	$('.panelIzquierdo').hide();
		$('.ifrContenedor').css({'width':(anchoTabla-anchoTDde-10)+'px'});
		$('.panelCentro2').css({'width':(tempCamb)+'px'});
	$('.panelDerecho').show();	
}
function soloConteIfr(){
	$('.panelIzquierdo').hide();
	$('.panelDerecho').hide();
}
function eventoNivel1ifr(){
	$('ul li:eq(4)', '#menu').trigger('click');
	$('ul a span:eq(4)', '#menu').trigger('click');
}

function creaContenedor(){
    var str;
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome/') > -1;
    str = '<iframe class="ifrContenedor" id="main" name="main" frameborder="0" scrolling="';
    (is_chrome)? str+='yes' : str+='no';
    str += '" src=""></iframe>';
    $('.iframeCli').html(str);
}

function procesarTituloNiv2(tituloNiv2)
{

	if(tituloNiv2 != null && tituloNiv2 != "")
	{
		$("#tituloSeccion").html();
		$("#tituloSeccion").show();
		var cuerpoTitulo = crearTituloSeccion();
		$("#tituloSeccion").html(cuerpoTitulo); 
		$("#tituloSeccionTexto").html(tituloNiv2);
		showtooltip2();
		slide(".activaflecha2",5,0);
		activaHoverIcos("/bestbanking/BB/images");
	}
	else
	{
		$("#tituloSeccion").html();
		$("#tituloSeccion").hide();
	}	
}

function activaHoverIcos(rutaImg)
{

	if(rutaImg== null)
		rutaImg = "/bestbanking/BB/images";
	rutaFondo2 = rutaImg + "/bg2.svg" ;
	
	if(!detectaDispositivoMobile()){
		$('.saldos_btn1').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') right -102px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') left -102px no-repeat'});			
			}		
		);
		$('.saldos_btn2').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') right -128px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') left -128px no-repeat'});			
			}		
		);
		$('.saldos_btn2b').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') right -128px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') left -128px no-repeat'});			
			}		
		);
		$('.saldos_btn3').hover(
			function(){
				$(this).css({'background':'#fff url(' + rutaFondo2 + ') right -53px no-repeat'});
			},
			function(){
				$(this).css({'background':'#fff url(' + rutaFondo2 + ') left -53px no-repeat'});			
			}		
		);
		$('.saldos_btn4').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') right -77px no-repeat'});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(' + rutaFondo2 + ') left -77px no-repeat'});			
			}		
		);
		$('.saldos_btn7').hover(
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/download.svg) '});
			},
			function(){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/download.svg)'});			
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
				posMad.find('td:eq(0)').find('div').css({'background':'url(' + rutaFondo2 + ') left -249px'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(' + rutaFondo2 + ') right -249px'});
				posMad.find('td:eq(1)').css({'background':'url(' + rutaFondo2 + ') left -194px'});
			},
			function(){
				var posMad = $(this).parent().parent().parent();
				posMad.find('td:eq(0)').find('div').css({'background':'url(' + rutaFondo2 + ') left -224px'});
				posMad.find('td:eq(2)').find('div').css({'background':'url(' + rutaFondo2 + ') right -224px'});
				posMad.find('td:eq(1)').css({'background':'url(' + rutaFondo2 + ') left -169px'});
			}
		);
	}	
	// 
	$('.saldos_btn1').click(
		function(){
			if(detectaDispositivoMobile()){;
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -102px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -102px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.saldos_btn2').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.saldos_btn2b').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -128px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -128px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.saldos_btn3').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) right -53px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#fff url(/bestbanking/BB/images/bg2.svg) left -53px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.saldos_btn4').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) right -77px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/bg2.svg) left -77px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.saldos_btn7').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/download.svg)'});
				setTimeout(
					function(){
						$(this).css({'background':'#FFFFFF url(/bestbanking/BB/images/download.svg)'});
					}
				,350);
			}
		}
	);	
	$('.inputBtn1').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -827px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -827px no-repeat'});
					}
				,350);
			}
		}
	);
	$('.inputBtn2').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) right -852px no-repeat'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/bg1.svg) left -852px no-repeat'})
					}
				,350);
			}
		}
	);
	$('.btnExportar1').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'url(/bestbanking/BB/images/hoja_flechas.gif)'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/icoExp2h.gif)'})
					}
				,350);
			}
		}
	);
	$('.btnExportar2').click(
		function(){
			if(detectaDispositivoMobile()){
				$(this).css({'background':'url(/bestbanking/BB/images/icoExp1.gif)'});
				setTimeout(
					function(){
						$(this).css({'background':'url(/bestbanking/BB/images/icoExp1h.gif)'})
					}
				,350);
			}
		}
	);
	$('.saldos_bordeInfCe5 a').click(
		function(){
			if(detectaDispositivoMobile()){
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
		}
	);
}

function slide(navegacion_id, pad_out, pad_in){
	var listaElementos = $(navegacion_id + ' div');
	var claseTexto = $(navegacion_id).parent().find('div:eq(2)').attr('class');
	$(listaElementos).each(
		function(i){
			if(!detectaDispositivoMobile()){
				$(this).hover(
					function(){
						$(this).animate({ paddingLeft: pad_out, opacity: 0.7 },{ duration: 150, "Easing": "easein", complete: function(){}});
					},		
					function(){
						$(this).animate({ paddingLeft: pad_in, opacity: 1 },{ duration: 150, "Easing": "elasinout", complete: function(){}});
					}
				);
			}
		}
	);	
	$('.'+claseTexto+' span').each(
		function(i){
			if(!detectaDispositivoMobile()){
				$(this).hover(
					function(){
						$(this).parent().parent().find('div:eq(0)').find('div').animate({ paddingLeft: pad_out, opacity: 0.7 },{ duration: 150, "Easing": "easein", complete: function(){}});
						
					},		
					function(){
						$(this).parent().parent().find('div:eq(0)').find('div').animate({ paddingLeft: pad_in, opacity: 1 },{ duration: 150, "Easing": "elasinout", complete: function(){}});
					}
				);
			}
		}
	);
}

function ajustarIframe(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	try
	{
		if( !document.getElementById('main').contentWindow.document.getElementById('wrapper_div') )
			return;
		
		var alturaContenidoIfr = document.getElementById('main').contentWindow.document.getElementById('wrapper_div').offsetHeight;
	}
	catch(e){return;}
	$("#SubirTranWrapperDiv").hide();
	if(alturaContenidoIfr>1000)
	$("#SubirTranWrapperDiv").show();
	//var anchoTempAux = $('.iframeCli').width();
	var anchoTemp = $('.contenedor_menuTN').outerWidth() - ($('.panelIzquierdo').is(':visible')? $('.panelIzquierdo').outerWidth() : 0) - ($('.panelDerecho').is(':visible')? $('.panelDerecho').outerWidth() : 0);// Cambio para que se ajuste el Iframe main, independientemente del div '.iframeCli' que lo encierra
	alturaAltualIfr = $(this).height();
	if(alturaContenidoIfr > alturaAltualIfr){
		time = (alturaContenidoIfr - alturaAltualIfr) * 1.48;
	}else{
		time = (alturaAltualIfr - alturaContenidoIfr) * 1.48;	
	}
	time = time > 4000 ? 4000 : time;
	if (msie && ua.substr(4, 1) == '6' || msie && ua.substr(4, 1) == '7'){
		if(alturaContenidoIfr > 410){
			$('#main').stop().animate({ 
				height:alturaContenidoIfr+'px', 
				width:anchoTemp+'px'
			},{ 
				duration: time, 
				"Easing": "easein", 
				complete: function(){
					$(this).css({height:alturaContenidoIfr+'px', width:anchoTemp});
				}
			});
		}else{
			$('#main').css({height:'410px', width:anchoTemp+'px'});
		}
	}else{
		if(alturaContenidoIfr > 410){
			$('#main').stop().animate({ 
				height: alturaContenidoIfr+'px' 
			},{ 
				duration: 400, 
				"Easing": "easein", 
				complete: function(){
					$(this).css({height:alturaContenidoIfr+'px'});
				}
			});
		}else{
			$('#main').css({height:'410px'});
		}
	}	
}

function goUp(){
    $('html,body').animate({scrollTop: 0}, 500);
}

var activarBotonDescargar = false;
var anula = true;
var tabPermanente = null;
var segNivPermanente = null;
var botonesTituloSeccion = '';
function mostrarBotonesTitulo(tipoBotones) 
{
	var btnAyuda =   '<div id="btn_ayuda" class="Ayuda saldos_btn1 showtooltip"></div>';		
	var btnImprimir =   '<div id="btn_imp" class="Imprimir saldos_btn2 showtooltip"></div>';
	var	btnDescargar =   '<div id="btn_exp" class="Descargar saldos_btn7 showtooltip"></div>';
	var btnPDF = '<div id="btn_pdf" class="PDF saldos_btn8 showtooltip"></div>';

	switch(tipoBotones)
	{
		case 0:
		{
			botonesTituloSeccion = "";
			break;	
		}
		case 1:
		{
			botonesTituloSeccion = btnAyuda;
			break;
		}
		case 2:
		{
			botonesTituloSeccion = btnAyuda + btnImprimir;			
			break;
		}
		case 3:
		{
			botonesTituloSeccion = btnAyuda + btnImprimir + btnDescargar;
			break;
		}	
		case 4:
		{
			botonesTituloSeccion = btnAyuda + btnImprimir + btnPDF;
			break;
		}		
		case 5:
		{
			botonesTituloSeccion = btnAyuda + btnDescargar;
			break;
		}		
	}
}

function quehacer( tipo , language){ 
	var idioma = 1;
	if (language == null)
		idioma = 1;
	else if (language == 5)
		idioma = 5;
	else
		idioma = 1;	
	
	array_quehacer = contenidoMenuQueHacer(tipo,1,idioma)
	array_comohacer = contenidoMenuQueHacer(tipo,2,idioma)
	if (array_quehacer.length != array_comohacer.length) return false;
	if(tipo>0){
		cuadro_quehacer = '<div class="menu4N_p1 negrita">' + (idioma == 1?'&iquest;Qu&eacute; desea hacer?':'What do you want to do?') + '</div>';
		for( i=0; i<array_quehacer.length ; i++){
			if( i == (array_quehacer.length-1) ){
				if(array_quehacer[i].length < "31")
					cuadro_quehacer += '<div onclick="'+array_comohacer[i]+'" class="menu4N_p3"><span class="bull" style="color: rgb(30, 135, 221);">&bull; </span><a href="#" class="exLiga2">'+array_quehacer[i]+'</a></div>';
				else
					cuadro_quehacer += '<div onclick="'+array_comohacer[i]+'" class="menu4N_p3_btm"><span class="bull" style="color: rgb(30, 135, 221);">&bull; </span><a href="#" class="exLiga2">'+array_quehacer[i]+'</a></div>';
			}else{
				cuadro_quehacer += '<div onclick="'+array_comohacer[i]+'" class="menu4N_p2"><span class="bull" style="color: rgb(30, 135, 221);">&bull; </span><a href="#" class="exLiga2">'+array_quehacer[i]+'</a></div>';
			}
		}
	}else{
		cuadro_quehacer = '';
	}
	$('.menu4N').html(cuadro_quehacer);
	colorLigas1();
}

function LinkAltaServicios(){
	document.APPS_FORM_MENU.DATAUX.value = 'ALTACTA_SERVICIOS_EXT';
	SaltoA('ZAOC');
}

function contenidoMenuQueHacer(tipo , opc, language){
	var linksMenu = new Array();
	var ligasMenu = new Array();
	switch ( tipo ){
		case 1:{
			ligasMenu = language == 1 ?['D\u00e1 de alta sus pagos','Administrar chequeras','Ir a movimientos','Ir a detalle de cuentas','Configurar sus notificaciones']:['Register your payments','Administrar chequeras','Go to movements','Ir a detalle de cuentas','Configurar sus notificaciones'];
			linksMenu = ["document.getElementById('main').contentWindow.goToDo();","SaltoA('ZTCH')","SaltoA('ZECL')","Vacio()","DoSubmit('ZAYN')"];
			break;
		}
		case 2:{
			ligasMenu = language == 1 ?['Ver historial de Banca Electr&oacute;nica','Ver pendientes de autorizar']:['View  electronic banking history','View pending authorizations'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRDT')"];
			break;
		}
		case 3:{
			ligasMenu = language == 1 ?['Ver historial de Banca Electr&oacute;nica','Ver pendientes de autorizar','Dar de alta una cuenta']:['View  electronic banking history','View pending authorizations','Register an account'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRDT')","SaltoA('ZAOC')"];
			break;
		}
		case 4:{
			ligasMenu = language == 1 ?['Dar de Alta una domiciliaci&oacute;n','Administrar mis pagos']:['Register a direct debit','Manage my payments'];
			linksMenu = ["document.getElementById('main').contentWindow.goToDo();","Vacio()"];
			break;
		}
		case 5:{
			ligasMenu = language == 1 ?['Ver historial de Banca Electr&oacute;nica']:['View  electronic banking history'];
			linksMenu = ["SaltoA('ZHIS')"];
			break;
		}
		case 6:{
			ligasMenu = language == 1 ?['Consulta de Estado de cuenta', 'Crear archivo', 'Configuraci&oacute;n de archivos']:['Go to Statements and Movements', 'Create file', 'Files Configuration'];
			linksMenu = ["SaltoA('ZECL')","Vacio()","Vacio()"];
			break;
		}
		case 7:{
			ligasMenu = language == 1 ?['Ver historial de Banca Electr&oacute;nica','Ver pendientes de autorizar','Dar de alta un servicio']:['View  electronic banking history','View pending authorizations','Register a service'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRDT')","LinkAltaServicios()"];
			break;
		}
		case 8:{
			ligasMenu = language == 1 ?['Dar de Alta una Domiciliaci&oacute;n']:['Register a direct debit'];
			linksMenu = ["document.getElementById('main').contentWindow.goToDo();"];
			break;
		}
		case 9:{
			ligasMenu = language == 1 ?['Realizar un pago','Ver pendientes de autorizar']:['Make a payment','View pending authorizations'];
			linksMenu = ["SaltoA('ZTAP')","SaltoA('ZRIC')"];
			break;
		}
		case 10:{
			ligasMenu = language == 1 ?['Ver resumen de saldos','Dar de alta una cuenta']:['View balance summary','Register an Account'];
			linksMenu = ["SaltoA('ZSYM')","SaltoA('ZAOC')"];
			break;
		}
		case 11:{
			ligasMenu = language == 1 ?['Ver resumen de transferencias y pagos','Configurar validaci&oacute;n de beneficiarios para archivos']:['View transfers and payments summary','Set validation of beneficiaries by files'];
			linksMenu = ["SaltoA('ZRDT')","SaltoA('ZCAR')"];
			break;
		}
		case 12:{
			ligasMenu = language == 1 ?['Realizar una transferencia','Realizar un pago']:['Make a transfer','Make a payment'];
			linksMenu = ["SaltoA('ZTYP')","SaltoA('ZTAP')"];
			break;
		}
		case 13:{
			ligasMenu = language == 1 ?['Cargar un archivo','Dar de alta una cuenta']:['Load a file','Register an account'];
			linksMenu = ["SaltoA('ZTAI')","SaltoA('ZAOC')"];
			break;
		}
		case 14:{
			ligasMenu = language == 1 ?['Cargar un archivo','Descargar un archivo','Dar de alta una cuenta']:['Load a file','Download a file','Register an account'];
			linksMenu = ["SaltoA('ZTAI')","SaltoA('ZTFC')","SaltoA('ZAOC')"];
			break;
		}
		case 15:{
			ligasMenu = language == 1 ?['Ver Historial de Banca Electr&oacute;nica ','Ver Pendientes de Autorizar','Dar de alta una cuenta']:['View Electronic Banking record','View approve pending','Register an account'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRDT')","SaltoA('ZAOC')"];
			break;
		}
		case 16:{
			ligasMenu = language == 1 ?['Ver pendientes de autorizar']:['View pending authorizations'];
			linksMenu = ["SaltoA('ZRIC')"]
			break;
		}
		case 17:{
			ligasMenu = language == 1 ?['Ver resumen de transferencias y pagos ','Configurar validación de beneficiarios para archivos']:['View transfers and payments summary','Set beneficiaries validation to file validation'];
			linksMenu = ["SaltoA('ZRDT')","SaltoA('ZCAR')"];
			break;
		}
		case 18:{
			ligasMenu = ['Ver saldos'];
			linksMenu = ["SaltoA('ZSYM')"];
			break;
		}
		case 19:{
			ligasMenu = language == 1 ?['Ver Estado de cuenta']:['View Statements and Movements'];
			linksMenu = ["SaltoA('ZECL')"];
			break;
		}
		case 20:{
			ligasMenu = ['Ir a Servicios Adicionales'];
			linksMenu = ["SaltoA('ZPEC')"];
			break;
		}
		case 21:{
			ligasMenu = language == 1 ?['Ir a Historial de Banca Electr&oacute;nica','Ir a Pendientes de Autorizar','Ir a Comprobantes','Pago masivo a GDF']:['View electronic banking history','View pending authorizations','View certificates','GDF mass payments'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRIC')","SaltoA('ZREI')","saltoVisual(1,4,0);DoSubmit('ZPMG')"];
			break;
		}
		case 22:{
			ligasMenu = language == 1 ?['Ver saldos','Realizar una transferencia','Realizar un pago']:['View balances','Make a transfer','Make a payment'];
			linksMenu = ["SaltoA('ZSYM')","SaltoA('ZTYP')","SaltoA('ZTAP')"];
			break;
		}
		case 23:{
			ligasMenu = language == 1 ?['Ver Historial de Banca Electr&oacute;nica ','Ver Pendientes de Autorizar','Dar de alta una cuenta','Ver proceso de aclaraci&oacute;n para pagos interbancarios']:['View Electronic Banking record','View approve pending','Register an account','See Interbank Payments Clarification'];
			linksMenu = ["SaltoA('ZHIS')","SaltoA('ZRDT')","SaltoA('ZAOC')","window.open('https://www.citibanamex.com/sitios/aclaraciones-cargos-tarjetas/index.html')"];
			break;
		}
	}
	if (opc == 1) return ligasMenu;
	else if (opc == 2) return linksMenu;
}
function showtooltip(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	 if (msie && ua.substr(4, 1) == '7')
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
			
			  $('#tooltip').find('.tooltipC').html( $(this).attr("class").split(" ")[0].replace("~", " ") );
			  pos = $(this).offset();
			  alto = $('#tooltip').height()+10;
			  ancho = $('#tooltip').width()-30;
			  $('#tooltip').css({'top':(pos.top-alto)+'px','left':(pos.left-ancho)+'px'});
			  $('#tooltip').show();
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
	 if (msie && ua.substr(4, 1) == '7')
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
			
			  $('#tooltip').find('.tooltipC').html( $(this).attr("class").split(" ")[0].replace("~", " ") );
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

function showtooltipCopy(){
	$('.showtooltip-copy').hover(
		function(){
			pos = $(this).offset();
			alto = $('#tooltip-copy').height()+10;
			ancho = $('#tooltip-copy').width()-40;
			$('#tooltip-copy').css({'top':(pos.top-alto)+'px','left':(pos.left-ancho)+'px'});
			$('#tooltip-copy').show();
		},
		function()
		{
			$('#tooltip-copy').hide();
		}
	);
}

var Modulo_Alternativo = 'NAN';

function SaltoA(Modulo,Modulo2){
	anularTriggerPadding = true;
	if (Modulo2 != null){ Modulo_Alternativo = Modulo2;Cambia_Submit = true; }
	var Absolute_Position_Second_level = -1;
	var Search;
	eval(" Search = /'" + Modulo + "'/");
	var i,j,k,l,m,n;
	var isArrayVar = false;
	for (i=0;i<menu.length;i++){
		for (j=0;j<menu[i][2].length;j++){
			Absolute_Position_Second_level++;
			try {
				isArrayVar = isArrayMandoBB(menu[i][2][j][3]);
			} catch ( ex ) {
				isArrayVar = false;
			}
			if(menu[i][2][j].length > 3 && isArrayVar){
				if (menu[i][2][j][3]+'' != 'undefined'){
					for (k=0;k<menu[i][2][j][3].length;k++){
						if(Search.test(menu[i][2][j][3][k])){
							IraMenu(i, Absolute_Position_Second_level, k);
							//document.getElementById('Position').value = '' + i + ',' + Absolute_Position_Second_level + ',' + k;
							return;
						}
					}
				}
			}
			else{
				if(Search.test(menu[i][2][j])){
					IraMenu(i,Absolute_Position_Second_level);
					//document.getElementById('Position').value = '' + i + ',' + Absolute_Position_Second_level;
					return;
				}
			}	
		}
	}
}

function SaltoB(Modulo,Modulo2){
	anularTriggerPadding = true;
	if (Modulo2 != null){ Modulo_Alternativo = Modulo2;Cambia_Submit = true; }
	var Absolute_Position_Second_level = -1;
	var Search;
	eval(" Search = /'" + Modulo + "'/");
	var i,j,k,l,m,n;
	var isArrayVar = false;
	for (i=0;i<menu.length;i++){
		for (j=0;j<menu[i][2].length;j++){
			Absolute_Position_Second_level++;
			try {
				isArrayVar = isArrayMandoBB(menu[i][2][j][3]);
			} catch ( ex ) {
				isArrayVar = false;
			}
			if(menu[i][2][j].length > 3 && isArrayVar){
				if (menu[i][2][j][3]+'' != 'undefined'){
					for (k=0;k<menu[i][2][j][3].length;k++){
						if(Search.test(menu[i][2][j][3][k])){
							IraMenuMulti(i, Absolute_Position_Second_level, k,"B");
							return;
						}
					}
				}
			}
			else{
				if(Search.test(menu[i][2][j])){
					IraMenuMulti(i,Absolute_Position_Second_level,"","");
					return;
				}
			}	
		}
	}
}

var Actual2 = anularTriggerNiv2;
function IraMenu(PrimerNivel,SegundoNivel,TercerNivel){
	TercerNivel = TercerNivel == null ? '': TercerNivel;
	Actual2 = anularTriggerNiv2;
	anularTriggerNiv2 = true;
	anularTriggerNiv3 = true;
	setTimeout(function(){$('#idConteiner .option a:eq(' + SegundoNivel + ')').trigger('click');},400);
	setTimeout(function(){
		if(SegundoNivel=="26" && (TercerNivel=="4" || TercerNivel=="5" || TercerNivel=="6" || TercerNivel=="7")){
			parent.$(".menu3N #pest4n_3").trigger("click");
		}
		if(SegundoNivel=="26" && (TercerNivel=="9" || TercerNivel=="10" || TercerNivel=="11" || TercerNivel=="12")){
			parent.$(".menu3N #pest4n_4").trigger("click");
		}
	},500);
	if(parseInt(TercerNivel) != NaN)
		setTimeout(function(){$('.menu3N a:eq(' + TercerNivel + ')' ).trigger('click');},800);	
	setTimeout('anularTriggerNiv2 = Actual2;anularTriggerNiv3 = false;Cambia_Submit = false;',1000);
}

function IraMenuMulti(PrimerNivel,SegundoNivel,TercerNivel,id){
	TercerNivel = TercerNivel == null ? '': TercerNivel;
	Actual2 = anularTriggerNiv2;
	anularTriggerNiv2 = true;
	anularTriggerNiv3 = true;
	if(id=="B"){
		setTimeout(function(){$('#idConteiner .option a:eq(' + SegundoNivel + ')').trigger('click');},400);
		setTimeout(function(){
			if(SegundoNivel=="26" && (TercerNivel=="4" || TercerNivel=="5" || TercerNivel=="6" || TercerNivel=="7")){
				parent.$(".menu3N #pest4n_3").trigger("click");
			}
			if(SegundoNivel=="26" && (TercerNivel=="9" || TercerNivel=="10" || TercerNivel=="11" || TercerNivel=="12")){
				parent.$(".menu3N #pest4n_4").trigger("click");
			}
		},500);
	}	
	setTimeout(function(){anularTriggerNiv3 = false;},500);
}

function Vacio(){
}

function ValidaMenu(cad){
	if(document.getElementById("STATUSNK").value=="06"){
		return true;
	}else{
	    if((cad=="ZREA")||(cad=="ZREB")||(cad=="ZREE")||(cad=="ZNKM")){
			return true;}
		else{
			return false;}
		
	}
}

function saltoVisual( primerNivel, segundoNivel, tercerNivel, cuartoNivel ) {
	tercerNivel = ( tercerNivel == null ) ? '' : tercerNivel;
	cuartoNivel = ( cuartoNivel == null ) ? '' : cuartoNivel;

	//Se selecciona la opción del menú de primer nivel y se muestra menú de segundo nivel
	var resTriggerNiv2 = anularTriggerNiv2;
	anularTriggerNiv2 = false;
	anularTriggerPadding = true;
	$( "ul a:eq(" + primerNivel + ") span", "#menu").trigger("click");
	anularTriggerNiv2 = resTriggerNiv2;

	//Se selecciona la opción del menú de segundo nivel y se muestra menú de tercer nivel
	anularTriggerNiv3 = true;
	anularTriggerNiv4 = true;
	$( "#menuSegundoNivel .oculto:eq(" + primerNivel + ")" ).find( "a:eq(" + segundoNivel + ")" ).trigger('click');
	anularTriggerNiv4 = false;
	anularTriggerNiv3 = false;

	//Se seleccionan las opción de menú del tercer y cuarto nivel, si existen
	if( !isNaN( parseInt( tercerNivel ) ) ) {

		if( !isNaN( parseInt( cuartoNivel ) ) ) {
			var num;
			switch( tercerNivel ) {
				case 0: num="7"; break;
				case 1: num="4"; break;
				case 3: num="6"; break;
			}
			$( ".menu4NConte" ).hide();
			$( ".pest4n" ).removeClass( "menu3N_p7inH" );
			$( '.menu3N>[class^="menu3N_p"]' ).eq( tercerNivel ).next( '.menu4NConte' ).show();
			$( '.menu3N>[class^="menu3N_p"]' ).eq( tercerNivel ).addClass( "menu3N_p"+num+"h" )
			$( '.menu3N>[class^="menu3N_p"]' ).eq( tercerNivel ).find( '.pest4n' ).addClass( "menu3N_p"+num+"inH2" );
			$( ".menu4NConte:visible a" ).css({color: '#1e87dd'}).removeClass( "colorFF5C00" );
			$( ".menu4NConte:visible a" ).addClass( "exLiga3" );
			$( ".menu4NConte:visible a:eq(" + cuartoNivel + ")" ).addClass( "colorFF5C00" ).removeClass("exLiga3");
		} else {
			if( $( ".menu3N .menu4NConte" ).length>0 ) {
				$( ".menu4NConte" ).hide();
				$( ".pest4n" ).removeClass( "menu3N_p7inH" );
				$( '.menu3N>[class^="menu3N_p"]' ).eq( tercerNivel ).find( "a" ).addClass( "colorFF5C00" );
			} else {
				$( ".menu3N a" ).removeClass( "colorFF5C00" );
				$( ".menu3N a:eq(" + tercerNivel + ")" ).addClass( "colorFF5C00" );
			}
		}	
	}
}

function isArrayMandoBB(obj) {
	var regreso;
	try {
		if (obj.constructor.toString().indexOf("Array") == -1){
			regreso = false;
		}else{ 
			regreso = true;
		}
	} catch ( ex ){
		regreso = false;
	}
	return regreso;
}


function creaMenuSecondActive(){
	var strMenuSecond = '';
	var tercerNivel;
	var descripcion1 = '';
	
	for(i=0;i<menus.length;i++){
		tercerNivel = menus[i][2];
		strMenuSecond += '<div class="menu-container menuPN'+(i+1)+'">';
		
		for(j=0; j<tercerNivel.length; j++){		
		
		strMenuSecond += '<div class="col-md-2 option" >'
		strMenuSecond += '<a href="javascript:void(0);" onclick="nuevoBNE_goto( &#39;#segNivel'+(i+1)+'&#39;, this, '+ (i+1) +'); return false;" class="link active">';
		if (menus.length == 8 && i== 6){
			strMenuSecond += '<span class="ico ico-menuPNP-menuSN'+ (j+1) +'">';
			strMenuSecond += '<span class="spriteMe sprite-smenuPNP-menuSN'+ (j+1)+'"> </span> </span>';
		}
		else if (menus.length == 8 && i>= 7){
			strMenuSecond += '<span class="ico ico-menuPN'+ (i) +'-menuSN'+ (j+1) +'">';
			strMenuSecond += '<span class="spriteMe sprite-smenuPN'+ (i) +'-menuSN'+ (j+1)+'"> </span> </span>';
		}
		else{
			strMenuSecond += '<span class="ico ico-menuPN'+ (i+1) +'-menuSN'+ (j+1) +'">';
			strMenuSecond += '<span class="spriteMe sprite-smenuPN'+ (i+1) +'-menuSN'+ (j+1)+'"> </span> </span>';
		}
		strMenuSecond += '<span class="text">'+ tercerNivel[j][1] +'</span></a></div>';
		
		}
		strMenuSecond += '</div>';
	}
	
	return strMenuSecond;
}



function creaMenuSecond(){
	var urlBanner = [
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuconsultas.htm",
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menutransfypagos.htm", 
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuimpycontribuciones.htm",
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menucobranza.htm", 
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuinversiones.htm",
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuservadicionales.htm",
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuadministracion.htm",
					"https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Saldos/menuadministracion.htm"
					];
	var strMenuSecond = '';
	var tercerNivel;
	var limitedeSubMenus = 0;
	var descripcion1 = '';
	for(i=0;i<menus.length;i++){
		tercerNivel = menus[i][2];
		
		strMenuSecond += '<div class="menu-container menuPN'+(i+1)+'" style="display: none;" id="newSegNivel'+(i+1)+'"> <div class="left-options"> <div class="clear-col">';
		limitedeSubMenus = 0;
		for(j=0; j<tercerNivel.length; j++){
		
		limitedeSubMenus++;
		
		if(limitedeSubMenus > 3)
		{
			limitedeSubMenus = 1;
			strMenuSecond += '</div><div class="clear-col">';
		}
		if (menus.length == 8 && i== 6){
		strMenuSecond += '<div class="option"> <a class="link" id="msn7PPrem'+j
		+'"  >';
		
			strMenuSecond += '<span class="ico ico-menuPNP-menuSN'+ (j+1) +'"><span class="spriteMa '+'sprite-menuPNP-menuSN'+ (j+1)+'"></span></span>  <span class="text">'+tercerNivel[j][1]+'</span>';
		}
		else if (menus.length == 8 && i>= 7){
		strMenuSecond += '<div class="option"> <a class="link" id="new'+(i+1)+'P'+tercerNivel[j][1]+'" onclick=" nuevoBNE_goto( &#39;#segNivel'+ (i+1) +'&#39;, this,'+(i+1)+'); return false;" href="javascript:void(0);">';
		
			strMenuSecond += '<span class="ico ico-menuPN'+ (i) +'-menuSN'+ (j+1) +'"><span class="spriteMa '+'sprite-menuPN'+ (i) +'-menuSN'+ (j+1)+'"></span></span>  <span class="text">'+tercerNivel[j][1]+'</span>';
		}
		else{
		strMenuSecond += '<div class="option"> <a class="link" id="new'+(i+1)+'P'+tercerNivel[j][1]+'" onclick=" nuevoBNE_goto( &#39;#segNivel'+ (i+1) +'&#39;, this,'+(i+1)+'); return false;" href="javascript:void(0);">';
		
			strMenuSecond += '<span class="ico ico-menuPN'+ (i+1) +'-menuSN'+ (j+1) +'"><span class="spriteMa '+'sprite-menuPN'+ (i+1) +'-menuSN'+ (j+1)+'"></span></span>  <span class="text">'+tercerNivel[j][1]+'</span>';
		}
		if(tercerNivel[j][0] == 1)
		{
			var subDescripcion = tercerNivel[j][3];
			
			if(subDescripcion[0][0] == 1)
			{
				var cuartoNivel = subDescripcion[0][3];
				descripcion1 = cuartoNivel[0][3];
			}
			else
			{
				descripcion1 = subDescripcion[0][3];
			}
		}
		else
		{
			descripcion1 = tercerNivel[j][3];
		}
		
		strMenuSecond += '<span class="descrip">' + descripcion1 + '</span> </a> </div>'
		}
		
		if(limitedeSubMenus <= 3)
		{
			strMenuSecond += '</div>';
		}
		if (menus.length == 8 && i== 6){
			strMenuSecond += '</div> <a class="banner-menu"><span class="spritePs"></span></a> </div>';
		}
		else{
			strMenuSecond += '</div> <a class="banner-menu" href="'+urlBanner[i]+'" target="_blank"> <span class="sprite2 sprite2-Banner'+(i+1)+'">  </span></a> </div>';
		}
	}
	
	return strMenuSecond;
}


function creaPrimerNivelNuevo(){
	var strMenu = '';
	var posfijo = '';
	for (i=0;i<menus.length;i++){
	var res = menus[i][1].split(" ");
	posfijo = res[0];
		if(i==0){
			strMenu += '<li><a id="menuPN'+(i+1)+'" class="option selected" href="#" >'
			+ menus[i][1]
			+ '</a></li>\n'
		}else{
			/*if(menus[i][1]=="Premium")
			{
				strMenu += '<li><a href="#" id="btnPremiumBNE" ><span class="noh  segNivel'+(i+1)+'">'
				+ menus[i][1]
				+ '</span></a></li>\n'
			}
			else
			{*/
				strMenu += '<li><a id="menuPN'+(i+1)+'" class="option" href="#" >'
			+ menus[i][1]
			+ '</a></li>\n'
			//}
		}
	}
		strMenu += '<li class="salir"><a href="javascript:void(0);" onclick="Exit();">Salir</a></li>';
	return strMenu;
}

function defineNuevosMenus(){
	var menuFirst = creaPrimerNivelNuevo();
	var menuSecond = creaMenuSecond();
	var menuSecondActive = creaMenuSecondActive();
	$('div.menu-first ul.nav').html(menuFirst);
	$('div.menu-second div.container').html(menuSecond);
	$('div.menu-second-active div.container').html(menuSecondActive);
}
///////////////////////////////////////////////////////////

function menu_header_bancanet(){
	menu_header_bancanet_first_hover();
	menu_header_bancanet_second_hover();
	menu_second_click();
	menu_second_active_click();
}
menu_header_bancanet_isHover = true;
function menu_header_bancanet_first_hover(){
	var hover_timeOut;
	$('.header-bancanet .menu-first a.option').hover(function(){
		$this = $(this);
		if(( !$this.parent().hasClass('salir') )&&( !$this.hasClass('selected') )){
			menu_header_bancanet_isHover = true;
			$('.menu-second .menu-container').hide();
			$('.menu-second .'+$this.attr('id')).show();
			
			$('.header-bancanet .menu-first a.option').removeClass('active');
			$this.addClass('active');
			
			$this.find('span.arrow').animate({
				'bottom': '4px'
			},300);
			$('.menu-second').animate({
				'top':'125px'
			},300);
			$('.menu-second-active').animate({
				'margin-top':'-50px'
			},200);

		}
	},function(){
		$this = $(this);
		if( !$this.parent().hasClass('salir') ){
			menu_header_bancanet_isHover = false;
			clearTimeout(hover_timeOut);
			hover_timeOut = setTimeout(function(){
				if( !menu_header_bancanet_isHover ){
					$('.header-bancanet .menu-first a.option').removeClass('active');
					$('.menu-second').stop( true, true ).animate({
						'top':'-360px'
					},300);	
					$('.menu-second-active').stop( true, true ).animate({
						'margin-top':'0'
					},300);
					
				}
			},100);
			
		}
	});
}
function menu_header_bancanet_second_hover(){
	$('.menu-second').hover(function(){
		menu_header_bancanet_isHover = true;
	},function(){
		menu_header_bancanet_isHover = false;
		setTimeout(function(){
			if( !menu_header_bancanet_isHover ){
				$('.header-bancanet .menu-first a.option').removeClass('active');
				$('.menu-second').animate({
					'top':'-360px'
				},400);	
				$('.menu-second-active').animate({
					'margin-top':'0'
				},300);
			}
		},100);
	});
}
function menu_second_click(){
	$('.menu-second .link').click(function(){
		$this = $(this);
		$('.menu-second .link').removeClass('active');
		$this.addClass('active');

		$('.menu-first .option').removeClass('selected');	
		selected_1st = $this.parent().parent().parent().parent().attr('class');
		selected_1st = selected_1st.replace("menu-container ", "");
		$('.menu-first .nav li #'+selected_1st).addClass('selected');

		$('.menu-second-active .menu-container .option .link').removeClass('active');	
		$('.menu-second-active .menu-container').css('display','none');
		$('.menu-second-active .'+selected_1st).css('display','block');
		selected_2nd = $this.find('.text').text();
		$('.menu-second-active .'+selected_1st+" .option").each(function(){
			$this2 = $(this);
			if( $this2.find('.link').find('.text').text() == selected_2nd ){
				$this2.find('.link').addClass('active');
			}
		});
		


		$('.header-bancanet .menu-first a.option').removeClass('active');
		$('.menu-second').animate({
			'top':'-360px'
		},300);	
		$('.menu-second-active').animate({
			'margin-top':'0'
		},300);
	});
}
function menu_second_active_click(){
	$('.menu-second-active .link').click(function(){
		$this = $(this);
		$('.menu-second-active .link').removeClass('active');
		$this.addClass('active');

		selected_1st = $this.parent().parent().attr('class');
		selected_1st = selected_1st.replace("menu-container ", "");
		selected_2nd = $this.find('.text').text();
		$('.menu-second .'+selected_1st+" .option").each(function(){
			$this2 = $(this);
			if( $this2.find('.link').find('.text').text() == selected_2nd ){
				$this2.find('.link').addClass('active');
			}else{
				$this2.find('.link').removeClass('active');
			}
		});
		
	});
}


function nuevoBNE_goto( menu, opcion, nivel){
	identificador = $(opcion).find('.text').text();
	$(menu+' '+"[id='msn"+nivel+"P"+identificador+"']").click();
}

function Disclaimer(){
		
	const dialogo = document.getElementById('divDisclaimer');	
	const loginDis = document.getElementById('login');
	const txtDisCod = 'QWhvcmEgQmFuY28gTmFjaW9uYWwgZGUgTcOpeGljbywgUy5BLiwgaW50ZWdyYW50ZSBkZWwgR3J1cG8gRmluYW5jaWVybyBCYW5hbWV4LCB0ZSBicmluZGFyw6Egc3VzIHNlcnZpY2lvcyBiYWpvIGVsIG5vbWJyZSAiQmFuYW1leCIuIFBhcmEgY3VhbHF1aWVyIGR1ZGEsIGNvbXVuw61jYXRlIGFsIDU1IDEyMjYgMjYzOSBvIHZpc2l0YSB3d3cuYmFuYW1leC5jb20=';

	if(!dialogo){
		return
	}	
	
	function ocultarDisclaimer(){
		dialogo.style.display='none';
	}
	
	function mostrarDisclaimer(){
		if(loginDis){
			var txtDisDec = atob(txtDisCod);
			var bytes = new Uint8Array(txtDisDec.length);
				for(var i = 0; i<txtDisDec.length; i++){
					bytes[i] = txtDisDec.charCodeAt(i);
				}
			var contDec = new TextDecoder('utf-8').decode(bytes);
		
			var divContent = document.createElement('div');
			divContent.classList.add('disclaimer-content');
		
			var divTxt = document.createElement('div');
			divTxt.textContent = contDec;
			divTxt.classList.add('disclaimer-label');
		
			var divImg = document.createElement('div');
			divImg.classList.add('disclaimer-button');
			var img = document.createElement('img');
			img.src = '/bestbanking/BB/images/close.svg';
			img.alt = 'Cerrar';
			img.id = 'cerrarDisclaimer';
			img.classList.add('disclaimer-button-style');
		
			divImg.appendChild(img);
			divContent.appendChild(divTxt);
			divContent.appendChild(divImg);
			dialogo.appendChild(divContent);
		}
		
		dialogo.style.display='block';
		
		const cerrarDisclaimer = document.getElementById('cerrarDisclaimer');
		
		cerrarDisclaimer.addEventListener('click', (e)=>{
			if(e.target && e.target.id==='cerrarDisclaimer'){
				ocultarDisclaimer();
			}
		});
	}
	
	const configuration_BNE_Legacy = {
		"disclaimerFlag" : false
	}; 

	const disclmFlg = configuration_BNE_Legacy.disclaimerFlag;
	
	if(disclmFlg){
		mostrarDisclaimer();
		
		const listIFrame = document.querySelector('.contenedor');
		if(listIFrame !== null){
			const callBackDisc = (mutations) =>{
				if(mutations.length===3 && mutations[1].target.innerText=='Saldos'){
					mostrarDisclaimer();
				}
				else if(mutations.length===2 && mutations[0].target.innerText=='Saldos'){
					mostrarDisclaimer();
				}
				else if(mutations.length===1){}
				else{
					ocultarDisclaimer();
				}
			}
			
			const observer = new MutationObserver(callBackDisc);
			observer.observe(listIFrame,{
				childList:true,
				subtree:true
			});
		}

	}else{
		ocultarDisclaimer();
	}

}