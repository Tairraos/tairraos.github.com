(function ($) {
    'use strict';
    var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
    var observer = new MutationObserver(beautiSource);
    observer.observe(document.getElementById('sourceDiv'), {
        'childList': true
    });

    function beautiSource() {
        var trClass = '';
        $('#sourceTable tr').each(function () {
            var td = $('td', this);
            if (td.eq(2).hasClass('r') || td.eq(1).hasClass('r')) {
                trClass = 'no-covered';
            } else if (td.eq(2).hasClass('g') || td.eq(1).hasClass('g')) {
                trClass = 'covered';
            } else if (td.eq(3).text() === '') {
                trClass = '';
            }
            $(this).addClass(trClass);
        });
    }

    beautiSource();
}(jQuery));
