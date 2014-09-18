/**
 * Created by Bryan on 9/17/2014.
 */

(function() {
    $(document).ready(function () {
        var quiz_file = 'json/quiz.json',
            option;

        $.getJSON(quiz_file, function(data) {
            for (var i = 0; i < data.questions.length; i++) {
                $("#quiz-container").append('<br /><p class="question">' + data.questions[i].q + '</p><br />');
                for (var j = 0; j < data.answers[i].a.length; j++) {
                    //$("#quiz-container").append(' * ' + data.answers[i].a[j].option + '<br />')
                    option = data.answers[i].a[j].option;
                    $("#quiz-container").append(buildButton(i))
                    .append( option + '<br />');
                }
            }
        });

        function buildButton(val) {
            var rButton = document.createElement('input');
            rButton.type = 'radio';
            rButton.name = "O" + val;
            rButton.value = val + 1;
            return rButton;
        }

        $("#submit").click(function() {
            alert("Bravo!");
        });
    });
})();