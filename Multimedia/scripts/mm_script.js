var imgArray = new Array();
var rand;

imgArray[1] = "_images/webdev1.jpg";
imgArray[2] = "_images/webdev2.jpg";
imgArray[3] = "_images/webdev3.jpg";
imgArray[4] = "_images/webdev4.jpg";
imgArray[5] = "_images/webdev5.jpg";
imgArray[6] = "_images/webdev6.jpg";
imgArray[7] = "_images/webdev7.jpg";
imgArray[8] = "_images/webdev8.jpg";
imgArray[9] = "_images/webdev9.jpg";
imgArray[10] = "_images/webdev10.jpg";
imgArray[11] = "_images/webdev11.jpg";

var timer = setInterval(function () { switchPicture() }, 6000);

function switchPicture() {
	randImg = Math.floor(Math.random() * 11 + 1);
	document.getElementById("slideshow").src = imgArray[randImg];
	//document.getElementById("imgNum").innerHTML = randImg;
}

// JavaScript / jQuery functions added for inclusion in the Portfolio
$(document).ready(function() {
    $("#floating_main_link").fadeTo(200, 1).delay(2500).fadeTo(800, 0.2).click(function(){
        window.open("../index.php", "_self");
    }).hover(
        function() {
            $(this).stop().fadeTo(600, 1);
        },
        function() {
            $(this).stop().fadeTo(600, 0.2);
        }
    );

    $("#close_splash").click(function() {
        $("#splash").stop().hide(800);
    });

    $("#splash").delay(500).show(800).delay(40000).hide(800);
});
// End of code added for Portfolio