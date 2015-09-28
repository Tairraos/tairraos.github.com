/**
 * BYHH勾选WebRip
 */
(function ($) {
    var t = $('#username').val();
    $('td.magTitle').each(function () {
        var h = $('a[target=_blank]', $(this)).attr('href');
        if (h.match(t) && h.match(/webrip/i)) {
            $('input', $(this)).get(0).checked = true;
        }
    });
}(jQuery));



/**
 * AMAZON批量删除云端kindle图书
 */
(function () {
    if (!/PersonalDocuments/.test(document.URL)) {
        window.alert("The script can only work in Personal Documents!");
    } else {
        var a = document.getElementsByClassName('rowBodyCollapsed'),
            b = document.getElementsByName('checkboxForDelete'), i, tmp;
        if (!b.length) {
            document.getElementById('Row1Button').innerHTML += "<a href='javascript:(function(){for(var i=0;i<b.length;i++){b[i].checked=true;};})();'>All</a><a href='javascript:(function(){for(var i=0;i<b.length;i++){b[i].checked=false;};})();'> None</a><a href='javascript:(function(){for(var i=0;i<b.length;i++){b[i].checked=!b[i].checked;};})();'> Reverse</a>";
            for (i = 0; i < a.length; i++) {
                tmp = document.getElementById('Row' + (i + 1) + 'Button');
                tmp.innerHTML += "<input type='checkbox' name='checkboxForDelete' >";
            }
        } else {
            for (i = 0; i < b.length; i++) {
                if (b[i].checked) {
                    window.Fion.deleteItem('deleteItem_' + a[i].getAttribute('asin'));
                }
            }
        }
    }
}());
