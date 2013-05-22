// ==UserScript==
// @name	Crafting synergy
// @description	Adds the corresponding discoveries to the regular crafting pages and vice-versa
// @include	*www.kingdomofloathing.com/craft.php*
// ==/UserScript==

/**
 * Sends an XML HTTP Request
 * @param {object} data         Any data necessary to build the request
 **/
function request(data){
    var x = new XMLHttpRequest();
    x.open (data.method, data.url, false);
    x.onreadystatechange= function (){
        if (this.readyState == 4){
            data.onload.apply(this, [this, data]);
        }
    };
    x.send();
}
/**
 * Gets the url "search" params as an associative array
 * @return {array}              An associative array of search params
 **/
function getSearch(){
	var data = window.location.search.substr(1).split('&');
	var values = [];
	for(var i = data.length; i--;){
		var dat = data[i].split('=');
		values[decodeURIComponent(dat[0])] = decodeURIComponent(dat[1]);
	}
	return values;
}



var srch = getSearch();

// Add the miscellaneous link to the top section
document.querySelector('font[size="2"]').innerHTML += '&nbsp;[<a href="/craft.php?mode=discoveries&what=multi">miscellaneous</a>]';
if (srch['mode'] == 'multi' || srch['what'] == 'multi'){
	return;
}

if (srch['mode'] == 'discoveries' || srch['action'] == 'craft'){
	request({
		'url':'/craft.php?mode='+(srch['what'] || srch['mode']),
		'method': 'POST',
		'onload': function (){
			var div = document.createElement('div');
			div.innerHTML = this.responseText;
			var create = div.querySelectorAll('center > table[width="95%"]');
			var parent = document.querySelector('center');
			var nextNode = document.querySelector('center > center:last-child');
			for(var i = 1, l = create.length; i < l; i++){
				create[i].parentNode.removeChild(create[i]);
				parent.insertBefore(create[i], nextNode);
			}
		}
	});
}else {
	request({
		'url':'/craft.php?mode=discoveries&what='+srch['mode'],
		'method': 'POST',
		'onload': function (){
			var div = document.createElement('div');
			div.innerHTML = this.responseText;
			var discoveries = div.querySelector('center table+center table');
			discoveries.parentNode.removeChild(discoveries);
			document.querySelector('center').appendChild(discoveries);
		}
	});
}
