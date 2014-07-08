/**
 * Created by Bryan on 5/28/2014.
 *
 * TODO (for Portfolio version)
 *  - store the questions and answers in JSON files and access them using AJAX.
 */
'use strict';
(function() {
    $(document).ready(function(){

        // ---- Variables and arrays used throughout the application ----
        var quiz_complete = false;
        var question_count= 0;
        // The next phase will be to store the questions and answers in separate files and import them using AJAX.
        var questions = [
            "What is JavaScript?",
            "For what browser was JavaScript originally written?",
            "What is jQuery?",
            "Who created jQuery?",
            "The first version of JavaScript was completed in:",
            "jQuery is used on more than what percentage of the 10,000 most visited web sites?",
            "jQuery eases the process of:",
            "JavaScript was originally created by:",
            "One of JavaScript's strongest advocates, as well as one of its harshest critics is:",
            "jQuery's selector engine is named:"
        ];
        var answers = [
            [
                "One of the .NET family of languages.",
                "A scripting language for running batch processes.",
                "A sequential programming language used for applications written for the Linux operating system.",
                "A dynamic, object oriented, event driven language used most often in web browsers."
            ],
            [
                "Microsoft Internet Explorer",
                "Mozilla Firefox",
                "Netscape Navigator",
                "Apple Safari"
            ],
            [
                "A free, open-source JavaScript library designed to ease the development of client-side scripted HTML pages and applications.",
                "A software platform for scalable server-side and networking applications.",
                "A server-side scripting language designed for web development but also used as a general-purpose programming language.",
                "A software framework that includes a large library and provides language interoperability across several programming languages."
            ],
            [
                "John Resig",
                "Tim Berners-Lee",
                "Steve Jobs",
                "Al Gore"
            ],
            [
                "1 year",
                "10 months",
                "10 weeks",
                "10 days"
            ],
            [
                "30%",
                "50%",
                "80%",
                "95%"
            ],
            [
                "Selecting DOM elements",
                "Creating animations",
                "Handling events",
                "All of the above"
            ],
            [
                "Bill Gates",
                "Brendan Eich",
                "John Resig",
                "Tim Berners-Lee"
            ],
            [
                "Brendan Eich",
                "Douglas Crockford",
                "John Resig",
                "Tim Berners-Lee"
            ],
            [
                "Flash",
                "Fuze",
                "Sizzle",
                "Elmer"
            ]
        ];
        var images = [
            {img_src: "images/javascript.jpg", alt: "JavaScript logo"},
            {img_src: "images/javascript.png", alt: "JavaScript image"},
            {img_src: "images/jquery.png", alt: "jQuery image"},
            {img_src: "images/jquery.jpg", alt: "jQuery image"},
            {img_src: "images/javascript_the_evil_parts.png", alt: "JavaScript image"},
            {img_src: "images/jquery2.jpg", alt: "jQuery image"},
            {img_src: "images/jquery2.png", alt: "jQuery image"},
            {img_src: "images/js.jpg", alt: "JavaScript image"},
            {img_src: "images/JS-logo1.png", alt: "JavaScript image"},
            {img_src: "images/jquery3.png", alt: "jQuery image"},
            {img_src: "images/done.gif", alt: "All Done!"}
        ];
        
        var correct_answer = [4, 3, 1, 1, 4, 3, 4, 2, 2, 3];
        var submitted_answer = [];

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
                        // If not the last question, process...
                        processClick();
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

        // ------------ Functions -----------------
        var loadQuestion = function() {
            if (!quiz_complete) {
                $('#main_image').fadeOut(200).finish();
                // Load questions and answers from arrays...
                $('#current_question').text(questions[question_count]);
                for (var i = 0; i < answers[question_count].length; i++) {
                    $('#q' + (i + 1).toFixed()).text(answers[question_count][i]);
                }
                $("#current_question").fadeIn(400);
                $("#main_image").attr("src", images[question_count].img_src).attr("alt", images[question_count].alt).fadeIn(800);
                $('#quiz_question input[type=radio]').prop("checked", false);  // Clear the radio buttons
                $('#quiz_question input[type=radio]').click(function () { // Create event handler for radio buttons
                    submitted_answer[question_count] = $(this).val(); // Add answer to array
                    $('.warning').fadeOut(400);
                });
            } else {
                // Show the answers
                $("#quiz_table").remove();  // Remove the table used to house the quiz; populate a fresh page
                $("#quiz_wrapper").append("<h2>Answers</h2>");
                for (i = 0; i < questions.length; i++) {
                    // Load each question...
                    $("#quiz_wrapper").append("<p class='answers'><span class='ques'>Question " + (i + 1).toFixed() + "</span>: " + questions[i] + "</p>");
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
            }
        }; // End loadQuestion function

        // Function for processing button clicks
        var processClick = function() {
            if (question_count < questions.length) {
                loadQuestion();
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

        // Execution begins here.
        loadQuestion();
    });
})();