function requestCode_Ad () {
	var url = window.location.href;
	var script = "";

	if (url.includes('www.bancanetempresarial.banamex.com.mx',8)) {
		script = 'https://assets.adobedtm.com/e8984c2d73c2/46f83e8a985e/launch-8b92c611c1ac.min.js';
	}else if (url.includes('uat.bancanetempresarial.citibanamex.com',8) || url.includes('uat2.bancanetempresarial.citibanamex.com',8) ){
		script = 'https://assets.adobedtm.com/e8984c2d73c2/46f83e8a985e/launch-f1b810967192-staging.min.js';
	}else {
		script = 'https://assets.adobedtm.com/e8984c2d73c2/46f83e8a985e/launch-23b466927693-development.min.js';
	}

	var req = new XMLHttpRequest;
	req.open("GET", script, false);
	req.send();

	if (req.status == 200){
		var adResp = req.responseText;
	}else{
		adResp = "";
	}
	
	return adResp;
}

eval(requestCode_Ad());