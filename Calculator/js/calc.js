/**
 * Created by Bryan on 5/14/2014.
 */
/* TODO for enhanced (Portfolio) version...
*   Find a way to limit, shorten, or shrink display for exponential numbers
*   A better Pi icon?
*   Improve media queries.
*   - Look for a better way to control the height of the buttons than with 'line-height' - need to be able to use
*     % rather than px.
*   Improve comments.
* */
(function() {
    $(document).ready(function() {
        // Variables required throughout the app
        var number = null;      // Variable for storing the number in the display before clearing it
        var operation = "";     // Keeps track of the operator key last pressed
        var displayCleared = false;
        var calcComplete = false;
        var helpVisible = false;
        var shiftOn = false;

        // Assign controls to variables to reduce jQuery calls
        var display = $("#display");
        var calcButton = $(".button");
        var helpIcon = $("#help_icon");
        var keyboard = $("body");
        var helpScreen = $("#help_popup");

        // Key code constants (keydown - keypress does not work in Firefox.
        // This makes it necessary to check for Shift to detect upper case keys.)
        var SHIFT = 16;
        var CLEAR = 67; // 'C'
        var BACK = 8; // Backspace
        var ESC = 27;
        var SIGN = 83; // 'S'
        var PERCENT = 80; // 'P'
        var SQUARE_ROOT = 82; // 'R'
        var PI_KEY = 73; // 'I'
        var SQUARED = 81; // 'Q'
        var DIVIDE = 191;
        var DIVIDE_NUM_PAD = 111;
        var MULTIPLY_NUM_PAD = 106;
        var MULTIPLY_X = 88; // 'X'
        var ADD = 61;
        var ADD_NUM_PAD = 107;
        var SUBTRACT = 173;
        var SUBTRACT_NUM_PAD = 109;
        var ZERO = 48;
        var ONE = 49;
        var TWO = 50;
        var THREE = 51;
        var FOUR = 52;
        var FIVE = 53;
        var SIX = 54;
        var SEVEN = 55;
        var EIGHT = 56;
        var NINE = 57;
        var ZERO_NUM_PAD = 96;
        var ONE_NUM_PAD = 97;
        var TWO_NUM_PAD = 98;
        var THREE_NUM_PAD = 99;
        var FOUR_NUM_PAD = 100;
        var FIVE_NUM_PAD = 101;
        var SIX_NUM_PAD = 102;
        var SEVEN_NUM_PAD = 103;
        var EIGHT_NUM_PAD = 104;
        var NINE_NUM_PAD = 105;
        var ENTER = 13;
        var EQUAL = 187;
        var HELP = 112;
        var DECIMAL = 190;
        var DECIMAL_NUM_PAD = 110;

        // Function to process a click or a valid keystroke
        var process = function(id) {
            var currDisplay = display.val();
            switch (id) {
                case "clear":
                    if(helpVisible) {   // If the help screen is visible, close it
                        process("help");
                    } else {            // Otherwise, clear the display.  In this calculator, Clear = Clear All.
                        display.val("");
                        operation = "";
                        number = null;
                    }
                    break;
                case "back":
                    currDisplay = currDisplay.slice(0, currDisplay.length - 1);
                    display.val(currDisplay);
                    break;
                case "calculate":
                    if (number !== null) {          // Must be a number in memory to perform the operation on
                        if (operation.length > 0) { // An operation must be selected
                            var newNum = display.val();
                            if (newNum.length > 0) {    // There has to be a number in the display
                                // Call the doCalculation function, trim decimal length, place the result in the display
                                display.val(setDecimalLength( doCalculation( number, parseFloat(newNum))));
                                operation = "";
                                // Flags used to determine how to process the next keystroke / button click.
                                displayCleared = false;
                                calcComplete = true;
                            }
                        }
                    }
                    break;
                case "sign":
                    if (currDisplay.length > 0) {
                        display.val(parseFloat(currDisplay) * -1);
                    }
                    break;
                case "percent":
                    if (currDisplay.length > 0) {
                        display.val(setDecimalLength(parseFloat(currDisplay) * 0.01));
                    }
                    if (operation.length > 0) {
                        id = "calculate";
                        process(id);
                    }
                    calcComplete = true;
                    break;
                case "sqrt":
                    if (currDisplay.length > 0) {
                        display.val(setDecimalLength(Math.pow(parseFloat(currDisplay), 0.5) ));
                    }
                    calcComplete = true;    // Treated as a calculation (might have been more consistent to pass it
                                            //  to doCalculation...  This works, though.
                    break;
                case "x2":      // Square
                    display.val(setDecimalLength(Math.pow(parseFloat(currDisplay), 2) ));
                    break;
                case "pi":
                    id = Math.PI.toFixed(10);
                    process(id);    // Processed the same way as a number button
                    break;
                case "help":
                    helpScreen.slideToggle(400);
                    helpVisible = !helpVisible;
                    break;
                // If id === none of the values above, id is either a number or an operation.
                default:
                    if(id.indexOf("op") === 0) {    // Operation keys
                        // TODO - Can this code can be consolidated, redundancy reduced? Fix this for Portfolio version
                        // Probably.  This is the code that makes stringed operations possible, e.g. 2 + 5 / 3 - 2.
                        // The code is redundant with 'case: "calculate"' in the 'process' function, so this needs
                        // work.  Because the situations are different, it promises to be a bit dicey, so I'm
                        // leaving it alone for now.
                        if (operation.length > 0) {     // An operation is already pending.  Chained operation.
                            newNum = currDisplay;
                            if (newNum.length > 0) {
                                display.val(setDecimalLength( doCalculation(number, parseFloat(newNum))));
                            }
                            operation = id.substr(3, id.length - 3);
                            displayCleared = false;
                        } else {
                            // Only assign an operator if there is data in the display
                            if (currDisplay.length > 0 ) {
                                operation = id.substr(3, id.length - 3);
                            }
                        }
                    } else {    // Number keys
                        // Special case for "0"
                        if (currDisplay === "0") {
                            if (id === "0") {
                                id = "";
                            } else if (id !== ".") {  // TODO - This should never occur because of how "." is handled.
                                                        // Check and fix / remove as needed.
                                currDisplay = "";
                            }
                        }
                        // Special case for "."  Allow only once in a number.
                        if (currDisplay.indexOf("." && !displayCleared) >= 0 ){
                            if (id === ".") {
                                id = "";
                            }
                        }
                        if (operation.length > 0) {
                            if (!displayCleared) {
                                number = parseFloat(currDisplay);
                                display.val("");
                                currDisplay = "";
                                displayCleared = true;
                            }
                        }
                        if (calcComplete) {
                            currDisplay = id;
                            calcComplete = false;
                        } else
                            currDisplay += id;

                        if (currDisplay === ".") {currDisplay = "0."; }
                        display.val(currDisplay);
                    }
            } // End switch
        }; // End of process function

        // Function for performing calculations
        var doCalculation = function(num1, num2) {
            var result;
            switch (operation) {
                case "add":
                    result = num1 + num2;
                    break;
                case "subtract":
                    result = num1 - num2;
                    break;
                case "multiply":
                    result = num1 * num2;
                    break;
                case "divide":
                    if (num2 !== 0) {
                        result = num1 / num2;
                    } else {
                        result = "Division by zero";
                        calcComplete = true;
                    }
                    break;
            }
            // Note - can't do parseFloat here because text is returned in the case of division by 0.
            return result;
        };

        // Set the number of decimals to be displayed (max = 10).  Also handles errors (NaN) and overflows (Infinity)
        var setDecimalLength = function(num) {
            if (isNaN(num)) {
                num = "Error";
            } else if (!isFinite(num)) {
                num = "Overflow";
            } else {
                var numType = typeof num;
                if (numType === "number") {
                    num = parseFloat(num.toFixed(10));
                }
            }
            return num;
        };

        // Use jQuery UI to make the calculator draggable
        $("#full_wrapper").draggable();

        // All button clicks are handled here.
        calcButton.mousedown(function() {
            var id = this.id;
            process(id);
        });

        // Keyboard handling.
        keyboard.keydown(function(event) {
            var id = "";
            switch (event.keyCode){
                case SHIFT:
                    shiftOn = !shiftOn;     // This will clear the flag if shift is pressed twice
                    break;
                case ESC:
                    process("clear");
                    break;
                case BACK:
                    process("back");
                    break;
                case HELP:
                    process("help");
                    return false;
                case CLEAR:
                    id = "clear";
                    break;
                case SIGN:
                    id = "sign";
                    break;
                case PERCENT:
                    id = "percent";
                    break;
                case PI_KEY:
                    id = "pi";
                    break;
                case SQUARED:
                    id = "x2";
                    break;
                case SQUARE_ROOT:
                    id = "sqrt";
                    break;
                case DIVIDE:
                case DIVIDE_NUM_PAD:
                    id = "op_divide";
                    break;
                case MULTIPLY_X:
                case MULTIPLY_NUM_PAD:
                    id = "op_multiply";
                    break;
                case ADD:
                case ADD_NUM_PAD:
                    id = "op_add";
                    break;
                case SUBTRACT:
                case SUBTRACT_NUM_PAD:
                    id = "op_subtract";
                    break;
                case ZERO:
                case ZERO_NUM_PAD:
                    id = "0";
                    break;
                case ONE:
                case ONE_NUM_PAD:
                    id = "1";
                    break;
                case TWO:
                case TWO_NUM_PAD:
                    id = "2";
                    break;
                case THREE:
                case THREE_NUM_PAD:
                    id = "3";
                    break;
                case FOUR:
                case FOUR_NUM_PAD:
                    id = "4";
                    break;
                case FIVE:
                case FIVE_NUM_PAD:
                    if (shiftOn) {
                        id = "percent";
                        shiftOn = false;
                    } else {
                        id = "5";
                    }
                    break;
                case SIX:
                case SIX_NUM_PAD:
                    id = "6";
                    break;
                case SEVEN:
                case SEVEN_NUM_PAD:
                    id = "7";
                    break;
                case EIGHT:
                case EIGHT_NUM_PAD:
                    if (shiftOn) {
                        id = "op_multiply";
                        shiftOn = false;
                    } else {
                        id = "8";
                    }
                    break;
                case NINE:
                case NINE_NUM_PAD:
                    id = "9";
                    break;
                case DECIMAL:
                case DECIMAL_NUM_PAD:
                    id = ".";
                    break;
                case EQUAL:
                    if (shiftOn) {
                        id = "op_add";
                        shiftOn = false;
                        break;  // Upper case '+' was pressed; break, don't fall through.
                    }
                    // If it is the lower case '=' rather than the upper case '+', we want to fall through
                case ENTER:
                    id = "calculate";
                    break;
                default:
                    // Do nothing.
                    break;
            }
            if (id.length > 0) {
                event.preventDefault();  // Prevent unexpected behavior.
                process(id);
            }
        });

        // There are actually two help icons on the full-screen version; they disappear when sized for a small device
        helpIcon.click(function () {
            process("help");
        });

        // Close the help screen when it is clicked on
        helpScreen.click(function() {
            process("help");
        });

        $(".button, #calc_wrapper").mousedown(function(event) {
            event.preventDefault();     // Prevent text from being highlighted by mouse clicks too close together
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

        // Whew!  But it works!!
    });
})();