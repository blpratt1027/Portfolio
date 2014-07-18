/**
 * Created by Bryan on 7/3/2014.
 */
"use strict";
var validateFields = function(fieldInfo) {
    var formVal = true;
    var fieldValue;
    var matchValue;
    var retValue;
    var firstInvalidField = null;
    var errorMsg;
    var cardType = null;
    var cardDigits;
    var cardFirstNum;
    var emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var zipReg = new RegExp('^\\d{5}(-\\d{4})?$');
    var numCnt;
    var validCardNum;
    var cscLen = 3;

    // First, clear all error fields
    for (var e in fieldInfo) {
        $('#' + fieldInfo[e].fieldname + '_error').text('');
    }

    for (e in fieldInfo) {
        errorMsg = "";
        fieldValue = $('#' + fieldInfo[e].fieldname);
        retValue = $(fieldValue).val();


        if (retValue) {
            if (fieldInfo[e].match) {
                matchValue = $('#' + fieldInfo[e].match).val();
                if (retValue !== matchValue) {
                    errorMsg = ' Must match.';
                }
            }
            if (fieldInfo[e].conditions.length) {
                if (retValue.length !== fieldInfo[e].conditions.length){
                    var descr = ' characters ';
                    if (fieldInfo[e].conditions.type === 'number') {
                        descr = ' digits ';
                    }
                    errorMsg = 'Must be ' + fieldInfo[e].conditions.length + descr + 'long.';
                }
            }
            switch (fieldInfo[e].conditions.type) {
                case 'email':
                    if (!emailReg.test(retValue)) {
                        errorMsg = "Must be a valid email address.";
                    }
                    break;
                case 'text':
                    break;
                case 'number':
                    if (isNaN(retValue)) {
                        errorMsg = "Must be a number.";
                    }
                    break;
                case 'zip':
                    if (!zipReg.test(retValue)) {
                        errorMsg = "Must be a valid zip code.";
                    }
                    break;
                case 'tel':
                    numCnt = 0;
                    for (var c in retValue) {
                        if(!isNaN(retValue[c]) && retValue[c] !== " ") {
                            numCnt++;
                        }
                    }
                    if (numCnt !== 10) { errorMsg = "Must be a valid US phone number."; }
                    break;
                case 'credit_card':
                    cardType = $('#' + fieldInfo[e].conditions.card_type_field).val();
                    switch (cardType) {
                        case 'visa':
                            cardDigits = 16;
                            cardFirstNum = '4';
                            break;
                        case 'mc':
                            cardDigits = 16;
                            cardFirstNum = '5';
                            break;
                        case 'amx':
                            cardDigits = 15;
                            cardFirstNum = '3';
                            break;
                    }
                    validCardNum = false;
                    if (!isNaN(retValue)){
                        if (retValue.length === cardDigits) {
                            if (retValue.charAt(0) === cardFirstNum) {
                                validCardNum = true;
                            }
                        }
                    }
                    if (!validCardNum) {
                        errorMsg = "Invalid card number";
                    }
                    break;
                case 'exp_date':
                    var expYr = parseInt(retValue);
                    var expMo = parseInt($('#' + fieldInfo[e].conditions.mo_field).val());
                    var today = new Date();
                    var expiredDate = new Date();

                    expiredDate.setMonth(expMo + 1);
                    expiredDate.setYear(expYr);
                    expiredDate.setDate(1);

                    if (today >= expiredDate) {
                        errorMsg = 'Past expiration date.';
                    }
                    break;
                case 'csc':
                    if (isNaN(retValue)) {
                        errorMsg = "Invalid security #.";
                    } else {
                        cardType = $('#' + fieldInfo[e].conditions.card_type_field).val();
                        if (cardType === "amx") cscLen = 4;
                        if (retValue.length !== cscLen) errorMsg = "Invalid security #.";
                    }
                    break;
            }
        } else {
            if (fieldInfo[e].conditions.required) {
                errorMsg = ' Required.';
            }
        }

        if (errorMsg) {
            $('#' + fieldInfo[e].fieldname + '_error').text(errorMsg).show();
            formVal = false;
            if (!firstInvalidField) {
                firstInvalidField = e;
            }
        }
    }

    if (!formVal) {
        /* Set focus on first element in fieldInfo */
        try {
            $('#' + fieldInfo[firstInvalidField].fieldname).focus();
        }
        catch(err) {
            // Do nothing.
        }
    }
    return formVal;
};  // End data validation function

// Format for fieldInfo object:
/*
 var fieldInfo =
 {'fieldname': name,                     // ID of the element to be evaluated.  Must have an associated <span> element named 'fieldname_error'
 'conditions': { 'min-length': length,                // Optional; for string values only
 'type': type,    // See list below
 'required': bool,                    // Required
 'length': len,      // optional
 'value': [
 {'name': placeholder, 'val': exact_val},
 {'name': placeholder, 'val': exact_val}
 ]
 },
 'match': fieldname,
 'messages': { 'required': msg,
 'optional': msg }
 }
 */
// Types
/*
 * text
 * email
 * number
 * zip
 * tel
 * credit_card
 * csc
 * expDate
 */
