/**
 * Created by Bryan on 5/30/2014.
 */
"use strict";
(function (){
    $(document).ready(function() {

        var scrolling = false,
            tocOpen = false,
            tableOfContents = $("#toc"),
            tocTab = $("#toc_tab");

        tocTab.click(function() {
            tableOfContents.stop().toggle(500);
        });

        tableOfContents.click(function() {
            $(this).hide();
        });

        $("#toc a").click(function() {
            var sectionOffset = 0,
                tocTabTop,
                id = "#" + $(this).attr("data-id");
            if (id !== "#top") {
                sectionOffset = $(id).next().offset().top;
            }

            sectionOffset = sectionOffset === 0 ? 0 : sectionOffset - 40;
            scrolling = true;
            window.scrollTo(0, sectionOffset);
            var divHeight = $("#tabs").height(),
                displayHeight = $(window).height(),
                tocTop;
            if (sectionOffset > 0) {
                if (displayHeight - (divHeight - sectionOffset) > displayHeight) {
                    tocTop = displayHeight - (divHeight - sectionOffset) + 10;
                } else {
                    tocTop = displayHeight - (divHeight - sectionOffset) + 10;
                    tocTop = tocTop < 45 ? 45 : tocTop;
                }
            } else {
                tocTop = 145;
            }
            if ((divHeight - sectionOffset) < tableOfContents.height()) {
                tocTabTop = tocTop;
                tocTop = displayHeight - tableOfContents.height();
            } else {
                tocTabTop = tocTop;
            }
            tocTab.css("top", tocTabTop);
            tableOfContents.css("top", tocTop);

            tableOfContents.hide();
            tocOpen = false;
            return false;
        });

        $("#resume_tab").click(function() {
            if (tocOpen)  {
                tableOfContents.hide();
                tocOpen = false;
            }
            if (tableOfContents.is(":visible")) {
                tocOpen = true;
            }
        });

         $(document).scroll(function() {
            if (scrolling) {
                scrolling = false;
            } else {
                var docScrollTop = $(document).scrollTop();
                if (docScrollTop === 0) {
                    if (tocTab.css("top") !== "145px") {
                        tocTab.css("top", 145);
                        tableOfContents.css("top", 145);
                    }
                } else if (docScrollTop > 145) {
                    tocTab.css("top", 45);
                    tableOfContents.css("top", 45);
                }
            }
        });
    });
})();
