Для установки зависимостей в текущей директории выполнить команду `npm i`

Для запуска есть две команды

`npm run prod` для prodaction не составляет карту стилей и скриптов, минимизирует файл css

`npm run dev` для разработки, включает карты стилей и скритов, не минимизирует файл css

Директория куда собираются файлы настраивается в gulpfile.js `settings.out_path` относительно файла gulpfile.js

Шрифты лежат в директории fonts, подключаются в файле scss/_fonts.scss путь указывается относительно собранного файла

Svg иконки храняться в дректории svg. Подключить иконку svg из sprite можно следующим образом, где `shopping-cart` имя файла из 
директории svg

`<svg>
    <use xlink:href="/www/images/svg/sprite.svg#shopping-cart"></use>
</svg>`

Если подключить файл спрайта в php `<div style="display:none;"><? include($_SERVER['DOCUMENT_ROOT'] . '/images/svg/sprite.svg'); ?></div>`, 
то путь до svg файла можно не писать, достаточно только #shopping-cart


