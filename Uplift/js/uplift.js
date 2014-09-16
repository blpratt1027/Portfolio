/**
 * Uplift blog site.
 * Created by Bryan on 5/21/2014.
 *
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

        $("h2").click(function(){
            var thisState = $(this).next().css("display");
            $("div").slideUp(300);
            if (thisState === "none")
            {
                $(this).next().slideDown(600, function() {
                    var sectionOffset = $(this).offset().top;
                    window.scrollTo(0, sectionOffset);
                });
            }
        });

        $("h3").after("<hr>");
        $("h2").each(function() {
            var nextText = $(this).next().html(),
                openH3 = nextText.indexOf("<h3>"),
                closeH3 = nextText.indexOf("</h3>"),
                titleText = nextText.slice(openH3 + 4, closeH3);
            $(this).attr("title", titleText);
        });
        $("div").append('<p class="soft center"><span class="close" title="Click here to close this story..."> - Close - </span></p>');
        $("p:last").remove();
        $(".close").click(function() {
            $("div").slideUp(600);
        });
        var d = new Date();
        $("#year").text(d.getFullYear());


        $("#floating_main_link").fadeTo(300, 1).delay(2500).fadeTo(600, 0.2)
            .click(function(){
            window.open("../index.php", "_self");
            })
            .hover(
            function() {
                $(this).stop().fadeTo(600, 1);
            },
            function() {
                $(this).stop().fadeTo(600, 0.2);
            }
        );
    });
})();