// ==UserScript==
// @name          Torn - Slots
// @namespace     http://userstyles.org
// @description   Play 5 tokens at once
// @author        Fitchett
// @include       http://www.torn.com/loader.php?sid=slots
// @include       https://www.torn.com/loader.php?sid=slots
// @require       http://code.jquery.com/jquery-latest.js
// @run-at        document-end
// @version       0.1
// ==/UserScript==
(function(){
    var betAmt = 10,
        moneyWon = 0,
        tokenBatch = 5,
        tmpTotalMoney = 0,
        slotUrl = "loader.php",
        btn = document.createElement("button"),
        slots = document.getElementsByClassName("slots-wrap")[0],
        casinoTokens = parseInt(document.getElementById("tokens").innerText),
        totalMoney = parseInt(document.getElementById("moneyAmount").innerText.replace(",", ""));
    
    slots.parentNode.insertBefore(btn, slots.nextSibling);

    if (casinoTokens == 0) {
        btn.innerText = "No tokens";
        return;
    }

    btn.innerText = "Play 5 tokens ($10)";

    function play(tokens, rfc) {
        $.ajax({
            type: "GET",
            data: {
                sid: "slotsInterface",
                step: "play",
                stake: betAmt,
                rfcv: rfc
            },
            success: function (response) {
                o = JSON.parse(response);
                var moneyWon =+ parseInt(o.moneyWon);

                // last spin
                if (tokens === 1) {
                    var newTotalMoney = tmpTotalMoney + moneyWon;
                    var text = "You just " + (newTotalMoney >= totalMoney ? "won" : "lost") + "  $";

                    btn.innerText = text + parseFloat(Math.abs(newTotalMoney - totalMoney));
                }
            }
        });
    }
    
    btn.addEventListener("click", function() {
        if (casinoTokens == 0) {
            return;
        }

        var i, rfc;

        tmpTotalMoney = totalMoney - (casinoTokens * betAmt);

        for (i=0; i<casinoTokens; i++) {
            rfc = getRFC();
            play(i, rfc);
        }

    }, false);
})();