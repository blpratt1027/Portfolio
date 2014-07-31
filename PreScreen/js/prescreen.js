/**
 * Created by Bryan on 7/29/2014.
 */
(function () {
    "use strict";
    var cars = [{
        class: "Two-Seaters",
        name: "Honda CR-Z",
        mpg: 37
    },{
        class: "Minicompacts",
        name: "Scion iQ",
        mpg: 37
    },{
        class: "Compacts",
        name: "Toyota Prius",
        mpg: 50
    },{
        class: "Large",
        name: "Ford C-MAX Hybrid",
        mpg: 43
    },{
        class: "Small Station Wagons",
        name: "BMW 328d xDrive Sports Wagon",
        mpg: 35
    }],
        $ = function(elem) {
        return document.getElementById(elem);
    },
        begin = $("begin"),
        box1 = $("box1"),
        box2 = $("box2"),
        container = $("container"),
        buttonDiv = $("button_div"),
        continueButton = $("continue_button"),
        viewSpec = $("view_spec"),
        intro = $("intro"),
        page1 = $("wrapper1"),
        page2 = $("wrapper2"),
        chartBuilt = false;

    begin.onclick = function() {
        intro.style.display = "none";
        page1.style.display = "block";
        buttonDiv.style.display = "block";
    };

    container.onclick = function() {
        var origConfig = $("box1").innerHTML.indexOf("Box 1") > 0,
            newHTML;
        if (origConfig) {
            newHTML = box1.innerHTML.replace(/1/,"2");
            box1.innerHTML = newHTML;
            box1.style.backgroundColor = "rgb(135, 173, 183)";
            newHTML = box2.innerHTML.replace(/2/, "1");
            box2.innerHTML = newHTML;
            box2.style.backgroundColor = "#E0E0E0";
        } else {
            newHTML = box2.innerHTML.replace(/1/,"2");
            box2.innerHTML = newHTML;
            box2.style.backgroundColor = "rgb(135, 173, 183)";
            newHTML = box2.innerHTML.replace(/2/, "1");
            box1.innerHTML = newHTML;
            box1.style.backgroundColor = "#E0E0E0";
        }
    };

    continueButton.onclick = function() {
        if (this.innerHTML.indexOf("MPG") > 0) {
            if (!chartBuilt) {
                buildChart();
                chartBuilt = true;
            }
            page1.style.display = "none";
            page2.style.display = "block";
            this.innerHTML = "Back";
        } else {
            page1.style.display = "block";
            page2.style.display = "none";
            this.innerHTML = "Click to view the Car MPG Chart";
        }
    };

    viewSpec.onclick = function() {
        page1.style.display = "none";
        page2.style.display = "none";
        buttonDiv.style.display = "none";
        intro.style.display = "block";
        continueButton.innerHTML = "Click to view the Car MPG Chart";
    };

    function buildChart() {
        // Create this page dynamically
        var dataCellWidth = (((window.innerWidth) * 0.9) - 16) - 239,
            table = createElement('table'),
            tr = createElement('tr'),
            th = createElement('th'),
            td,
            div,
            colors = [
                {"bar": "#D67B7B", "text": "#2A1616"},
                {"bar": "#82AAF1", "text": "#233048"},
                {"bar": "#E8C46E", "text": "#2E2716"},
                {"bar": "#8FBC8F", "text": "#2B382B"},
                {"bar": "#D2B48C", "text": "#2A241C"}
            ],
            maxMPG = getMaxMPG(), // Determine highest mpg.  Width of bars in chart will be relative to this amount.
            p,
            barWidth;

        th.colSpan = "2";
        th.innerHTML = "Miles Per Gallon";
        addToDiv(tr, th);
        addToDiv(table, tr);
        for (var i in cars) {
            tr = createElement('tr');
            td = createElement('td');
            td.className = "label";
            p = createElement('p');
            p.className = "class";
            p.innerHTML = "Class: " + cars[i].class;
            addToDiv(td, p);
            p = createElement('p');
            p.className = "name";
            p.innerHTML = cars[i].name;
            addToDiv(td, p);
            addToDiv(tr, td);
            td = createElement('td');
            td.className = "data";
            div = createElement('div');
            div.className = "bar";
            barWidth = (dataCellWidth * (cars[i].mpg / maxMPG) - 20) + "px";
            div.innerHTML = cars[i].mpg;
            div.style.width = barWidth;
            div.style.backgroundColor = colors[i].bar;
            div.style.color = colors[i].text;
            addToDiv(td, div);
            addToDiv(tr, td);
            addToDiv(table, tr);
        }
        addToDiv(page2, table);
    }

    function getMaxMPG() {
        var max = 0,
            curr;
        for (var i in cars) {
            curr = cars[i].mpg;
            if (curr > max) {
                max = curr;
            }
        }
        return max;
    }
    function createElement(elem) {
        return document.createElement(elem);
    }

    function addToDiv(divName, elem) {
        divName.appendChild(elem);
    }

})();
