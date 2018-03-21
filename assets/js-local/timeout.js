var timeout = document.querySelector('#timeout');
var refresh = document.querySelector('#timeout-refresh');
var minutes = document.querySelector('#timeout-expires');
var intID = setInterval(function(){
  var exp = Date.parse(expires);
  if(exp - Date.now() > 5 * 60 * 1000) {
    // more than 5 minutes left
  } else if (exp - Date.now() > 0) {
    timeout.className = '';
    var m = Math.ceil( (exp - Date.now() )/60/1000);
    var html = m 
    if(lang != 'cy') {
      html += ' minute';
      if(m !== 1) html += 's';
    }
    minutes.innerHTML = html;
  } else {
    document.location = '/session-timeout';
  }
}, 1000);
