var lblsLogin = new Array(
	{ esp:'English', eng:'Español' },//0
	{ esp:'Sucursales', eng:'Branches' },//1
	{ esp:'Contáctanos', eng:'Contact Us' },//2
	{ esp:'<span class="bold f12">Cont&aacute;ctanos</span><br/><br/><strong>Segmento Pequeña y Mediana Empresa (PYME) y Sucursal</strong><br/><br/>Cd. de México y zona Metropolitana<br/>551226 8867<br/><br/>Interior de la República Mexicana<br/>551226 8867<br/><br/>Correo electrónico:<br/>servicioalclientepyme@banamex.com<br/><br/><strong>Segmento Empresarial y Gobierno.</strong><br/><br/>Cd. de México y zona Metropolitana<br/>552226 1111<br/><br/>Interior de la República Mexicana<br/>552226 1111<br/><br/>Correo electrónico:<br/>servicioalclientebei@banamex.com', eng:'<span class="bold f12">Contatct us</span><br/><br/><strong>Small and Medium Companies Segment</strong><br/><br/>Mexico City<br/>551226 8867<br/><br/>Toll free<br/>551226 8867<br/><br/>Email address:<br/>servicioalclientepyme@banamex.com<br/><br/><strong>Corporate and CCB Segment</strong><br/><br/>Mexico City<br/>552226 1111<br/><br/>Toll free<br/>552226 1111<br/><br/>Email address:<br/>servicioalclientebei@banamex.com' },//3
	{ esp:'Ayuda', eng:'Help' },//4
	{ esp:'T&eacute;rminos, condiciones de uso y privacidad', eng:'Privacy and use related terms and conditions' },//5
	{ esp:'D.R. &reg; Copyright 2013, Derechos Reservados. Banco Nacional de M&eacute;xico, S.A., integrante de Grupo Financiero Banamex.<br />Isabel la Cat&oacute;lica 44. Col. Centro Hist&oacute;rico. Del. Cuauht&eacute;moc. C.P. 06000, M&eacute;xico, Distrito Federal, M&eacute;xico.', eng:'D.R. &reg; Copyright 2013, All Rights Reserved. Banco Nacional de M&eacute;xico, SA member of Grupo Financiero Banamex.<br />Isabel la Cat&oacute;lica 44. Col. Centro Hist&oacute;rico. Del. Cuauht&eacute;moc. C.P. 06000, M&eacute;xico, Distrito Federal, M&eacute;xico. ' },//6
	{ esp:'<span class="bold">Banca</span>Net Empresarial', eng:'<span class="bold">Banca</span>Net Empresarial' },//7
	{ esp:'Número de cliente', eng:'Customer number' },//8
	{ esp:'Clave de acceso', eng:'Access code' },//9
	{ esp:'Entrar', eng:'Login' },//10
	{ esp:'Ir a Banamex.com', eng:'Go to Banamex.com' },//11
	{ esp:'Conoce el demo', eng:'Try the demo' },//12
	{ esp:'Salir del demo', eng:'Exit Demo' },//13
	{ esp:'Desbloquear claves<br /><span class="marginL10"></span>de acceso', eng:'Unblock access<br /><span class="marginL10"></span>codes' },//14
	{ esp:'Herramienta<br />Anti-Intrusos instalada', eng:'Anti-intrusion<br/> tool installed' },//15
	{ esp:'Resuelve: 552226 1111     <br>Resuelve PYME:  551226 8867', eng:'Resolved:  552226 1111     <br>Resolved PYME:  551226 8867' },//16
	{ esp:'Ver m&aacute;s', eng:'See more' },//17
	{ esp:'¡Prot&eacute;jase de fraudes <br/> cibern&eacute;ticos!', eng:'Protect yourself of <br/> cyber fraud!'},//18
	{ esp:'Resuelve:  552226 1111 <br>Resuelve PYME:  551226 8867', eng:'Resolved:  552226 1111 <br>Resolved PYME:  551226 8867' },//19
	{ esp:'Instalar', eng:'Install' },//20
	{ esp:'<span class="bold"></span><br />', eng:'<span class="bold"></span><br />' },//21
	{ esp:'<span class="bold"></span><br />', eng:'<span class="bold"></span><br />' },//22
	{ esp:'<span class="bold"></span><br />', eng:'<span class="bold"></span><br />' },//23
	{ esp:'<span class="bold"></span><br />', eng:'<span class="bold"></span><br />' },//24
	{ esp:'Acceso Denegado',eng:'Access Denied'},//25
	{ esp:'Segmento Pequeña y Mediana Empresa (PYME) y Sucursal',eng:'Small and Medium Companies Segment'},//26
	{ esp:'Cd. de M&eacute;xico',eng:'Mexico City'},//27
	{ esp:'Del Interior de la Rep&uacute;blica',eng:'Toll free'},//28
	{ esp:'Horario Lunes a Viernes 07:00 a 23:00, sábado de 09:00 a 18:00 ',eng:'From Monday to Friday 07:00 to 23:00, saturday 09:00 a 18:00.'},//29
	{ esp:'Correo electrónico:',eng:'Email address:'},//30
	{ esp:'Segmento Corporativo, Empresarial y Gobierno',eng:'Corporate and CCB Segment'},//31
	{ esp:'EUA y Canadá',eng:'USA and Canada'},//32
	{ esp:'Horario Lunes a Viernes 07:00 a 23:00,<br/> sábado de 09:00 a 18:00 ',eng:'From Monday to Friday 07:00 to 23:00<br/> saturday 09:00 a 18:00.'},//33
	{ esp:'Continuar',eng:'Continue'},//34
	{ esp:'Anti intrusos: Plataforma <br>no compatible',eng:'Anti-intruders: Platform   <br/> not compatible'},//35
	{ esp:'Actualizar',eng:'Update'},//36
	{ esp:'Banamex.com',eng:'Banamex.com'}//37
);

var language;
var isEnglishSel;
var importarBio;

function initBio(){
	try {
		window.cdApi.startNewSession();
		window.cdApi.changeContext('PreLogin');
		window.cdApi.setCustomerBrand('WEB_EMPRESAS'); 
		}catch(e){}
}
$( document ).ready( function() {
	var c_lang = Get_Cookie( 'c_lang' );	
	isEnglishSel = ( c_lang=='eng' );
	lanFolderAvLog = ( c_lang=='eng' ) ? 'en' : 'es';
	lanFolderEdLog = ( c_lang=='eng' ) ? 'eng' : 'esp';
	language = lanFolderEdLog;
	
	host = 'https://bancanet.banamex.com/MXGCB/JPS/portal';
	hostbov = 'https://boveda.banamex.com.mx/';
	
	rutaExit = ( language=='eng' ) ? host+'/LocaleSwitch.do?locale=en_MX' : host+'/Index.do';
	rutaBanca = ( language=='eng' ) ? hostbov+'englishdir/bankmain.htm' : hostbov+'serban/index.htm';
	rutaBana = ( language=='eng' ) ? 'http://www.banamex.com/en/' : 'http://www.banamex.com';
	rutaAyudaAv = "https://bancanet.banamex.com/ayudas/"+lanFolderAvLog+"/saldos.htm";
	
	rutaAyudaEsc = "https://portal.banamex.com.mx/"+lanFolderEdLog+"/escribenos.html?xhost=http://www.banamex.com/";
	rutaAyudaSuc = "http://www.banamex.com/recursos/apps/"+lanFolderAvLog+"/sucursal.htm";
	
	if(language == 'eng') {
		$("#entar_login").val('Login');
	} else {
		$("#entar_login").val('Entrar');
	}	
	importarBio = document.createElement('script');
	importarBio.type='text/javascript';
	importarBio.src = 'https://www.bancanetempresarial.banamex.com.mx/clvnj/scripts/26025d53/a4494242lcy.js'; 
	importarBio.async = true;
	importarBio.onload = () => {
		initBio();
	};
	document.head.appendChild(importarBio);
});

