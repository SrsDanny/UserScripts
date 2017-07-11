// ==UserScript==
// @name         Tomi teacher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes words from <p> and stuff
// @author       SrsDanny
// @match        http://www.lemonde.fr/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`.hidden { background-color: red; color: red; width: 5em; display: inline-block; }
.hidden-check:checked + .hidden { color: white; background-color: green; font-weight: bold; display: inline; }
.hidden-check { position: fixed; top: -100px; }
.list { position: fixed; right: 0; bottom: 0px; z-index: 99999; width: 35%; height: 40%; background-color: white; border-style: solid; border-width: 2px 0 0 2px; }
.list p { padding: 8px; }
.striked { color: red; text-decoration: line-through; }`);

    var frenchLetters = /([ ]?)([a-zàâçéèêëîïôûùüÿñæœ’-]+)([ ,\.])/gi;

    var paragraphs = $('article p');
    var chosenWords = [];

    $('<div class="list"><p id="word-list"></p></div>').appendTo(document.body);

    for(let i = 0; i < paragraphs.length; ++i) {
        let p = paragraphs[i];

        let prevChosen = false;
        p.innerHTML = p.textContent.replace(frenchLetters, function(original, p1, p2, p3, offset) {
            if(prevChosen || Math.random() > 0.1) {
                prevChosen = false;
                return original;
            }

            prevChosen = true;
            chosenWords.push(`<span id="${i}_${offset}_span">${p2}</span>`);
            return `<input class="hidden-check" type="checkbox" id="${i}_${offset}_check"/>${p1}<label class="hidden" for="${i}_${offset}_check">${p2}</label>${p3}`;
        });
    }
    $('input[id*="_check"]').click(function(e) {
        $('#'+e.target.id.replace('check', 'span')).addClass('striked');
        console.log(e.target.id.replace('check', 'span'));
    });
    $('#word-list').html(_(chosenWords).shuffle().join(', '));
})();
