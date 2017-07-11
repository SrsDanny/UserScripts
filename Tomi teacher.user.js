// ==UserScript==
// @name         Tomi teacher
// @namespace    http://tampermonkey.net/
// @version      0.3
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
.hidden.visible { color: white; background-color: green; font-weight: bold; display: inline; }
.list { padding: 8px; position: fixed; right: 0; bottom: 0px; z-index: 99999; width: 35%; height: 40%; background-color: white; border-style: solid; border-width: 2px 0 0 2px; }
.striked { color: red; text-decoration: line-through; }`);

    var frenchLetters = /([ ]?)([a-zàâçéèêëîïôûùüÿñæœ’-]+)([ ,\.])/gi;

    var paragraphs = $('article p');
    var chosenWords = [];

    for(let i = 0; i < paragraphs.length; ++i) {
        let p = paragraphs[i];

        let prevChosen = false;
        p.innerHTML = p.textContent.replace(frenchLetters, function(original, p1, p2, p3, offset) {
            if(prevChosen || Math.random() > 0.1) {
                prevChosen = false;
                return original;
            }

            prevChosen = true;
            chosenWords.push(`<span id="${i}-${offset}-list-elem">${p2}</span>`);
            return `${p1}<span id="${i}-${offset}-inline" class="hidden">${p2}</span>${p3}`;
        });

    }
    $('span[id$="-inline"]').click(function(e) {
        var listElemId = '#'+e.target.id.replace('inline', 'list-elem');
        $(listElemId).toggleClass('striked');
        $(e.target).toggleClass('visible');
    });

    $('<div class="list"><p id="word-list"></p></div>').appendTo(document.body);
    $('#word-list').html(_(chosenWords).shuffle().join(', '));
})();
