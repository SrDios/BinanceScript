// ==UserScript==
// @name         Binance Helper Power Max 2000
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Just a little helper for binance.
// @author       Wiedzmin (Mediavida)
// @author       fmunozn
// @match        https://www.binance.com/trade.html?symbol=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var latestNotificationTime = 0;
    var notificationPeriod = 30000;

    function notifyMe(notification) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            new Notification(notification);
            latestNotificationTime = new Date().getTime();
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification("Hi there!");
                    latestNotificationTime = new Date().getTime();
                }
            });
        }

        // Finally, if the user has denied notifications and you
        // want to be respectful there is no need to bother them any more.
    }

    /********************************************************COIN VALUES************************************************/
    /* Coloca en la variable coinPrices siguiendo el formato (y separado por comas) las monedas que tienes y a que precio fueron compradas.*/
    /* Ejemplo: {'name':'BNB', 'price':0.0009495} */
    /* Además, deberás tener un valor visible de BTC/USDT en pantalla si quieres usar la calculadora, ya sea añadiendo la moneda a favoritos y teniendo este tab seleccionado, o seleccionando un tab que la contenga (los de la parte de arriba a la derecha).
    /*********************************************/
    var coinPrices = [{'name':'LTC', 'price':0.016020},{'name':'BNB', 'price':0.00063196},{'name':'IOTA', 'price':0.00027079},{'name':'XLM', 'price':0.00005601},{'name':'TRX', 'price':0.00000330}];
    //Cambia este valor si quieres que se refresque cada mas o menos tiempo. Tiempo actual, 3000 milisegundos (3 segundos).
    var refreshTime = 3000;
    var lossAlert = -10;
    var winAlert = 10;
    //Cambia este valor para actualizar el valor de 'Vender a:' al porcentaje que quieras.
    var sellTo = 10;
    /***************/
    var bitcoinValue = 0;
    var loadChecker = setInterval(function(){
        if(!$('#pageLoading').is(":visible")){
            (function() {
                var cors_api_host = 'cors-anywhere.herokuapp.com';
                var cors_api_url = 'https://' + cors_api_host + '/';
                var slice = [].slice;
                var origin = window.location.protocol + '//' + window.location.host;
                var open = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function() {
                    var args = slice.call(arguments);
                    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
                    if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                        targetOrigin[1] !== cors_api_host) {
                        args[1] = cors_api_url + args[1];
                    }
                    return open.apply(this, args);
                };
            })();
            init();
            clearInterval(loadChecker);

            $('body').keyup(function (e) {
                if(e.keyCode === 67){
                    if(!$('#calc').is(':visible'))
                        $('#calc').attr('style', 'display:block;  float: right;color: #ffd800;position: absolute; right: 0;top: 0; text-align: center;background-color: #909090;width: 250px;border: 1px dotted yellow;height: 75px;vertical-align: middle;margin-left: 44%;font-weight: bold;');
                    else
                        $('#calc').attr('style', 'display:none');
                }

                if(e.keyCode === 78)
                    if(!$('#news').is(':visible'))
                        $('#news').attr('style', 'float: left;color: #ffd800;position: absolute; left: 0;top: 0; text-align: left;background-color: #909090;width: 250px;border: 1px dotted yellow;height: auto;margin-top:10%; vertical-align: middle;margin-left: 0%;font-weight: bold;');
                    else
                        $('#news').attr('style', 'display:none');
            });

            /**Calculadora**/
            $('#satoshis').keyup(function (e) {
                calculate(e);
            });
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
            var infoSell = "Vender a +"+sellTo+"% : ";
            var infoGanancia = "Ganancia: ";
            var break_ = false;
            var gananciaFloat = 0;

            $(coinPrices).each(function( i ) {
                if($('.productSymbol').text().includes(coinPrices[i].name)) {
                    infoBuy += coinPrices[i].price;
                    name = coinPrices[i].name;
                    infoSell += coinPrices[i].price + percent(coinPrices[i].price);
                    gananciaFloat = (((currentPrice*100)/coinPrices[i].price) -100).toFixed(2);
                    infoGanancia += gananciaFloat;
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

            //notifyMe("It might be a good moment to sell: "+name+" Current profit: "+gananciaFloat);
            var currentTime = new Date().getTime();

            if(currentTime-notificationPeriod > latestNotificationTime){
                if(gananciaFloat > winAlert){
                    notifyMe("Sell Currency "+name+" Current profit: "+gananciaFloat+"%");
                }else if(gananciaFloat < lossAlert){
                    notifyMe("Alarm!! Currency "+name+" Is losing too much: "+gananciaFloat+"%");
                }
            }

            //Esto actualizará el valor del bitcoin en la calculadora.
            calculate();

            var splitted = $('.productSymbol').text().split('/');
            //$('.productSymbol').find('a').remove();
            if( $('.productSymbol').find('a').length == 0)
                $('.productSymbol').wrapInner('<a target="_blank" href="https://www.google.es/search?q='+ splitted[0] + '%20coin" />');
            else
                $('.productSymbol').find('a').attr('href', 'https://www.google.es/search?q='+ splitted[0] + '%20coin' );

        }, refreshTime);

        var calculator="<span><input id='satoshis' class='satoshis' type='text' width='100' /><br/><span class='dollars'> </span></span>";
        var bitcoinValue = $($("li:contains('BTC/USDT')").parent()).find('li')[2];
        $('body').append('<div id="calc" style="display:none; float: right;color: #ffd800;position: absolute; right: 0;top: 0; text-align: center;background-color: #909090;width: 250px;border: 1px dotted yellow;height: 75px;vertical-align: middle;margin-left: 44%;font-weight: bold;">'+ calculator +'</div>');


        $.get(
            'https://support.binance.com/hc/en-us/sections/115000106672-New-Listings', function() {
                alert( "success" );
            })
            .done(function() {
            alert( "second success" );
        })
            .fail(function(response) {
            var newCoins = $(response.responseText).find('.article-list').text();
            $('body').append('<div id="news" style="float: left;color: #ffd800;position: absolute; left: 0;top: 0; text-align: left;background-color: #909090;width: 250px;border: 1px dotted yellow;height: auto;margin-top:10%; vertical-align: middle;margin-left: 0%;font-weight: bold;">'+ newCoins +'</div>');



        });

    };

    /**Helpers**/
    function percent(price) {
        return (sellTo / 100) * price;
    }
    function calculate(e){
        var usd = $('#satoshis').val();
        var bitcoinValue = $($("li:contains('BTC/USDT')").parent()).find('li')[2];
        if(!bitcoinValue){
            $('.dollars').text('BitCoin price not found');
        }
        $('.dollars').text( bitcoinValue.innerText.replace(',','') * usd);
    }


})();