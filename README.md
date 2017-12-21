# BinanceScript



Instalar TamperMonkey (Firefox || Chrome)
https://addons.mozilla.org/es/firefox/addon/tampermonkey/
https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=es

Una vez instalado os aparecerá en la parte de arriba del navegador, a la derecha de la barra de direcciones y el buscador una carita negra, solo teneis que pulsar en ella y luego en 'Create a new Script', en la pantalla que os aparece, tan solo teneis que copiar el código que está en BincanceScript.js y guardar, una vez recargueis la página el script cargará automáticamente.

# Configuración
Esto es un extracto del código del script, línea 14, no tiene perdida, si teneis algún problema usad el post de MV.
``` 
    /********************************************************COIN VALUES************************************************/
    /* Coloca en la variable coinPrices siguiendo el formato (y separado por comas) las monedas que tienes y a que precio fueron compradas.*/
    /* Ejemplo: {'name':'BNB', 'price':0.0009495} */
    /* Además, deberás tener un valor visible de BTC/USDT en pantalla si quieres usar la calculadora, ya sea añadiendo la moneda a favoritos y teniendo este tab seleccionado, o seleccionando un tab que la contenga (los de la parte de arriba a la derecha).
    /*********************************************/
    var coinPrices = [{'name':'XVG', 'price':0.00000400},{'name':'BNB', 'price':0.0009495},{'name':'IOTA', 'price':0.00029700},{'name':'MANA', 'price':0.00000362},{'name':'TRX', 'price':0.00000330}];
    //Cambia este valor si quieres que se refresque cada mas o menos tiempo. Tiempo actual, 3000 milisegundos (3 segundos).
    var refreshTime = 3000;
    //Cambia este valor para actualizar el valor de 'Vender a:' al porcentaje que quieras.
    var sellTo = 10;
    /***************/

```

Este script *NO AUTOMATIZA NINGÚN PROCESO*, solo está pensado para ayudar en el seguimiento.