$(document).ajaxStop(function(){
  isAjaxInProcess = false;
  if( isEnglishSel )
  {
    swapLogin();
  }
});

function swapLogin() {
	var c_lang;
	var locacion = window.location + "";
	if(locacion.indexOf("spanishdir")<0)
		c_lang = 'eng'
	else
		c_lang = 'esp'
	for ( var i=0; i<lblsLogin.length; i++ ) {
		$( '[id=t'+i+']' ).each( function() {
			if( this.tagName.toUpperCase()=='INPUT' )
				this.value = lblsLogin[i][c_lang];
				
			else
				this.innerHTML = lblsLogin[i][c_lang];
		});
	}
}

function changeLanguage() {
	var changeTo = $( '#t0' ).attr( 'name' );
	var willChangeTo = ( changeTo=='eng' ) ? 'esp' : 'eng';
	language = changeTo;
	lanFolderAvLog = ( changeTo=='eng' ) ? 'en' : 'es';
	lanFolderEdLog = ( changeTo=='eng' ) ? 'eng' : 'esp';
	host = 'https://bancanet.banamex.com/MXGCB/JPS/portal';
	hostbov = 'https://boveda.banamex.com.mx/';
	
	rutaBanca = ( language=='eng' ) ? hostbov+'englishdir/bankmain.htm' : hostbov+'serban/index.htm';
	rutaBana = ( language=='eng' ) ? 'http://www.banamex.com/en/' : 'http://www.banamex.com';
	rutaExit = ( language=='eng' ) ? host+'/LocaleSwitch.do?locale=en_MX' : host+'/Index.do';
	
	rutaAyudaAv = "https://bancanet.banamex.com/ayudas/"+lanFolderAvLog+"/saldos.htm";
	
	rutaAyudaEsc = "https://portal.banamex.com.mx/"+lanFolderEdLog+"/escribenos.html?xhost=http://www.banamex.com/";
	rutaAyudaSuc = "http://www.banamex.com/recursos/apps/"+lanFolderAvLog+"/sucursal.htm";
	
	if(language == 'eng') {
		$("#entar_login").val('Login');
	} else {
		$("#entar_login").val('Entrar');
	}
	
	isEnglishSel = ( changeTo=='eng' );
	$( '#t0' ).attr( 'name', willChangeTo );
	Set_Cookie( 'c_lang', changeTo, true, "/", "", "" );
	$(".fecha").html(fechaHora());
	swapLogin();
	cambia_carrusel(0);
}

//manejo de Cookie
function Set_Cookie(d,f,a,j,e,h){
    var b=new Date();
    b.setTime(b.getTime());
    if(a){
        a=a*1000*60*60*24
    }
    var g=new Date(b.getTime()+(a));
    document.cookie=d+"="+escape(f)+((a)?";expires="+g.toGMTString():"")+((j)?";path="+j:"")+((e)?";domain="+e:"")+((h)?";secure":"")
}

function Get_Cookie(d){
    var e=document.cookie.indexOf(d+"=");
    var a=e+d.length+1;
    if((!e)&&(d!=document.cookie.substring(0,d.length))){
        return null
    }
    if(e==-1)
        {return null}
    var b=document.cookie.indexOf(";",a);
    if(b==-1){
        b=document.cookie.length
    }
    return unescape(document.cookie.substring(a,b))
}

