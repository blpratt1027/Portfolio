/**
 * Created by Bryan on 5/14/2014.
 */
(function() {
    "use strict";
    $(document).ready(function() {

        // Variables required throughout the app
        var currentValue = 0,   // Value of number to be displayed after calculations are complete.  Display will be
                            //  formatted from this value.
            number = null,      // Variable for storing the number in the display before clearing it
            operation = "",     // Keeps track of the operator key last pressed
            displayCleared = false,
            calcComplete = false,
            helpVisible = false,
            helpClosed = false,
            shiftOn = false,

            // Flag for IE (to handle specific IE related issues)
            browser = navigator.userAgent,
            isIE = (browser.indexOf("MSIE") > -1 || browser.indexOf("rv:11.0") > -1),

            // Assign controls to variables to reduce jQuery calls
            fullWrapper = $("#full_wrapper"),
            calcWrapper = $("#calc_wrapper"),
            display = $("#display"),
            calcButton = $(".button"),
            helpIcon = $(".helpIcon"),
            keyboard = $("body"),
            helpScreen = $("#help_popup"),

            // Key code constants (keydown - keypress does not work in Firefox.
            // This makes it necessary to check for Shift to detect upper case keys.)
            SHIFT = 16,
            CLEAR = 67, // 'C'
            BACK = 8, // Backspace
            ESC = 27,
            SIGN = 83, // 'S'
            PERCENT = 80, // 'P'
            SQUARE_ROOT = 82, // 'R'
            PI_KEY = 73, // 'I'
            SQUARED = 81, // 'Q'
            DIVIDE = 191,
            DIVIDE_NUM_PAD = 111,
            MULTIPLY_NUM_PAD = 106,
            MULTIPLY_X = 88, // 'X'
            ADD = 61,
            ADD_NUM_PAD = 107,
            SUBTRACT = 173,
            SUBTRACT_NUM_PAD = 109,
            ZERO = 48,
            ONE = 49,
            TWO = 50,
            THREE = 51,
            FOUR = 52,
            FIVE = 53,
            SIX = 54,
            SEVEN = 55,
            EIGHT = 56,
            NINE = 57,
            ZERO_NUM_PAD = 96,
            ONE_NUM_PAD = 97,
            TWO_NUM_PAD = 98,
            THREE_NUM_PAD = 99,
            FOUR_NUM_PAD = 100,
            FIVE_NUM_PAD = 101,
            SIX_NUM_PAD = 102,
            SEVEN_NUM_PAD = 103,
            EIGHT_NUM_PAD = 104,
            NINE_NUM_PAD = 105,
            ENTER = 13,
            EQUAL = 187,
            HELP = 112,
            DECIMAL = 190,
            DECIMAL_NUM_PAD = 110;

        window.onresize = calculatorSize;
        calculatorSize();

        // Function to process a click or a valid keystroke
        function process(id) {
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
                    if (currDisplay.indexOf("e+") === -1) {
                        if (currentValue !== 0) {
                            currDisplay = clearComma(currDisplay);
                            currDisplay = currDisplay.slice(0, currDisplay.length - 1);
                            if (currDisplay === "") {
                                currentValue = 0;
                            } else {
                                currentValue = parseFloat(currDisplay);
                            }
                            display.val(CommaFormatted(trimDisplay(currentValue)));
                        }
                    }
                    break;
                case "calculate":
                    if (number !== null) {          // Must be a number in memory to perform the operation on
                        if (operation.length > 0) { // An operation must be selected
                            if (performCalculation(currDisplay)) {
                                operation = "";
                                calcComplete = true;
                            }
                        }
                    }
                    break;
                case "sign":
                    if (currDisplay.length > 0) {
                        currentValue *= -1;
                        display.val(CommaFormatted(trimDisplay(currentValue)));
                    }
                    break;
                case "percent":
                    if (currDisplay.length > 0) {
                        currentValue *= 0.01;
                        display.val(CommaFormatted(trimDisplay(setDecimalLength(currentValue))));
                    }
                    if (operation.length > 0) {
                        id = "calculate";
                        process(id);
                    }
                    calcComplete = true;
                    break;
                case "sqrt":
                    if (currDisplay.length > 0) {
                        currentValue = Math.pow(currentValue, 0.5);
                        display.val(trimDisplay(setDecimalLength(currentValue )));
                    }
                    calcComplete = true;    // Treated as a calculation (might have been more consistent to pass it
                                            //  to doCalculation...  This works, though.
                    break;
                case "x2":      // Square
                    currentValue = Math.pow(parseFloat(clearComma(currDisplay)), 2);
                    display.val(CommaFormatted(trimDisplay(setDecimalLength(currentValue ))));
                    break;
                case "pi":
                    id = Math.PI.toFixed(14);
                    process(id);    // Processed the same way as a number button
                    break;
                case "help":
                    helpScreen.slideToggle(400);
                    helpVisible = !helpVisible;
                    helpClosed = !helpClosed;
                    break;
                // If id === none of the values above, id is either a number or an operation.
                default:
                    if(id.indexOf("op") === 0) {    // Operation keys
                        if (operation.length > 0) {     // An operation is already pending.  Chained operation.
                            if (performCalculation(currDisplay)) {
                                operation = id.substr(3, id.length - 3);
                            }
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
                            }                         }
                        // Special case for "."  Allow only once in a number.
                        if (currDisplay.indexOf("." && !displayCleared) >= 0 ){
                            if (id === ".") {
                                id = "";
                            }
                        }
                        if (operation.length > 0) {
                            if (!displayCleared) {
                                number = parseFloat(clearComma(currDisplay));
                                currDisplay = "";
                                display.val(currDisplay);
                                displayCleared = true;
                            }
                        }
                        if (calcComplete) {
                            currDisplay = id;
                            currentValue = parseFloat(currDisplay);
                            calcComplete = false;
                        } else {
                            if (currDisplay.length < 18) {
                                currDisplay += id;
                                if (currDisplay === "." || currDisplay === "0.") {
                                    currentValue = 0;
                                } else {
                                    currentValue = parseFloat(clearComma(currDisplay));
                                }
                            }
                        }

                        if (currDisplay === ".") {currDisplay = "0."; }
                        //if (currDisplay === "0.") {
                        if (currDisplay.indexOf(".") > 0) {
                            display.val(currDisplay);
                        } else {
                            display.val(CommaFormatted(trimDisplay(currentValue)));
                        }
                    }
            } // End switch
        } // End of process function

        // Function for performing calculations
        function doCalculation(num1, num2) {
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
        }

        // Set the number of decimals to be displayed (max = 10).  Also handles errors (NaN) and overflows (Infinity)
        function setDecimalLength(num) {
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
        }

        // Use jQuery UI to make the calculator draggable
        fullWrapper.draggable();

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
                    event.preventDefault();
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

        helpIcon.click(function () {
            process("help");
        });

        // Close the help screen when it is clicked on
        helpScreen.click(function() {
            process("help");
        });

        $("#floating_main_link").fadeTo(200, 1).delay(2500).fadeTo(600, 0.2).click(function(){
            window.open("../index.php", "_self");
        }).hover(
            function() {
                $(this).stop().fadeTo(600, 1);
            },
            function() {
                $(this).stop().fadeTo(600, 0.2);
            }
        );

        // Find a better place for this function
        function trimDisplay(displayVal) {
            var temp = displayVal;
            if (typeof(temp) !== "string") {
                temp = temp.toString();
            }
            if (temp.length > 18) {
                if (temp.indexOf(".") < 0) {
                    temp = displayVal.toExponential();
                } else if (temp.indexOf("e+") > 0) {
                    var e = temp.indexOf("e+");
                    var toTrim = temp.length - 18;
                    var newTemp = temp.slice(0, e - toTrim);
                    newTemp += temp.slice(e, temp.length);
                    temp = newTemp;
                }
                else {
                    temp = temp.slice(0, 18);
                }
            }
            // Compensate for rounding errors
            var dec = temp.indexOf(".");
            if (dec > 0) {
                var rem = parseFloat(temp.slice(dec, temp.length));
                if (rem < 0.0000001) {
                    temp = Math.floor(temp).toFixed();
                } else if (rem > 0.999999) {
                    temp = Math.ceil(temp).toFixed();
                }

            }
            return temp;
        }

        // This function needs a logical home...
        function performCalculation (currDisplay) {
            var calcPerformed = false;
            if(currDisplay.length > 0) {
                currentValue = doCalculation( number, parseFloat(currDisplay));
                display.val(CommaFormatted(trimDisplay(setDecimalLength( currentValue))));
                displayCleared = false;
                calcPerformed = true;
            }
            return calcPerformed;
        }

        function calculatorSize() {
            var winHeight = $(window).height(),
                wrapperWidth, calcWrapperWidth, calcWrapperHeight, height, top, lineHeight, fontSize, supTop, supFontSize, supLineHeight, wideButtonWidth,
                regularButtonWidth, buttonHeight, displayWidth, displayHeight, displayFont, displayBottomMargin, wrapperMargin, calcPadding, calcMargin;
            if (winHeight < 500) {
                height = winHeight;
                wrapperWidth = height * 0.6268;
                top = 0;
                $("body").css({"margin": 0});
            } else if (winHeight < 695) {
                height = winHeight - 20;
                wrapperWidth = height * 0.6268;
                top = 10;
            } else {
                wrapperWidth = 435;
                height = wrapperWidth / 0.6268;
                top = 10;
            }
            calcPadding = wrapperWidth * 0.025974;
            calcMargin = calcPadding / 2;
            calcWrapperWidth = (wrapperWidth - (calcPadding * 2) - (calcMargin * 2)) + 2;
            calcWrapperHeight = height - 10;
            displayWidth = (wrapperWidth * 0.885).toString() + "px";
            displayHeight = height * 0.044444;
            displayBottomMargin = calcWrapperHeight * 0.02924;
            fontSize = (height * 0.04611).toString() + "px";
            buttonHeight = (height * 0.129682759).toString() + "px";
            lineHeight = buttonHeight;
            supTop = ((height * 0.02594) * -1).toString()  + "px";
            supFontSize = (height * 0.02882).toString()  + "px";
            supLineHeight = (height * 0.11).toString()  + "px";
            regularButtonWidth = (calcWrapperWidth / 4) - 3;
            wideButtonWidth = (regularButtonWidth * 2) + 2;
            displayFont = wrapperWidth * 0.08276;
            regularButtonWidth = regularButtonWidth.toString() + "px";
            wrapperMargin = top + "px auto";

            calcPadding = "0 " + calcPadding + "px";
            calcMargin = 0;
            fullWrapper.css({"width": wrapperWidth, "height": height, "margin": wrapperMargin});
            calcWrapper.css({"height": (calcWrapperHeight), "padding": calcPadding, "margin": calcMargin, "width": calcWrapperWidth});
            $("body").css({"line-height": lineHeight, "font-size": fontSize});
            $(".bksp").css({"width": fontSize, "height": fontSize});
            $(".sup").css({"top": supTop, "font-size": supFontSize, "line-height": supLineHeight});
            $(".wide").css("width", wideButtonWidth);
            $(".regular").css("width", regularButtonWidth);
            calcButton.css("height", buttonHeight);
            $("#display").css({"width": displayWidth, "height": displayHeight, "font-size": displayFont, "margin-bottom": displayBottomMargin});
            var helpIcon = $("#keyboard_icon");
            if (top === 10) {
                helpIcon.show();
            } else {helpIcon.hide();}
        }

        // This needs to be in a better place
        calcButton.mousedown(function(evt) {
            //if (!isIE) {
            //}
            fullWrapper.draggable("disable");
            if (!helpVisible && !isIE) {
                var newWidth = (calcWrapper.width() / 4) - 4;
                if ($(this).hasClass("wide")) {
                    newWidth = (newWidth * 2) + 3;
                }
                var newHeight = (fullWrapper.height() * 0.129682759) - 1;
                $(this).css({"width": newWidth, "height": newHeight, "border-right-width": "2px", "border-bottom-width": "2px"});
            }
            process(this.id);
        });

        calcButton.mouseup(function() {
            if (!helpVisible && !isIE) {
                var newWidth = (calcWrapper.width() / 4) - 3;
                if ($(this).hasClass("wide")) {
                    newWidth = (newWidth * 2) + 2;
                }
                var newHeight = fullWrapper.height() * 0.129682759;
                $(this).css({"width": newWidth, "height": newHeight, "border-right-width": "1px", "border-bottom-width": "1px"});
            }
            if (helpClosed) {helpClosed = false;}
            fullWrapper.draggable("enable");
        });

        var CommaFormatted = function(amount) {
            if (!parseFloat(amount)) { return amount; }  // Don't process if a string value is passed ("Overflow", etc.)
            var delimiter = ",", // replace comma if desired
                a = amount.split('.', 2),
                d = a[1];
            var i = parseInt(a[0]);
            if (isNaN(i)) {
                return '';
            }
            var minus = '';
            if (i < 0) {
                minus = '-';
            }
            i = Math.abs(i);
            var n = i.toString();
            a = [];
            while (n.length > 3) {
                var nn = n.substr(n.length - 3);
                a.unshift(nn);
                n = n.substr(0, n.length - 3);
            }
            if (n.length > 0) {
                a.unshift(n);
            }
            n = a.join(delimiter);
            if (d && d.length < 1) {
                amount = n;
            }
            else {
                amount = d ? n + '.' + d: n;
            }
            amount = minus + amount;
            return amount;
        };
        // end of function CommaFormatted()

        function clearComma(value) {
            while (value.indexOf(",") > 0){
                value = value.replace(",", "");
            }
            return value;
        }
    });
})();