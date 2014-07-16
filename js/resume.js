/**
 * Created by Bryan on 5/30/2014.
 * TODO
 *  - Investigate a way to make the toc tabs float with scrolling (fixed) but then snap to a position when a link is
 *    clicked, as they do presently.
 *    ! - See if I can work around the problems with this by using window.scrollTo(x, y)
 */
"use strict";
(function (){
    $(document).ready(function() {

        var scrolling = false,
            tocOpen = false;

        $("#toc_tab").click(function() {
            $("#toc").stop().toggle(500);
        });

        $("#toc").click(function() {
            $(this).hide();
        });

        $("#toc a").click(function() {
            var sectionOffset = 0,
                tocTabTop;
            var id = "#" + $(this).attr("data-id");
            if (id !== "#top") {
                //sectionOffset = 0; //145;
                //scrolling = true;
                //window.scrollTo(0,0);
            //} else {
                sectionOffset = $(id).next().offset().top;
            }
            //alert($("#toc_tab").css("position"));

            //$("#toc_tab").css("top", sectionOffset).css("position", "absolute");
            //$("#toc").css("top", sectionOffset).css("position", "absolute");
            sectionOffset = sectionOffset === 0 ? 0 : sectionOffset - 40;
            scrolling = true;
            window.scrollTo(0, sectionOffset);
            var divHeight = $("#tabs").height();
            var displayHeight = $(window).height();
            if (sectionOffset > 0) {

                //if (sectionOffset > displayHeight) {
                //    var tocTop = displayHeight - (divHeight - sectionOffset) + 20;
                //} else
                //if ((displayHeight - sectionOffset) < 140) {
                if (displayHeight - (divHeight - sectionOffset) > displayHeight) {
                    var tocTop = displayHeight - (divHeight - sectionOffset) + 10;
                    // The next line is a bit of a hack; the formula above needs to be adjusted...
                    //tocTop = tocTop < 45 ? 45 : tocTop;
                } else {
                    //sectionOffset = $(id).offset().top;
                    //tocTop = (displayHeight - sectionOffset); // + 45;
                    tocTop = displayHeight - (divHeight - sectionOffset) + 10;
                    tocTop = tocTop < 45 ? 45 : tocTop;
                }
            } else {
                tocTop = 145;
            }
            if ((divHeight - sectionOffset) < $("#toc").height()) {
                tocTabTop = tocTop;
                tocTop = displayHeight - $("#toc").height();
            } else {
                tocTabTop = tocTop;
            }
            $("#toc_tab").css("top", tocTabTop);
            $("#toc").css("top", tocTop);

            $("#toc").hide();
            tocOpen = false;
            return false;
        });

        $("#resume_tab").click(function(evt) {
            //$("#toc").hide();
            if (tocOpen)  {
                $("#toc").hide();
                tocOpen = false;
            }
            if ($("#toc").is(":visible")) {
                tocOpen = true;
            };
            //alert("Status:" + status);
            //if (status) {$("#toc").hide();}
            //evt.preventDefault();
        });

        $("#portfolio_thumbnails img").each(function() {
            var altTag = $(this).attr("alt");
            $(this).after("<figcaption>" + altTag + "</figcaption>");
            //alert(altTag);
        });

        /* The problem with this code is that it runs as soon as a link is clicked and before the document is
         * refreshed in its new position.  Need to figure out how to run only after...*/

         $(document).scroll(function() {
            if (scrolling) {
                scrolling = false;
            } else {
                var docScrollTop = $(document).scrollTop();
                if (docScrollTop === 0) {
                    if ($("#toc_tab").css("top") !== "145px") {
                        $("#toc_tab").css("top", 145);
                        $("#toc").css("top", 145);
                    }
                } else if (docScrollTop > 145) {
                    $("#toc_tab").css("top", 45);
                    $("#toc").css("top", 45);
                }
            }
        });

    });
})();
