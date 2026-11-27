// func
function ringo_do_xss_encode(data) {
    return String(data ?? '').replace(/&/g, '&amp;').replace(/'/g, '&#x27;')
        .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function ringo_do_url_encode(data) {
    return encodeURIComponent(data);
}

// API compatibility: current GopenNAMU returns {response, data}.
function vision_api_data(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || (payload.response && payload.response !== 'ok')) throw new Error('API response error');
    return payload.data;
}

function vision_fetch(url) {
    return fetch(url).then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    });
}

function vision_list(id, data) {
    const list = document.getElementById(id);
    if (list) list.innerHTML = data || '<li>표시할 항목이 없습니다.</li>';
}

function vision_error(id) {
    vision_list(id, '<li>API를 불러오지 못했습니다!</li>');
}

// event
vision_user_info();
function vision_user_info() {
    const name = document.getElementById('sidebar-0-name1');
    const target = document.getElementById('sidebar-0-name3');
    if (!name || !target) return;
    vision_fetch("/api/user_info/" + encodeURIComponent(name.textContent.trim())).then(function(payload) {
        let data = vision_api_data(payload);
        if (Array.isArray(data)) data = data[0];
        if (data && data.level != null && data.exp != null && data.max_exp != null) {
            target.textContent = data.level + ' (' + data.exp + ' / ' + data.max_exp + ')';
        }
    }).catch(function() {
        // User level is optional.
    });
}

ringo_do_side_button_1();
function ringo_do_side_button_1() {
    vision_fetch("/api/recent_change/14").then(function(payload) {
        let text = vision_api_data(payload);
        if (!Array.isArray(text)) throw new Error('Invalid list');
        let data = '';
        for(let for_a = 0; for_a < text.length && for_a < 14; for_a++) {
            if(text[for_a][6] === '') {
                data += '<li><a class="recent-item" href="/w/'+ ringo_do_xss_encode(text[for_a][1]) + '">';
                data += '<span class="recent-time">' + ringo_do_xss_encode(text[for_a][2].slice(11, -3)) + '</span>';
                data += '<span class="recent-title">' + ringo_do_xss_encode(text[for_a][1]) + '</span></a></li>';
            } else {
                data += '<li>[관리자에 의해 숨겨진 역사입니다!]</li>';
            }
        }
        vision_list('sidebar-1-list', data);
    }).catch(function(error) {
        vision_error('sidebar-1-list');
    });
}

ringo_do_side_button_2();
function ringo_do_side_button_2() {
    vision_fetch("/api/v2/bbs/recent/-1/10").then(function(payload) {
        let text = vision_api_data(payload);
        if (!Array.isArray(text)) throw new Error('Invalid list');
        let data = '';
        for(let for_a = 0; for_a < text.length && for_a < 6; for_a++) {
            data += '<li><a class="recent-item" href="/bbs/w/-1/' + ringo_do_url_encode(text[for_a][3]) + '">';
            data += '<span class="recent-time">' + ringo_do_xss_encode(text[for_a][2].slice(11, -3)) + '</span>';
            data += '<span class="recent-title">' + ringo_do_xss_encode(text[for_a][1]) + '</span></a></li>';
        }
        vision_list('sidebar-2-list', data);
    }).catch(function(error) {
        vision_error('sidebar-2-list');
    });
}

ringo_do_side_button_3();
function ringo_do_side_button_3() {
    vision_fetch("/api/v2/bbs/main").then(function(payload) {
        let text = vision_api_data(payload);
        if (!Array.isArray(text)) throw new Error('Invalid list');
        let data = '';
        for(let for_a = 0; for_a < text.length && for_a < 6; for_a++) {
            data += '<li><a class="recent-item" href="/bbs/w/' + ringo_do_url_encode(text[for_a]["set_id"]) + '/' + ringo_do_url_encode(text[for_a]["set_code"]) + '">';
            data += '<span class="recent-time">' + ringo_do_xss_encode(text[for_a]["date"].slice(11, -3)) + '</span>';
            data += '<span class="recent-title">' + ringo_do_xss_encode(text[for_a]["title"]) + '</span></a></li>';
        }
        vision_list('sidebar-3-list', data);
    }).catch(function(error) {
        vision_error('sidebar-3-list');
    });
}

ringo_do_side_button_4();
function ringo_do_side_button_4() {
    vision_fetch("https://namgall.wikiing.in/api/open_recent_changes").then(function(payload) {
        let text = vision_api_data(payload);
        if (!Array.isArray(text)) throw new Error('Invalid list');
        let data = '';
        for(let for_a = 0; for_a < text.length && for_a < 8; for_a++) {
            data += '<li><a class="recent-item" href="'+ text[for_a][8] + ringo_do_xss_encode(text[for_a][1]) + '">';
            data += '<span class="recent-time">' + ringo_do_xss_encode(text[for_a][2].slice(11, -3)) + '</span>';
            data += '<span class="recent-title">' + "[" + ringo_do_xss_encode(text[for_a][7]) + "] " + ringo_do_xss_encode(text[for_a][1]) + '</span></a></li>';
        }
        vision_list('sidebar-4-list', data);
    }).catch(function(error) {
        vision_error('sidebar-4-list');
    });
}

if(window.location.pathname.toLowerCase() === '/license') {
    function vision_license_info(url, id, key) {
        vision_fetch(url).then(function(info) {
            if (Array.isArray(info)) info = info[0];
            const target = document.getElementById(id);
            if (target && info && info[key] != null) target.textContent = "Version:" + info[key];
        }).catch(function() {});
    }
    vision_license_info("/api/version", "openNAMU_ver", "version");
    vision_license_info("/api/skin_info", "Vision_ver", "skin_ver");
}

// Dropdown
$( function () {
	'use strict';
	$( '.dropdown' ).on( 'show.bs.dropdown', function () {
		$( this ).find( '.dropdown-menu' ).first().stop( true, true ).fadeToggle( 200 );
	} );

	$( '.dropdown' ).on( 'hide.bs.dropdown', function () {
		$( this ).find( '.dropdown-menu' ).first().stop( true, true ).fadeToggle( 200 );
	} );

	$( '.btn-group' ).on( 'show.bs.dropdown', function () {
		$( this ).find( '.dropdown-menu' ).first().stop( true, true ).fadeToggle( 200 );
	} );

	$( '.btn-group' ).on( 'hide.bs.dropdown', function () {
		$( this ).find( '.dropdown-menu' ).first().stop( true, true ).fadeToggle( 200 );
	} );
} );