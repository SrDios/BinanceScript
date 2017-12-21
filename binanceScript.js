// ==UserScript==
// @name         Binance Helper Power Max 2000
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Just a little helper for binance.
// @author       Wiedzmin (Mediavida)
// @match        https://www.binance.com/trade.html?symbol=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /********************************************************COIN VALUES************************************************/
    /* Coloca aquí siguiendo el formato (y separado por comas) las monedas que tienes y a que precio fueron compradas.*/
    /* Ejemplo: {'name':'BNB', 'price':0.0009495} */
    /* Además, deberás tener un valor visible de BTC/USDT en pantalla si quieres usar la calculadora, ya sea añadiendo la moneda a favoritos y teniendo este tab seleccionado, o seleccionando un tab que la contenga (los de la parte de arriba a la derecha).
    /*********************************************/
    var coinPrices = [{'name':'XVG', 'price':0.00000400},{'name':'BNB', 'price':0.0009495},{'name':'IOTA', 'price':0.00029700},{'name':'MANA', 'price':0.00000362},{'name':'TRX', 'price':0.00000330}];
    //Cambia este valor si quieres que se refresque cada mas o menos tiempo. Tiempo actual, 3000 milisegundos (3 segundos).
    var refreshTime = 3000;
    /***************/

    var loadChecker = setInterval(function(){
        if(!$('#pageLoading').is(":visible")){
            init();
            clearInterval(loadChecker);
        }
    }, 1000);



    var init = function(){
        $('body').append('<div style="float: right;color: #ffd800;position: absolute;top: 0;text-align: center;background-color: #909090;width: 250px;border: 1px dotted yellow;height: 75px;vertical-align: middle;margin-left: 44%;font-weight: bold;" id="mainDiv"></div>');
        setInterval(function(){
            bitcoinValue = $($("li:contains('BTC/USDT')").parent()).find('li')[2];
            var currentPrice = $('.kline-para').find('strong')[0];
            currentPrice = $(currentPrice).text();
            var name = "BTC";
            var infoBuy = "Comprado a: ";
            var infoSell = "Vender a: ";
            var infoGanancia = "Ganancia: ";
            var break_ = false;
            $(coinPrices).each(function( i ) {
                if($('.productSymbol').text().includes(coinPrices[i].name)) {
                    infoBuy += coinPrices[i].price;
                    name = coinPrices[i].name;
                    infoSell += coinPrices[i].price + percent(coinPrices[i].price);
                    infoGanancia += (((currentPrice*100)/coinPrices[i].price) -100).toFixed(2);
                    break_ = true;
                }
                if(break_)
                    return false;
            });
            var spanName="<span>"+name+"</span><br/>";
            var span1="<span>"+infoBuy+"</span>";
            var span2="<span>"+infoSell+"</span>";
            var span3="<span>"+infoGanancia+"%</span>";
            $('#mainDiv').html(spanName+span1+"<br/>"+span2+"<br/>"+span3);
        }, refreshTime);

        var calculator="<span><input id='satoshis' class='satoshis' type='text' width='100' /><br/><span class='dollars'> </span></span>";
        var bitcoinValue = $($("li:contains('BTC/USDT')").parent()).find('li')[2];
        $('body').append('<div style="float: right;color: #ffd800;position: absolute; right: 0;top: 0; text-align: center;background-color: #909090;width: 250px;border: 1px dotted yellow;height: 75px;vertical-align: middle;margin-left: 44%;font-weight: bold;">'+ calculator +'</div>');
        if(!bitcoinValue){
            $('.dollars').text('BitCoin price not found');
        }
    };


    /**Helpers**/
    function percent(price) {
        return (5 / 100) * price;
    }

    /**Calculadora**/
    $('#satoshis').keyup(function (e) {
        var usd = $('#satoshis').val();
        $('.dollars').text( bitcoinValue.innerText.replace(',','') * usd);
    });

})();
