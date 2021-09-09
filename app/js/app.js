import {test} from './modules/test.js'
import './modules/test2.js';
test();

$(function () {
    console.log($('title').text());
});