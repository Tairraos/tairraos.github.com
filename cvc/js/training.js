/**
 * @Description
 * @Author Xiaole Tao <xiaolet@cisco.com>
 * @Date 18/01/2017
 */
$(function () {
    "use strict";

    $(".word").on("animationend", function () {
        $(this).removeClass("change");
    });

    $(".card-set").on("click", function () {
        console.log(111);
        changeCard($(this));
    });

    function changeCard($cardSet, character) {
        if (!$cardSet) {
            return;
        }
        if (!character) {
            character = "abcdefghjijklmnopqrstuvwxyz"[Math.random() * 26 | 0];
        }

        var $back = $(".back", $cardSet), $backCard = $(".card", $back),
            $word = $(".word", $cardSet), $wordCard = $(".card", $word);
        $backCard.text($wordCard.text());
        $wordCard.text(character);
        $word.addClass("change");


    }

}());
