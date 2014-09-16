/**
 * Created by Bryan on 8/30/2014.
 */
"use strict";
(function () {
    $(document).ready(function() {
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