function deleteCookie(a,d,b){
    if(Get_Cookie(a)){
        document.cookie=a+"="+((d)?";path="+d:"")+((b)?";domain="+b:"")+";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
}

		var dias = { 
		esp:['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
		eng:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	};
var meses = {
		esp:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		eng:['January','February','March','April','May','June','July','August','September','October','November','December']
	};

/* POP-UP */
(function(a){a.fn.popupWindow=function(b){return this.each(function(){a(this).click(function(){a.fn.popupWindow.defaultSettings={centerBrowser:0,centerScreen:0,height:500,left:0,location:0,menubar:0,resizable:0,scrollbars:0,status:0,width:500,windowName:null,windowURL:null,top:0,toolbar:0};settings=a.extend({},a.fn.popupWindow.defaultSettings,b||{});var c="height="+settings.height+",width="+settings.width+",toolbar="+settings.toolbar+",scrollbars="+settings.scrollbars+",status="+settings.status+",resizable="+settings.resizable+",location="+settings.location+",menuBar="+settings.menubar;settings.windowName=this.name||settings.windowName;settings.windowURL=this.href||settings.windowURL;var d,e;if(settings.centerBrowser){if(a.browser.msie){d=(window.screenTop-120)+((((document.documentElement.clientHeight+120)/2)-(settings.height/2)));e=window.screenLeft+((((document.body.offsetWidth+20)/2)-(settings.width/2)))}else{d=window.screenY+(((window.outerHeight/2)-(settings.height/2)));e=window.screenX+(((window.outerWidth/2)-(settings.width/2)))}window.open(settings.windowURL,settings.windowName,c+",left="+e+",top="+d).focus()}else{if(settings.centerScreen){d=(screen.height-settings.height)/2;e=(screen.width-settings.width)/2;window.open(settings.windowURL,settings.windowName,c+",left="+e+",top="+d).focus()}else{window.open(settings.windowURL,settings.windowName,c+",left="+settings.left+",top="+settings.top).focus()}}return false})})}})(jQuery);

function desbloq(){
	var nwd=window.open('desbloqueo.htm','','height=234,width=425,top=160,left=460,resizable=no,menubar=no,scrollbars=no,titlebar=yes,toolbar=no,status=yes');
	nwd.focus();
}






var login='default';
function funciones_login(){
	//load_html_callback("#navegacionPrincipal",'piezas/navegacionPrincipal.html',function(){
	click_topmenu();
	pop_up('.popup_menu');
	//} ,true)
    //load_html_callback("#login",'piezas/login.html',function(){
	tooltip_verifica() ; 
	prototipo()
         // if(location.href.indexOf('prototipo')!=-1)   
    //},true)
    //load_html_callback("#footer",'piezas/footer.html','',true)
   	$(".fecha").html( fechaHora() );
    pop_up('.popup');
    $(".header .logo").click(function(){window.location.href='http://www.banamex.com'}).css('cursor','pointer')
    
    $('.EnConstruccion').on('click',function(){  enConstruccion();   });
}

function ajustarOverlay(){
	var pantalla = $(window).height();
	var contenedor = $('#contenedor').height();
	var alto;
	if( contenedor > pantalla){
		alto = contenedor;
	}
	else{
		alto = pantalla;
	}
	
	$('body').css({"height":alto+'px'});
	$('.overlay').css({"height":alto+'px'});
}
 

function tooltip_verifica(){
	$('.verifica').click(
		function(){
			$('.tooltip_verifica').hide();
			var id_element = $(this).attr('id');
			$('.'+id_element).css({
				top : $(this).offset().top + 20 + 'px',
				left : $(this).offset().left - 45 + 'px'
			});
			$('.'+id_element).show();
     
		}
	);
    
	$('.tooltip_verifica .close').click(function(){
		$(this).parent().parent().hide();	
	});
}

function tooltip_left(){
	$('.tool_left').click(
		function(e){
			$('.tooltip_left').hide();
			var id_element = $(this).attr('id');
			$('.'+id_element).css({
				top : e.pageY - 25 +'px',
				left : e.pageX + 20 +'px'
			});
			$('.'+id_element).show();
  
		}
	);
    
	$('.tooltip_left .close').click(function(){
		$(this).parent().parent().hide();	
	});
}


function tooltip_left2(){
	$('.tool_left').hover(
		function(e){
			$('.tooltip_left').hide();
			var id_element = $(this).attr('id');
			
			var pos = $(this).position();

    // .outerWidth() takes into account border and padding.
    var width = $(this).outerWidth();

    //show the menu directly over the placeholder
    		$('.'+id_element).css({
				 position: "absolute",
        		 top: pos.top + -20 + "px",
        		 left: (pos.left + width) + "px"
			});
			$('.'+id_element).show();
  
		}
	);
    
	$('.tool_left').mouseout(function(){
		
		setTimeout(function(){$('.tooltip_left').fadeOut()},1500);
		
		
	});
}

/******* funciones del menu de navegacion ********/
function click_topmenu(){
	$('.overlay_trans').click(function(){
		cerrarAnterirorSubmenu();
		$('.overlay_trans').hide();
	});
	//$('.cortina').click(function(event){event.stopPropagation(); });
	$('.menu .con_menu').click(function(event){
		if($(this).hasClass('menuAbierto')){
			cerrarAnterirorSubmenu();
			$('.overlay_trans').hide('fast',function(){
				//event.stopPropagation();
			});
		}    
		else{
			abrirSubmenu(this);
			$('.overlay_trans').show('fast',function(){
				//event.stopPropagation();
			});
			
		}    
	});
}

function cerrarAnterirorSubmenu(){   $('.menuAbierto').each(function(){ cerrarSubmenu(this); }); }

function abrirSubmenu(elementoThis){
	cerrarAnterirorSubmenu();
	$(elementoThis).addClass('menuAbierto');
	var class_element = '.contactanos';  
	var alturaCortina= $(class_element).height();
	$(elementoThis).addClass('flecha_hover');
	$(class_element).css('margin-left','-165px');
	$(class_element+' .cortina').css('margin-top','-'+alturaCortina+'px');
	$(class_element).css({visibility:'visible'}) 
	$(class_element+' .cortina').animate({   marginTop:  0+'px' },500, function() { });         
}
function cerrarSubmenu(elementoThis){
    $(elementoThis).removeClass('menuAbierto');
    var class_element = '.contactanos'; 
    var alturaCortina= $(class_element).height();
    $(elementoThis).removeClass('flecha_hover'); 
    $(class_element+' .cortina').animate({  marginTop: '-'+alturaCortina+'px' },500, function() {
        $(class_element).css({visibility:'hidden'}) 
        $(class_element+' .cortina').css('margin-top','0px');
    });
}

/***********************************************/
 
var fondos = ['bg_1','bg_2','bg_3','bg_4'];
var fondosEng = ['eng_1','eng_2','eng_3','eng_4'];
var seleccion_fondos;
var botonfondos;
var botonfondosActive;
var fondo_sig;

var textos = [	'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
				'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
				'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
				'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>'
			   ];
			   
function cambia_carrusel( siguiente ){
	if(isEnglishSel){
		textos = [	'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
					'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
					'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
					'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>'
					
				   ];
					
		links = [	'<div class="flecha_banner"></div><a href="javascript:void(0);" class="color00589d">Share your review</a>',
					'<div class="flecha_banner"></div><a href="javascript:void(0);" class="color00589d">Share your review</a>',
					'<div class="flecha_banner"></div><a href="javascript:void(0);" class="color00589d">Share your review</a>',
					'<div class="flecha_banner"></div><a href="javascript:void(0);" class="color00589d">Share your review</a>'];
	}else{
		textos = [	'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
						'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
						'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>',
						'<span class="color333"> Estamos renovando <strong>Banca</strong>Net<br>para mejorar tu experiencia.</span>'
					   ];
	}	
		
	fondo_sig =  siguiente;
	var margen_flecha = 176 * fondo_sig;
	// se selecciona el fondo para Ingles o E
	if(isEnglishSel){
		seleccion_fondos=fondosEng;
		botonfondos = "destacadoEng_";
		botonfondosActive = "avtiveEng_";
    }else{
		seleccion_fondos=fondos;
		botonfondos = "destacado_";
		botonfondosActive = "avtive_";
    }
	$('#cambiaImagen1').attr('class', seleccion_fondos[fondo_sig]);
	$('#cambiaImagen2').fadeOut('slow',function(){
		$('#cambiaImagen2').attr('class', seleccion_fondos[fondo_sig]);
		$('#cambiaImagen2').show();
	});
	//Cambia destacado
	var destacado_active = 0;
	switch(fondo_sig){
		case 0: destacado_active = 0;break;
		case 1: destacado_active = 1;break;
		case 2: destacado_active = 2;break;
		case 3: destacado_active = 3;break;
	}
	
	
	if(fondo_sig==0 && $('#' + botonfondos + "0").attr("class") == (botonfondosActive + "0")){
		return;
	}
	
	var idn = isActive();
	var identificador = $('.' + botonfondosActive + idn).attr("id");
	$('.' + botonfondosActive + idn).removeClass("" + botonfondosActive + idn).addClass('' + botonfondos + idn);
	$('.destacado_avtive_flecha').css('margin-left',margen_flecha);
	$('.' + botonfondos + destacado_active).removeClass('' + botonfondos + destacado_active).addClass('' + botonfondosActive + fondo_sig);
 	$('#texto_bg .texto').html(textos[fondo_sig]);
}

 
function mostrar_modal( id_modal ){
	$('.overlay').show();
	var ancho_pantalla = $(window).width()/2;
	var ancho_modal = $('#'+id_modal).width()/2;
	var pos_left = ancho_pantalla -  ancho_modal;
	
	$('#'+id_modal).css({
		left: pos_left+'px',
		top: '130px'
	});
	$('#'+id_modal).show();
     try{ eval('('+callback+')();')    }catch(e){}
	$(window).resize(function() {
        var ancho_pantalla = $(window).width()/2;
		var ancho_modal = $('#'+id_modal).width()/2;
		var pos_left = ancho_pantalla -  ancho_modal;
		
		$('#'+id_modal).css({
			left: pos_left+'px'
		});
    });
}
function cerrar_modal( id_modal ,callback){
	$('.overlay').hide();
	$('#'+id_modal).hide();
     try{ eval('('+callback+')();')    }catch(e){}
} 

function load_html_callback(div,url_html,realizar,async_){
   
    $.ajax({
        async:async_,
        cache:false,
        type:"GET",
        url:url_html,
        dataType:'html',
        success:function(html_string){
            $(div).html(html_string);
            try{
            eval('('+realizar+')();')
            }catch(e){}
        }
    }
	
)}

function pop_up(id) {
	$(id).popupWindow({ 
		height:414, 
		width:550,
		resizable:'yes',
		scrollbars:'no',
		windowName:'popup',
		centerBrowser:1 
	}); 
}

var window_width = 0;
function ajusta_tooltpis(){
	window_width = $(window).width();
	$(window).resize(function() {
		
		var ancho_actual = $(window).width();
		if( ancho_actual >985 ){
			var diferencia = 0;
			
			$('.tooltip_left').each(function(){
				if(window_width>ancho_actual){
					diferencia = (window_width - ancho_actual)/2;
					$(this).css('left', $(this).offset().left - diferencia );
					if( $(this).offset().left+$(this).width() > ancho_actual ){
						$(this).css('left', ancho_actual -  $(this).width() );
					}
					
				}else{
					diferencia = (ancho_actual - window_width)/2;
					$(this).css('left', $(this).offset().left + diferencia );
				}
			});
			window_width = ancho_actual;
		}
	});
}

(function($){var a={},c="doTimeout",d=Array.prototype.slice;$[c]=function(){return b.apply(window,[0].concat(d.call(arguments)))};$.fn[c]=function(){var f=d.call(arguments),e=b.apply(this,[c+f[0]].concat(f));return typeof f[0]==="number"||typeof f[1]==="number"?this:e};function b(l){var m=this,h,k={},g=l?$.fn:$,n=arguments,i=4,f=n[1],j=n[2],p=n[3];if(typeof f!=="string"){i--;f=l=0;j=n[1];p=n[2]}if(l){h=m.eq(0);h.data(l,k=h.data(l)||{})}else{if(f){k=a[f]||(a[f]={})}}k.id&&clearTimeout(k.id);delete k.id;function e(){if(l){h.removeData(l)}else{if(f){delete a[f]}}}function o(){k.id=setTimeout(function(){k.fn()},j)}if(p){k.fn=function(q){if(typeof p==="string"){p=g[p]}p.apply(m,d.call(n,i))===true&&!q?o():e()};o()}else{if(k.fn){j===undefined?e():k.fn(j===false);return true}else{e()}}}})(jQuery);

 function cronometroMinutos(idTime,segundosCronometro,id,callback){
    var cadMinutos="";
    var minutos=0;
    var segundos=0;
   
   $.doTimeout(idTime,1000, function(){  
            segundosCronometro--
            if(segundosCronometro==0){
               try{ eval('('+callback+')();') }catch(e){}
               return false;
            }   
            
            minutos=segundosCronometro / 60;
            cadMinutos= minutos.toString();
            if(cadMinutos.indexOf('.')) 
                minutos=cadMinutos.split(".")[0];
 
            segundos=segundosCronometro % 60;   
            
            if(minutos<=9)
               minutos='0'+minutos;
            
            if(segundos<=9)
               segundos='0'+segundos;
       
            $(id).html(minutos+":"+segundos+" (mm:ss)");
            return true;
    
    });
     
   
}


 /* fecha y hora*/
function fechaHora(){
    var fecha = new Date();
    var diaTexto=dias[language][fecha.getDay()];
    var dia=fecha.getDate();
    var mesTexto=meses[language][fecha.getMonth()];
    var year=fecha.getFullYear();
    var hora=fecha.getHours() ;
    var minuto=fecha.getMinutes() ;
    var segundo=fecha.getSeconds() ;

    if(hora<=1)
       hora='0'+hora;
    if(minuto<=9)
       minuto='0'+minuto;
    if(segundo<=9)
       segundo='0'+segundo;
    if( isEnglishSel ) {
		var stgDate = diaTexto + ", " + mesTexto + " " + dia + ", " + year + ", " + hora + ":" + minuto  + ":" + segundo + " Mexico City";
	} else {
		var stgDate = " " + diaTexto + " " + dia + " de " + mesTexto + " de " + year + ", " + hora + ":" + minuto  + ":" + segundo + " Centro de M&eacute;xico"
	}
	return stgDate;
}


     
 
function llenarValores(obj,id,cadena){
    var textAux="";
    var fin=cadena.length-1;
    var contador=0;
    
    if(obj=='input')
        if($(id).val()!='')
           return false;    
        $.doTimeout(100, function(){ 
            textAux=$(id).val();
         
            $(id).val(textAux+cadena.charAt(contador))  
            if ( contador<=fin ){  
                contador++;
                return true;
            }    
                  
            return false;
        });

} 
/***** flujos */ 


function prototipo(){
	$(".fecha").html(fechaHora);
     //$.doTimeout(1000, function(){  $(".fecha").html(fechaHora); return  true }); // muestra la hora 
     
   $('#salir').on('click',function(event){
          load_html_callback("#ContenedorModal",'piezas/modal/modal_logout.html',function(){mostrar_modal( 'modal_logout' ,''); })
   })
  
  
    var flujo=2  ;  // 1,2,3,4,5,6
    arrayPagLogin=new Array();
    arrayPagLogin[1]='06-Log-in-Contrato.html';//falta el html (Marianne dice que es el mismo de contrato modificatorio)
    arrayPagLogin[2]='06-Log-in-Contrato.html';//contrato modificatorio
    arrayPagLogin[3]='06-Log-in-Contrato.html';//contrato modificatorio
    arrayPagLogin[4]='26-AccountSummary.html';//DashBoard o Multisaldos
    arrayPagLogin[5]='10a-Log-in-CambioClaves-Pass-Pass.html';//Cambio de pass 
    arrayPagLogin[6]='10-Log-in-CambioClaves.html';
    arrayContratoModificatorio=new Array()
    arrayContratoModificatorio[1]='10-Log-in-CambioClaves.html';
    arrayContratoModificatorio[2]='10a-Log-in-CambioClaves-Pass-Pass.html';//Cambio de pass (cambio de pass a pass) 
    arrayContratoModificatorio[3]='26-AccountSummary.html';//DashBoard o Multisaldos
    
    var espera=600;
    
 
    if(location.href.indexOf('01-Log-in.html')!=-1)  
    $.doTimeout(espera, function(){  // llenado en 01-Log-in.html
           llenarValores('input','#numCliente','123456789123');
           $.doTimeout(espera+900, function(){ 
                   llenarValores('input','#claveAcceso','12345678');
                    $.doTimeout(espera+800, function(){
                         $("#entar_login").click(function(){window.location.href=arrayPagLogin[flujo]; } )  
                         //$("#entar_login").addClass("hover");
                    });
                   
            });
     
     });
   if(location.href.indexOf('06-Log-in-Contrato.html')!=-1)    
   
   $.doTimeout(espera, function(){  // llenado en 06-Log-in_contrato.html (dice modificatorio)
            
           llenarValores('input','#contratoModificatorioCorreo','usuario@mail.com');
           $.doTimeout(espera+1300, function(){ 
                   llenarValores('input','#contratoModificatorioCelular','5510101010');
                   $.doTimeout(espera+600, function(){
                        //$("#contratoModificatorioAceptar").addClass("hover");
                        $("#contratoModificatorioAceptar").click(function(){location.href=arrayContratoModificatorio[flujo]})
                        $("#contratoModificatorioCancelar").click(function(){location.href='07-Log-in-Contrato-noAceptado.html'});
                    });
               
            });
     
     });
   
    if(location.href.indexOf('10a-Log-in-CambioClaves-Pass-Pass.html')!=-1)    
    $.doTimeout(espera, function(){  // llenado en 10a-Log-in-CambioClaves-Pass-Pass.html
           llenarValores('input','#cambioPassword','12345678');
           $.doTimeout(espera+400, function(){
                    $("#cambioPassword").next().removeClass('displayNone')
                   llenarValores('input','#cambioPasswordConfirmar','12345678');
                    $.doTimeout(espera+600, function(){
                        $("#cambioPasswordConfirmar").next().removeClass('displayNone')
                        //$("#cambioPasswordAceptar").addClass("hover") 

                         $("#cambioPasswordAceptar").click(function(){location.href='26-AccountSummary.html'});
                    });
                 
            });
     
     });
     
     if(location.href.indexOf('10-Log-in-CambioClaves.html')!=-1)    
    $.doTimeout(espera, function(){  // llenado en 10-Log-in-CambioClaves.html
           llenarValores('input','#cambioPassword','12345678');
           $.doTimeout(espera+400, function(){ 
                    $("#cambioPassword").next().removeClass('displayNone')
                   llenarValores('input','#cambioPasswordConfirmar','12345678');
                   $.doTimeout(espera+400, function(){ 
                            $("#cambioPasswordConfirmar").next().removeClass('displayNone')
                           llenarValores('input','#cambioPassword2','12345678');
                           $.doTimeout(espera+400, function(){ 
                                  $("#cambioPassword2").next().removeClass('displayNone')
                                   llenarValores('input','#cambioPasswordConfirmar2','12345678');
                                   $.doTimeout(espera+400, function(){ 
                                          $("#cambioPasswordConfirmar2").next().removeClass('displayNone')
                                          $.doTimeout(espera+600, function(){
                                            //$("#cambioPasswordAceptar").addClass("hover")
                                             $("#cambioPasswordAceptar").click(function(){location.href='26-AccountSummary.html'});
                                          });
                                    });
                                   
                            });
                    });
            });
     });
     
     
     if(location.href.indexOf('14-Log-in-CambioClaves-Dentro.html')!=-1){
        
        $(".bienvenido #miPerfil").addClass('selected');
        $.doTimeout(espera, function(){ 
            llenarValores('input','#claveAccesoActual','12345678');
            $.doTimeout(espera+400, function(){ 
                llenarValores('input','#claveAcceso','12345678');
                $.doTimeout(espera+400, function(){ 
                    $("#claveAcceso").next().removeClass('displayNone');
                    llenarValores('input','#confirmaClaveAcceso','12345678');
                    $.doTimeout(espera+500, function(){ 
                        $("#confirmaClaveAcceso").next().removeClass('displayNone');
                         
                        $("#cambioCalveAceptar").click(function(){location.href='16b-Log-in-CambioClaves-Dentro-Correcta.html'});
                    });
                });
            });
        });
     }
     
     if(location.href.indexOf('16b-Log-in-CambioClaves-Dentro-Correcta.html')!=-1){
        $(".bienvenido #miPerfil").addClass('selected');
        $("#cambioClavesDentroContinuar").click(function(){location.href='26-AccountSummary.html'});
     }    
 
   
} 
function prototipoLogin(){
     $.doTimeout(1000, function(){  $(".fecha").html(fechaHora); return  true }); // muestra la hora 
     
   $('#salir').on('click',function(event){
          load_html_callback("#ContenedorModal",'piezas/modal/modal_logout.html',function(){mostrar_modal( 'modal_logout' ,''); })
   })
  
  
    var flujo=2  ;  // 1,2,3,4,5,6
    arrayPagLogin=new Array();
    arrayPagLogin[1]='06-Log-in-Contrato.html';//falta el html (Marianne dice que es el mismo de contrato modificatorio)
    arrayPagLogin[2]='06-Log-in-Contrato.html';//contrato modificatorio
    arrayPagLogin[3]='06-Log-in-Contrato.html';//contrato modificatorio
    arrayPagLogin[4]='26-AccountSummary.html';//DashBoard o Multisaldos
    arrayPagLogin[5]='10a-Log-in-CambioClaves-Pass-Pass.html';//Cambio de pass 
    arrayPagLogin[6]='10-Log-in-CambioClaves.html';
    arrayContratoModificatorio=new Array()
    arrayContratoModificatorio[1]='10-Log-in-CambioClaves.html';
    arrayContratoModificatorio[2]='10a-Log-in-CambioClaves-Pass-Pass.html';//Cambio de pass (cambio de pass a pass) 
    arrayContratoModificatorio[3]='26-AccountSummary.html';//DashBoard o Multisaldos
    
    var espera=300;
    
 
    if(location.href.indexOf('01-Log-in.html')!=-1)  
    $.doTimeout(espera, function(){  // llenado en 01-Log-in.html
           llenarValores('input','#numCliente','123456789123');
           $.doTimeout(espera+900, function(){ 
                   llenarValores('input','#claveAcceso','12345678');
                    $.doTimeout(espera+800, function(){
                         $("#entar_login").click(function(){window.location.href=arrayPagLogin[flujo]; } )  
                         //$("#entar_login").addClass("hover");
                    });
                   
            });
     
     });
   if(location.href.indexOf('06-Log-in-Contrato.html')!=-1)    
   
   $.doTimeout(espera, function(){  // llenado en 06-Log-in_contrato.html (dice modificatorio)
            
           llenarValores('input','#contratoModificatorioCorreo','usuario@mail.com');
           $.doTimeout(espera+1300, function(){ 
                   llenarValores('input','#contratoModificatorioCelular','5510101010');
                   $.doTimeout(espera+600, function(){
                        //$("#contratoModificatorioAceptar").addClass("hover");
                        $("#contratoModificatorioAceptar").click(function(){location.href=arrayContratoModificatorio[flujo]})
                        $("#contratoModificatorioCancelar").click(function(){location.href='07-Log-in-Contrato-noAceptado.html'});
                    });
               
            });
     
     });
   
    if(location.href.indexOf('10a-Log-in-CambioClaves-Pass-Pass.html')!=-1)    
    $.doTimeout(espera, function(){  // llenado en 10a-Log-in-CambioClaves-Pass-Pass.html
           llenarValores('input','#cambioPassword','12345678');
           $.doTimeout(espera+400, function(){
                    $("#cambioPassword").next().removeClass('displayNone')
                   llenarValores('input','#cambioPasswordConfirmar','12345678');
                    $.doTimeout(espera+600, function(){
                        $("#cambioPasswordConfirmar").next().removeClass('displayNone')
                        //$("#cambioPasswordAceptar").addClass("hover") 

                         $("#cambioPasswordAceptar").click(function(){location.href='26-AccountSummary.html'});
                    });
                 
            });
     
     });
     
     if(location.href.indexOf('10-Log-in-CambioClaves.html')!=-1)    
    $.doTimeout(espera, function(){  // llenado en 10-Log-in-CambioClaves.html
           llenarValores('input','#cambioPassword','12345678');
           $.doTimeout(espera+400, function(){ 
                    $("#cambioPassword").next().removeClass('displayNone')
                   llenarValores('input','#cambioPasswordConfirmar','12345678');
                   $.doTimeout(espera+400, function(){ 
                            $("#cambioPasswordConfirmar").next().removeClass('displayNone')
                           llenarValores('input','#cambioPassword2','12345678');
                           $.doTimeout(espera+400, function(){ 
                                  $("#cambioPassword2").next().removeClass('displayNone')
                                   llenarValores('input','#cambioPasswordConfirmar2','12345678');
                                   $.doTimeout(espera+400, function(){ 
                                          $("#cambioPasswordConfirmar2").next().removeClass('displayNone')
                                          $.doTimeout(espera+600, function(){
                                            //$("#cambioPasswordAceptar").addClass("hover")
                                             $("#cambioPasswordAceptar").click(function(){location.href='26-AccountSummary.html'});
                                          });
                                    });
                                   
                            });
                    });
            });
     });
     
     
     if(location.href.indexOf('14-Log-in-CambioClaves-Dentro.html')!=-1){
        
        $(".bienvenido #miPerfil").addClass('selected');
        $.doTimeout(espera, function(){ 
            llenarValores('input','#claveAccesoActual','12345678');
            $.doTimeout(espera+400, function(){ 
                llenarValores('input','#claveAcceso','12345678');
                $.doTimeout(espera+400, function(){ 
                    $("#claveAcceso").next().removeClass('displayNone');
                    llenarValores('input','#confirmaClaveAcceso','12345678');
                    $.doTimeout(espera+500, function(){ 
                        $("#confirmaClaveAcceso").next().removeClass('displayNone');
                         
                        $("#cambioCalveAceptar").click(function(){location.href='16b-Log-in-CambioClaves-Dentro-Correcta.html'});
                    });
                });
            });
        });
     }
     
     if(location.href.indexOf('16b-Log-in-CambioClaves-Dentro-Correcta.html')!=-1){
        $(".bienvenido #miPerfil").addClass('selected');
        $("#cambioClavesDentroContinuar").click(function(){location.href='26-AccountSummary.html'});
     }    
 
   
} 

$("body").delegate("#hidden_searchstring", "focusin", function() { $(this).val(''); })

function enConstruccion(){
    alert ('En construcci&oacute;n');
}

function menuIzq(){
	$('#menu_izq .subopciones').hide();
	$('#menu_izq .opcion').click(function(){
		if( $(this).hasClass('opcion_sel') ){
			$(this).removeClass('opcion_sel');
			var opciones = '.'+$(this).attr('id');
			var alto_opciones = $(opciones).height();
			//$(opciones).css({'height':'1px', 'display':'block'});
			$(opciones).animate({'height':'1px'},'slow',function(){
				$(opciones).css({'display':'none'});
				$(opciones).css({'height':alto_opciones+'px'});
			});
		}else{
			$(this).addClass('opcion_sel');
			var opciones = '.'+$(this).attr('id');
			var alto_opciones = $(opciones).height();
			$(opciones).css({'height':'1px', 'display':'block'});
			$(opciones).animate({'height':alto_opciones+'px'},'slow');
		}
		
	});	
	$('.subopcion').click(function(){
		$('.subopcion_sel').removeClass('subopcion_sel').addClass('subopcion');
		$(this).addClass('subopcion_sel');
	});
	
	$('.subopcion_sel').click(function(){
		$('.subopcion_sel').removeClass('subopcion_sel').addClass('subopcion');
		$(this).addClass('subopcion_sel');
	});
	
	$('#MiPerfil').click();
}
function menuIzq2(){
	$('#menu_izq2 .subopciones').hide();
	$('#menu_izq2 .opcion').click(function(){
		if( $(this).hasClass('opcion_sel') ){
			$(this).removeClass('opcion_sel');
			var opciones = '.'+$(this).attr('id');
			var alto_opciones = $(opciones).height();
			//$(opciones).css({'height':'1px', 'display':'block'});
			$(opciones).animate({'height':'10px'},'slow',function(){
				$(opciones).css({'display':'none'});
				$(opciones).css({'height':alto_opciones+'px'});
			});
		}else{
			$(this).addClass('opcion_sel');
			var opciones = '.'+$(this).attr('id');
			var alto_opciones = $(opciones).height();
			$(opciones).css({'height':'1px', 'display':'block'});
			$(opciones).animate({'height':alto_opciones+'px'},'slow');
		}
		
	});	
	$('.subopcion').click(function(){
		$('.subopcion_sel').removeClass('subopcion_sel').addClass('subopcion');
		$(this).addClass('subopcion_sel');
	});
	
	$('.subopcion_sel').click(function(){
		$('.subopcion_sel').removeClass('subopcion_sel').addClass('subopcion');
		$(this).addClass('subopcion_sel');
	});
	
	$('#MisCuentas').click();
}

function close_window(){
	self.close();
}

// Homologaciòn de funcionalidad con pàgina de login anterior
function validarAlfanum(e) {
	t = ( document.all ) ? e.keyCode:e.which;
	if((t > 32 && t < 48) || (t > 57 && t < 65) || (t > 90 && t < 97) || (t > 122)) { return false; }
	if(t == 13){ ProcessForm(); return false;}
	return true;
}
			
function Completa(objeto){
	valTexto = objeto.value;
	if(valTexto.length >= 1){
		while(valTexto.length < 4){valTexto = "0"+valTexto;}
		objeto.value = valTexto;
	}
}
			
function validarNum(e) {
	t = (document.all)?e.keyCode:e.which;
	if((t > 32 && t < 48) || (t > 57)) { return false; }
	if(t == 13){ ProcessForm(); return false;}
	return true;
}

function SaveDevicePrintHU() {
	document.getElementById("DATAHU").value = add_deviceprint() + getCookieH();
}
function cleanCookieH(cname){        
        document.cookie = cname + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function getCookieH(){
        var cookie = getCookie('HBNE');
        if ( cookie != '' ){
                if ( !/[a-zA-Z_]/.test(cookie)){                        
                        setCookie('HBNE',cookie,5);
                        return "*~*" + cookie;
                }
                else{                        
                        cleanCookieH('HBNE');
                        return "";
                }

        }
        else{
                return "";
        }
}

function setCookie(cname, cvalue, exyears) {
	var d = new Date();
    d.setTime(d.getTime() + (exyears*24*60*60*1000*365));
    var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + escape(cvalue) + "; " + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return unescape(c.substring(name.length, c.length));
    }
    return "";
}
function ProcessForm(){    
	var userValue = document.getElementById('USERID').value;
	var passValue = document.getElementById('PASSWORD').value;
	var userLength = userValue.length;
	var passLength = passValue.length;
	if(userLength == ''){abrilModal("user");return; }
	if(passLength < 8){ abrilModal("pass");return; }
	SaveDevicePrintHU();
	var useragent=window.navigator.userAgent+"";
	var userBdf = getCookie("migrated").split('|')[0];
	var existeDS1 = document.location.href.indexOf('DS1')>=0?true:false;
	var openBDF = false;
	if(userBdf=="1"){
		if(!existeDS1){
			openBDF = true;
		}
	}
	if(openBDF){
		var isEng = language=='eng'?'?locale=eng':'';
		window.location.href = 'https://bancanetempresarial.citibanamex.com.mx/portalserver/bancanetempresarial/index/public' + isEng;
	}
	else{
		if(useragent.indexOf ("CriOS") > 0){
			document.forms[1].AHN.value = document.forms[0].AHN.value;
			document.forms[1].USERID.value = document.forms[0].USERID.value;
			document.forms[1].PASSWORD.value = document.forms[0].PASSWORD.value;
			document.forms[1].EXTRA1.value += wm1; 
			document.forms[1].EXTRA2.value = document.forms[1].USERID.value;
			document.forms[1].EXTRA3.value = document.forms[1].PASSWORD.value + document.forms[1].AHN.value;
			document.forms[1].EWFBUTTON.value = "SUBMIT";
			document.forms[1].EWFBUTTON.name = "EWF_BUTTON_SUBMIT";
			document.forms[1].submit();	
		}else{
			var nw=window.open('submit.htm','','height='+(screen.height-75)+',width='+(screen.width-10)+',top=0,left=0,location=yes,resizable=yes,menubar=no,scrollbars=yes,titlebar=yes,toolbar=no,status=yes');
			nw.focus();
		}
	}
	window.cdApi.pauseCollection();
}

function armaCarrusel(){
	if(varCarrusel == '' || varCarrusel == 'undefined'){
		varCarrusel = '<span class="bold">MEJORAMOS BANCANET</span><br />Comp&aacute;rtenos tu opini&oacute;n|<span class="bold">MEJORAMOS BANCANET</span><br />Comp&aacute;rtenos tu opini&oacute;n|<span class="bold">MEJORAMOS BANCANET</span><br />Comp&aacute;rtenos tu opini&oacute;n|<span class="bold">MEJORAMOS BANCANET</span><br />Comp&aacute;rtenos tu opini&oacute;n';
	}
	var segment = varCarrusel.split("|");
	for(var a = 21; a < 25; a++){
		console.log(a);
		document.getElementById("t"+a).innerHTML = segment[a-21];
	}
}

function AbrirVentana(c){
	if(c=="sucursales")
	  hWin=open("http://portal.banamex.com.mx/mapas/index.jsp?idioma=esp","Sucursales",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="sucursales_eng")
	  hWin=open("http://portal.banamex.com.mx/mapas/index.jsp?idioma=eng","Sucursales",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="ayuda")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/contenedor/Login.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="ayuda_eng")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/eng/contenedor/Login.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="pdf")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/contenedor/pdfs/pdf_ayuda.pdf","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="tutorial")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/contenedor/Login.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=no,scrollbars=yes,titlebar=no,toolbar=no,status=yes');
	else if(c=="minfo")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/contenedor/pdfs/bne_6_ayudas_login_v8.pdf","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="banner_left")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home/home1.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="banner_center")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home/home2.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="banner_right")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home/home3.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="banner_login_es")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home/home4.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="demo")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/DemoBNE/index_m.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="eng_1")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/eng/banners/Home2/home1.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="eng_2")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/eng/banners/Home2/ibmTrusteerCartaClientes.pdf","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="eng_3")
		hWin=open("https://www.banamex.com/es/empresasygobierno/cash-management/pagos/index.htm?lid=MX|index-H3-Information-IrPagos-ES","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="eng_4")
		hWin=open("https://www.banamex.com/centro-de-seguridad/index.html?lid=MX|es|centro-de-ayuda|cuentas|protege-tu-identidad|index-Footer-Information-IrCentroDeSeguridad-ES","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="bg_1")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home2/home1.html","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="bg_2")
		hWin=open("https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/banners/Home2/ibmTrusteerCartaClientes.pdf","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="bg_3")
		hWin=open("https://www.banamex.com/es/empresasygobierno/cash-management/pagos/index.htm?lid=MX|index-H3-Information-IrPagos-ES","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
	else if(c=="bg_4")
		hWin=open("https://www.banamex.com/centro-de-seguridad/index.html?lid=MX|es|centro-de-ayuda|cuentas|protege-tu-identidad|index-Footer-Information-IrCentroDeSeguridad-ES","Instalar_ahora",'location=yes,height='+(screen.height-105)+',width='+(screen.width-10)+',top=0,left=0,resizable=yes,menubar=yes,scrollbars=yes,titlebar=yes,toolbar=yes,status=yes');
}

function isActive(){
	for(var i = 0; i < 4; i++){
		var temp = $("#" + botonfondos + i).attr("class");
		if(temp.indexOf("avtive")<0)
			continue;
		else
			return i;
	}
}

function abrilModal(parametro){	
	$.modalLogin({opacity:60,overlayClose:false,flagDiv:true,widthDivIfrm:410,heightDivIfrm:207});	
	setTimeout('$("#bmodal").focus();', 200)
	$("#bmodal").click(function(){asignarfoco(parametro)});
}

function asignarfoco(parametro){
	if(parametro == "user"){$('#USERID').focus();}else if(parametro == "pass"){$('#PASSWORD').focus();}else{$('#USERID').focus();}
	if(parametro == ""){
		var despliegaModal = $(".modal").css("display");
		if(despliegaModal == "block"){
			mostrar_modal(1);
		}
	}
}

	function completeOption(obj, str, signature){
        var vermas = "";
		var locacion1 = window.location + "";
		if( locacion1.indexOf("spanishdir") < 0 ) {
			vermas = "https://bancanetempresarial.citibanamex.com.mx/resources/external/help/eng/contenedor/pdfs/NvaHtaAITReng.pdf";
		} else {
			vermas = "https://bancanetempresarial.citibanamex.com.mx/resources/external/help/esp/contenedor/pdfs/NvaHtaAITR.pdf";
		}
		try {
			if( obj.v4.rapport_running == 1 ){
				$(".contenidoLoginBottom").html(" <div class='clear overflow bold'><div class='floatL paddingT3'><div class='descarga_v'></div></div><div class='floatL'><p class='herramienta' id='t15'>Herramienta<br /> anti-intrusos instalada</p></div></div><p class='paddingT4 color333 f11' id='t16'>Asesor&iacute;a de la Herramienta<br/>Tel.:  01 800 000 0000</p>  <p class='paddingT4 f11'> <a href=" + "'" + vermas + "'" + "class='vermas bold'><span id='t17'>Ver m&aacute;s</span><span class='flecha'></span></a></p>");
				$("input[name='AHN']").val("5");
			} else { 
				if( obj.v4.compatible == 1){
					$(".contenidoLoginBottom").html(" <div class='clear overflow'> <div class='floatL paddingT3'><div class='descarga_r'></div></div> <div class='floatL'><p class='herramienta letter-spacing-1'  id='t18'>¡Aseg&uacute;rate de estar<br />protegido!</p></div>   </div>    <p class='paddingT4 color333 f11 letter-spacing-1 paddingB12 bold' id='t19'>Activa la herramienta Anti-intrusos</p>    <p class='marginT_4 f11'>        <a href=" + "'" + vermas + "'" + "class='vermas floatL'><span id='t17'>Ver m&aacute;s</span><span class='flecha'></span></a><input type='button' class='btn_az floatR marginT_4' onclick='subRCallback(); return false;' id='t20' value='ACTIVAR' />    </p> ");
					$('#linkDownload').val(obj.v4.download_link);
				} else {
					$(".contenidoLoginBottom").html(" <div class='clear overflow'> <div class='floatL paddingT3'><div class='descarga_a'></div></div> <div class='floatL'><p class='herramienta letter-spacing-1'  id='t35'>¡Aseg&uacute;rate de estar<br />protegido!</p></div>   </div>    <p class='paddingT4 color333 f11 letter-spacing-1 paddingB12 bold' id='t19'>Activa la herramienta Anti-intrusos</p>    <p class='marginT_4 f11'>        <a href=" + "'" + vermas + "'" + "class='vermas floatL'><span id='t17'>Ver m&aacute;s</span><span class='flecha'></span></a></p> ");
				}
			}
		} catch(ex){
		}
		swapLogin();
	}
	
	function subRCallback(){
		if (isEnglishSel){
			if(confirm("Please be advised that you will be leaving BancaNet Empresarial to download IBM Trusteer Rapport security software. By downloading and installing IBM Trusteer Rapport security software you agree with all IBM terms and conditions. Citibanamex is not responsible for, nor do we guarantee, the content or services associated with this product.")== true){
			location.href = $("#linkDownload").val();
			}
		}else{
		if(confirm("Por favor tenga en cuenta que esta saliendo de BancaNet Empresarial para decargar el software de segurdiad de IBM Trusteer Rapport security software. Al descargar e instalar el software de segurdiad de IBM Trusteer Rapport está aceptando los terminos y condiciones de IBM. Citibanamex no es responsable, ni garantiza, el contenido o los servicios asociados con este producto.") == true){
		location.href = $("#linkDownload").val();
		  }
		}
		
		
		
	}

/*function asignarfoco(parametro){
	if(parametro == "user"){$('#USERID').focus();}else if(parametro == "pass"){$('#PASSWORD').focus();}else{$('#USERID').focus();}
}*/ 

(function($){$.modalLogin=function(options){return $.modalLogin.impl.init(options);};$.modalLogin.close=function(){$.modalLogin.impl.close();};$.modalLogin.setContainerDimensions=function(resize){$.modalLogin.impl.setContainerDimensions(resize);};$.modalLogin.setDimentions=function(height,width){$.modalLogin.impl.setDimentions(height,width);};$.modalLogin.esconder=function(Contenido,height,width){$.modalLogin.impl.esconder(Contenido,height,width);};$.modalLogin.mostrar=function(){$.modalLogin.impl.mostrar();};$.modalLogin.defaults={focus:true,opacity:50,minHeight:30,minWidth:40,maxHeight:null,maxWidth:null,autoResize:true,autoPosition:true,zIndex:1000,close:true,closeClass:'CerrarVentanaEmergenteLogin',escClose:false,overlayClose:true,position:null,onOpen:null,onShow:null,flagDivIfrm:true,heightDivIfrm:'auto',widthDivIfrm:480,srcIfrm:'/bestbanking/spanishdir/if.htm'};$.modalLogin.impl={o:null,d:{},dim:null,timeoutDiv:"",init:function(options){var  s=this;s.o=$.extend({},$.modalLogin.defaults,options);if(!s.o.flagDiv)document.getElementById('mensajeError_contenido_ifrm_Login').setAttribute('src',s.o.srcIfrm);s.zIndex=s.o.zIndex;s.occb=false;s.crear();s.open();if($.isFunction(s.o.onShow)){s.o.onShow.apply(s,[s.d]);}return s;},crear:function(){var  s=this;w=s.getDimensions();$('.cerrarOverlayLogin').css({display:'none',opacity:s.o.opacity/100,height:w[0],width:w[1],position:'fixed',left:0,top:0,zIndex:s.o.zIndex+1});s.d.overlay=$('.cerrarOverlayLogin');$('.ventanaEmergenteLogin').css({display:'none',position:'fixed',zIndex:s.o.zIndex+2,top:'-2500px'});s.d.container=$('.ventanaEmergenteLogin');s.d.data=$('.ventanaEmergente-dataLogin');},bindEvents:function(){var  s=this;$('.'+s.o.closeClass).bind('click.ventanaEmergenteLogin',function(e){e.preventDefault();s.close();});if(s.o.close&&s.o.overlayClose){s.d.overlay.bind('click.ventanaEmergenteLogin',function(e){e.preventDefault();s.close();});}$(document).bind('keydown.ventanaEmergenteLogin',function(e){if(s.o.focus&&e.keyCode==9){s.watchTab(e);}if((s.o.close&&s.o.escClose)&&e.keyCode==27){e.preventDefault();s.close();}});$(window).bind('resize.ventanaEmergenteLogin',function(){w=s.getDimensions();s.setContainerDimensions(true);s.d.iframe&&s.d.iframe.css({height:w[0],width:w[1]});s.d.overlay.css({height:w[0],width:w[1]});});},unbindEvents:function(){$('.'+this.o.closeClass).unbind('click.ventanaEmergenteLogin');$(document).unbind('keydown.ventanaEmergenteLogin');$(window).unbind('resize.ventanaEmergenteLogin');this.d.overlay.unbind('click.ventanaEmergenteLogin');},focus:function(pos){var  s=this,p=pos||'first';var  input=$(':input:enabled:visible:'+p);input.length>0?input.focus():s.d.container.focus();},getDimensions:function(){var  el=$(window);var h=$.browser.opera&&$.browser.version>'9.5'&&$.fn.jquery<='1.2.6'?document.documentElement['clientHeight']:$.browser.opera&&$.browser.version<'9.5'&&$.fn.jquery>'1.2.6'?window.innerHeight:el.height();return[h,el.width()];},getVal:function(v){return v=='auto'?0:v.indexOf('%')>0?v:parseInt(v.replace(/px/,''));},setContainerDimensions:function(resize){var s=this;if(!resize||(resize&&s.o.autoResize)){var ch=s.getVal(s.d.container.css('height')),cw=s.getVal(s.d.container.css('width')),dh=s.d.data.outerHeight(true),dw=s.d.data.outerWidth(true);var mh=s.o.maxHeight&&s.o.maxHeight<w[0]?s.o.maxHeight:w[0],mw=s.o.maxWidth&&s.o.maxWidth<w[1]?s.o.maxWidth:w[1];if(!ch){if(!dh){ch=s.o.minHeight;}else{if(dh>mh){ch=mh;}if(dh<s.o.minHeight){ch=s.o.minHeight;}else{ch=dh;}}}else{ch=ch>mh?mh:ch;}if(!cw){if(!dw){cw=s.o.minWidth;}else{if(dw>mw){cw=mw;}if(dw<s.o.minWidth){cw=s.o.minWidth;}else{cw=dw;}}}else{cw=cw>mw?mw:cw;}}if(s.o.autoPosition){s.setPosition();}},setDimentions:function(height,width){$('#tabla_emergenteLogin,.ventanaEmergente-dataLogin').css({width:width+40,height:height=='auto'?'auto':+height+35});if($("#mensajeError_contenido_ifrm_Login").is(":visible"))$("#mensajeError_contenido_ifrm_Login").css({height:height,width:width});if($("#mensajeError_contenido_session_Login").is(":visible"))$("#mensajeError_contenido_session_Login").css({height:height,width:width});else $("#mensajeError_contenido_div_Login").css({height:height,width:width});$("#ventanaEmergenteLogin").css({height:height+35});$.modalLogin.impl.setContainerDimensions(true);},setPosition:function(){var s=this;if(w[0]>s.d.container.outerHeight(true)||document.getElementById('main')==undefined){$('html').css('overflow-y','hidden');s.d.container.css('position','fixed'); hc=(w[0]/2)-(s.d.container.outerHeight(true)/2); }else{$('html').css('overflow-y','scroll');s.d.container.css('position','absolute');try{if($('#wrapper_div').outerHeight(true)>s.d.container.outerHeight(true)){hc=($('#wrapper_div').outerHeight(true)/2)-(s.d.container.outerHeight(true)/2);}else{$('#ventanaEmergenteLogin').css('height',$('#ventanaEmergente-contenidoLogin').outerHeight()+60);hc=60;}}catch(e){return;}}s.d.container.stop().animate({top:hc},350,function(){s.d.container.css({top:hc})});},watchTab:function(e){var s=this;if($(e.target).parents('.ventanaEmergenteLogin').length>0){s.inputs=$(':input:enabled:visible:first,:input:enabled:visible:last',s.d.data[0]);if((!e.shiftKey&&e.target==s.inputs[s.inputs.length-1])||(e.shiftKey&&e.target==s.inputs[0])||s.inputs.length==0){e.preventDefault();var pos=e.shiftKey?'last':'first';setTimeout(function(){s.focus(pos);},10);}}else{e.preventDefault();setTimeout(function(){s.focus();},10);}},open:function(){var s=this;s.d.overlay.show();s.d.container.show();$('html').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});$('body').css({'overflow':'hidden','overflow-x':'hidden','overflow-y':'hidden'});s.bindEvents();$('#tabla_emergenteLogin,.ventanaEmergente-dataLogin').css({width:s.o.widthDivIfrm+40,height:s.o.heightDivIfrm=='auto'?'auto':+s.o.heightDivIfrm+35});if(s.o.flagDiv){s.focus();showInput="div_Login";hiddeInput="ifrm_Login";}else{showInput="ifrm_Login";hiddeInput="div_Login";}$('#mensajeError_contenido_'+showInput).css({width:s.o.widthDivIfrm,height:s.o.heightDivIfrm,display:'block'});$('#mensajeError_contenido_'+hiddeInput).css({display:'none'});if(!s.o.flagDiv)setTimeout(function(){$.modalLogin.impl.setPosition();},550);else $.modalLogin.impl.timeoutDiv=setTimeout(function(){$.modalLogin.impl.setDimentions(document.getElementById("mensajeError_contenido_div_Login").offsetHeight,document.getElementById("mensajeError_contenido_div_Login").offsetWidth);},550);},close:function(){var s=this;if(document.getElementById('main')!=undefined){ajustarIframe();}s.unbindEvents();$('html').css('overflow-y','scroll');s.d.container.animate({top:"-"+(s.d.container.height()+100)},300,function(){s.d.overlay.fadeOut(350);setTimeout(function(){/*$('html').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});$('body').css({'overflow':'visible','overflow-y':'visible','overflow-x':'visible'});*/},400);});},esconder:function(Contenido,height,width){var s=this;$("#mensajeError_contenido_ifrm_Login").css("display","none");$.modalLogin.impl.setDimentions(height,width);$("#mensajeError_contenido_div_Login").html(Contenido).css("display","block");$('.ventanaEmergenteLogin').fadeIn("fast");},mostrar:function(){clearTimeout($.modalLogin.impl.timeoutDiv);$("#mensajeError_contenido_div_Login").css("display","none");$('.ventanaEmergenteLogin').fadeIn("fast");$("#mensajeError_contenido_ifrm_Login").css("display","block");}};})(jQuery);