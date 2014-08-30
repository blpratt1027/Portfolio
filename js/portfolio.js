/* Portfolio Main page *
 * Created by Bryan on 5/29/2014.
 *
 * TODO
 *  - Remove unused images
 */
(function() {
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

        $("#tabs").tabs();

        $(".tab-id").click(function() {
            tabHeight();
        });

        tabHeight("port");

        $(window).keyup(function(evt) {
            if (evt.which === 113) {
                $("#show_count").show();
            }
        });

        $("#images_wrapper img").each(function() {
            var altTag = $(this).attr("alt");
            if (altTag !== undefined) {
                $(this).after("<figcaption>" + altTag + "</figcaption>");
            }
        });

        $("h4").click(function() {
            var text = $(this).next();
            text.slideToggle();
        });

        $(".description-text").click(function(){
            $(this).slideUp();
        });

        $("#show_count").click(function() {
            $(this).hide();
        });

        window.onresize = tabHeight;

        function tabHeight() {
            var tabHeight,
                tabID = $("#tabs").tabs('option', 'active');  /* Thanks to 'Contra' on StackOverflow for this code for
                                                                 finding the active tab! */
            if (tabID === 0) {
                var winWidth = $(window).width();
                var imgPerRow = Math.floor((winWidth - 79) / 268);
                var rows;
                switch (imgPerRow) {
                    case 5:
                        rows = 1;
                        break;
                    case 4:
                    case 3:
                        rows = 2;
                        break;
                    case 2:
                        rows = 3;
                        break;
                    case 1:
                    case 0:
                        rows = 5;
                        break;
                    default:
                        rows = 1;
                        break;
                }
                tabHeight = (rows * 316) + 150;
            } else if (tabID === 1) {
                tabHeight = $("#resume_content").height() + 80;
            } else {
                tabHeight = $("#contact_tab").height() + 80;
            }
            $("#tabs").css("height", tabHeight);
        }
    });
})();