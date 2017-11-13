function main() {
    loadHighscore();
    randomIMG();
    flipClick();
    $(eventsHandlers);
}
$(main);

function eventsHandlers() {
    ($start).click(startGame);
    ($again).click(resetGame);
}

// sprawdź localStorage czy nie ma zapisanych wyników //
function loadHighscore() {
    if (localStorage.getItem(".localstorage16")) {
        $savedScore.html(localStorage.getItem(".localstorage16"));
    }
}

var img = [
    "img/icon1.png",
    "img/icon2.png",
    "img/icon3.png",
    "img/icon4.png",
    "img/icon5.png",
    "img/icon6.png",
    "img/icon7.png",
    "img/icon8.png",
    "img/icon9.png",
    "img/icon10.png",
    "img/icon11.png",
    "img/icon12.png",
    "img/icon13.png",
    "img/icon14.png",
    "img/icon15.png",
    "img/icon16.png",
]

var total = 0,
    move = 0,
    count = 1,
    first_card = null,
    secn_card = null;

var stop_fa = false,
    stop_fc = true,
    stop_time = true;

var $card = $('.card'),
    $board = $('.board'),
    $start = $('.start'),
    $again = $('.again'),
    $best = $('.best'),
    $savedScore = $(".localstorage16");

// utwórz pole 4 na 8 // 
var card_id = 0
for (i = 0; i < 4; i++) {
    for (j = 0; j < 8; j++) {
        $('.room').append(' <div class="card" data-id="' + card_id + '"><div class="front face"></div><div  data-bid="0" class="back face" ></div></div>')
        card_id++;
    }
    $('.room').append('<br>');
}
// rozpocznij grę //
function startGame() {
    total = 0;
    stop_fa = true;
    stop_fc = false;
    stop_time = false;
    $('.card').removeClass('flip');
    $start.hide();
    randomIMG();
}
// zagraj jeszcze raz, załaduj ponownie stronę //
function resetGame() {
    location.reload(true);
}

// tasowanie kart //
function randomIMG() {

    var c_array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16];
    var c_length = c_array.length;
    var $card = $('.card');

    $card.each(function() {
        var r_id = Math.floor(Math.random() * (c_length - 1));
        var temp = c_array[r_id];
        c_array[r_id] = c_array[c_length - 1];
        c_array[c_length - 1] = temp;

        c_length--

// css dla karty //
        $(this).find('.back').css({
            'background-image': 'url(' + img[temp - 1] + ')',
            'background-repeat': 'no-repeat',
            'background-size': '100%'
        });
// dodanie data-bid //
        $(this).find('.back').attr('data-bid', temp);
    });

    return 0;
}

function flipClick() {
    total = 0;
    move = 0;
    count = 1;
    var i = 0
    first_card = null;
    secn_card = null;
    var $card = $('.card');

    $card.find('.front').click(function() {

        if (stop_fc == true) {
            return 0;
        }

        $(this).parent('.card').toggleClass('flip');
        move++;
        $('.c_move').html(move);

        if (count == 1) {
            first_card = $(this).parent('.card').find('.back').attr('data-bid');
        } else if (count == 2) {
            secn_card = $(this).parent('.card').find('.back').attr('data-bid');
        }

        if (first_card == secn_card) {

            $('[data-bid="' + first_card + '"]').parent('.card').addClass('fliped')
            total++;
            if (total == 16) {
// po znalezieniu wszystkich 16 par zatrzymanie czasu //
                stop_time = true;

                var sec_f = pad(++sec % 60),
                    min_f = pad(parseInt(sec / 60, 10));
                stop_fc = reset(move, sec_f, min_f);
                stop_fc = true;
                move = 0;
            }
        }
        if (stop_fc) {
            return
        }
// liczeniue ruchów 2 pary - 1 ruch //
        count++
        if (count > 2) {
            console.log(first_card, secn_card)
            first_card = null;
            secn_card = null;
            count = 1;
            setTimeout(function() {
                $card.removeClass('flip');

            }, 400)
        }
    });

//liczenie czasu//
    var sec = 0;

    function pad(val) {
        return val > 9 ? val : "0" + val;
    }

    setInterval(function() {
        if (stop_time) {
            sec = 0
            return;
        }
        $(".sec").html(pad(++sec % 60));
        $(".min").html(pad(parseInt(sec / 60, 10)));
    }, 1000);
}

function reset(move, sec, min) {
    highScore = $(".bestmove").html();

// pokaż planszę końcową //
    $('.board').toggleClass('open');

    $board.find('.scr_moves').html(move);
    $board.find('.scr_sec').html(sec);
    $board.find('.scr_min').html(min);

// najlepszy wynik //
    if (move < highScore) {
        $best.find(".bestsec").html(sec);
        $best.find(".bestmin").html(min);
        $best.find(".bestmove").html(move);
    }
//zapisz wynik w highscore//
    localStorage.setItem(".localstorage16", $savedScore.html());

    return true;
}