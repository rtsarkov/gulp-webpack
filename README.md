Для запуска в текущей директории выполнить команду `npm i`

Для запуска использовать команду `gulp`

Вывод файлов настраивается в файле gulpfile.js `out_path` 

Подключить svg sprite можно следующим образом

`<img src="/www/images/svg/sprite.svg#shopping-cart">`

или

`<svg class="img">
    <use xlink:href="/www/images/svg/sprite.svg#shopping-cart "></use>
</svg>`