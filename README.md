Версия node 16  
Для установки зависимостей в текущей директории выполнить команду 
```sh
npm i
```

Для запуска есть две команды

```sh
npm run prod
``` 
для prodaction не составляет карту стилей и скриптов, минимизирует файл css, js

```sh
npm run dev
``` 
для разработки, включает карты стилей и скритов, не минимизирует файл css, js

## Settings
Директория куда собираются файлы настраивается в gulpfile.js `settings.out_path` относительно файла gulpfile.js

## Fonts
Шрифты лежат в директории fonts, подключаются в файле scss/_fonts.scss путь указывается относительно собранного файла

## SVG
Svg иконки храняться в дректории svg. Подключить иконку svg из sprite можно следующим образом, где `shopping-cart` имя файла из 
директории svg

`<svg>
    <use xlink:href="/www/images/svg/sprite.svg#shopping-cart"></use>
</svg>`

Если подключить файл спрайта в php `<div style="display:none;"><? include($_SERVER['DOCUMENT_ROOT'] . '/images/svg/sprite.svg'); ?></div>`, 
то путь до svg файла можно не писать, достаточно только #shopping-cart

## Если нужен jQuery
```sh
npm i jquery
```
Раскоментировать строки в gulpfile.js
```js
$: 'jquery',
jQuery: 'jquery',
'window.jQuery': 'jquery'
```


