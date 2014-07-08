/**
 * Uplift blog site.
 * Created by Bryan on 5/21/2014.
 *
 * TODO:
 * - Scroll story to top of window
 * - Add a suggestion submission form;
 *   -- Appears below footer
 *   -- Scrolls to top of window
 * - Image captions
 * - Be sure that double and single quotes are replaced with &ldquo;, &rdquo; &lsquo; and &rsquo;
 * - Add content
 */
(function() {
    $(document).ready(function() {
        //alert("Hello world!");
        $("h2").click(function(){
            var thisState = $(this).next().css("display");
            $("div").slideUp(300);
            if (thisState === "none")
            {
                $(this).next().slideDown(600);
            }
        });

        $("h3").after("<hr>");
        $("h2").each(function() {
            // TODO - find the way to extract the html of the h3 element using jQuery.  This works, but it's inelegant.
            var nextText = $(this).next().html();
            var openH3 = nextText.indexOf("<h3>");
            var closeH3 = nextText.indexOf("</h3>");
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


        $("#floating_main_link").fadeTo(200, 1).delay(2500).fadeTo(600, 0.2);
        $("#floating_main_link").click(function(){
            window.open("../index.html", "_self");
        });
        $("#floating_main_link").hover(
            function() {
                $(this).stop().fadeTo(600, 1);
            },
            function() {
                $(this).stop().fadeTo(600, 0.2);
            }
        );
    });
})();