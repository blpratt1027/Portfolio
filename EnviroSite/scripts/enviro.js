/**
 * Created by Bryan on 5/7/2014.
 */
(function() {
    $(document).ready(function(){
        //alert("Hello World!");
        $("#content_wrapper").fadeIn(600);

        $(".expand").click(function() {
            var expandID = $(this).attr("id");
            var expanded = $("#expand_premise").html().indexOf("return");
            expandDiv(expandID, expanded);
        });

        $("h2, h3").click(function() {
            var expandID = $(this).parent().attr("id");
            var expanded = $("#expand_premise").html().indexOf("return");
            expandDiv(expandID, expanded);
        });

        var expandDiv = function(expandID, expanded) {
            if ( expandID.indexOf("premise") >= 0 ) {
                expandPremise(expanded);
            } else {
                //alert("Working on it!!");
                var num, div_id, content_id;
                num = expandID[expandID.length - 1];
                //alert(num);
                if ( expandID.indexOf("ev") >= 0 ) {
                    div_id = "#evidence" + num;
                    content_id = "#ev" + num + "_content";
                } else if (expandID.indexOf("con") >= 0 ) {
                    div_id = "#consequences" + num;
                    content_id = "#con" + num + "_content";
                } else {
                    div_id = "#action" + num;
                    content_id = "#act" + num + "_content";
                }
                if (expanded > 0) {
                    $(content_id).fadeToggle(10);
                    $('h3').animate( {fontSize: '1.5rem'}, 10);
                    $(div_id).stop().animate(
                        { width: "30%", minWidth: "10"}, 10
                    );
                    $(div_id).fadeToggle(1);
                    fadePremise();
                    $(".expand").html("Click to expand");
                    fadeAction();
                    fadeExpand();
                } else {
                    fadeExpand();
                    fadePremise();
                    fadeAction();
                    $(div_id).fadeToggle(300);
                    $(div_id).animate(
                        { width: "80%", minWidth: "1000"}, 300
                    );
                    $(content_id).delay(300).fadeToggle(300);
                    $('h3').delay(600).animate( {fontSize: '3rem'}, 600);
                    $(".expand").html("Click to return");
                }
                fadeExpand();
            }
        };

        $("#flyout, #social").hover(
            function(evt) { $(this).stop().delay(200).animate( { left: '-8px', height: '240px' }, 300);
                            $("#content_wrapper").stop().animate( {"opacity": "0.5"}, 300);},
            function(evt) { $(this).stop().delay(200).animate( { left: '-210px', height: '24px'}, 300);
                            $("#content_wrapper").stop().animate( {"opacity": "1"}, 300);}
        );

        $("#sign_petition").click(function () {
            $("#sign_petition").hide();
            fadePremise();
            fadeAction();
            $("#petition").fadeToggle(1500);
            $("#social").animate(
                { left: '-175' }, 500
            );
            $("#first_name").focus();
        });

        $("#cancel_petition").click(function() {
            $("#petition").hide();
            fadePremise();
            fadeAction();
            $("#sign_petition").show();
        });

        $("#petition_signup").validate({
            rules: {
                first_name: {
                    required: true,
                    rangeLength:[2, 25]
                },
                last_name: {
                    required: true,
                    rangeLength:[2, 25]
                },
                email: {
                    required: true,
                    email: true
                },
                confirm_email: { equalTo:'#email'},
                messages: {
                    first_name: {
                        required: "Please enter your first name"
                    },
                    last_name: {
                        required: "Please enter your last name"
                    },
                    email: {
                        required: "Email address required"
                    },
                    confirm_email: {
                        equalTo: "Email addresses do not match"
                    }

                }

            }
        });

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

        var expandPremise = function(expanded) {
            fadeExpand();
            fadeAction();
            $("#premise_content").slideToggle(600);
            //var expanded = $("#expand_premise").html().indexOf("return");
            if (expanded > 0) {
                $(".expand").html("Click to expand");
                $('h2').animate( { fontSize: '2.5rem' }, 300 );
                $('h4').animate( { fontSize: '1.33rem'}, 300 );
                $('h4').css('color', 'black');

                $('h2').css(
                    {'text-shadow': 'none',
                        'color': 'black'
                    });
                /*$('h2').css('color', 'black');*/
            } else {
                $(".expand").html("Click to return");
                $('h2').animate( { fontSize: '4rem' }, 300 );
                $('h4').animate( { fontSize: '2.5rem'}, 300 );
                $('h4').css('color', '#844545');
                $('h2').css(
                    {'text-shadow': '4px 4px 5px #CCD3CC',
                        'color': '#343'
                    });
                /*$('h2').css('color', '#343');*/
            }
            fadeExpand();
        };

        var fadeExpand = function() {
            //$(".expand").stop().fadeToggle(400);
            $(".expand").stop().toggle(400);
        };

        var fadeAction = function() {
            //$(".actions").fadeToggle(400);
            $(".actions").toggle(400);
        };

        var fadePremise = function() {
            //$("#premise").fadeToggle(400);
            $("#premise").toggle(400);
        }
    });
})();