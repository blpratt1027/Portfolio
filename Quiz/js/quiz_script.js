/**
 * Created by Bryan on 5/28/2014.
 *
 */
'use strict';
(function() {
    $(document).ready(function(){

        // ---- Variables and arrays used throughout the application ----
        var quiz_complete = false,
            question_count= 0,
            questions = [],
            answers = [],
            images = [],
            correct_answer = [],
            submitted_answer = [],
            display_image = false,
            credit_text,
            credit_url,
            quiz_file = 'json/js_quiz.json';    // JS / jQuery quiz is default
        // The next phase will be to store the questions and answers in separate files and import them using AJAX.

        var parameter = location.search.substring(1).split('?');
        switch (parameter[0]) {
            case 'wf':
                quiz_file = 'json/flowers_quiz.json';
                break;
            case 'us':
                quiz_file = 'json/us_quiz.json';
            default:
                break;
        }

        $.getJSON(quiz_file, function(data){
            $(".title").html(data.title);
            for (var q = 0; q < data.questions.length; q++) {
                questions.push(data.questions[q].q)
            }

            for (var a = 0; a < data.answers.length; a++) {
                var temp = [];
                for (var o = 0; o < data.answers[a].a.length; o++) {
                    temp.push(data.answers[a].a[o].option);
                }
                answers.push(temp);
            }
            for (var i = 0; i < data.images.length; i++) {
                temp = {"img_src": data.images[i].img_src, "alt": data.images[i].alt}
                images.push(temp);
            }

            for (var c = 0; c < data.correct_answer.length; c++) {
                correct_answer.push(data.correct_answer[c].a);
            }

            if (data.credit) {
                credit_text = data.credit.text;
                credit_url = data.credit.url;

                var creditsHTML = "<a href=\"" + credit_url + "\" target=\"_blank\">Credit: " + credit_text + "</a>";
                $("#credits").html(creditsHTML);
            }

            if (data.display_image) {display_image = true; }
            // Execution begins here.
            //alert("Hold it!");
            loadQuestion();
            $("#quiz_wrapper").fadeIn(600);
        });


        //  -------- Event handlers --------

        // Submit button event handler
        $("#submit_button").click(function() {
            if (quiz_complete) { // If the quiz is complete, this button click will display the answers
                loadQuestion();  // Use the same function; the value of question_count will cause the answers to load
            } else {
                if ($("#quiz_question input:radio:checked").length > 0) { // Is one of the radio buttons selected?
                    $('.warning').fadeOut(400);  // Remove a warning if one was displayed
                    question_count++; // Increment the question count.
                    if (question_count === questions.length) {
                        // Questions used up.  Display the "Done" message and the score.
                        $("#quiz_question").html("<h2>You have completed the quiz.</h2>");
                        $("#main_image").attr("src", images[question_count].img_src).attr("alt", images[question_count].alt).fadeIn(800);
                        $(this).text("Show answers").removeClass("submit_status");
                        $("#previous_button").remove();
                        $("#quiz_question").append("<p>You answered " + countCorrect() + " ouf of " + questions.length +
                            " questions correctly.");
                        quiz_complete = true;
                    } else {
                        $("#quiz_wrapper").fadeOut(100);
                        // If not the last question, process...
                        processClick();
                        $("#quiz_wrapper").fadeIn(500);
                    }
                } else {  // If no radio button is selected, show the warning and exit the event handler
                    $('.warning').fadeIn(100);
                }
            }
        }); // End submit_button handler

        // Previous button event handler
        $("#previous_button").click(function() {
            question_count = question_count > 0 ? --question_count : 0; // Decrement question_count if > 0
            processClick();
        }); // End Previous button handler

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

        // This will probably be best in the general declarations area
        var buttonsForm = $("#buttons_form");
        var rBtn, qSpan;
        // ------------ Functions -----------------
        var loadQuestion = function() {
            if (!quiz_complete) {
                $('#main_image').fadeOut(200).finish();
                buttonsForm.empty();
                // Load questions and answers from arrays...
                $('#current_question').text(questions[question_count]);
                for (var i = 0; i < answers[question_count].length; i++) {
                    $('#q' + (i + 1).toFixed()).text(answers[question_count][i]);
                    rBtn = crEl('input');
                    rBtn.type = 'radio';
                    rBtn.name = 'q1';
                    rBtn.value = i + 1;
                    qSpan = crEl('span');
                    //qSpan.id = 'q' + (i + 1).toFixed();
                    qSpan.innerHTML = answers[question_count][i];
                    addToEl(buttonsForm, rBtn);
                    addToEl(buttonsForm, qSpan);
                    addToEl(buttonsForm, crEl('br'));
                }
                $("#current_question").fadeIn(400);
                $("#main_image").attr("src", images[question_count].img_src).attr("alt", images[question_count].alt).fadeIn(800);
                $('#quiz_question input[type=radio]').prop("checked", false);  // Clear the radio buttons
                $('#quiz_question input[type=radio]').click(function () { // Create event handler for radio buttons
                    submitted_answer[question_count] = $(this).val(); // Add answer to array
                    $('.warning').fadeOut(400);
                    $('#submit_button').removeClass('disabled');

                });
            } else {
                // Show the answers
                // TODO - consider changing font sizes for the answer section.  It will have to be more than just the
                // body as other elements have fixed sizes which over-ride it.
                $("#quiz_table").remove();  // Remove the table used to house the quiz; populate a fresh page
                $("#quiz_wrapper").append("<h2>Answers</h2>");
                for (i = 0; i < questions.length; i++) {
                    // Load each question...
                    $("#quiz_wrapper").append("<p class='answers'><span class='ques'>Question " + (i + 1).toFixed() + "</span>: " + questions[i] + "</p>");
                    // A small version of the image, if the display image option is flagged
                    if (display_image) {
                        $("#quiz_wrapper").append("<img class='tiny-img' src=\"" + images[i].img_src + "\">");
                    }
                    // ...and the correct answer.
                    $("#quiz_wrapper").append("<p class='answers'> - <span class='ans' >Answer</span>: " + answers[i][correct_answer[i] - 1]);
                    if (correct_answer[i] == submitted_answer[i]) {
                        // Indicate a correct answer...
                        $("#quiz_wrapper").append("<span class='answers correct'> You answered correctly!</span></p>");
                    } else {
                        // Display an inncorret answer and indicate it is incorrect.
                        $("#quiz_wrapper").append("<span class='answers'>Your answer: " + answers[i][submitted_answer[i] - 1] + " <span class='incorrect'>(Incorrect)</span></span></p>");
                    }
                }
                $('#another_quiz').show();
            }
        }; // End loadQuestion function

        // Function for processing button clicks
        var processClick = function() {
            if (question_count < questions.length) {
                loadQuestion();
                $('#submit_button').addClass('disabled');
                switch (question_count) {
                    case 0:
                        $("#previous_button").hide();
                        break;
                    case (questions.length - 1):
                        $("#submit_button").html("Submit quiz").toggleClass("submit_status");
                        break;
                    default:
                        $("#submit_button").html("Submit answer").removeClass("submit_status");
                        $("#previous_button").show();
                        break;
                }
            }
        }; // End processClick function

        // Compare submitted answers to correct answers and total
        var countCorrect = function() {
            var correct_count = 0;
            for (var i = 0; i < questions.length; i++) {
                if (correct_answer[i] == submitted_answer[i]) { correct_count++; }
            }
            return correct_count;
        }; // End countCorrect function

        var crEl = function(element) {
            return document.createElement(element);
        };

        function addToEl(dest, element) {
            $(dest).append(element);
        }



    });
})();