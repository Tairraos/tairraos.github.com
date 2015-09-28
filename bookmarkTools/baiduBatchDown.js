var links = [
        'ed2k://|file|福尔摩斯：演绎法.Elementary.S03E10.mp4|259751958|20714d1dfa5a76b2a426c7dbf48374b5|h=jgl5gx26icwqf2b3ofa2bdrfldusjqm6|/'
    ],
    btnDown = $('#_disk_id_24');

function doDown() {
    if ($('.offlinelist-dialog').css('display') === 'block') {
        var link = links.pop();
        if (link) {
            btnDown.click();
            setTimeout(function () {
                var inputUrl = $('#share-offline-link'),
                    btnOk = $('#_disk_id_28');
                inputUrl.val(link);
                btnOk.click();
            }, 100);
        }
    }
    setTimeout(function () {
        doDown();
    }, 200);
}

doDown();
