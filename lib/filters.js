module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/filters/src/main.js
//保留小数位数
var toFixed = function toFixed(val, acc) {
  //保留小数位，acc为保留几位小数位
  var num = parseFloat(val);

  if (isNaN(num)) {
    num = 0;
  }

  var accuracy = parseInt(acc);

  if (isNaN(accuracy) || accuracy < 0 || accuracy > 10) {
    accuracy = 2;
  }

  return num.toFixed(accuracy);
}; //日期格式化("yyyy-MM-dd HH:mm:ss")


var dateTimeFormat = function dateTimeFormat(date) {
  var fmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd HH:mm:ss';

  //日期时间格式化 
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    date = date.replace('T', ' ').replace('Z', '');
    date = new Date(date.replace(/-/g, '/'));
  }

  if (typeof date === 'number') {
    date = new Date(date);
  }

  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  var week = {
    '0': "\u65E5",
    '1': "\u4E00",
    '2': "\u4E8C",
    '3': "\u4E09",
    '4': "\u56DB",
    '5': "\u4E94",
    '6': "\u516D"
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "\u661F\u671F" : "\u5468" : '') + week[date.getDay() + '']);
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return fmt;
};

var timeLongFormat = function timeLongFormat(value) {
  var isMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '00:00:00';
  var total = parseInt(value);

  if (!isNaN(total)) {
    if (isMs) {
      total = total / 1000;
    }

    var hours = parseInt(total / 3600);
    var minutes = parseInt(total % 3600 / 60);
    var seconds = parseInt(total % 3600 % 60);
    var h = hours > 9 ? hours : '0' + hours;
    var m = minutes > 9 ? minutes : '0' + minutes;
    var s = seconds > 9 ? seconds : '0' + seconds;
    return h + ':' + m + ':' + s;
  } else {
    return dft;
  }
};

var timeLongFormat_zh = function timeLongFormat_zh(valuevalue) {
  var isMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '--';
  var total = parseInt(value);

  if (!isNaN(total)) {
    if (isMs) {
      total = total / 1000;
    }

    var hours = parseInt(total / 3600);
    var minutes = parseInt(total % 3600 / 60);
    var seconds = parseInt(total % 3600 % 60);
    var h = hours == 0 ? "" : "".concat(hours, "\u65F6");
    var m = minutes == 0 ? "" : "".concat(minutes, "\u5206");
    var s = seconds == 0 ? "" : "".concat(seconds, "\u79D2");
    return h + m + s;
  } else {
    return dft;
  }
};

var bytesToSize = function bytesToSize(bytes) {
  //文件大小单位转换
  if (bytes === 0) {
    return '0 B';
  }

  ;
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i];
};

/* harmony default export */ var main = ({
  toFixed: toFixed,
  dateTimeFormat: dateTimeFormat,
  timeLongFormat: timeLongFormat,
  timeLongFormat_zh: timeLongFormat_zh,
  bytesToSize: bytesToSize
});
// CONCATENATED MODULE: ./src/filters/index.js

/* istanbul ignore next */

main.install = function (Vue) {
  Object.keys(main).forEach(function (item) {
    if (item == 'install') return true;
    Vue.filter(item, main[item]);
  });
};

/* harmony default export */ var filters = __webpack_exports__["default"] = (main);

/***/ })
/******/ ]);