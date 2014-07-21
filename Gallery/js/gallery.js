/**
/**
 * Created by Bryan L. Pratt on 6/2/2014.
 *  - Feature complete: 6/23/2014.
 *  - Code complete: 7/2/2014.
 */
(function application() {
    "use strict";
    $(document).ready(function () {
        var fullSiteContent = $("#content_wrapper");
         fullSiteContent.hide();    // Hide main page until data is loaded an page constructed (smooths loading)

        // Disable the context (right-click) menu to discourage copying images
        $(document).bind('contextmenu', function(e) {
            e.preventDefault();
        });
        // Application wide variables
        var img_path,
            img_title,
            img_fullFileName,
            thumb_fullFileName,
            item_to_delete = null,
            size_to_delete = null,
            currently_displayed_image_id = null,
            items,
            grand_total,
            formatted_item_total,
            gallery_title,
            copyright_holder,
            disclaimer_statements,
            itemsTotal,
            sh,
            tax,
            itemCount = 0,
            printSize,
            pwd,
            // session flags
            light_box_open = false,
            confirm_remove_item_open = false,
            emptyCartActive = false,
            delete_complete_item = false;

        // Local storage; declarations, get session data
        var storage = $.localStorage,
            disclaimerViewed = storage.get('general_viewed'),
            checkout_disclaimer_viewed = storage.get('checkout_viewed'),
            session_count = storage.get('count');
        if (!session_count) {
            session_count = 0;
        } else {
            if (session_count > 3) {
                disclaimerViewed = false;
                checkout_disclaimer_viewed = false;
                session_count = -1;
            }
        }
        session_count++;
        storage.set('count', session_count);

        // Retrieve saved shopping cart data from local storage
        var shoppingCart = storage.get('shoppingCart');
        if (!shoppingCart) {
            shoppingCart = [];
        }

        // Get the JSON file location from storage.  Generic gallery is standard.  Changing to Catherine's requires
        //   a password.
        var data_file = storage.get('dataFile');
        if (!data_file) {
            data_file = 'JSON/bp_images.json';
            storage.set('dataFile', data_file);
        }

        // Populate the cart label showing number of items in cart, if any
        cartLabel();

        // Element variables
        var lightBox = $("#light_box"),
            disclaimerDialogBox = $("#disclaimer"),
            cartDialogBox = $("#cart"),
            addedToCartDialogBox = $("#added_to_cart_popup"),
            confirmDeleteDialogBox = $("#confirm_delete"),
            orderConfDialogBox = $("#order_confirmation"),
            checkoutPage = $("#checkout_page"),
            useBillingCheckbox = $("#use_billing"),
            editShippingCheckbox = $('#edit_shipping'),
            messageBox = $("#msg_box"),
            overlay = $('#screen');

        // Create the galleries
        var gallery1 = $("#gallery_1"),
            gallery2 = $("#gallery_2"),
            gallery3 = $("#gallery_3");

        // Variables to hold pointers to functions to respond to <Enter> and <Esc> key presses
        var default_button,
            cancel_button;

        // Keyboard constants
        var ENTER = 13,
            ESC = 27,
            E_KEY = 69,
            Y_KEY = 89,
            N_KEY = 78,
            RIGHT_ARROW = 39,
            LEFT_ARROW = 37,
            F2 = 113;

        // Load images from JSON file.
        var images;
        $.getJSON(data_file, function (data) {  // Callback for initialization tasks which require data from JSON file
            var galleries = data.galleries;
            $("#gallery_1_name").html(galleries[0].name);
            $("#gallery_2_name").html(galleries[1].name);
            $("#gallery_3_name").html(galleries[2].name);

            var author = data.author;
            $("#author").html(author);

            copyright_holder = data.copyright;
            gallery_title = data.title;
            $(".gallery_title").html(gallery_title);
            $(".copyright_holder").html(copyright_holder);

            disclaimer_statements = data.disclaimer;

            printSize = parsePrintSizes(data.dimensions);

            pwd = data.pwd;

            images = data.images;

            // Load images into galleries
            loadImagesIntoGalleries(galleries);

            // Create the carousels
            gallery1.owlCarousel(
                {navigation: true,
                    items: 7
                }
            );

            gallery2.owlCarousel(
                {
                    navigation: true,
                    items: 7
                }
            );

            gallery3.owlCarousel(
                {navigation: true,
                    items: 7
                }
            );

            // Event handlers the require JSON data
            $(".gallery-order-tag").click(function () {
                if (!light_box_open) {
                    var imgID = $(this).parent().prev().attr("data-imgID");
                    light_box_open = true;
                    showLightBoxDialog(imgID);
                }
            });

            //$("img").dblclick(function () {
            $(".thumb").click(function () {
                if (!light_box_open) {
                    var imgID = $(this).attr("data-imgID");
                    showLightBoxDialog(imgID);
                    light_box_open = true;
                }
            });

            populateControlPanelButtons();
            // Slight delay and fading in allows for smoother load.
            fullSiteContent.delay(100).fadeIn(1500);

            // Disclaimer comes up on initial load and then after 5 loads
            if (!disclaimerViewed) {
                showDisclaimerDialog();
                storage.set('general_viewed', true);
            }
            // End initialization
        }); // End .get


// ----------------------- Initialization complete; image, gallery, and related data loaded -------------------------

// ----------------------- Event handlers -----------------------
        // --- General ---

        // Prevents text from being highlighted.  Thanks to Tom Roggero,
        //   http://stackoverflow.com/questions/880512/prevent-text-selection-after-double-click.
        // TODO - test this on older versions of IE.
        $("p, h1, h2, h3, h4, h5, frameset, label, span").mousedown (function (evt) {
            evt.preventDefault();
        });

        // Insert the return to the main portfolio page icon.
        $("#floating_main_link").fadeTo(200, 1).delay(2500).fadeTo(600, 0.2).click(function (){
            window.open("../index.html", "_self");
        }).hover(
            function () {
                $(this).stop().fadeTo(600, 1);
            },
            function () {
                $(this).stop().fadeTo(600, 0.2);
            }
        );

        // Activate jQueryUI draggable for dialog boxes.
        $(".draggable").draggable();

        // Keyboard handler
        $(window).keyup(function(evt) {
            var key = evt.which;
            evt.preventDefault();
            switch (evt.which) {
                case ENTER:
                    if (default_button) {
                        default_button();
                    }
                    break;
                case ESC:
                    if (cancel_button) {
                        cancel_button();
                    }
                    break;
                case E_KEY:
                    if (emptyCartActive) {
                        confirmEmptyCartDialog();
                    }
                    break;
                case N_KEY:
                    if (confirm_remove_item_open) {
                        closeDeleteConfirm();
                    } else if (emptyCartActive) {
                        closeConfirmEmptyCart();
                    }
                    break;
                case Y_KEY:
                    if (confirm_remove_item_open) {
                        deleteItem();
                    } else if (emptyCartActive) {
                        emptyCart();
                    }
                    break;
                case RIGHT_ARROW:
                    if (light_box_open) {
                        rightArrowClick();
                    }
                    break;
                case LEFT_ARROW:
                    if (light_box_open) {
                        leftArrowClick();
                    }
                    break;
                case F2:    // No prompt anywhere on site.  For 'admin' use only.
                    passwordPrompt();
                    break;
                default:
                    break;
            }
        }); // End keyboard handler

        $("#cart_icon").click(function() {
            populateCart();
        });

        // --- Dialog box related event handlers ---

        $("#user_control_panel, .arrow").hover( // Fade 'control panel' (upper right corner) and arrows in and out
            function () {
                $(this).stop().fadeTo(200, 1);
            },
            function () {
                $(this).stop().fadeTo(600, 0.67);
            }
        );

        $("#left_arrow").click(function () {
            leftArrowClick();
        });

        $("#right_arrow").click(function () {
            rightArrowClick();
        });

        useBillingCheckbox.change(function () {  // On checkout page
            $("#billing_info_caption").text(" Billing and Shipping Information ");
            $("#shipping_info").slideUp(400, function () {
                //centerDialogVert(checkoutPage);
            });
            editShippingCheckbox.prop('checked', false).show();
            $("#es_label").show();
        }); // End useBillingCheckbox event handler

        editShippingCheckbox.change(function (){  // On checkout page
            $("#billing_info_caption").text(" Billing Information ");
            $("#shipping_info").slideDown(400, function () {
                //centerDialogVert(checkoutPage);
            });
            useBillingCheckbox.prop('checked', false);
            editShippingCheckbox.hide();
            $("#es_label").hide();
        }); // End editShippingCheckbox event handler

        $("#card_type").change(function () {  // On checkout page
            var ccType = this.value,
                card = $(this).find(":selected").text(),
                digits = "3",
                side = " back ",
                location = " to the right of ",
                cardFeature = " the signature box.",
                ccLen = "16",
                defaultPrompt = null,
                prompt,
                promptPrefix = "Enter your ";
            switch (ccType) {
                case "visa":
                    prompt = ccLen + "-digit Visa";
                    break;
                case "mc":
                    prompt = ccLen + "-digit MC";
                    break;
                case "amx":
                    ccLen = "15";
                    prompt = ccLen + "-digit AmX";
                    digits = "4";
                    side = " front ";
                    location = " just above and to the right of ";
                    cardFeature = " your main credit card number.";
                    break;
                default:
                    ccLen = "0";
                    digits = "0";
                    defaultPrompt = "Select your card type";
            }
            var placeholderPrompt = prompt + " # (no dashes or spaces)",
                fullPrompt = promptPrefix + placeholderPrompt,
                helpPrompt = "Your " + card + " card's " + digits + "-digit security number is located on the" + side +
                " of the card" + location + cardFeature;

            if (defaultPrompt) {
                fullPrompt = defaultPrompt;
                placeholderPrompt = defaultPrompt;
                helpPrompt = null;
            }
            $("#card_number").attr({"placeholder": placeholderPrompt, "title": fullPrompt, "maxlength": ccLen});
            $("#ccn_label").attr("title", fullPrompt);
            $("#security_code").attr("maxlength", digits);
            if (helpPrompt) {
                $("#security_code_help").attr("title", helpPrompt).fadeIn(300);
            } else {$("#security_code_help").hide(); }
        });  // End card_type change event handler

        // Limit input in zip code fields to numbers and dash only
        $("#b_zip, #s_zip").on("keyup", function() {
            var txt = $(this).val().split("-");
            var tmp = "";
            for (var i in txt) {
                if (isNaN(txt[i])) {
                    txt[i] = txt[i].slice(0, txt[i].length - 1);
                }
                if (i > 0) tmp += "-";
                tmp += txt[i];
                $(this).val(tmp);
            }
        });

        // Limit input in credit card and csc fields to numbers only
        $("#card_number, #security_code").on("keyup", function() {
            var txt = $(this).val();
            if (isNaN(txt)) {
                txt = txt.slice(0, txt.length - 1);
                $(this).val(txt);
            }
        });
// ---------- End event handlers -------------

// ----------------------- Functions -----------------------
        // --- Loading and initialization ---
        function cartLabel() {
            // Populates the label for the cart icon in the upper-right corner of the window
            var quantityLabel = " items",
                verb = "are ",
                checkoutButton = $(".checkout-button");


            items = 0;
            $.each(shoppingCart, function(id, image) {
                items += image.Sizes.length;
            });
            if (items > 0) {
                $("#cart_icon").attr("src", "images/assets/shopping_cart_full.png");
                checkoutButton.removeClass("disabled");
                $("#empty_cart_button").removeClass("disabled");
                if (items === 1){
                    quantityLabel = " item";
                    verb = "is ";
                }
            } else {
                $("#cart_icon").attr("src","images/assets/shopping_cart_empty.png");
                checkoutButton.addClass("disabled");
            }
            quantityLabel = verb + items.toFixed() + quantityLabel;
            $("#cart_count").text(quantityLabel);
        } // End cartLabel function

        function populateControlPanelButtons() {
            var cp = $("#user_control_panel");
            var cartButton = createButton(' Edit cart / Checkout ', populateCart,
                'This is a "mock" site.  Images are not actually for sale.');
            cartButton.className += ' checkout-button populate-cart';
            addToEl(cp, cartButton);
            var br = crEl('br');
            addToEl(cp, br);
            var disclaimerButton = createButton('Disclaimer', showDisclaimerDialog,
                'Click to see the site disclaimer.');
            disclaimerButton.className += ' disclaimer-button';
            addToEl(cp, disclaimerButton);
            cancel_button = closeDisclaimer;
            default_button = closeDisclaimer;
        }

        // The dynamic elements on this site are created using two small functions for creating elements
        //   and appending them to other elements.  The functions:
        //  * crEl    - creates new elements (document.createElement)
        //  * adToEl  - nests elements (appends one element within another)
        function loadImagesIntoGalleries(galleries) {
            var gallery1ID = galleries[0].id,
                gallery2ID = galleries[1].id,
                gallery3ID = galleries[2].id;

            for (var i = 0; i < images.length; i++) {
                img_path = "images/" + images[i].gallery + "/";
                img_title = images[i].title;
                img_fullFileName = img_path + images[i].fileName + ".jpg";
                thumb_fullFileName = img_path + "thumbs/" + images[i].fileName + "_thumb.jpg";

                // Create figure with img and caption tags for each image
                var fig = crEl('figure'),
                    img = crEl('img');
                img.className = 'thumb';
                img.src = thumb_fullFileName;
                img.alt = img_title;
                img.title = img_title + ' - Copyright ' + String.fromCharCode(169) + ' '  + copyright_holder +
                    '\nClick to open in light box';
                img.setAttribute('data-full', img_fullFileName);
                img.setAttribute('data-imgID', i.toFixed());
                addToEl(fig, img);
                var fc = crEl('figcaption');
                fc.innerHTML = img_title;
                var sp= crEl('span');
                sp.innerHTML = '-Order';
                sp.className = 'gallery-order-tag';
                addToEl(fc, sp);
                addToEl(fig, fc);

                switch (images[i].gallery) {
                    case gallery1ID:
                        addToEl(gallery1, fig);
                        break;
                    case gallery2ID:
                        addToEl(gallery2, fig);
                        break;
                    case gallery3ID:
                        addToEl(gallery3, fig);
                        break;
                    default:
                        alert("Error: invalid image path processing JSON...");
                }
            } // End for loop to load images into galleries
        }

        // --- Dialog Boxes ---
        function showDisclaimerDialog() {
            var closeIcon = createCloseIcon(closeDisclaimer);
            addToEl(disclaimerDialogBox, closeIcon);
            var p;
            var statementWrapper = $("#disclaimer_statements");
            statementWrapper.empty();
            var msgLen = 0;
            for (var s = 0; s < disclaimer_statements.length; s++) {
                p = crEl('p');
                p.innerHTML = disclaimer_statements[s].para;
                addToEl(statementWrapper, p);
                // Get the total length of the message
                msgLen += disclaimer_statements[s].para.length;
            }
            var pauseLength = (msgLen * 50);
            if (!copyright_holder) {$("#disclaimer_copyright_notice").addClass("hidden");}
            centerDialogVert(disclaimerDialogBox);
            addOverlay();
            disclaimerDialogBox.stop().delay(300).fadeIn(1750).delay(pauseLength).fadeOut(2000,
                function () {
                    removeOverlay();
                });
            default_button = closeDisclaimer;
            cancel_button = closeDisclaimer;
        } // End showDisclaimerDialog

        function showLightBoxDialog(id) {
            // The sizes and locations of objects in this dialog box are calculated proportionally so the light box
            //  can fill most of the window regardless of what size it is.
            closeDisclaimer();  // Verify this dialog is closed, because if it is still active, it will through off
                                //  the overlay.
            var lastID = images.length - 1,
                intID = parseInt(id);
            currently_displayed_image_id = intID;

            var link = "images/" + images[intID].gallery + "/" + images[intID].fileName + ".jpg",
                title = images[intID].title,
                fullImageWrapper = $("#full_image_wrapper"),
                watermark = $("#watermark"),
                leftArrow = $("#left_arrow"),
                rightArrow = $("#right_arrow"),
                closeIcon = createCloseIcon(closeLightBox),
                lbClose = $("#lbox_close");

            lbClose.empty();
            addToEl(lbClose, closeIcon);

            if (intID < lastID) {
                var currentGallery = images[intID].gallery,
                    nextGallery = images[intID + 1].gallery;
                if (currentGallery === nextGallery) {
                    rightArrow.removeClass("arrow-hidden");
                } else {
                    rightArrow.addClass("arrow-hidden");
                }
                if (intID > 0) {
                    leftArrow.removeClass("hidden");
                    var prevGallery = images[intID - 1].gallery;
                    if (currentGallery === prevGallery) {
                        leftArrow.removeClass("arrow-hidden");
                    } else {
                        leftArrow.addClass("arrow-hidden");
                    }

                } else {
                    leftArrow.addClass("arrow-hidden");
                }
            } else {
                rightArrow.addClass("arrow-hidden");
            }
            var displayWidth = $(window).width(),
                displayHeight = $(window).height(),
                popUpWidth, popUpHeight;

            if ((displayHeight / displayWidth) > 0.74) {
                popUpWidth = displayWidth * 0.9558;
                popUpHeight = popUpWidth / 1.43;
                if (displayHeight < (popUpHeight + 24)) {
                    popUpHeight = displayHeight - 24;
                    popUpWidth = popUpHeight * 1.43;
                }
            } else {
                popUpHeight = displayHeight < 592 ? 472.8 : displayHeight * 0.9;
                popUpWidth = popUpHeight * 1.43;
                if (popUpWidth > displayWidth) {
                    popUpWidth = displayWidth; // - 30;
                    popUpHeight = (popUpWidth / 1.43); // - 30;
                }
            }


            var popUpMarginLeft = parseInt(popUpWidth / 2) * -1,
                popUpMarginTop = parseInt(popUpHeight / 2) * -1;
            lightBox.css({"width": popUpWidth, "height": popUpHeight, "margin-left": popUpMarginLeft,
                "margin-top": popUpMarginTop});
            var watermarkTop = popUpHeight * 0.58,
                watermarkLeft = (183 + (popUpHeight * 0.1405)),
                watermarkFontSize = popUpHeight * 0.068,
                arrowFontSize = popUpHeight * 0.1502;


            $(".cr-small").css({"font-size": watermarkFontSize *0.75, "margin-left": popUpHeight * 0.0793});
            watermark.css("line-height", ((watermarkFontSize * 0.67).toFixed()) + "px");
            $(".arrow").css("top", watermarkTop - (popUpHeight * 0.1562));
            leftArrow.css("left", 210);
            rightArrow.css("left", popUpWidth * 0.945);
            $("#lightbox_title").text(title);
            $("#image_info").css("height", popUpHeight - 100);
            var wrapperHeight = popUpHeight - 100;
            fullImageWrapper.css("height", wrapperHeight).empty();
            var img = crEl('img');
            img.id = 'main_img';
            img.src = link;
            img.title = title + ' - Copyright ' + String.fromCharCode(169) + ' ' + copyright_holder;
            addToEl(fullImageWrapper, img);
            var iconWrapper = $('#cart_button'),
                addButton = createButton('Add to Cart', addToCart);
            addButton.className += ' disabled';
            addButton.id = 'add_to_cart_button';
            iconWrapper.empty();
            addToEl(iconWrapper, addButton);
            // These fudge factors are required to make the elements the right sizes for various screen sizes.
            var fudgeFactor = (732.5 - wrapperHeight) / wrapperHeight,
                fudgePct = 0.99 - (fudgeFactor / 50),
                fudgePx = 15 + (fudgeFactor * 3),
                imgHeight = (wrapperHeight * fudgePct) - fudgePx;

            watermark.css({"top": watermarkTop, "left": watermarkLeft, "font-size": watermarkFontSize});
            leftArrow.css("font-size", arrowFontSize);
            rightArrow.css("font-size", arrowFontSize);

            $("#main_img").css("height", imgHeight);

            populatePriceList(id);

            window.scrollTo(0,0);
            $("body").css("overflow-y", "hidden");      // Disable scrollbar
            $("#add_to_cart_button").addClass("disabled");
            centerDialogVert(lightBox, 24);
            cancel_button = closeLightBox;
            default_button = addToCart;
            toggleOverlay();
            lightBox.fadeIn(100);
        } // End showLightBoxDialog method.

        function cartAddConfirmationDialog(orderItem) {
            var imgID = orderItem.ID,
                title = images[imgID].title,
                thumbSource = "images/" + images[imgID].gallery + "/thumbs/" + images[imgID].fileName + "_thumb.jpg",
                wrapper = $("#added_to_cart_content");
            wrapper.empty();

            var closeIcon = createCloseIcon(closeAddedToCartConfirm);
            addToEl(wrapper, closeIcon);

            var dv = crEl('div');
            dv.id = "order_conf_inner";
            dv.className = "inner-border added-to-cart-height";
            var h5 = crEl('h5');
            h5.innerHTML = 'The image "' + title + '" has been added to your cart.';
            addToEl(dv, h5);
            var hr = crEl('hr');
            addToEl(dv, hr);

            var dv2 = crEl('div');
            dv2.className = "in-line-float"; // added-to-cart-height";

            var img = crEl('img');
            img.className = "small-thumb";
            img.src = thumbSource;
            img.alt = title;
            addToEl(dv2, img);
            addToEl(dv, dv2);

            var dv3 = crEl('div');
            dv3.id = 'size_list';
            dv3.className = "in-line-float size-detail"; // added-to-cart-height";

            var sizeLabel = 'Size';
            if (orderItem.Sizes.length > 1) {
                sizeLabel += 's';
            }

            var p = crEl('p');
            p.innerHTML = sizeLabel;
            addToEl(dv3, p);

            var ul = crEl('ul'),
                li;
            for (var s = 0; s < orderItem.Sizes.length; s++) {
                li = crEl('li');
                li.innerHTML = printSize[orderItem.Sizes[s].size];
                addToEl(ul, li);
            }
            addToEl(dv3, ul);
            addToEl(dv, dv3);
            addToEl(wrapper, dv);

            var chkOutBtn = createButton('Edit Cart / Checkout ', populateCart,
                    'This is a "mock" site.  Images are not actually for sale.'),
                closeBtn = createButton(' Back to Gallery', closeAddedToCartConfirm),
                btnWrapper = $('#added_to_cart_buttons');
            btnWrapper.empty();
            addToEl(btnWrapper, chkOutBtn);
            addToEl(btnWrapper, closeBtn);

            addedToCartDialogBox.css("width", 320).css("margin-left", -160).css("height", 190).css("border",
                "solid 4px #484c3c");
            $("#order_conf_inner").css("height", 140).css("margin-bottom", "5px");
            cancel_button = closeAddedToCartConfirm;
            default_button = populateShoppingCart;
            centerDialogVert(addedToCartDialogBox);
            addedToCartDialogBox.show();
        } // End cartAddConfirmationDialog

        function confirmItemDeletionDialog (imgID, imgSize, cartID, cartSize, entireID) {
            confirm_remove_item_open = true;
            var title = images[imgID].title,
                size = printSize[imgSize],
                thumb = "images/" + images[imgID].gallery + "/" + "thumbs/" + images[imgID].fileName + "_thumb.jpg";

            confirmDeleteDialogBox.empty();
            var closeIcon = createCloseIcon(closeDeleteConfirm);
            addToEl(confirmDeleteDialogBox, closeIcon);

            var hd = crEl('h3');
            hd.innerHTML = 'Confirm removing item<br><hr>';
            addToEl(confirmDeleteDialogBox, hd);

            var hr = crEl('hr');
            addToEl(confirmDeleteDialogBox, hr);

            var dv = crEl('div');
            dv.className = 'in-line-float narrow-pad';
            var img = crEl('img');
            img.src = thumb;
            img.className = 'tiny-thumb';
            addToEl(dv, img);
            addToEl(confirmDeleteDialogBox, dv);

            dv = crEl('div');
            dv.className = 'narrow-pad';
            var p = crEl('p');
            p.innerHTML = 'Do you want to remove <em>"' + title + '"</em> (' + size + ') from your cart?';
            addToEl(dv, p);
            addToEl(confirmDeleteDialogBox, dv);
            addToEl(confirmDeleteDialogBox, hr);

            dv = crEl('div');
            dv.className = 'text-center button-footer';
            var button_labels = ['<span class="u">Y</span>es', ' <span class="u">N</span>o ', ' Cancel'];
            for (var i = 0; i < 3; i++) {
                if (i === 0) {
                    p = createButton(button_labels[i], deleteItem);
                } else p = createButton(button_labels[i], closeDeleteConfirm);
                addToEl(dv, p);
            }
            addToEl(confirmDeleteDialogBox, dv);

            item_to_delete = cartID;
            size_to_delete = cartSize;
            delete_complete_item = entireID;
            centerDialogVert(confirmDeleteDialogBox);
            addOverlay();
            default_button = closeDeleteConfirm;
            cancel_button = default_button;

            cartDialogBox.css('z-index',0);
            confirmDeleteDialogBox.show();
        } // End confirmItemDeletionDialog function

        function confirmEmptyCartDialog() {
            if (!$(this).hasClass("disabled")) {
                var h = 'Empty Cart?',
                    msg = [ 'Are you sure you want to delete all items from your cart?'],
                    buttons = [
                    {'title': '<span class="u">Y</span>es '},
                    {'title': ' <span class="u">N</span>o '},
                    {'title': ' Cancel'}
                    ],
                    handlers = [emptyCart, closeConfirmEmptyCart, closeConfirmEmptyCart],
                    closeHandler = closeConfirmEmptyCart;

                default_button = closeConfirmEmptyCart;
                cancel_button = default_button;

                cartDialogBox.css('z-index', 0);
                msgBox(h, msg, buttons, handlers, closeHandler, 100);
            }
        } // End confirmEmptyCartDialog function

        function populateShoppingCart() {
            closeDisclaimer();
            var closeIcon = createCloseIcon(closeShoppingCart),
                cartContent = $("#cart_content");
            itemsTotal = 0;
            // Clear contents from the last time the cart was built
            cartContent.empty();
            addToEl(cartContent, closeIcon);
            var h2 = crEl('h2');
            h2.innerHTML = "Cart";
            addToEl(cartContent, h2);

            var dv = crEl('div');
            dv.className = "in-line-float cart-column-img";
            dv.innerHTML = '<p>&nbsp;</p>';
            addToEl(cartContent, dv);

            dv = crEl('div');
            dv.className = "in-line-float";

            var tb = crEl('table'),
                tr = crEl('tr'),
                th,
                classes = ["title text-center", "size", "price", "qty", "extprice text-right", "remove"],
                labels = ["Title", "Size", "Price", "Qty", "Ext Price", ""];

            for (var i = 0; i < classes.length; i++) {
                th = crEl('th');
                th.className = "cart-column-" + classes[i];
                th.innerHTML = labels[i];
                addToEl(tr, th);
            }
            addToEl(tb, tr);
            addToEl(dv, tb);
            addToEl(cartContent, dv);
            var hr = crEl('hr');
            addToEl(cartContent, hr);

            if (shoppingCart.length > 0) {
                var e,
                    id,
                    thumb_path,
                    title,
                    img,
                    s,
                    iSize,
                    sizeLabel;
                for (e = 0; e < shoppingCart.length; e++) {       // Loop for each image
                    id = shoppingCart[e].ID;
                    thumb_path = "images/" + images[id].gallery + "/thumbs/" + images[id].fileName + "_thumb.jpg";
                    title = images[id].title;

                    dv = crEl('div');
                    dv.className = "in-line-float cart-column-img";
                    img = crEl('img');
                    img.className = 'tiny-thumb';
                    img.src = thumb_path;
                    addToEl(dv, img);
                    addToEl(cartContent, dv);

                    dv = crEl('div');
                    dv.className = "in-line-float";
                    tb = crEl('table');

                    for (s = 0; s < shoppingCart[e].Sizes.length; s++) {      // Loop for each size
                        var iPrice,
                            td,
                            sel,
                            extPrice;
                        iSize = shoppingCart[e].Sizes[s].size;
                        sizeLabel = printSize[iSize];
                        // Get the price for this size of this image
                        for (i = 0; i < images[id].size_price.length; i++) {
                            if (parseInt(iSize) == images[id].size_price[i].size) {
                                iPrice = images[id].size_price[i].price;
                                break;
                            }
                        }

                        tr = crEl('tr');
                        td = crEl('td');
                        td.className = "cart-column-title";

                        if (parseInt(s) === 0) {
                            td.innerHTML = title;   // was innerHTML; see if this fixes the problem in FireFox
                        }
                        addToEl(tr, td);

                        td = crEl('td');
                        td.className = "cart-column-size";
                        td.innerHTML = sizeLabel;

                        addToEl(tr, td);

                        td = crEl('td');
                        td.className = 'cart-column-price';
                        td.innerHTML = '$' + iPrice.toFixed(2);
                        addToEl(tr, td);

                        td = crEl('td');
                        td.className = "cart-column-qty";
                        sel = crEl('select');
                        sel.className = "qty";
                        sel.id = id;
                        sel.name = iSize;

                        for (i = 1; i <= printSize.length; i++) {
                            //p = parseInt(p);
                            sel.options[i - 1] = new Option(i.toFixed(), i);
                            if (i == shoppingCart[e].Sizes[s].Qty){
                                sel.options[i - 1].selected = true;

                            }
                        }
                        sel.onchange = changeQtyInCart;

                        addToEl(td, sel);
                        addToEl(tr, td);

                        extPrice = iPrice * shoppingCart[e].Sizes[s].Qty;
                        itemsTotal += extPrice;
                        itemCount++;

                        td = crEl('td');
                        td.className = "cart-column-extprice";
                        td.innerHTML = '$' + extPrice.toFixed(2);
                        addToEl(tr, td);

                        td = crEl('td');
                        var p = createButton('Remove', removeItemFromCart);
                        p.id = id;
                        p.name = iSize;
                        addToEl(td, p);
                        addToEl(tr, td);
                        addToEl(tb, tr);

                    }           // End of loop for each size
                    addToEl(dv, tb);
                    addToEl(cartContent, dv);
                    hr = crEl('hr');
                    addToEl(cartContent, hr);
                }               // End of loop for each image
            } else {            // If no images in cart, display empty cart message.
                dv = crEl('div');
                dv.className = 'text-center';
                p = crEl('p');
                p.innerHTML = '<br>Your cart is empty.<br>';
                $("#empty_cart_button").toggleClass("disabled");
                addToEl(dv, p);
                addToEl(cartContent, dv);
            }                   // End of if items in cart

            dv = crEl('div');
            dv.className = 'in-line-float cart-column-img';
            dv.innerHTML = '<p>&nbsp;</p>';
            addToEl(cartContent, dv);

            dv = crEl('div');
            dv.className = "in-line-float";

            tb = crEl('table');
            tr = crEl('tr');

            var gTotal = '<strong>$' + CommaFormatted(CurrencyFormatted(itemsTotal)) + '<strong>';

            labels = ['&nbsp;', '&nbsp;', '', '<strong>Total:</strong>', gTotal, ''];

            for (i = 0; i < classes.length; i++) {
                td = crEl('td');
                td.className = "cart-column-" + classes[i];
                td.innerHTML = labels[i];
                addToEl(tr, td);
            }
            addToEl(tr, td);
            addToEl(tb, tr);
            addToEl(dv, tb);
            addToEl(cartContent, dv);
            hr = crEl('hr');
            addToEl(cartContent, hr);

            dv = crEl('div');
            dv.className = 'text-center button-footer';
            var chkOutBtn = createButton('Checkout ',checkOut,
                'This is a "mock" site.  Images are not actually for sale.');
            chkOutBtn.id = 'checkout';
            var emptyCartBtn = createButton(' <span class="u">E</span>mpty Cart ',confirmEmptyCartDialog);
            emptyCartBtn.id = 'empty_cart_button';
            if (shoppingCart.length === 0) {
                chkOutBtn.className += ' disabled';
                emptyCartBtn.className += ' disabled';
            }
            var closeCartBtn = createButton(' Back to Gallery', closeShoppingCart);
            addToEl(dv, chkOutBtn);
            addToEl(dv, emptyCartBtn);
            addToEl(dv, closeCartBtn);
            addToEl(cartContent, dv);

            var cartHeight = cartDialogBox.height(),
                cartTop = ($(window).height() - cartHeight) / 2;
            cartTop = cartTop > 5 ? cartTop : 5;
            $(".cart-div").css("top", cartTop);
            closeAddedToCartConfirm(0);
            centerDialogVert(cartDialogBox);
            cancel_button = closeShoppingCart;
            emptyCartActive = true;
            default_button = checkOut;
            addOverlay();
            cartDialogBox.fadeIn(200);
        } // End populateShoppingCart

        function checkOut() {
            closeLightBox();
            closeCart();
            closeAddedToCartConfirm(0);
            loadCheckout();
            var submitButton = createButton('Place Order', createOrderValidationPage,
                    'This is a "mock" site.  Images are not actually for sale.'),
                cnButton = createButton('Cancel', closeCheckoutPage),
                buttonWrapper = $('#co_buttons');
            submitButton.className += " wide-separation";
            cnButton.className += " wide-separation";
            buttonWrapper.empty();
            addToEl(buttonWrapper, submitButton);
            addToEl(buttonWrapper, cnButton);
            cancel_button = closeCheckoutPage;
            default_button = createOrderValidationPage;
            emptyCartActive = false;
            addOverlay();
            checkoutPage.show();
            $("#b_first_name").focus();
        } // End checkOut function

        function createOrderValidationPage() {
            // Create object of validation criteria
            var fieldInfo = [
                {'fieldname': "b_first_name",
                    'conditions': {'required': true}
                },
                {'fieldname': "b_last_name",
                    'conditions': {'required': true}
                },
                {'fieldname': "b_address1",
                    'conditions': {'required': true}
                },
                {'fieldname': "b_city",
                    'conditions': {'required': true}
                },
                {'fieldname': "b_state",
                    'conditions': {'required': true}
                },
                {'fieldname': "b_zip",
                    'conditions': {'required': true,
                        'type': 'zip'}
                },
                {'fieldname': "b_email",
                    'conditions': {'required': true,
                        'type': 'email'}
                },
                {'fieldname': "b_confirm_email",
                    'conditions': {'required': true,
                        'type': 'email'},
                    'match': 'b_email'
                },
                {'fieldname': "b_phone",
                    'conditions': {'required': false,
                        'type': 'tel'}
                },
                {'fieldname': "s_zip",
                    'conditions': {'required': false,
                        'type': 'zip'}
                },
                {'fieldname': "s_email",
                    'conditions': {'required': false,
                        'type': 'email'}
                },
                {'fieldname': "s_confirm_email",
                    'conditions': {'required': false,
                        'type': 'email'},
                    'match': 's_email'
                },
                {'fieldname': "s_phone",
                    'conditions': {'required': false,
                        'type': 'tel'}
                },
                {'fieldname': "card_type",
                    'conditions': {'required': true}
                },
                {'fieldname': "card_number",
                    'conditions': {'required': true,
                        'type': 'credit_card',
                        'card_type_field': 'card_type'}
                },
                {'fieldname': "security_code",
                    'conditions': {'required': true,
                        'type': 'csc',
                        'card_type_field': 'card_type'}
                    //'length': 3}
                },
                {'fieldname': 'exp_yr',
                    'conditions': {
                        'type': 'exp_date',
                        'mo_field': 'exp_mo'}
                }
            ];

            // Event handler to validate every time a field changes
            $(".co-input, #b_state, #exp_yr, #exp_mo").change( function () {
                validateFields(fieldInfo);
            });

            if (validateFields(fieldInfo)) {
                closeCheckoutPage();
                var billToInfo = buildBillTo(),
                    shipToInfo;
                $("#conf_page_billto_summary").html(billToInfo);
                if ($("#use_billing:checked").length === 1) {
                    shipToInfo = billToInfo;
                } else {
                    shipToInfo = buildShipTo();
                }
                $("#conf_page_shipto_summary").html(shipToInfo);
                var paymentInfo = buildPayment();
                $("#conf_page_payment_info").html(paymentInfo);

                var tb = crEl('table');
                tb.className = "order-conf-table";
                var tr = crEl('tr'),
                    th, td,
                    classes = ["title text-center confirmation-item-title", "size", "price text-right", "qty text-right", "extprice text-right",
                        "remove"],
                    labels = ["Title", "Size", "Price", "Qty", "Ext Price", ""];
                for (i = 0; i < classes.length; i++) {
                    th = crEl('th');
                    th.className = "cart-column-" + classes[i];
                    th.innerHTML = labels[i];
                    addToEl(tr, th);
                }
                addToEl(tb, tr);

                var titles = [],
                    sizes = [],
                    prices = [],
                    qtys = [],
                    extprices = [],
                    itemCnt = 0;

                for (var i = 0; i < shoppingCart.length; i++) {

                    for (var s = 0; s < shoppingCart[i].Sizes.length; s++) {
                        titles[itemCnt] = images[shoppingCart[i].ID].title;
                        sizes[itemCnt] = printSize[shoppingCart[i].Sizes[s].size];
                        prices[itemCnt] = getPrice(shoppingCart[i].ID, shoppingCart[i].Sizes[s].size);
                        qtys[itemCnt] = shoppingCart[i].Sizes[s].Qty;
                        extprices[itemCnt] = prices[itemCnt] * qtys[itemCnt];
                        itemCnt++;
                    }
                }

                for (i = 0; i < itemCnt; i++) {
                    tr = crEl('tr');
                    td = crEl('td');
                    td.innerHTML = titles[i];
                    td.className = "confirmation-item-title";
                    addToEl(tr, td);
                    td = crEl('td');
                    td.innerHTML = sizes[i];
                    addToEl(tr, td);
                    td = crEl('td');
                    //td.innerHTML = prices[i].toFixed();
                    td.innerHTML = '$' + CurrencyFormatted(prices[i]);
                    addToEl(tr, td);
                    td = crEl('td');
                    td.innerHTML = qtys[i]; //.toFixed();
                    addToEl(tr, td);
                    td = crEl('td');
                    //td.innerHTML = extprices[i].toFixed(2);
                    td.innerHTML = '$' + CommaFormatted(CurrencyFormatted(extprices[i]));
                    addToEl(tr, td);
                    addToEl(tb, tr);
                }
                var confInfoDiv = $("#confirmation_info");
                confInfoDiv.empty();
                addToEl(confInfoDiv, tb);
                $("#conf_items_total").html(formatted_item_total);
                $("#conf_s_h").html(sh);
                $("#conf_tax").html(tax);
                $("#conf_grand_total").html(grand_total);

                var closeIcon = createCloseIcon(closeOrderConfirmation),
                    closeDiv = $("#oc_close");
                closeDiv.empty();
                addToEl(closeDiv, closeIcon);

                var buttonDiv = $('#oc_buttons'),
                    confButton = createButton('Click to complete your order ', confirmOrder),
                    cnclButton = createButton('Cancel', closeOrderConfirmation),
                    hr = crEl('hr');
                buttonDiv.empty();
                addToEl(buttonDiv, hr);
                addToEl(buttonDiv, confButton);
                addToEl(buttonDiv, cnclButton);

                centerDialogVert(orderConfDialogBox);
                cancel_button = closeOrderConfirmation;
                default_button = confirmOrder;
                addOverlay();
                orderConfDialogBox.show();
            } // End 'if validated' block
        } // End createOrderValidationPage

        function confirmOrderPlacedDialog() {
            var h = 'Order confirmation',
                msg = ['Because this is a "mock" site, no order has been placed and no data has been saved.',
                'Your shopping cart has been emptied.'],
                btn = [{'title': 'OK'}],
                bHndlr = [closeMsgBox],
                cHndlr = closeMsgBox,
                delay = 300;
            default_button = closeMsgBox;
            cancel_button = default_button;
            msgBox(h, msg, btn, bHndlr, cHndlr, delay);
        }

        function msgBox(heading, message, buttons, buttonHandlers, closeHandler, delay) {
            // heading - String that will appear in the h3 heading
            // message - Array of strings.  Each array element will be a paragraph.
            // buttons - array array of objects: [ { 'title': 'OK' }, { 'title': 'Cancel' }, { 'title': 'Click' }, etc ]
            //          Can be anything.  To work, there must be a corresponding handler.
            // handlers - array of methods, one for each button.  Number of handlers must match number of buttons.
            // closeHandler - the handler for the close icon.
            // delay (optional) - fade in time

            messageBox.empty();
            var header = crEl('h2');
            header.className = 'slim-h';
            header.innerHTML = heading;
            addToEl(messageBox, header);
            var innerDiv = crEl('div');
            innerDiv.className = 'inner-border';

            var p, br;

            for (var m = 0; m < message.length; m++) {
                p = crEl('p');
                p.innerHTML = message[m];
                addToEl(innerDiv, p);
                br = crEl('br');
                addToEl(innerDiv,br);
            }

            addToEl(messageBox, innerDiv);

            var buttonDiv = crEl('div');
            buttonDiv.className = 'text-center button-footer';

            var button;
            for (var b = 0; b < buttons.length; b++) {
                button = createButton(buttons[b].title);
                button.onclick = buttonHandlers[b];
                addToEl(buttonDiv, button);
            }

            addToEl(messageBox, buttonDiv);

            var closeIcon = createCloseIcon(closeHandler);
            addToEl(messageBox, closeIcon);

            centerDialogVert(messageBox);
            addOverlay();
            if (delay) {
                messageBox.fadeIn(delay);
            } else {
                messageBox.show();
            }
        } // End msgBox function

        function passwordPrompt() {
            var popupDiv = $("#pwd_popup");
            // Test
            //popupDiv.className = 'pop-up thick-border auto-height';
            popupDiv.empty();
            var closeIcon = createCloseIcon(closePasswordPrompt);
            addToEl(popupDiv, closeIcon);
            var label = crEl('label');
            label.for = 'password';
            label.innerHTML = 'Enter password: ';
            addToEl(popupDiv, label);
            var tb = crEl('input');
            tb.type = 'password';
            tb.name = 'password';
            tb.id = 'password';
            addToEl(popupDiv, tb);
            var br = crEl('br');
            addToEl(popupDiv, br);
            var hr = crEl('hr');
            addToEl(popupDiv, hr);
            var p = crEl('p');
            p.innerHTML = 'Enter';
            p.className = 'button-style small-button';
            p.onclick = passwordHandler;
            addToEl(popupDiv, p);
            p = crEl('p');
            p.className = 'button-style small-button';
            p.innerHTML = 'Cancel';
            p.onclick = closePasswordPrompt;
            addToEl(popupDiv, p);
            centerDialogVert(popupDiv);
            //addToEl(fullSiteContent, popupDiv);
            popupDiv.show();
            tb.focus();
            default_button = passwordHandler;
            cancel_button = closePasswordPrompt;
        }

        // --- Close Dialog Boxes ---
        function closeDisclaimer() {
            disclaimerDialogBox.stop().hide();
            removeOverlay();
            default_button = null;
            cancel_button = null;
        }

        function closeLightBox() {
            lightBox.fadeOut(500);
            $("body").css("overflow-y", "auto");
            toggleOverlay();
            $("#main_img").remove();
            light_box_open = false;
            default_button = null;
            cancel_button = null;
        } // End closeLightBox function

        function closeAddedToCartConfirm(delay) {
            addedToCartDialogBox.stop().fadeOut(delay);
            $(lightBox).css('z-index', 100);
            cancel_button = closeLightBox;
            default_button = addToCart;
        } // End closeAddedToCartConfirm function

        function closeDeleteConfirm() {
            confirmDeleteDialogBox.hide();
            cartDialogBox.css('z-index', 100);
            cancel_button = closeShoppingCart;
            default_button = checkOut;
            confirm_remove_item_open = false;
        } // End closeDeleteConfirm function

        function closeConfirmEmptyCart () {
            messageBox.fadeOut(150);
            cartDialogBox.css('z-index', 100);
            cancel_button = closeShoppingCart;
            default_button = checkOut;
        }

        function closeShoppingCart() {
            emptyCartActive = false;
            closeCart(150);
        } // End closeShoppingCart function

        function closeCart(delay) {
            if (delay) {
                cartDialogBox.stop().fadeOut(delay);
            } else {
                cartDialogBox.hide();
            }
            removeOverlay();
            default_button = null;
            cancel_button = null;
        } // End closeCart

        function closeCheckoutPage() {
            checkoutPage.hide();
            default_button = null;
            cancel_button = null;
            emptyCartActive = false;
            removeOverlay();
        } // End closeCheckoutPage function

        function closeOrderConfirmation() {
            orderConfDialogBox.hide();
            closeCheckoutPage();
            removeOverlay();
            default_button = null;
            cancel_button = null;
        } // End closeOrderConfirmation function

        function closeMsgBox() {
            messageBox.hide();
            removeOverlay();
            default_button = null;
            cancel_button = null;
        } // End closeMsgBox function

        function closePasswordPrompt() {
            $("#pwd_popup").hide();
            default_button = null;
            cancel_button = null;
        }

        // --- Functions and support for Dialog Boxes
        function leftArrowClick() {
            if (!$(this).hasClass("arrow-hidden")) {
                currently_displayed_image_id -= 1;
                $("body").css("overflow-y", "auto");
                toggleOverlay();
                showLightBoxDialog(currently_displayed_image_id);
            }
        }

        function rightArrowClick() {
            if (!$(this).hasClass("arrow-hidden")) {
                currently_displayed_image_id += 1;
                $("body").css("overflow-y", "auto");
                toggleOverlay();
                showLightBoxDialog(currently_displayed_image_id);
            }
        }

        function addToCart() {
            if (!$("#add_to_cart_button").hasClass("disabled")) {
                var thisID = $("#price_list :checkbox").attr("name"),
                    thisSize,
                    Sizes = [];
                $("#price_list :checkbox").each(function () {
                    if ($(this).is(':checked')) {
                        thisSize = parseInt($(this).attr("value"));
                        Sizes.push({"size": thisSize, "Qty": 1});    // Quantity is 1 by default; can be changed in cart
                    }
                });
                var orderItem = {"ID": thisID, "Sizes": Sizes};
                shoppingCart.push(orderItem);
                storage.set('shoppingCart', shoppingCart);

                cartAddConfirmationDialog(orderItem);
                cartLabel();
                populatePriceList(thisID);
                lightBox.css('z-index', 0);
                $("#add_to_cart_button").addClass("disabled");
                cancel_button = closeAddedToCartConfirm;
                default_button = populateCart;
            }
        } // End addToCart function

        function populateCart() {
            if (!$(this).hasClass("disabled")) {
                closeLightBox();
                populateShoppingCart();
            }
        } // End closeConfirmEmptyCart function

        function populatePriceList(id) {
            var priceTag,
                size,
                sizeLabel,
                price,
                priceLabel;
            $("#price_list").empty();
            //for (var i = 0; i < images[id].size_price.length; i++) {
            for (var i in images[id].size_price) {
                size = images[id].size_price[i].size;
                sizeLabel = printSize[size];
                price = images[id].size_price[i].price;
                priceTag = '<input type="checkbox" name="' + id + '" value="' + size + '"';
                if (duplicateItem(id,size)){
                    priceTag += ' disabled ';
                    priceLabel = "(in cart)";
                } else {
                    priceLabel = '$' + price + '.00';
                }
                priceTag += '>';
                priceTag += sizeLabel + ' &mdash; ' + priceLabel + ' <br>';
                $("#price_list").append(priceTag);
                $("#price_list :checkbox").click(function () {
                    var selected = false;
                    $("#price_list :checkbox").each(function (){
                        if ($(this).is(':checked')) {
                            selected = true;
                        }
                    });
                    if (selected) {
                        $("#add_to_cart_button").removeClass("disabled");
                    } else {
                        $("#add_to_cart_button").addClass("disabled");
                    }
                });
            }
        } // End populatePriceList

        function changeQtyInCart() {
            // Handler (added dynamically in populateShoppingCart method) for a Qty selection change
            var id = this.id,
                size = this.name,
                newQty = this.value;
            for (var e in shoppingCart) {
                if (shoppingCart[e].ID == id) {
                    for (var s = 0; s < shoppingCart[e].Sizes.length; s++) {
                        if (shoppingCart[e].Sizes[s].size == size) {
                            shoppingCart[e].Sizes[s].Qty = newQty;
                            storage.set('shoppingCart', shoppingCart);
                            populateShoppingCart();
                            break;
                        }
                    }
                }
            }
        } // End changeQtyInCart function

        function removeItemFromCart() {
            // Handler (added dynamically in populateShopping cart method) for a Remove button click
            var id = this.id;
            var size = this.name;
            for (var i = 0; i < shoppingCart.length; i++) {
                if (shoppingCart[i].ID == id) {
                    var entireID = (shoppingCart[i].Sizes.length === 1);
                    for (var j = 0; j < shoppingCart[i].Sizes.length; j++) {
                        if (shoppingCart[i].Sizes[j].size == size) {
                            confirmItemDeletionDialog(id, size, i, j, entireID);
                            break;
                        }
                    }
                }
            }
        } // End removeItemFromCart function

        function deleteItem (){
            if (delete_complete_item) {
                shoppingCart.splice(item_to_delete, 1);
            } else {
                shoppingCart[item_to_delete].Sizes.splice(size_to_delete, 1);
            }
            storage.set('shoppingCart', shoppingCart);
            closeDeleteConfirm();
            populateShoppingCart();
            cartLabel();
        } // End deleteItem function

        function emptyCart() {
            shoppingCart = [];
            storage.set('shoppingCart', shoppingCart);
            closeCart();
            cartLabel();
            closeConfirmEmptyCart();
            populateShoppingCart();
        } // End emptyCart function

        function loadCheckout() {
            // Get states data from JSON file
            $.getJSON('JSON/states.json', function (data) {
                var states = data.states,
                    b_sel = document.createElement('select'),
                    s_sel = document.createElement('select');
                for (var s = 0; s < states.length; s++) {
                    b_sel.options[s] = new Option(states[s].name, states[s].abbr);
                    s_sel.options[s] = new Option(states[s].name, states[s].abbr);
                }
                b_sel.id = "b_state";
                b_sel.name = "b_state";
                s_sel.id = "s_state";
                s_sel.name = "s_state";

                $("#b_state_list").empty().append(b_sel);
                $("#s_state_list").empty().append(s_sel);
            });

            populateExpDate();
            populateSummary();

            var closeWrapper = $("#co_close"),
                closeIcon = createCloseIcon(closeCheckoutPage);
            closeWrapper.empty();
            addToEl(closeWrapper, closeIcon);
            centerDialogVert(checkoutPage);
            if (!checkout_disclaimer_viewed) {
                $("#checkout_disclaimer").fadeIn(1200).delay(5000).fadeOut(2500);
                storage.set('checkout_viewed', true);
            }

        } // End of loadCheckout function

        function populateExpDate() {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                expMonth = document.createElement('select');
            expMonth.id = 'exp_mo';
            for (var i = 0; i < monthNames.length; i++) {
                expMonth.options[i] = new Option(monthNames[i], i);
            }
            $("#exp_month").empty().append(expMonth);

            var d = new Date(),
                currentYear = d.getFullYear(),
                expYear = document.createElement('select');
            expYear.id = 'exp_yr';
            for (i = 0; i < 10; i++) {
                expYear.options[i] = new Option(currentYear + i, currentYear + i);
            }
            $("#exp_year").empty().append(expYear);
        } // End populateExpDate function

        function confirmOrder() {
            // Wrapper function / handler for confirmOrderPlacedDialog.  Performs housekeeping before and after
            //  displaying the dialog.
            closeOrderConfirmation();
            confirmOrderPlacedDialog();
            shoppingCart = [];
            storage.set('shoppingCart', shoppingCart);
            cartLabel();
        } // End confirmOrder

        function populateSummary() {
            formatted_item_total = '$' + CommaFormatted(CurrencyFormatted(itemsTotal));
            $("#item_total").text(formatted_item_total);
            var shpHndl = 7.95 + (itemCount * 1.25);
            sh = '$' +  CommaFormatted(CurrencyFormatted(shpHndl));
            $("#s_h").text(sh);
            var tx = (itemsTotal + shpHndl) * 0.089;
            tax = '$' +  CommaFormatted(CurrencyFormatted(tx));
            $("#tx").text(tax);
            var gTotal = itemsTotal + shpHndl + tx;
            grand_total = '$' + CommaFormatted(CurrencyFormatted(gTotal));
            $("#grand_total").text(grand_total);

        } // End populateSummary function

        var buildBillTo = function () {
            // Function to build BillTo summary
            var br = '<br>',
                bt = $("#b_first_name").val(),
                mi = $("#b_MI").val();
            bt += mi.length > 0 ? ' ' + mi + '. ' : ' ';
            bt += $("#b_last_name").val() + br;
            bt += $("#b_address1").val() + br;
            var ad2 = $("#b_address2").val();
            if (ad2.length > 0) {
                bt += ad2 + br;
            }
            bt += $("#b_city").val() + ', ';
            bt += $("#b_state").val() + '  ';
            bt += $("#b_zip").val() + br;
            var tel = $("#b_phone").val();
            if (tel.length > 0) {
                bt += tel + br;
            }
            bt += $('#b_email').val();

            return bt;
        }; // End buildBillTo function

        var buildShipTo = function () {
            var br = '<br>',
                temp = $("#s_first_name").val(),
                st = temp.length > 0 ? temp : $("#b_first_name").val(),
                mi = $("#s_MI").val();
            if (mi.length === 0) {
                mi = $("#b_MI").val();
            }
            st += mi.length > 0 ? ' ' + mi + '. ' : ' ';
            temp = $("#s_last_name").val();
            st += temp.length > 0 ? temp + br : $("#b_last_name").val() + br;
            temp = $("#s_address1").val();
            st += temp.length > 0 ? temp + br : $("#b_address1").val() + br;
            var ad2 = $("#s_address2").val();
            if (ad2.length === 0) {
                ad2 = $("#b_address2").val();
            }
            if (ad2.length > 0) {
                st += ad2 + br;
            }
            temp = $("#s_city").val();
            st += temp.length > 0 ? temp + ', ': $("#b_city").val() + ', ';
            temp = $("#s_state").val();
            st += temp.length > 0 ? temp + '  ' : $("#b_state").val() + '  ';
            temp = $("#s_zip").val();
            st += temp.length > 0 ? temp + br : $("#b_zip").val() + br;
            var tel = $("#s_phone").val();
            if (tel.length === 0) {
                tel = $("#b_phone").val();
            }
            if (tel.length > 0) {
                st += tel + br;
            }
            temp = $('#s_email').val();
            st += temp.length > 0 ? temp : $('#b_email').val();

            return st;
        }; // buildShipTo;

        var buildPayment = function () {
            var cardType = $("#card_type").find(":selected").text(),
                cardNum = $("#card_number").val(),
                lastFour = cardNum.slice(cardNum.length - 4, cardNum.length);
            return cardType + ' card ending with ' + lastFour + '.';
        }; // End buildPayment function

        function centerDialogVert(elem, minTop) {
            var displayHeight = $(window).height(),
                dialogHeight = $(elem).height(),
                dialogTop = (displayHeight - dialogHeight) / 2,
                mTop;
            if (minTop) {
                mTop = minTop;
            } else {
                mTop = 24;      // 24 pixels is default to allow room for close icon
            }
            if (dialogTop < mTop) dialogTop = mTop;
            var topOffset = dialogTop / -16;
            //Position set to 'absolute' for compatibility with jQueryUI draggable, which alters the position attribute.
            $(elem).css({'top': dialogTop, 'margin-top': topOffset, 'position': 'absolute'});
        } // End centerDialogVert function
// ---------- End functions -------------

        function passwordHandler() {
            closePasswordPrompt();
            var enteredPwd = $("#password").val();
            if (enteredPwd === pwd){
                if (data_file.indexOf('bp') > 0) {
                    data_file = "JSON/images.json";
                } else { data_file = "JSON/bp_images.json";}
                storage.set('dataFile', data_file);
                shoppingCart = [];
                location.reload(true);
            }
        }

// ----------------------- Methods -----------------------
        var parsePrintSizes = function(dimensions) {  // Puts dimensions for JSON file into a formatted array
            var dquo = "&rdquo;";
            var size;
            var sizeArray = [];
            for (var d = 0; d < dimensions.length; d++) { //(var d in dimensions) {
                size = dimensions[d].width.toFixed() + dquo + ' x ' + dimensions[d].height.toFixed() + dquo;
                sizeArray.push(size);
            }
            return sizeArray;
        };

        var duplicateItem = function(item, sz) {
            // Checks for a duplicate entry in the shopping cart
            var dupe = false;
            //for (var e = 0; e < shoppingCart.length; e++) {
            for (var e in shoppingCart) {
                if (shoppingCart[e].ID == item) {
                    for (var s in shoppingCart[e].Sizes) {
                        if (shoppingCart[e].Sizes[s].size == sz) {
                            dupe = true;
                            break;
                        }
                    }
                    if (dupe) { break; }
                }
            }
            return dupe;
        }; // End duplicateItem function

        var crEl = function(element) {
            return document.createElement(element);
        };

        function addToEl(dest, element) {
            $(dest).append(element);
        }

        var getPrice = function(id, size) {
            for (var p = 0; p < images[id].size_price.length; p++) {
                if (images[id].size_price[p].size == size) {
                    return images[id].size_price[p].price;
                    break;
                }
            }
        }; // End getPrice function

        // Thanks to William Bontrager for the following two functions.  I was out of time and needed this solved quickly.
        // http://www.web-source.net/web_development/currency_formatting.htm#.U59KGfldV7g
        var CurrencyFormatted = function(amount) {
            var i = parseFloat(amount);
            if (isNaN(i)) {
                i = 0.00;
            }
            var minus = '';
            if (i < 0) {
                minus = '-';
            }
            i = Math.abs(i);
            i = parseInt((i + 0.005) * 100);
            i = i / 100;
            var s = i.toString();
            if (s.indexOf('.') < 0) {
                s += '.00';
            }
            if (s.indexOf('.') == (s.length - 2)) {
                s += '0';
            }
            s = minus + s;
            return s;
        };
        // end of function CurrencyFormatted()

        var CommaFormatted = function(amount) {
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
            if (d.length < 1) {
                amount = n;
            }
            else {
                amount = n + '.' + d;
            }
            amount = minus + amount;
            return amount;
        };
        // end of function CommaFormatted()

        var createCloseIcon = function(handler) {
            var img = crEl('img');
            img.className = 'close-icon';
            img.src = 'images/assets/Close.png';
            img.alt = 'Close icon';
            img.title = 'Close';
            img.onmousedown = handler;
            // Handling additional mouse events to avoid unexpected behaviors
            img.ondblclick = handler;
            return img;
        }; // End createCloseIcon function

        var createButton = function(text, handler, title) {
            // title is optional
            var p = crEl('p');
            p.className = 'button-style small-button';
            p.innerHTML = text;
            p.onclick = handler;
            if (title) {
                p.title = title;
            }
            return p;
        }; // End createButton function

        function addOverlay() {
            overlay.addClass('overlay');
        }

        function removeOverlay() {
            overlay.removeClass('overlay');
        }

        function toggleOverlay() {
            if (overlay.hasClass('overlay')) {
                overlay.removeClass('overlay');
            } else {
                overlay.addClass('overlay');
            }
        }

    }); // End document.ready
})();
