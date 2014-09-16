/**
 * Created by Bryan on 8/30/2014.
 */
"use strict";
(function () {
    $(document).ready(function() {

        // Verify version
        var versionFile = "JSON/version.json",
            currVersion,
            storedVersion;

        $.getJSON(versionFile, function(data){
            currVersion = data.version;
            var storage = $.localStorage;
            storedVersion = storage.get('version');
            if (currVersion !== storedVersion) {
                storage.set('version', currVersion);
                location.reload();
            }
        });

        $("h2").each(function() {
            var imgTxt = this.innerHTML,
                altTxt = imgTxt + ' test results',
                titleTxt = 'Click to see ' + imgTxt + ' test results';
            $(this).attr('title', titleTxt)
                .next().attr( {'alt': altTxt, 'title': altTxt });

            //alert(imgTxt);
        });

        $("h2").click(function() {
            //$("img").slideUp(250);
            $(this).next().slideToggle(400);
        });

        $("#floating_main_link").fadeTo(200, 1).delay(2500).fadeTo(600, 0.2).click(function(){
            window.open("../index.php", "_self");
        }).hover(
            function() {
                $(this).stop().fadeTo(600, 1);
            },
            function() {
                $(this).stop().fadeTo(600, 0.2);
            }
        );

    })
})();
