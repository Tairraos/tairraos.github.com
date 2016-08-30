'use strict';
var url = location.href;
location.href = url.replace(/:55555/, '/Workspace').replace(/_ijt=[a-z0-9]+/, '').replace(/\?$/, '');
