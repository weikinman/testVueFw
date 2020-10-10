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
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("jquery");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("vee-validate");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("vue-cookies");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(32);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(34);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(36);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(40);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(43);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(45);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(47);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(49);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(51);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(53);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(2);
            var content = __webpack_require__(55);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("echarts");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("nprogress");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("vue-i18n");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("element-ui");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {
  '没有数据': "没有数据",
  '操作': "操作",
  home: {
    copyright: ''
  },
  login: {
    loginsystem: '系统登录',
    insertaccount: '请输入账号',
    insertpassword: '请输入密码',
    rememberpassword: '记住密码',
    login: '登录'
  },
  //数据返回的文字提示
  responseMsg: {
    requestError: '请求失败'
  }
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {
  '没有数据': "Query Empty",
  '操作': "operation",
  home: {
    copyright: ''
  },
  login: {
    loginsystem: 'login system',
    insertaccount: 'please insert account',
    insertpassword: 'please insert password',
    rememberpassword: 'Remember the password',
    login: 'Login'
  },
  //数据返回的文字提示
  responseMsg: {
    requestError: '请求失败'
  }
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = {
  responseMsg: {
    "${200.wf.instance.start.success}": "The instance start success",
    "${200.wf.task.commit.success}": "The task commit successfully",
    "${401.token.required}": "Token is required",
    "${401.token.expired}": "Token is expired",
    "${401.token.type.required}": "Token type is required",
    "${401.token.type.error}": "Token transational type error",
    "${401.account.authen.failure}": "Account authentication failure",
    "${401.client.id.required}": "client_id is required",
    "${401.client.secret.required}": "client_secret is required",
    "${401.param.long.type.error}": "Parameter data type error",
    "${403.Authority.failure}": "Authority failure",
    "${403.access.refuse}": "Access refuse",
    "${404.channel.closed}": "Message can not send, Micro-server channel is closed",
    "${404.channel.timeout}": "Connecting Micro-server channel is timeout",
    "${504.server.busy}": "Server busy",
    //服务繁忙
    "${400.file.type.error}": "Wrong file type",
    //文件類型錯誤
    "${400.file.type.must.be.zip}": "The compressed file type must be zip",
    //壓縮文件類型必須是ZIP
    "${400.file.format.type.must.be}": "The file format in the compressed file must be (.png/.jpg/.jpeg/.bmp/.tif)",
    //圖片類型必須是：（.png/.jpg/.jpeg/.bmp/.tif）
    "${400.file.not.exist}": "File cannot be empty",
    //文件不能爲空
    "${400.file.upload.unknown.error}": "Unknown mistake",
    //上傳文件未知錯誤
    "${400.account.type.error}": "Account type error",
    //帐户类型错误
    "${400.version.lock.error}": "The record is modify by other person",
    //记录被其他人修改
    "${400.tcc.confirm.process.failure}": "Process failure after confirm",
    //确认后处理失败
    "${400.tcc.cancel.process.failure}": "Process failure after cancel",
    //取消后处理失败
    "${400.record.not.present}": "The record is not present",
    //记录不存在
    "${400.owner.not.present}": "The owner is not present",
    //所有者不存在
    "${400.wf.task.create.failure}": "Cannot new any tasks",
    //无法新增任何任务
    "${400.wf.instance.closed.error}": "The instance has been closed",
    "${400.wf.instance.start.failure}": "Start instance failure",
    "${400.wf.instance.not.closed.error}": "This owner has a instance that is not finished",
    "${400.public.id.empty}": "Param id cannot null",
    //参数ID不能为空
    "${400.adm.user.not.exist}": "User does not exists",
    //用户不存在
    "${400.adm.user.exist}": "User already exists!",
    //用户已存在
    "${400.devi.device.not.exist}": "The device does not exists",
    //该设备不存在
    "${400.devi.device.temporary.name.exist}": "The temporary name of the device already exists",
    //设备的临时名称已存在
    "${400.devi.device.username.and.camera.ip.exist}": "The username for this camera IP already exists",
    //该摄像机工作模式的用户名已存在
    "${400.devi.device.username.and.nebula.ip.exist}": "The username for this nebula IP already exists",
    //该星云IP的用户名已存在
    "${400.devi.device.group.not.exist}": "The group does not exists",
    //该组别不存在
    "${400.devi.device.group.exist}": "The group already exists",
    //该组别已存在
    "${400.devi.device.relationship.not.exist}": "The relationship device does not exist",
    //当前两设备的关系已存在
    "${400.param.date.time.type.error}": "Time format error ",
    //时间格式错误
    "${400.lib.library.exist}": "The face library already exist",
    //人脸库已存在
    "${400.lib.library.not.exist}": "The face library does not exist",
    //人脸库不存在
    "${400.lib.image.person.not.exist}": "The id of person does not exist",
    //图片的人物信息不存在
    "${400.lib.image.not.exist}": "The image does not exist",
    //人脸图片不存在
    "${400.lib.image.upload.fail}": "File upload failed",
    //上传失败
    "${400.lib.image.not.face.detected}": "No face detected ",
    //未发现人脸
    "${400.lib.image.too.low}": "The face image quality is too low ",
    //人臉圖片品質過低
    "${400.lib.image.incorrect.or.broken}": "Incorrect image format or broken image",
    //圖片格式不正確或圖片 破損
    "${400.param.input.error}}": "Parameter input error",
    //參數輸入錯誤
    "${400.msg.id.error}": "'msg_id' error",
    //msg_id 错误
    "${400.system.internal.error}": "System internal error ",
    //nebula设备错误
    "${400.alarm.record.not.exist}": "The record of alarm does not exists",
    //告警记录不存在
    "${400.alarm.record.is.empty}": "The query alarm record is empty" //查询的告警记录为空

  }
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = {
  responseMsg: {
    "${200.wf.instance.start.success}": "The instance start success",
    "${200.wf.task.commit.success}": "The task commit successfully",
    "${401.token.required}": "Token is required",
    "${401.token.expired}": "Token is expired",
    "${401.token.type.required}": "Token type is required",
    "${401.token.type.error}": "Token transational type error",
    "${401.account.authen.failure}": "Account authentication failure",
    "${401.client.id.required}": "client_id is required",
    "${401.client.secret.required}": "client_secret is required",
    "${401.param.long.type.error}": "Parameter data type error",
    "${403.Authority.failure}": "Authority failure",
    "${403.access.refuse}": "Access refuse",
    "${404.channel.closed}": "Message can not send, Micro-server channel is closed",
    "${404.channel.timeout}": "Connecting Micro-server channel is timeout",
    "${504.server.busy}": "Server busy",
    "${400.file.type.error}": "Wrong file type",
    "${400.file.type.must.be.zip}": "The compressed file type must be zip",
    "${400.file.format.type.must.be}": "The file format in the compressed file must be (.png/.jpg/.jpeg/.bmp/.tif)",
    "${400.file.not.exist}": "File cannot be empty",
    "${400.file.upload.unknown.error}": "Unknown mistake",
    "${400.account.type.error}": "Account type error",
    "${400.version.lock.error}": "The record is modify by other person",
    "${400.tcc.confirm.process.failure}": "Process failure after confirm",
    "${400.tcc.cancel.process.failure}": "Process failure after cancel",
    "${400.record.not.present}": "The record is not present",
    "${400.owner.not.present}": "The owner is not present",
    "${400.wf.task.create.failure}": "Cannot new any tasks",
    "${400.wf.instance.closed.error}": "The instance has been closed",
    "${400.wf.instance.start.failure}": "Start instance failure",
    "${400.wf.instance.not.closed.error}": "This owner has a instance that is not finished",
    "${400.public.id.empty}": "Param id cannot null",
    "${400.adm.user.not.exist}": "User does not exists",
    "${400.adm.user.exist}": "User already exists!",
    "${400.devi.device.not.exist}": "The device does not exists",
    "${400.devi.device.temporary.name.exist}": "The temporary name of the device already exists",
    "${400.devi.device.username.and.camera.ip.exist}": "The username for this camera IP already exists",
    "${400.devi.device.username.and.nebula.ip.exist}": "The username for this nebula IP already exists",
    "${400.devi.device.group.not.exist}": "The group does not exists",
    "${400.devi.device.group.exist}": "The group already exists",
    "${400.devi.device.relationship.not.exist}": "The relationship device does not exist",
    "${400.param.date.time.type.error}": "Time format error ",
    "${400.lib.library.exist}": "The face library already exist",
    "${400.lib.library.not.exist}": "The face library does not exist",
    "${400.lib.image.person.not.exist}": "The id of person does not exist",
    "${400.lib.image.not.exist}": "The image does not exist",
    "${400.lib.image.upload.fail}": "File upload failed",
    "${400.lib.image.not.face.detected}": "No face detected ",
    "${400.lib.image.too.low}": "The face image quality is too low ",
    "${400.lib.image.incorrect.or.broken}": "Incorrect image format or broken image",
    "${400.param.input.error}": "Parameter input error",
    "${400.msg.id.error}": "'msg_id' error",
    "${400.system.internal.error}": "System internal error ",
    "${400.alarm.record.not.exist}": "The record of alarm does not exists",
    "${400.alarm.record.is.empty}": "The query alarm record is empty"
  }
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = {
  responseMsg: {
    "${200.wf.instance.start.success}": "流程实例开始成功",
    "${200.wf.task.commit.success}": "任务提交成功",
    "${401.token.required}": "令牌不能為空",
    "${401.token.expired}": "令牌已過期",
    "${401.token.type.required}": "令牌類型不能為空",
    "${401.token.type.error}": "令牌類型錯誤",
    "${401.account.authen.failure}": "用戶驗證失敗",
    "${401.client.id.required}": "client_id不能為空",
    "${401.client.secret.required}": "client_secret不能為空",
    "${401.param.long.type.error}": "數據太大",
    "${403.Authority.failure}": "驗證錯誤",
    "${403.access.refuse}": "Access refuse",
    "${404.channel.closed}": "Message can not send, Micro-server channel is closed",
    "${404.channel.timeout}": "Connecting Micro-server channel is timeout",
    "${504.server.busy}": "服务繁忙",
    //服务繁忙
    "${400.file.type.error}": "文件類型錯誤",
    //文件類型錯誤
    "${400.file.type.must.be.zip}": "壓縮文件類型必須是ZIP",
    //壓縮文件類型必須是ZIP
    "${400.file.format.type.must.be}": "圖片類型必須是 (.png/.jpg/.jpeg/.bmp/.tif)",
    //圖片類型必須是：（.png/.jpg/.jpeg/.bmp/.tif）
    "${400.file.not.exist}": "文件不能爲空",
    //文件不能爲空
    "${400.file.upload.unknown.error}": "上傳文件未知錯誤",
    //上傳文件未知錯誤
    "${400.account.type.error}": "帐户类型错误",
    //帐户类型错误
    "${400.version.lock.error}": "记录被其他人修改",
    //记录被其他人修改
    "${400.tcc.confirm.process.failure}": "确认后处理失败",
    //确认后处理失败
    "${400.tcc.cancel.process.failure}": "取消后处理失败",
    //取消后处理失败
    "${400.record.not.present}": "记录不存在",
    //记录不存在
    "${400.owner.not.present}": "所有者不存在",
    //所有者不存在
    "${400.wf.task.create.failure}": "无法新增任何任务",
    //无法新增任何任务
    "${400.wf.instance.closed.error}": "實例已關閉",
    "${400.wf.instance.start.failure}": "開啟實例失敗",
    "${400.wf.instance.not.closed.error}": "實例無法正常關閉",
    "${400.public.id.empty}": "参数ID不能为空",
    //参数ID不能为空
    "${400.adm.user.not.exist}": "用户不存在",
    //用户不存在
    "${400.adm.user.exist}": "用户已存在!",
    //用户已存在
    "${400.devi.device.not.exist}": "该设备不存在",
    //该设备不存在
    "${400.devi.device.temporary.name.exist}": "设备的临时名称已存在",
    //设备的临时名称已存在
    "${400.devi.device.username.and.camera.ip.exist}": "该摄像机工作模式的用户名已存在",
    //该摄像机工作模式的用户名已存在
    "${400.devi.device.username.and.nebula.ip.exist}": "该星云IP的用户名已存在",
    //该星云IP的用户名已存在
    "${400.devi.device.group.not.exist}": "该组别不存在",
    //该组别不存在
    "${400.devi.device.group.exist}": "该组别已存在",
    //该组别已存在
    "${400.devi.device.relationship.not.exist}": "当前两设备的关系已存在",
    //当前两设备的关系已存在
    "${400.param.date.time.type.error}": "时间格式错误",
    //时间格式错误
    "${400.lib.library.exist}": "人脸库已存在",
    //人脸库已存在
    "${400.lib.library.not.exist}": "人脸库不存在",
    //人脸库不存在
    "${400.lib.image.person.not.exist}": "图片的人物信息不存在",
    //图片的人物信息不存在
    "${400.lib.image.not.exist}": "人脸图片不存在",
    //人脸图片不存在
    "${400.lib.image.upload.fail}": "上传失败",
    //上传失败
    "${400.lib.image.not.face.detected}": "未发现人脸",
    //未发现人脸
    "${400.lib.image.too.low}": "人臉圖片品質過低",
    //人臉圖片品質過低
    "${400.lib.image.incorrect.or.broken}": "圖片格式不正確或圖片破損",
    //圖片格式不正確或圖片破損
    "${400.param.input.error}}": "參數輸入錯誤",
    //參數輸入錯誤
    "${400.msg.id.error}": "msg_id 错误",
    //msg_id 错误
    "${400.system.internal.error}": "nebula设备错误",
    //nebula设备错误
    "${400.alarm.record.not.exist}": "告警记录不存在",
    //告警记录不存在
    "${400.alarm.record.is.empty}": "查询的告警记录为空" //查询的告警记录为空

  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/locale/lang/zh-CN");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/locale/lang/en");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/locale/lang/zh-TW");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_75f29932_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_75f29932_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_75f29932_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_75f29932_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.el-aside .el-menu[data-v-75f29932] {\r\n  border-right: none;\n}\n.iscollapse[data-v-75f29932] {\r\n  position: absolute;\r\n  bottom: 0;\r\n  background: #132843;\r\n  color: #fff;\r\n  width: 100%;\r\n  height: 0.4rem;\r\n  text-align: center;\r\n  cursor: pointer;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\n}\n.el-menu-vertical-demo[data-v-75f29932]:not(.el-menu--collapse) {\r\n  width: 2.5rem;\r\n  min-height: 400px;\n}\n.el-menu-item[data-v-75f29932] {\r\n  margin: 0.025rem 0;\r\n  text-align: left;\n}\n.el-submenu[data-v-75f29932] {\r\n  margin: 0.025rem 0;\r\n  text-align: left;\n}\n.menu-icon[data-v-75f29932] {\r\n  width: 0.25rem;\r\n  margin-right: 0.15rem;\n}\n.el-menu-item span[data-v-75f29932] {\r\n  word-break: normal;\r\n  width: 100px;\r\n  /* white-space: pre-wrap; */\r\n  word-wrap: break-word;\n}\n.el-menu-item span.el-icon[data-v-75f29932]{\r\n  width:.25rem;\n}\n.el-menu-item>span:first-child.child-title[data-v-75f29932]{\r\n  padding-left: .15rem;\n}\n.el-menu[data-v-75f29932] .is-active {\r\n  background-color: #1b3b61 !important;\r\n  color: #fff !important;\n}\n.el-submenu[data-v-75f29932] i,\r\n.el-menu-item[data-v-75f29932] i {\r\n  color: #fff;\n}\n.child-title[data-v-75f29932] {\r\n  font-size: 0.15rem;\n}\n.icon-box[data-v-75f29932] {\r\n  width: 0.29rem;\r\n  /* margin-left: 0.41rem; */\r\n  display: inline-block;\n}\n.img-icon[data-v-75f29932] {\r\n  width: 100%;\n}\n.icon-title[data-v-75f29932] {\r\n  font-size: 0.17rem;\n}\n.icon-child-box[data-v-75f29932] {\r\n  margin-left: 0.2rem;\r\n  display: inline-block;\n}\r\n/* 按钮样式 */\n.Management-icon[data-v-75f29932] {\r\n  width: 0.25rem;\n}\n.User-icon[data-v-75f29932] {\r\n  width: 0.22rem;\n}\n.Customer-icon[data-v-75f29932] {\r\n  width: 0.24rem;\n}\n.Contract-icon[data-v-75f29932] {\r\n  width: 0.27rem;\n}\n.Report-icon[data-v-75f29932] {\r\n  width: 0.25rem;\n}\n.Amendment-icon[data-v-75f29932] {\r\n  width: 0.35rem;\n}\n.Email-icon[data-v-75f29932] {\r\n  width: 0.29rem;\n}\n.Permission-icon[data-v-75f29932] {\r\n  width: 0.26rem;\n}\n.Settings-icon[data-v-75f29932] {\r\n  width: 0.27rem;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DashBoard_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DashBoard_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DashBoard_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_DashBoard_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.el-col {\n  border-radius: 4px;\n}\n.bg-purple-dark {\n  background: #99a9bf;\n}\n.bg-purple {\n  background: #d3dce6;\n}\n.bg-purple-light {\n  background: #e5e9f2;\n}\n.grid-content {\n  border-radius: 4px;\n  min-height: 36px;\n}\n.dashboard-content {\n  background-color: #131734;\n  width: 100%;\n  box-sizing: border-box;\n}\n.dashboard-item {\n  padding: 0 3%;\n}\n.dashboard-item canvas{border-radius: 10px;}\n.dashboard-cell{margin-top:10px;}\n.chart-item-box{border-radius: 10px;}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_4af72fa7_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_4af72fa7_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_4af72fa7_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_4af72fa7_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.theader-cell-center[data-v-4af72fa7]{}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("nprogress/nprogress.css");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("jsencrypt");

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MinDataGrid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MinDataGrid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MinDataGrid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MinDataGrid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.min-datagrid-box .el-form-item__content{margin-left: 0 !important;}\n.min-datagrid-header-item{font-size: 14px;}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormRows_vue_vue_type_style_index_0_id_267fb5c8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormRows_vue_vue_type_style_index_0_id_267fb5c8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormRows_vue_vue_type_style_index_0_id_267fb5c8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormRows_vue_vue_type_style_index_0_id_267fb5c8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.bw-form-rows-title[data-v-267fb5c8]{font-size: .2rem;padding: .1rem 0;}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTable_vue_vue_type_style_index_0_id_787e0722_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTable_vue_vue_type_style_index_0_id_787e0722_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTable_vue_vue_type_style_index_0_id_787e0722_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTable_vue_vue_type_style_index_0_id_787e0722_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.bw-form-table-title[data-v-787e0722]{font-size: .2rem; padding: .1rem 0; cursor: pointer;}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTab_vue_vue_type_style_index_0_id_b7161a14_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTab_vue_vue_type_style_index_0_id_b7161a14_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTab_vue_vue_type_style_index_0_id_b7161a14_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormTab_vue_vue_type_style_index_0_id_b7161a14_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.bw-form-tab-title[data-v-b7161a14]{font-size: .2rem;padding: .1rem 0;}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormLayout_vue_vue_type_style_index_0_id_250804d9_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormLayout_vue_vue_type_style_index_0_id_250804d9_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormLayout_vue_vue_type_style_index_0_id_250804d9_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FormLayout_vue_vue_type_style_index_0_id_250804d9_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.bw-form-layout-title[data-v-250804d9]{font-size: .2rem;padding: .1rem 0;}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Form_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Form_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Form_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Form_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.form-item-error{\r\n    position: absolute;\r\n    font-size: .14rem;\r\n    color: #ff0000;\r\n    left: 2px;\r\n    bottom: -26px;\n}\n.is-danger input:not(.el-select__input), \r\n.is-danger select, \r\n.is-danger textarea {\r\n border: 1px solid #ff0000;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_38cc60fe_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_38cc60fe_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_38cc60fe_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Index_vue_vue_type_style_index_0_id_38cc60fe_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* 合约中的服务类型 */\n.search-list-box[data-v-38cc60fe] {\n  text-align: left;\n}\n.sevices-box[data-v-38cc60fe] {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 27px;\n}\n.services-type[data-v-38cc60fe] {\n  display: inline-block;\n  background-color: #3b5c84;\n  color: #ffffff;\n  padding: 3px 8px;\n  border-radius: 15px;\n  margin-left: 9px;\n}\n.ser-svrs[data-v-38cc60fe] {\n  display: inline-block;\n}\n.services-text[data-v-38cc60fe] {\n  font-size: 0.13rem;\n}\n.goList[data-v-38cc60fe] {\n  cursor: pointer;\n}\n.table-class[data-v-38cc60fe] {\n  margin-top: .1rem;\n}\n.table-class .el-table[data-v-38cc60fe] th:first-child .cell {\n  text-align: center;\n}\n.el-form--inline .el-form-item[data-v-38cc60fe] {\n  margin-bottom: 0;\n}\n.table-item[data-v-38cc60fe] {\n  padding: 5px 0;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MutilSelecter_vue_vue_type_style_index_0_id_646f81e2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MutilSelecter_vue_vue_type_style_index_0_id_646f81e2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MutilSelecter_vue_vue_type_style_index_0_id_646f81e2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MutilSelecter_vue_vue_type_style_index_0_id_646f81e2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.mutilselecter-box[data-v-646f81e2]{\r\n    font-size: 12px;\n}\n.mutilselecter-selecter ul[data-v-646f81e2],.mutilselecter-result ul[data-v-646f81e2]{\r\n    overflow-y: auto;\n}\n.mutilselecter-selecter li[data-v-646f81e2],.mutilselecter-result li[data-v-646f81e2]{\r\n    height:22px;\r\n    line-height: 22px;\r\n    overflow-x:hidden ;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    color:#333;\r\n    font-size: 12px;\r\n    padding: 0px 8px;\r\n    cursor: pointer;\n}\n.mutilselecter-selecter li[data-v-646f81e2]:nth-child(2n),\r\n.mutilselecter-result li[data-v-646f81e2]:nth-child(2n){\r\n    background: #f9f9f9;\n}\n.mutilselecter-selecter li.active[data-v-646f81e2],.mutilselecter-result li.active[data-v-646f81e2]{\r\n    background: #ddd;\n}\n.mutilselecter-item-box[data-v-646f81e2]{\r\n    border:1px solid #eee;\r\n    position: relative;\n}\n.mutilselecter-ctrler[data-v-646f81e2]{\r\n    transform: translateY(-50%);\n}\n.mutilselecter-selecter-search[data-v-646f81e2]{\r\n    margin-bottom: 8px;\n}\n.mutilselecter-item-tools[data-v-646f81e2]{\r\n    position:absolute;\r\n    right:20px;\r\n    top:10px;\r\n    display: none;\r\n    height: 10px;\r\n    width: 10px;\r\n    z-index: 11;\r\n    color:#999;\r\n    cursor: pointer;\n}\n.mutilselecter-item-box:hover .mutilselecter-item-tools[data-v-646f81e2]{\r\n    display: block;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

if (typeof Array.prototype.unique === "undefined") {
  //数组去重
  Array.prototype.unique = function () {
    var res = [];
    var json = {};

    for (var i = 0; i < this.length; i++) {
      if (!json[this[i]]) {
        res.push(this[i]);
        json[this[i]] = 1;
      }
    }

    return res;
  };

  Array.prototype.uniqueByKey = function (key) {
    var res = [];
    var innserkey = [];

    for (var i = 0; i < this.length; i++) {
      if (innserkey.indexOf(this[i][key]) == -1) {
        innserkey.push(this[i][key]);
        res.push(this[i]);
      }
    }

    return res;
  };
}

if (typeof Date.prototype.format === "undefined") {
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1,
      //month
      "d+": this.getDate(),
      //day
      "h+": this.getHours(),
      //hour
      "m+": this.getMinutes(),
      //minute
      "s+": this.getSeconds(),
      //second
      "q+": Math.floor((this.getMonth() + 3) / 3),
      //quarter
      "S": this.getMilliseconds() //millisecond

    };

    if (/(y+)/.test(format)) {
      // console.log(this)
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }

    return format;
  };
}

if (typeof Date.prototype.DateAdd === "undefined") {
  //+---------------------------------------------------
  //| 日期计算
  //+---------------------------------------------------
  Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;

    switch (strInterval) {
      case 's':
        return new Date(Date.parse(dtTmp) + 1000 * Number);

      case 'n':
        return new Date(Date.parse(dtTmp) + 60000 * Number);

      case 'h':
        return new Date(Date.parse(dtTmp) + 3600000 * Number);

      case 'd':
        return new Date(Date.parse(dtTmp) + 86400000 * Number);

      case 'w':
        return new Date(Date.parse(dtTmp) + 86400000 * 7 * Number);

      case 'q':
        return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());

      case 'm':
        return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());

      case 'y':
        return new Date(dtTmp.getFullYear() + Number, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
  };
}

if (typeof Date.prototype.DateDiff === "undefined") {
  //+---------------------------------------------------
  //| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串
  //+---------------------------------------------------
  Date.prototype.DateDiff = function (strInterval, dtEnd) {
    var dtStart = this;

    if (typeof dtEnd == 'string') //如果是字符串转换为日期型
      {
        dtEnd = StringToDate(dtEnd);
      }

    switch (strInterval) {
      case 's':
        return parseInt((dtEnd - dtStart) / 1000);

      case 'n':
        return parseInt((dtEnd - dtStart) / 60000);

      case 'h':
        return parseInt((dtEnd - dtStart) / 3600000);

      case 'd':
        return parseInt((dtEnd - dtStart) / 86400000);

      case 'w':
        return parseInt((dtEnd - dtStart) / (86400000 * 7));

      case 'm':
        return dtEnd.getMonth() + 1 + (dtEnd.getFullYear() - dtStart.getFullYear()) * 12 - (dtStart.getMonth() + 1);

      case 'y':
        return dtEnd.getFullYear() - dtStart.getFullYear();
    }
  };
}

/***/ }),
/* 57 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"boardware-vue-framework\",\"version\":\"1.0.6\",\"description\":\"\",\"main\":\"lib/bw-framework.js\",\"scripts\":{\"dev\":\"webpack-dev-server --mode development\",\"pro\":\"webpack-dev-server --mode production\",\"build\":\"webpack --mode production\",\"build:file\":\"node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js\",\"build:theme\":\"node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk\",\"build:utils\":\"cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js\",\"build:umd\":\"node build/bin/build-locale.js\",\"clean\":\"rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage\",\"deploy:build\":\"npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME\",\"deploy:extension\":\"cross-env NODE_ENV=production webpack --config build/webpack.extension.js\",\"dev:extension\":\"rimraf examples/extension/dist && cross-env NODE_ENV=development webpack --watch --config build/webpack.extension.js\",\"dev:play\":\"npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js\",\"lint\":\"eslint src/**/* test/**/* packages/**/* build/**/* --quiet\",\"dist\":\"webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.modules.js\"},\"keywords\":[],\"author\":\"Scott.Yan\",\"license\":\"ISC\",\"devDependencies\":{\"@babel/core\":\"^7.8.3\",\"@babel/plugin-transform-object-assign\":\"^7.8.3\",\"@babel/plugin-transform-runtime\":\"^7.8.3\",\"@babel/polyfill\":\"^7.8.3\",\"@babel/preset-env\":\"^7.8.3\",\"@vue/component-compiler-utils\":\"^2.6.0\",\"ag-grid-community\":\"^23.2.1\",\"ag-grid-vue\":\"^23.2.1\",\"algoliasearch\":\"^3.24.5\",\"axios\":\"^0.19.2\",\"babel-cli\":\"^6.26.0\",\"babel-loader\":\"^8.0.6\",\"babel-plugin-add-module-exports\":\"^0.2.1\",\"babel-plugin-component\":\"^1.1.1\",\"babel-plugin-istanbul\":\"^4.1.1\",\"babel-plugin-module-resolver\":\"^2.2.0\",\"babel-plugin-syntax-jsx\":\"^6.18.0\",\"babel-plugin-transform-vue-jsx\":\"^3.7.0\",\"babel-preset-env\":\"^1.7.0\",\"babel-preset-stage-2\":\"^6.24.1\",\"babel-regenerator-runtime\":\"^6.5.0\",\"clean-webpack-plugin\":\"^3.0.0\",\"core-js\":\"^3.6.4\",\"css-loader\":\"^3.4.2\",\"echarts\":\"^4.7.0\",\"element-ui\":\"^2.13.1\",\"eslint\":\"4.18.2\",\"eslint-config-elemefe\":\"0.1.1\",\"eslint-loader\":\"^2.0.0\",\"eslint-plugin-html\":\"^4.0.1\",\"eslint-plugin-json\":\"^1.2.0\",\"file-loader\":\"^5.0.2\",\"html-webpack-plugin\":\"^3.2.0\",\"jquery\":\"^3.5.1\",\"jsencrypt\":\"^3.0.0-rc.1\",\"lodash\":\"^4.17.15\",\"mini-css-extract-plugin\":\"^0.9.0\",\"nprogress\":\"^0.2.0\",\"progress-bar-webpack-plugin\":\"^2.1.0\",\"style-loader\":\"^1.1.3\",\"terser-webpack-plugin\":\"^2.3.2\",\"url-loader\":\"^3.0.0\",\"vee-validate\":\"^2.1.5\",\"vue\":\"^2.6.11\",\"vue-class-component\":\"^7.2.3\",\"vue-cookies\":\"^1.7.0\",\"vue-i18n\":\"^8.17.4\",\"vue-loader\":\"^15.8.3\",\"vue-property-decorator\":\"^9.0.0\",\"vue-template-compiler\":\"^2.6.11\",\"webpack\":\"^4.42.1\",\"webpack-cli\":\"^3.3.11\",\"webpack-dev-server\":\"^3.10.3\",\"webpack-node-externals\":\"^1.7.2\"},\"dependencies\":{}}");

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "bwFilters", function() { return /* binding */ bwFilters; });
__webpack_require__.d(__webpack_exports__, "bwUtils", function() { return /* binding */ bwUtils; });
__webpack_require__.d(__webpack_exports__, "bwAxios", function() { return /* binding */ bwAxios; });
__webpack_require__.d(__webpack_exports__, "bwTokenService", function() { return /* binding */ bwTokenService; });
__webpack_require__.d(__webpack_exports__, "bwI18n", function() { return /* binding */ bwI18n; });
__webpack_require__.d(__webpack_exports__, "bwMessage", function() { return /* binding */ bwMessage; });

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

/* harmony default export */ var filters = (main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Menu/Index.vue?vue&type=template&id=75f29932&scoped=true&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-aside",
    { attrs: { width: "auto" } },
    [
      _c(
        "el-menu",
        {
          staticClass: "el-menu-vertical-demo",
          attrs: {
            "default-active": _vm.defaultActive,
            collapse: _vm.iscollapse,
            router: true,
            "background-color": _vm.m_bgColor,
            "text-color": _vm.m_textColor,
            "active-text-color": _vm.m_activeTextColor
          },
          on: { open: _vm.handleOpen, close: _vm.handleClose }
        },
        [
          _vm._l(_vm.menuDatas, function(itemmenu, index) {
            return [
              itemmenu.childrens.length > 0
                ? _c(
                    "el-submenu",
                    { key: index, attrs: { index: index + "" } },
                    [
                      itemmenu.isshow && itemmenu.childrens.length > 0
                        ? _c("template", { slot: "title" }, [
                            itemmenu.icon
                              ? _c("div", { staticClass: "icon-box" }, [
                                  _c("img", {
                                    class: [itemmenu.iconclass],
                                    attrs: { src: itemmenu.icon }
                                  })
                                ])
                              : _vm._e(),
                            itemmenu.iconclass
                              ? _c("div", { staticClass: "icon-box" }, [
                                  !itemmenu.icon && itemmenu.iconclass
                                    ? _c("span", {
                                        class: [itemmenu.iconclass]
                                      })
                                    : _vm._e()
                                ])
                              : _vm._e(),
                            _c("span", { staticClass: "icon-title" }, [
                              _vm._v(
                                _vm._s(
                                  itemmenu.isI18n && _vm.$t
                                    ? _vm.$t(itemmenu.title)
                                    : itemmenu.title
                                )
                              )
                            ])
                          ])
                        : _vm._e(),
                      itemmenu.isshow && itemmenu.childrens.length > 0
                        ? _c(
                            "el-menu-item-group",
                            _vm._l(itemmenu.childrens, function(
                              submenu,
                              subindex
                            ) {
                              return _c(
                                "el-menu-item",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: submenu.isshow,
                                      expression: "submenu.isshow"
                                    }
                                  ],
                                  key: subindex + "",
                                  attrs: { index: submenu.url }
                                },
                                [
                                  submenu.icon
                                    ? _c(
                                        "div",
                                        { staticClass: "icon-child-box" },
                                        [
                                          _c("img", {
                                            class: [submenu.iconclass],
                                            attrs: { src: submenu.icon }
                                          })
                                        ]
                                      )
                                    : _vm._e(),
                                  !submenu.icon && submenu.iconclass
                                    ? _c("span", { class: [submenu.iconclass] })
                                    : _vm._e(),
                                  _c("span", { staticClass: "child-title" }, [
                                    _vm._v(
                                      _vm._s(
                                        submenu.isI18n && _vm.$t
                                          ? _vm.$t(submenu.title)
                                          : submenu.title
                                      )
                                    )
                                  ])
                                ]
                              )
                            }),
                            1
                          )
                        : _vm._e()
                    ],
                    2
                  )
                : _vm._e(),
              itemmenu.childrens.length == 0
                ? _c(
                    "el-menu-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: itemmenu.isshow,
                          expression: "itemmenu.isshow"
                        }
                      ],
                      key: index + "",
                      attrs: { index: itemmenu.url }
                    },
                    [
                      itemmenu.icon
                        ? _c("div", { staticClass: "icon-box" }, [
                            _c("img", {
                              class: [itemmenu.iconclass],
                              attrs: { src: itemmenu.icon }
                            })
                          ])
                        : _vm._e(),
                      !itemmenu.icon && itemmenu.iconclass
                        ? _c("span", { class: [itemmenu.iconclass] })
                        : _vm._e(),
                      _c(
                        "span",
                        {
                          staticClass: "icon-title",
                          attrs: { slot: "title" },
                          slot: "title"
                        },
                        [
                          _vm._v(
                            _vm._s(
                              itemmenu.isI18n && _vm.$t
                                ? _vm.$t(itemmenu.title)
                                : itemmenu.title
                            )
                          )
                        ]
                      )
                    ]
                  )
                : _vm._e()
            ]
          })
        ],
        2
      ),
      _c("div", { staticClass: "iscollapse", on: { click: _vm.setcollapse } }, [
        _vm.iscollapse
          ? _c("i", { staticClass: "el-icon-d-arrow-right" })
          : _c("i", { staticClass: "el-icon-d-arrow-left" })
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/components/Menu/Index.vue?vue&type=template&id=75f29932&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Menu/Index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/**
 * menuData example
 */
// const menuDatas = [{
//     url:'/',
//     icon:'../../assets/image/icon/Management.png',
//     iconclass:'Management-icon',
//     title:'Management',
//     permissionurls:[],
//     childrens:[{
//         url:'/UserCon',
//         icon:'../../assets/image/icon/User.png',
//         iconclass:'User-icon',
//         title:'User management',
//         permissionurls:['/adm/pageUser'],
//         childrens:[]
//     },
//     {
//         url:'/CustCon',
//         icon:'../../assets/image/icon/Customer.png',
//         iconclass:'Customer-icon',
//         title:'Customer management',
//         permissionurls:['/pageCustome'],
//         childrens:[]
//     }]
// }]

/**
 * 
 */
/* harmony default export */ var Indexvue_type_script_lang_js_ = ({
  props: ['menuDatas', 'defaultActive', 'bgColor', 'textColor', 'activeTextColorr'],
  data: function data() {
    return {
      iscollapse: false,
      m_bgColor: '#244A79',
      m_textColor: '#fff',
      m_activeTextColor: '#ffd04b'
    };
  },
  created: function created() {
    console.log(this.$t);
    this.$props.bgColor && (this.m_bgColor = this.$props.bgColor);
    this.$props.textColor && (this.m_textColor = this.$props.textColor);
    this.$props.activeTextColor && (this.m_activeTextColor = this.$props.activeTextColor);
  },
  methods: {
    //收缩展开
    setcollapse: function setcollapse() {
      this.iscollapse = !this.iscollapse;
    },
    handleOpen: function handleOpen(key, keyPath) {// console.log(key, keyPath);
    },
    handleClose: function handleClose(key, keyPath) {// console.log(key, keyPath);
    }
  }
});
// CONCATENATED MODULE: ./src/components/Menu/Index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Menu_Indexvue_type_script_lang_js_ = (Indexvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Menu/Index.vue?vue&type=style&index=0&id=75f29932&scoped=true&lang=css&
var Indexvue_type_style_index_0_id_75f29932_scoped_true_lang_css_ = __webpack_require__(31);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/Menu/Index.vue






/* normalize component */

var component = normalizeComponent(
  Menu_Indexvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "75f29932",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Menu/Index.vue"
/* harmony default export */ var Index = (component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DashBoard/DashBoard.vue?vue&type=template&id=1024c9f9&
var DashBoardvue_type_template_id_1024c9f9_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "dashboard-content" },
    [
      _c(
        "el-row",
        { staticClass: "dashboard-item", attrs: { gutter: 10 } },
        _vm._l(_vm.datas.rows, function(item) {
          return _c(
            "el-col",
            {
              key: item.id,
              staticClass: "dashboard-cell",
              attrs: { span: item.span ? item.span * 1 : 8 }
            },
            [
              item.chartType == 0
                ? [
                    _c("LocalDataTable", {
                      attrs: {
                        chartConfig: item.chartData,
                        height: item.height,
                        width: item.width
                      }
                    })
                  ]
                : _vm._e(),
              item.chartType == 1
                ? [
                    _c("HBarChart", {
                      attrs: {
                        chartConfig: item.chartData,
                        height: item.height,
                        width: item.width
                      }
                    })
                  ]
                : _vm._e(),
              item.chartType == 2
                ? [
                    _c("BarChart", {
                      attrs: {
                        chartConfig: item.chartData,
                        height: item.height,
                        width: item.width
                      }
                    })
                  ]
                : _vm._e(),
              item.chartType == 3
                ? [
                    _c("PieChart", {
                      attrs: {
                        chartConfig: item.chartData,
                        height: item.height,
                        width: item.width
                      }
                    })
                  ]
                : _vm._e()
            ],
            2
          )
        }),
        1
      )
    ],
    1
  )
}
var DashBoardvue_type_template_id_1024c9f9_staticRenderFns = []
DashBoardvue_type_template_id_1024c9f9_render._withStripped = true


// CONCATENATED MODULE: ./src/components/DashBoard/DashBoard.vue?vue&type=template&id=1024c9f9&

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(4);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);

// EXTERNAL MODULE: external "echarts"
var external_echarts_ = __webpack_require__(18);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/HBar.vue?vue&type=template&id=5184e17a&scoped=true&
var HBarvue_type_template_id_5184e17a_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    ref: "chartId_" + _vm.chartId,
    style: { height: this.height, width: this.width }
  })
}
var HBarvue_type_template_id_5184e17a_scoped_true_staticRenderFns = []
HBarvue_type_template_id_5184e17a_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Charts/components/HBar.vue?vue&type=template&id=5184e17a&scoped=true&

// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(0);
var external_lodash_default = /*#__PURE__*/__webpack_require__.n(external_lodash_);

// CONCATENATED MODULE: ./src/components/Charts/charts.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 
 */


var echarts = __webpack_require__(18);

var charts_handleOptions = function handleOptions(datas, options) {
  return datas;
};

var chartOptions = {
  handleOptions: charts_handleOptions
};
var charts_options = {
  backgroundColor: '#212650',
  legend: {
    show: true,
    data: [],
    textStyle: {
      color: '#fff'
    }
  },
  title: {
    textStyle: {
      color: '#fff'
    },
    text: '' // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'

  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: {
        show: true,
        formatter: function formatter(params) {
          return params.value.replace('\n', '');
        }
      }
    }
  },
  xAxis: {
    data: [],
    axisLabel: {
      textStyle: {
        color: '#fff'
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    silent: false,
    splitLine: {
      show: false,
      color: ['#fff'],
      opacity: 0.3,
      lineStyle: {
        width: 0.5
      }
    },
    splitArea: {
      show: false
    },
    z: 0
  },
  grid: {
    left: "40",
    right: "40",
    top: "50",
    bottom: "30",
    containLabel: true
  },
  yAxis: {
    axisLine: {
      show: false
    },
    splitLine: {
      show: true,
      color: ['#fff'],
      opacity: 0.1,
      lineStyle: {
        width: 0.5
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#ccc'
      }
    }
  },
  dataZoom: [{
    type: 'inside'
  }],
  series: []
};
var charts_defaultConfig = {
  title: {
    //標題
    textStyle: {
      color: '#fff'
    },
    x: 10,
    y: 10,
    text: 'Title'
  },
  backgroundColor: '#212650',
  borderRadius: [0, 0, 0, 0],
  url: 'http://172.19.201.201:8900/api/splunk?key=Customer1%20Malware%20Activity',
  //獲取數據的接口
  areaStyle: false,
  //折綫圖顯示數據時，是否顯示下方區域顔色,
  areaColor: ['#fff', '#fff'],
  //多個為漸變色
  xAxis: {
    //X軸顯示的字段
    data: ['_time'],
    axisLabel: {
      textStyle: {
        color: '#fff'
      }
    }
  },
  yAxis: {
    //Y軸顯示的字段
    axisLabel: {
      textStyle: {
        color: '#ccc'
      }
    }
  },
  chartType: 'bar',
  //line  顯示為柱形或者折現
  legend: {
    show: true,
    data: ['blocked'],
    textStyle: {
      color: '#fff'
    },
    right: 10,
    y: 10
  },
  LinearColor: ['#FFF'] //數據顯示的顔色//多個為漸變色

};
var baseSeries = {
  type: 'bar',
  smooth: true,
  seriesLayoutBy: 'row',
  barMaxWidth: '10%',
  itemStyle: {
    normal: {},
    emphasis: {}
  },
  data: []
};
var charts_BaseCharts = /*#__PURE__*/function () {
  function BaseCharts(opts, config) {
    _classCallCheck(this, BaseCharts);

    var _opts = external_lodash_default.a.cloneDeep(charts_options);

    this.options = Object.assign({}, _opts, opts);
    this.config = Object.assign({}, charts_defaultConfig, config);
    this.options.grid = Object.assign({}, this.options.grid || {}, this.config.grid || {});
    this.options.tooltip = Object.assign({}, this.options.tooltip || {}, this.config.tooltip || {});
    this.options.xAxis = Object.assign({}, this.options.xAxis || {}, this.config.xAxis || {});
    this.options.yAxis = Object.assign({}, this.options.yAxis || {}, this.config.yAxis || {});
    this.datas = [];
    this.series = [];
    this.state = {};
    this.myChart = null;
    this.init();
  }

  _createClass(BaseCharts, [{
    key: "init",
    value: function init() {}
  }, {
    key: "getDatas",
    value: function getDatas() {}
  }, {
    key: "handleOptions",
    value: function handleOptions() {}
  }, {
    key: "preRender",
    value: function preRender() {
      if (this.config.dataZoom) {
        this.options.dataZoom = Object.assign([], this.options.dataZoom || [], this.config.dataZoom || []);
      }
    }
    /**
     * 處理從後臺獲取的數據
     * 
     */

  }, {
    key: "filterDatas",
    value: function filterDatas() {
      return this.datas;
    }
    /**
     * 
     * @param {Dom} context 一個DOM元素，渲染的容器 
     * @param {Object} datas //數據，格式為 fields:所有字段   ，results:接口數據
     * @param {Object} options //可覆蓋默認圖表配置信息
     */

  }, {
    key: "renderChart",
    value: function renderChart(context, datas, options) {
      var _this = this;

      // console.log(context,datas);
      this.datas = datas;
      this.filterDatas(this.datas);
      this.handleOptions(this.datas, options);
      options = external_lodash_default.a.cloneDeep(options);
      this.options = Object.assign(this.options, options);
      var myChart = this.myChart = echarts.init(context);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
      this.preRender(); // 绘制图表

      console.log('options', this.options);
      setTimeout(function () {
        myChart.setOption(_this.options);
      });
    }
  }]);

  return BaseCharts;
}();
var charts_HBarChart = /*#__PURE__*/function (_BaseCharts) {
  _inherits(HBarChart, _BaseCharts);

  var _super = _createSuper(HBarChart);

  function HBarChart(opts, config) {
    _classCallCheck(this, HBarChart);

    return _super.call(this, opts, config);
  }

  _createClass(HBarChart, [{
    key: "handleOptions",
    value: function handleOptions() {
      var _this2 = this;

      // console.log('hbarinfo:',this.options,this.config);
      //virmap 
      if (this.config.visualMap) {
        this.options.visualMap = Object.assign({}, this.options.visualMap, this.config.visualMap);
      } //標題


      this.options.title = Object.assign({}, this.options.title, this.config.title); //放大缩小
      //處理X軸

      this.options.xAxis.data = []; //X軸字段

      var xAxisField = this.config.xAxis.data[0]; //Y軸數據

      this.options.series = Object.assign([], this.options.series, this.config.series);
      this.options.legend = Object.assign({}, this.options.legend, this.config.legend);
      this.options.yAxis.splitLine = {
        show: true,
        color: ['#fff'],
        opacity: 0.3,
        lineStyle: {
          width: 0.5
        }
      };
      this.options.yAxis.splitLine = Object.assign({}, this.options.yAxis.splitLine, this.config.yAxis.splitLine || {});
      var legendField = this.options.legend.data;

      if (this.datas && this.datas.results) {
        var seriesData = [];
        this.datas.results.forEach(function (item, index) {
          if (external_lodash_default.a.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')) {
            _this2.options.xAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
          } else {
            _this2.options.xAxis.data.push(item[xAxisField]);
          } //處理Y軸


          legendField.forEach(function (n, i) {
            if (!seriesData[n]) {
              seriesData[n] = [];
            }

            seriesData[n].push(item[n]);
          });
        }); // console.log('seriesData',seriesData);
        //處理Y軸

        if (!this.config.isLineColor) {
          //不是渐变色的话
          var k = 0;
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = _this2.config.chartType;

            if (_this2.config.LinearColor && _this2.config.LinearColor[i]) {
              series.itemStyle = {
                normal: {
                  barBorderRadius: _this2.config.borderRadius,
                  color: _this2.config.LinearColor[i]
                }
              };
            }

            if (_this2.config.areaStyle) {
              var areaColor = [];

              if (_this2.config.areaColor && _this2.config.areaColor.length > 0) {
                for (var _i = 0, j = 0; _i <= 1; _i++) {
                  var color = _this2.config.areaColor[_i];

                  if (!color) {
                    color = _this2.config.areaColor[_i - 1];

                    if (!color) {
                      color = _this2.config.areaColor[_i - 2];
                    }
                  }

                  areaColor.push({
                    offset: j,
                    color: color
                  });
                  j += 0.5;
                }

                series.areaStyle = {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                };
              } else {
                series.areaStyle = {
                  opacity: 0.2
                };
              }
            }

            series.data = serieData;

            _this2.options.series.push(series);
          });
        } else {
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = _this2.config.chartType; //渐变色

            if (_this2.config.LinearColor && _this2.config.LinearColor[i] && external_lodash_default.a.isArray(_this2.config.LinearColor[i])) {
              var color = _this2.config.LinearColor[i];
              var seriesColor = [];

              for (var _k = 0, j = 0; j < 3; j++) {
                if (color[j]) {
                  seriesColor.push({
                    offset: _k,
                    color: color[j]
                  });
                }

                _k += 0.5;
              }

              if (_this2.config.chartType == 'bar' && seriesColor.length > 0) {
                series.itemStyle = {
                  normal: {
                    barBorderRadius: _this2.config.borderRadius,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                  }
                };
                series.emphasis = {
                  itemStyle: {
                    normal: {
                      barborderRadius: _this2.config.borderRadius,
                      color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                    }
                  }
                };
              }
            }

            if (_this2.config.areaStyle) {
              var areaColor = [];

              for (var _i2 = 0, _j = 0; _i2 <= 1; _i2++) {
                var _color = _this2.config.areaColor[_i2];

                if (!_color) {
                  _color = _this2.config.areaColor[_i2 - 1];

                  if (!_color) {
                    _color = _this2.config.areaColor[_i2 - 2];
                  }
                }

                areaColor.push({
                  offset: _j,
                  color: _color
                });
                _j += 0.5;
              }

              series.areaStyle = {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
              };
            }

            series.data = serieData;

            _this2.options.series.push(series);
          });
        } //標簽
        // console.log(legendField)
        //this.options.legend.data = legendField;
        // console.log(this.options.series)

      }
    }
  }]);

  return HBarChart;
}(charts_BaseCharts);
var charts_BarChart = /*#__PURE__*/function (_BaseCharts2) {
  _inherits(BarChart, _BaseCharts2);

  var _super2 = _createSuper(BarChart);

  function BarChart(opts, config) {
    _classCallCheck(this, BarChart);

    return _super2.call(this, opts, config);
  }

  _createClass(BarChart, [{
    key: "handleOptions",
    value: function handleOptions() {
      var _this3 = this;

      // console.log('barinfo:',this.options,this.config);
      //virmap 
      if (this.config.visualMap) {
        this.options.visualMap = Object.assign({}, this.options.visualMap, this.config.visualMap);
      } //標題


      this.options.title = Object.assign({}, this.options.title, this.config.title);
      this.options.dataZoom = [{
        type: 'inside',
        yAxisIndex: [0]
      }]; //this.options.dataZoom.orient = 'horizontal';
      //處理X軸

      this.options.xAxis.data = [];
      this.options.xAxis.type = 'value'; //X軸字段

      var xAxisField = this.config.xAxis.data[0];
      this.options.yAxis.type = 'category'; //Y軸數據

      this.options.series = Object.assign([], this.options.series, this.config.series);
      this.options.legend = Object.assign({}, this.options.legend, this.config.legend);
      this.options.yAxis.splitLine = {
        show: false
      };
      this.options.xAxis.splitLine = {
        show: true,
        color: ['#fff'],
        opacity: 0.3,
        lineStyle: {
          width: 0.5
        }
      };
      this.options.xAxis.splitLine = Object.assign({}, this.options.xAxis.splitLine, this.config.xAxis.splitLine || {});
      var legendField = this.options.legend.data;
      this.options.xAxis.data = external_lodash_default.a.cloneDeep(this.options.legend.data);

      if (this.datas && this.datas.results) {
        var seriesData = [];
        this.options.yAxis.data = [];
        this.datas.results.forEach(function (item, index) {
          if (external_lodash_default.a.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')) {
            _this3.options.yAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
          } else {
            _this3.options.yAxis.data.push(item[xAxisField]);
          } //處理Y軸


          legendField.forEach(function (n, i) {
            if (!seriesData[n]) {
              seriesData[n] = [];
            }

            seriesData[n].push(item[n]);
          });
        }); // console.log('seriesData',seriesData);
        //處理Y軸

        if (!this.config.isLineColor) {
          //不是渐变色的话
          var k = 0;
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = _this3.config.chartType;

            if (_this3.config.LinearColor && _this3.config.LinearColor[i]) {
              series.itemStyle = {
                normal: {
                  barBorderRadius: _this3.config.borderRadius,
                  color: _this3.config.LinearColor[i]
                }
              };
            }

            if (_this3.config.areaStyle) {
              var areaColor = [];

              for (var _i3 = 0, j = 0; _i3 <= 1; _i3++) {
                var color = _this3.config.areaColor[_i3];

                if (!color) {
                  color = _this3.config.areaColor[_i3 - 1];

                  if (!color) {
                    color = _this3.config.areaColor[_i3 - 2];
                  }
                }

                areaColor.push({
                  offset: j,
                  color: color
                });
                j += 0.5;
              }

              series.areaStyle = {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
              };
            }

            series.data = serieData;

            _this3.options.series.push(series);
          });
        } else {
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = _this3.config.chartType; //渐变色

            if (_this3.config.LinearColor && _this3.config.LinearColor[i] && external_lodash_default.a.isArray(_this3.config.LinearColor[i])) {
              var color = _this3.config.LinearColor[i];
              var seriesColor = [];

              for (var _k2 = 0, j = 0; j < 3; j++) {
                if (color[j]) {
                  seriesColor.push({
                    offset: _k2,
                    color: color[j]
                  });
                }

                _k2 += 0.5;
              }

              if (_this3.config.chartType == 'bar' && seriesColor.length > 0) {
                series.itemStyle = {
                  normal: {
                    barBorderRadius: _this3.config.borderRadius,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                  }
                };
                series.emphasis = {
                  itemStyle: {
                    normal: {
                      barborderRadius: _this3.config.borderRadius,
                      color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                    }
                  }
                };
              }
            }

            if (_this3.config.areaStyle) {
              var areaColor = [];

              for (var _i4 = 0, _j2 = 0; _i4 <= 1; _i4++) {
                var _color2 = _this3.config.areaColor[_i4];

                if (!_color2) {
                  _color2 = _this3.config.areaColor[_i4 - 1];

                  if (!_color2) {
                    _color2 = _this3.config.areaColor[_i4 - 2];
                  }
                }

                areaColor.push({
                  offset: _j2,
                  color: _color2
                });
                _j2 += 0.5;
              }

              series.areaStyle = {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
              };
            }

            series.data = serieData;

            _this3.options.series.push(series);
          });
        } //標簽
        // console.log(legendField)
        //this.options.legend.data = legendField;
        // console.log(this.options.series)

      }
    }
  }]);

  return BarChart;
}(charts_BaseCharts); //未完成

var charts_PieChart = /*#__PURE__*/function (_BaseCharts3) {
  _inherits(PieChart, _BaseCharts3);

  var _super3 = _createSuper(PieChart);

  function PieChart(opts, config) {
    _classCallCheck(this, PieChart);

    return _super3.call(this, opts, config);
  }

  _createClass(PieChart, [{
    key: "handleOptions",
    value: function handleOptions() {
      var _this4 = this;

      console.log('PieChartInfo:', this.options, this.config); //virmap 

      if (this.config.visualMap) {
        this.options.visualMap = Object.assign({}, this.options.visualMap, this.config.visualMap);
      } //標題


      this.options.title = Object.assign({}, this.options.title, this.config.title); //處理X軸

      this.options.xAxis.data = [];
      this.options.xAxis.show = false;
      this.options.tooltip = {};
      this.options.tooltip = Object.assign({}, this.options.tooltip, this.config.tooltip); //X軸字段

      var xAxisField = this.config.xAxis.data[0]; //Y軸數據

      this.options.series = Object.assign([], this.options.series, this.config.series);
      this.options.legend = Object.assign({}, this.options.legend, this.config.legend);
      this.options.yAxis.splitLine = {
        show: false,
        color: ['#fff'],
        opacity: 0.3,
        lineStyle: {
          width: 0.5
        }
      };
      this.options.yAxis.splitLine = Object.assign({}, this.options.yAxis.splitLine, this.config.yAxis.splitLine || {});
      var legendField = this.options.legend.data;

      if (this.datas && this.datas.results) {
        var seriesData = [];
        this.datas.results.forEach(function (item, index) {
          if (external_lodash_default.a.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')) {
            _this4.options.xAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
          } else {
            _this4.options.xAxis.data.push(item[xAxisField]);
          } //處理Y軸


          legendField.forEach(function (n, i) {
            if (!seriesData[n]) {
              seriesData[n] = [];
            }

            seriesData[n].push({
              name: item[xAxisField],
              value: item[n]
            });
          });
        }); // console.log('seriesData',seriesData);
        //處理Y軸

        if (!this.config.isLineColor) {
          //不是渐变色的话
          var k = 0;
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = 'pie';

            if (_this4.config.LinearColor && _this4.config.LinearColor[i]) {
              series.itemStyle = {
                normal: {
                  barBorderRadius: _this4.config.borderRadius,
                  color: _this4.config.LinearColor[i]
                }
              };
            }

            if (_this4.config.areaStyle) {
              var areaColor = [];

              if (_this4.config.areaColor && _this4.config.areaColor.length > 0) {
                for (var _i5 = 0, j = 0; _i5 <= 1; _i5++) {
                  var color = _this4.config.areaColor[_i5];

                  if (!color) {
                    color = _this4.config.areaColor[_i5 - 1];

                    if (!color) {
                      color = _this4.config.areaColor[_i5 - 2];
                    }
                  }

                  areaColor.push({
                    offset: j,
                    color: color
                  });
                  j += 0.5;
                }

                series.areaStyle = {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                };
              } else {
                series.areaStyle = {
                  opacity: 0.2
                };
              }
            }

            series.data = serieData;

            _this4.options.series.push(series);
          });
        } else {
          legendField.forEach(function (n, i) {
            var serieData = seriesData[n];

            var series = external_lodash_default.a.cloneDeep(baseSeries);

            series.name = n;
            series.type = 'pie'; //渐变色

            if (_this4.config.LinearColor && _this4.config.LinearColor[i] && external_lodash_default.a.isArray(_this4.config.LinearColor[i])) {
              var color = _this4.config.LinearColor[i];
              var seriesColor = [];

              for (var _k3 = 0, j = 0; j < 3; j++) {
                if (color[j]) {
                  seriesColor.push({
                    offset: _k3,
                    color: color[j]
                  });
                }

                _k3 += 0.5;
              }

              if (_this4.config.chartType == 'bar' && seriesColor.length > 0) {
                series.itemStyle = {
                  normal: {
                    barBorderRadius: _this4.config.borderRadius,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                  }
                };
                series.emphasis = {
                  itemStyle: {
                    normal: {
                      barborderRadius: _this4.config.borderRadius,
                      color: new echarts.graphic.LinearGradient(1, 0, 0, 1, seriesColor)
                    }
                  }
                };
              }
            }

            if (_this4.config.areaStyle) {
              var areaColor = [];

              for (var _i6 = 0, _j3 = 0; _i6 <= 1; _i6++) {
                var _color3 = _this4.config.areaColor[_i6];

                if (!_color3) {
                  _color3 = _this4.config.areaColor[_i6 - 1];

                  if (!_color3) {
                    _color3 = _this4.config.areaColor[_i6 - 2];
                  }
                }

                areaColor.push({
                  offset: _j3,
                  color: _color3
                });
                _j3 += 0.5;
              }

              series.areaStyle = {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
              };
            }

            series.data = serieData;

            _this4.options.series.push(series);
          });
        } // this.options.xAxis = {};
        // this.options.yAxis = {};
        //標簽
        //  console.log(legendField)
        //this.options.legend.data = legendField;
        //  console.log(this.options.series)

      }
    }
  }]);

  return PieChart;
}(charts_BaseCharts);
// CONCATENATED MODULE: ./src/utils/guid.js
var _Guid = function _Guid(g) {
  var arr = new Array(); //存放32位数值的数组

  if (typeof g == "string") {
    //如果构造函数的参数为字符串
    InitByString(arr, g);
  } else {
    InitByOther(arr);
  } //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。


  this.Equals = function (o) {
    if (o && o.IsGuid) {
      return this.ToString() == o.ToString();
    } else {
      return false;
    }
  }; //Guid对象的标记


  this.IsGuid = function () {}; //返回 Guid 类的此实例值的 String 表示形式。


  this.ToString = function (format) {
    if (typeof format == "string") {
      if (format == "N" || format == "D" || format == "B" || format == "P") {
        return ToStringWithFormat(arr, format);
      } else {
        return ToStringWithFormat(arr, "D");
      }
    } else {
      return ToStringWithFormat(arr, "D");
    }
  }; //由字符串加载


  function InitByString(arr, g) {
    g = g.replace(/\{|\(|\)|\}|-/g, "");
    g = g.toLowerCase();

    if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
      InitByOther(arr);
    } else {
      for (var i = 0; i < g.length; i++) {
        arr.push(g[i]);
      }
    }
  } //由其他类型加载


  function InitByOther(arr) {
    var i = 32;

    while (i--) {
      arr.push("0");
    }
  }
  /*
    根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。
    N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
    P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    */


  function ToStringWithFormat(arr, format) {
    switch (format) {
      case "N":
        return arr.toString().replace(/,/g, "");

      case "D":
        var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
        str = str.replace(/,/g, "");
        return str;

      case "B":
        var str = ToStringWithFormat(arr, "D");
        str = "{" + str + "}";
        return str;

      case "P":
        var str = ToStringWithFormat(arr, "D");
        str = "(" + str + ")";
        return str;

      default:
        return new Guid();
    }
  }
};

var Guid = {
  NewGuid: function NewGuid() {
    var g = "";
    var i = 32;

    while (i--) {
      g += Math.floor(Math.random() * 16.0).toString(16);
    }

    return new _Guid(g);
  },
  EmptyGuid: function EmptyGuid() {
    new _Guid().toString();
  }
};
var NewGuid = Guid.NewGuid;
var EmptyGuid = Guid.EmptyGuid;
/* harmony default export */ var guid = (Guid);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/HBar.vue?vue&type=script&lang=js&
//
//
//
//
//



/* harmony default export */ var HBarvue_type_script_lang_js_ = ({
  props: {
    chartConfig: {
      "default": function _default() {
        return {};
      }
    },
    height: {
      "default": function _default() {
        return '300px';
      }
    },
    width: {
      "default": function _default() {
        return '100%';
      }
    }
  },
  data: function data() {
    return {
      type: 'line',
      chartId: NewGuid().ToString(),
      chart: null,
      chartData: {}
    };
  },
  created: function created() {
    this.chart = new charts_HBarChart({}, this.chartConfig);
  },
  methods: {
    getDatas: function getDatas() {
      var _this = this;

      // var _tempdata = localStorage.getItem(this.chart.config.url);
      // if(_tempdata){
      //     var datas = JSON.parse(_tempdata);
      //     this.renderChart(datas)
      // }else{
      this.$fetch(this.chart.config.url, {}).then(function (res) {
        //console.log(res.data.data);
        try {
          var datas = JSON.parse(res.data.data); //  localStorage.setItem(this.chart.config.url,res.data.data)

          console.log(datas);
        } catch (e) {}

        _this.renderChart(datas);
      }); // }
    },
    renderChart: function renderChart(datas) {
      // 绘制图表
      var $dom = this.$refs['chartId_' + this.chartId];

      if ($dom) {
        console.log(datas);
        this.chart.renderChart($dom, datas);
      }
    }
  },
  mounted: function mounted() {
    this.getDatas();
  }
});
// CONCATENATED MODULE: ./src/components/Charts/components/HBar.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_HBarvue_type_script_lang_js_ = (HBarvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Charts/components/HBar.vue





/* normalize component */

var HBar_component = normalizeComponent(
  components_HBarvue_type_script_lang_js_,
  HBarvue_type_template_id_5184e17a_scoped_true_render,
  HBarvue_type_template_id_5184e17a_scoped_true_staticRenderFns,
  false,
  null,
  "5184e17a",
  null
  
)

/* hot reload */
if (false) { var HBar_api; }
HBar_component.options.__file = "src/components/Charts/components/HBar.vue"
/* harmony default export */ var HBar = (HBar_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/Bar.vue?vue&type=template&id=76d2b474&scoped=true&
var Barvue_type_template_id_76d2b474_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    ref: "chartId_" + _vm.chartId,
    style: { height: this.height, width: this.width }
  })
}
var Barvue_type_template_id_76d2b474_scoped_true_staticRenderFns = []
Barvue_type_template_id_76d2b474_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Charts/components/Bar.vue?vue&type=template&id=76d2b474&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/Bar.vue?vue&type=script&lang=js&
//
//
//
//
//



/* harmony default export */ var Barvue_type_script_lang_js_ = ({
  props: {
    chartConfig: {
      "default": function _default() {
        return {};
      }
    },
    height: {
      "default": function _default() {
        return '300px';
      }
    },
    width: {
      "default": function _default() {
        return '100%';
      }
    }
  },
  data: function data() {
    return {
      type: 'line',
      chartId: NewGuid().ToString(),
      chart: null,
      chartData: {}
    };
  },
  created: function created() {
    this.chart = new charts_BarChart({}, this.chartConfig);
  },
  methods: {
    getDatas: function getDatas() {
      var _this = this;

      // var _tempdata = localStorage.getItem(this.chart.config.url);
      // if(_tempdata){
      //     var datas = JSON.parse(_tempdata);
      //     this.renderChart(datas)
      // }else{
      this.$fetch(this.chart.config.url, {}).then(function (res) {
        //console.log(res.data.data);
        try {
          var datas = JSON.parse(res.data.data); // localStorage.setItem(this.chart.config.url,res.data.data)
          //  console.log(datas)
        } catch (e) {}

        _this.renderChart(datas);
      }); //  }
    },
    renderChart: function renderChart(datas) {
      // 绘制图表
      var $dom = this.$refs['chartId_' + this.chartId];

      if ($dom) {
        console.log(datas);
        this.chart.renderChart($dom, datas);
      }
    }
  },
  destroyed: function destroyed() {},
  mounted: function mounted() {
    this.getDatas();
  }
});
// CONCATENATED MODULE: ./src/components/Charts/components/Bar.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Barvue_type_script_lang_js_ = (Barvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Charts/components/Bar.vue





/* normalize component */

var Bar_component = normalizeComponent(
  components_Barvue_type_script_lang_js_,
  Barvue_type_template_id_76d2b474_scoped_true_render,
  Barvue_type_template_id_76d2b474_scoped_true_staticRenderFns,
  false,
  null,
  "76d2b474",
  null
  
)

/* hot reload */
if (false) { var Bar_api; }
Bar_component.options.__file = "src/components/Charts/components/Bar.vue"
/* harmony default export */ var Bar = (Bar_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/Pie.vue?vue&type=template&id=6859856d&scoped=true&
var Pievue_type_template_id_6859856d_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    ref: "chartId_" + _vm.chartId,
    style: { height: this.height, width: this.width }
  })
}
var Pievue_type_template_id_6859856d_scoped_true_staticRenderFns = []
Pievue_type_template_id_6859856d_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Charts/components/Pie.vue?vue&type=template&id=6859856d&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Charts/components/Pie.vue?vue&type=script&lang=js&
//
//
//
//
//



/* harmony default export */ var Pievue_type_script_lang_js_ = ({
  props: {
    chartConfig: {
      "default": function _default() {
        return {};
      }
    },
    height: {
      "default": function _default() {
        return '300px';
      }
    },
    width: {
      "default": function _default() {
        return '100%';
      }
    }
  },
  data: function data() {
    return {
      type: 'pie',
      chartId: NewGuid().ToString(),
      chart: null,
      chartData: {}
    };
  },
  created: function created() {
    this.chart = new charts_PieChart({}, this.chartConfig);
  },
  methods: {
    getDatas: function getDatas() {
      var _this = this;

      // var _tempdata = localStorage.getItem(this.chart.config.url);
      // if(_tempdata){
      //     var datas = JSON.parse(_tempdata);
      //     this.renderChart(datas)
      // }else{
      this.$fetch(this.chart.config.url, {}).then(function (res) {
        //console.log(res.data.data);
        try {
          var datas = JSON.parse(res.data.data); // localStorage.setItem(this.chart.config.url,res.data.data)
          //  console.log(datas)
        } catch (e) {}

        _this.renderChart(datas);
      }); //  }
    },
    renderChart: function renderChart(datas) {
      // 绘制图表
      var $dom = this.$refs['chartId_' + this.chartId];

      if ($dom) {
        console.log(datas);
        this.chart.renderChart($dom, datas);
      }
    }
  },
  mounted: function mounted() {
    this.getDatas();
  }
});
// CONCATENATED MODULE: ./src/components/Charts/components/Pie.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Pievue_type_script_lang_js_ = (Pievue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Charts/components/Pie.vue





/* normalize component */

var Pie_component = normalizeComponent(
  components_Pievue_type_script_lang_js_,
  Pievue_type_template_id_6859856d_scoped_true_render,
  Pievue_type_template_id_6859856d_scoped_true_staticRenderFns,
  false,
  null,
  "6859856d",
  null
  
)

/* hot reload */
if (false) { var Pie_api; }
Pie_component.options.__file = "src/components/Charts/components/Pie.vue"
/* harmony default export */ var Pie = (Pie_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DataTable/LocalDataTable.vue?vue&type=template&id=2a110494&scoped=true&
var LocalDataTablevue_type_template_id_2a110494_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "chartId_" + _vm.chartId,
      staticStyle: { height: "300px", width: "100%" }
    },
    [
      _vm.localDatas && _vm.localDatas.length > 0
        ? _c(
            "el-table",
            {
              ref: "multipleTable",
              staticClass: "theader-cell-center",
              staticStyle: { width: "100%" },
              attrs: {
                data: _vm.localDatas,
                "tooltip-effect": "dark",
                "header-cell-style": {
                  "background-color": "#eaf1f6",
                  color: "#74859f"
                }
              }
            },
            [
              _c("template", { slot: "empty" }, [
                _vm._v(_vm._s(_vm.$t("table.queryEmpty")))
              ]),
              _vm._l(_vm.tableFields, function(item, index) {
                return _c("el-table-column", {
                  key: index,
                  attrs: {
                    "header-align": _vm.chartConfig.headerAlign,
                    align: _vm.chartConfig.cellAlign,
                    label: _vm.changeHeaderItemValue(item.name),
                    "min-width": "13%"
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "default",
                        fn: function(scope) {
                          return [
                            _c("p", [
                              _vm._v(
                                _vm._s(_vm.changeRowValue(scope.row, item.name))
                              )
                            ])
                          ]
                        }
                      }
                    ],
                    null,
                    true
                  )
                })
              })
            ],
            2
          )
        : _vm._e(),
      _c(
        "div",
        { staticClass: "pagetion-box pull-right" },
        [
          _vm.localDatas && _vm.localDatas.length > 0
            ? _c("el-pagination", {
                attrs: {
                  "page-size": _vm.pageinfo.pageSize,
                  layout: "slot, prev, pager, next,jumper",
                  "current-page": _vm.pageinfo.pageNum,
                  background: "",
                  total: _vm.pageinfo.total
                },
                on: {
                  "current-change": _vm.renderTable,
                  "update:currentPage": function($event) {
                    return _vm.$set(_vm.pageinfo, "pageNum", $event)
                  },
                  "update:current-page": function($event) {
                    return _vm.$set(_vm.pageinfo, "pageNum", $event)
                  }
                }
              })
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var LocalDataTablevue_type_template_id_2a110494_scoped_true_staticRenderFns = []
LocalDataTablevue_type_template_id_2a110494_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/DataTable/LocalDataTable.vue?vue&type=template&id=2a110494&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DataTable/LocalDataTable.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var LocalDataTablevue_type_script_lang_js_echarts = __webpack_require__(18);

var OnlyId = function OnlyId() {
  return (Math.random() * 10000000 >> 0).toString(16) + '-' + (Math.random() * 10000000 >> 0).toString(16);
};

var chartInfo = {
  title: ''
};

/* harmony default export */ var LocalDataTablevue_type_script_lang_js_ = ({
  props: {
    chartConfig: {
      "default": function _default() {
        return {
          customerFields: [],
          headerAlign: 'center',
          cellAlign: 'center'
        };
      }
    }
  },
  data: function data() {
    return {
      type: 'datatable',
      chartId: OnlyId(),
      localDatas: [],
      tableDatas: [],
      //當前列表頁存放列表數據，在handleList中賦值即可在
      tableFields: [],
      pageinfo: {
        pageNum: 1,
        //查询第几页
        currentPage: 1,
        //页码对应值
        total: 0,
        //总页数
        pageSize: 10,
        //显示条数
        pageSizes: [10, 20, 50, 100]
      }
    };
  },
  created: function created() {
    console.log('datatable.loading');
    this.getDatas();
  },
  methods: {
    changeHeaderItemValue: function changeHeaderItemValue(value) {
      return value;
    },
    changeRowValue: function changeRowValue(itemData, value) {
      return itemData[value];
    },
    handleCurrentChange: function handleCurrentChange(page) {
      this.pageinfo.pageNum = page;
      this.getDatas();
    },
    getDatas: function getDatas() {
      var _this = this;

      this.$fetch(this.chartConfig.url, {}).then(function (res) {
        var datas = [];

        try {
          if (res.data && res.data.data) {
            datas = JSON.parse(res.data.data);

            _this.handleData(datas);
          }

          console.log('datatable', datas);
        } catch (e) {}
      });
    },
    handleData: function handleData(datas) {
      if (this.dataFields) {
        this.tableFields = external_lodash_default.a.cloneDeep(this.dataFields);
      } else {
        this.tableFields = datas.fields;
      }

      this.tableDatas = datas.results;
      this.pageinfo.total = this.tableDatas.length;
      this.renderTable();
    },
    limitData: function limitData() {
      var res = [];
      var start = (this.pageinfo.pageNum - 1) * this.pageinfo.pageSize;
      var end = start + this.pageinfo.pageSize - 1;

      if (start < 0) {
        start = 0;
      }

      if (end > this.tableDatas.length) {
        end = this.tableDatas.length;
      }

      var tempDatas = external_lodash_default.a.cloneDeep(this.tableDatas);

      return tempDatas.slice(start, end);
    },
    renderTable: function renderTable() {
      this.localDatas = this.limitData();
    }
  },
  mounted: function mounted() {}
});
// CONCATENATED MODULE: ./src/components/DataTable/LocalDataTable.vue?vue&type=script&lang=js&
 /* harmony default export */ var DataTable_LocalDataTablevue_type_script_lang_js_ = (LocalDataTablevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/DataTable/LocalDataTable.vue





/* normalize component */

var LocalDataTable_component = normalizeComponent(
  DataTable_LocalDataTablevue_type_script_lang_js_,
  LocalDataTablevue_type_template_id_2a110494_scoped_true_render,
  LocalDataTablevue_type_template_id_2a110494_scoped_true_staticRenderFns,
  false,
  null,
  "2a110494",
  null
  
)

/* hot reload */
if (false) { var LocalDataTable_api; }
LocalDataTable_component.options.__file = "src/components/DataTable/LocalDataTable.vue"
/* harmony default export */ var LocalDataTable = (LocalDataTable_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DashBoard/DashBoard.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ var DashBoardvue_type_script_lang_js_ = ({
  name: "Dashboard",
  components: {
    HBarChart: HBar,
    LocalDataTable: LocalDataTable,
    BarChart: Bar,
    PieChart: Pie
  },
  props: ['dashboardData'],
  data: function data() {
    return {
      datas: []
    };
  },
  methods: {},
  created: function created() {
    this.datas = this.dashboardData;
  },
  mounted: function mounted() {//console.log(this.datas);
  }
});
// CONCATENATED MODULE: ./src/components/DashBoard/DashBoard.vue?vue&type=script&lang=js&
 /* harmony default export */ var DashBoard_DashBoardvue_type_script_lang_js_ = (DashBoardvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/DashBoard/DashBoard.vue?vue&type=style&index=0&lang=css&
var DashBoardvue_type_style_index_0_lang_css_ = __webpack_require__(33);

// CONCATENATED MODULE: ./src/components/DashBoard/DashBoard.vue






/* normalize component */

var DashBoard_component = normalizeComponent(
  DashBoard_DashBoardvue_type_script_lang_js_,
  DashBoardvue_type_template_id_1024c9f9_render,
  DashBoardvue_type_template_id_1024c9f9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var DashBoard_api; }
DashBoard_component.options.__file = "src/components/DashBoard/DashBoard.vue"
/* harmony default export */ var DashBoard = (DashBoard_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DataTable/Index.vue?vue&type=template&id=4af72fa7&scoped=true&
var Indexvue_type_template_id_4af72fa7_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: ["content-item clearfix", _vm.tableInfo.className || ""] },
    [
      _c(
        "el-table",
        {
          ref: "multipleTable",
          staticClass: "theader-cell-center",
          staticStyle: { width: "100%" },
          attrs: {
            data: _vm.tableDatas,
            "tooltip-effect": "dark",
            stripe: _vm.tableInfo.stripe || false,
            height:
              _vm.tableInfo.height === false
                ? null
                : _vm.tableInfo.height || 250,
            "row-class-name": _vm.tableInfo.tableRowClassName,
            "default-sort": _vm.tableInfo.defaultSort || {},
            "header-row-style": _vm.tableInfo.headerCellStyle || {
              "background-color": "#eaf1f6",
              color: "#74859f"
            },
            "header-cell-style": _vm.tableInfo.headerCellStyle || {
              "background-color": "#eaf1f6",
              color: "#74859f"
            }
          },
          on: {
            "selection-change": _vm.handleSelectionChange,
            "sort-change": _vm.handleSortChange
          }
        },
        [
          _c("template", { slot: "empty" }, [
            _vm._v(_vm._s(_vm.$t("没有数据")))
          ]),
          _vm.columnConfig.isSelectAll
            ? _c("el-table-column", {
                attrs: {
                  type: "selection",
                  align: _vm.columnConfig.selectAllAlign
                    ? _vm.columnConfig.selectAllAlign
                    : "center",
                  "min-width": _vm.columnConfig.selectAllWidth
                    ? _vm.item.selectAllWidth
                    : "5%"
                }
              })
            : _vm._e(),
          _vm._l(_vm.columnConfig.columnModels, function(item, index) {
            return _c("el-table-column", {
              key: index,
              attrs: {
                "header-align": item.headerAlign,
                align: item.cellAlign,
                sortable: item.sortable ? item.sortable : false,
                prop: item.field,
                label: _vm.changeHeaderItemValue(item.headerName || item.field),
                "min-width": item.width ? item.width : "13%"
              },
              scopedSlots: _vm._u(
                [
                  {
                    key: "default",
                    fn: function(scope) {
                      return [
                        _vm._t("cell", null, null, {
                          scope: scope,
                          item: item,
                          columnConfig: _vm.columnConfig,
                          tableDatas: _vm.tableDatas
                        })
                      ]
                    }
                  }
                ],
                null,
                true
              )
            })
          }),
          _vm.columnConfig.columnModels &&
          _vm.columnConfig.columnModels.length > 0 &&
          !_vm.columnConfig.notShowOperation
            ? _c("el-table-column", {
                attrs: {
                  label: _vm.$t("操作"),
                  "min-width": _vm.columnConfig.operaterWidth
                    ? _vm.columnConfig.operaterWidth
                    : "13%",
                  align: _vm.columnConfig.operaterAlign
                    ? _vm.columnConfig.operaterAlign
                    : "center"
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function(scope) {
                        return [
                          _vm._t("operater", null, null, {
                            scope: scope,
                            columnConfig: _vm.columnConfig,
                            tableDatas: _vm.tableDatas
                          })
                        ]
                      }
                    }
                  ],
                  null,
                  true
                )
              })
            : _vm._e()
        ],
        2
      ),
      _c(
        "div",
        { staticClass: "pagetion-box pull-right" },
        [
          _c("el-pagination", {
            attrs: {
              "page-size": _vm.pageinfo.pageSize,
              layout:
                _vm.tableInfo.layouts || "sizes,slot, prev, pager, next,jumper",
              "current-page": _vm.pageinfo.pageNum,
              background: "",
              total: _vm.pageinfo.total
            },
            on: {
              "current-change": _vm.handleCurrentChange,
              "size-change": _vm.handleSizeChange,
              "update:pageSize": function($event) {
                return _vm.$set(_vm.pageinfo, "pageSize", $event)
              },
              "update:page-size": function($event) {
                return _vm.$set(_vm.pageinfo, "pageSize", $event)
              },
              "update:currentPage": function($event) {
                return _vm.$set(_vm.pageinfo, "pageNum", $event)
              },
              "update:current-page": function($event) {
                return _vm.$set(_vm.pageinfo, "pageNum", $event)
              }
            }
          })
        ],
        1
      )
    ],
    1
  )
}
var Indexvue_type_template_id_4af72fa7_scoped_true_staticRenderFns = []
Indexvue_type_template_id_4af72fa7_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/DataTable/Index.vue?vue&type=template&id=4af72fa7&scoped=true&

// CONCATENATED MODULE: ./src/mixins/tablehandler.js
/**
 * 帶分頁列表頁面控制mixin
 * 必須自定義一個 handleList的方法
 */
var tablehandler = {
  data: function data() {
    return {
      tableDatas: [],
      //當前列表頁存放列表數據，在handleList中賦值即可在
      pageinfo: {
        pageNum: 1,
        //查询第几页
        currentPage: 1,
        //页码对应值
        total: 0,
        //总页数
        pageSize: 10,
        //显示条数
        pageSizes: [10, 20, 50, 100]
      },
      multipleSelection: [] //存放选中那些记录

    };
  },
  methods: {
    seacherHander: function seacherHander() {
      this.pageinfo.pageNum = 1;
      this.pageinfo.currentPage = 1;
      this.handleList();
    },
    //选中记录触发
    handleSelectionChange: function handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange: function handleCurrentChange(page) {
      this.pageinfo.pageNum = page;

      if (this.tableInfo && this.tableInfo.handleCurrentChange) {
        this.tableInfo.handleCurrentChange.call(this, this, page);
      }

      var tableInfoCache = localStorage.getItem(this.$route.name);
      var tableInfoObj = null;

      if (tableInfoCache) {
        tableInfoObj = JSON.parse(tableInfoCache);
      } else {
        tableInfoObj = {};
      }

      tableInfoObj.pageinfo = this.pageinfo;
      localStorage.setItem(this.$route.name, JSON.stringify(tableInfoObj));
      this.handleList();
    },
    //改变每页多少条
    handleSizeChange: function handleSizeChange(val) {
      sessionStorage.setItem("ContpageSize", val);
      this.pageinfo.pageSize = val;
      this.pageinfo.pageNum = 1;
      this.pageinfo.currentPage = 1;
      this.handleList(); // console.log(`每页 ${val} 条`);
    },
    //删除数据
    handledelete: function handledelete(row) {
      var _this = this;

      var txt = "是否确认删除该记录?";
      var typetxt = "error";
      this.$confirm(txt, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: typetxt
      }).then(function () {
        _this.delbwForm(row);
      })["catch"](function () {});
    }
  }
};
/* harmony default export */ var mixins_tablehandler = (tablehandler);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DataTable/Index.vue?vue&type=script&lang=js&
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/**
 * 表格单元格的渲染方式
 *  <template  v-slot:cell="scope">
      <p >{{changeRowValue(scope.scope.row,scope.item.field)}}</p>
    </template>
    表格操作列的渲染方式
    <template  v-slot:operater="scope">
      <el-button size="mini" @click="refreshTable"> 编辑 </el-button>
      <p v-if="false">{{scope.scope.row.count}}</p>
    </template>
 * 
 * @param {Object} tableInfo
 *   tableInfo.columnConfig:列配置项，具体配置在  columnConfig.columnModels里面
  *      example columnConfig.columnModels {Array} = [{name:'attributename',label:'显示名称',sortby:''，displayorder:0}]
  *      example  columnConfig.isSelectAll {Boolean}  是否显示表格前面复选框
 *   tableInfo.tableDatas {Array}: 列表具体数据配置信息  tableDatas.url：获取数据的API
 *  
 *   tableInfo.filterDatas: {Object} 传到API中的过滤条件
 * 
 *   tableInfo.sortHandler {Function} 返回一个对象 ，列如{
       sortby:'',
       sortorder:"descending"
     }
      tableInfo.defaultSort {object} 例如{prop: 'count', order: 'descending'}
     tableInfo.layouts 分页显示那些内容 ，默认：'slot, prev, pager, next,jumper'
 */

/* harmony default export */ var DataTable_Indexvue_type_script_lang_js_ = ({
  name: "DataTable",
  props: ["tableInfo"],
  components: {},
  mixins: [mixins_tablehandler],
  data: function data() {
    return {
      // tableDatas:this.tableInfo.tableDatas,
      columnConfig: this.tableInfo.columnConfig,
      type: 'get',
      sortData: {
        sortby: '',
        sortorder: "descending"
      }
    };
  },
  created: function created() {
    var _this = this;

    if (this.tableInfo.sortHandler) {
      this.sortData = this.tableInfo.sortHandler.call(this, this.sortData);
    }

    this.tableInfo.$_VmTable = this;
    this.$nextTick(function (res) {
      _this.$refs.multipleTable.doLayout();
    });
  },
  methods: {
    setOptions: function setOptions(handler) {
      handler.call(this, this);
    },
    //改变每页多少条
    handleSizeChange: function handleSizeChange(val) {
      this.pageinfo.pageSize = val;
      this.pageinfo.pageNum = 1;
      this.pageinfo.currentPage = 1;

      if (this.tableInfo.handleSizeChange) {
        this.tableInfo.handleSizeChange.call(this, val);
      }

      var tableInfoCache = localStorage.getItem(this.$route.name);
      var tableInfoObj = null;

      if (tableInfoCache) {
        tableInfoObj = JSON.parse(tableInfoCache);
      } else {
        tableInfoObj = {};
      }

      tableInfoObj.pageinfo = this.pageinfo;
      localStorage.setItem(this.$route.name, JSON.stringify(tableInfoObj));
      this.handleList();
    },
    handleSelectionChange: function handleSelectionChange(val) {
      this.multipleSelection = val;

      if (this.tableInfo.handleSelectionChange) {
        this.tableInfo.handleSelectionChange.call(this, val);
      }
    },
    changeHeaderItemValue: function changeHeaderItemValue(value) {
      var res = value;

      if (this.tableInfo.changeLang) {
        res = this.tableInfo.changeLang(value, this);
      } else if (this.$t && this.tableInfo.isI18n == true) {
        res = this.$t(value);
      }

      return res;
    },
    changeRowValue: function changeRowValue(rowData, name) {
      return rowData[name];
    },
    handleSortChange: function handleSortChange(opts) {
      // console.log(opts);
      if (this.tableInfo.sortHandler) {
        this.sortData = this.tableInfo.sortHandler.call(this, this.sortData, opts);
      }

      var tableInfoCache = localStorage.getItem(this.$route.name);
      var tableInfoObj = null;

      if (tableInfoCache) {
        tableInfoObj = JSON.parse(tableInfoCache);
      } else {
        tableInfoObj = {};
      }

      tableInfoObj.sortData = this.sortData;
      localStorage.setItem(this.$route.name, JSON.stringify(tableInfoObj));

      if (!this.tableInfo.isNotSortRefresh) {
        this.handleList();
      }

      if (this.tableInfo.sortEnded) {
        this.tableInfo.sortEnded.call(this);
      } // console.log(this.sortData);

    },
    handleList: function handleList() {
      var _this2 = this;

      // let tableInfoCache = localStorage.getItem(this.$route.name);
      // let tableInfoObj = null
      // if(tableInfoCache){
      //    tableInfoObj = JSON.parse(tableInfoCache);
      // }else{
      //    tableInfoObj= {};
      // }
      // tableInfoObj.filterDatas = this.tableInfo.filterDatas;
      // localStorage.setItem(this.$route.name,JSON.stringify(tableInfoObj));
      if (!this.tableInfo.getTableDatas) {
        var xhr = this.$fetch;

        if (this.tableInfo.type == 'post') {
          xhr = this.$post;
        }

        var postData = _objectSpread(_objectSpread({
          pageNum: this.pageinfo.pageNum,
          pageSize: this.pageinfo.pageSize
        }, this.tableInfo.filterDatas || {}), this.sortData);

        if (this.tableInfo.preLoadData) {
          this.tableInfo.preLoadData.call(this, postData);
        }

        if (!this.tableInfo.tableDatas.url) return false;
        xhr(this.tableInfo.tableDatas.url, {
          params: postData
        }).then(function (res) {
          // console.log('testdatas',res);
          if (res) {
            if (_this2.tableInfo.dataFilter) {
              res = _this2.tableInfo.dataFilter.call(_this2, res);
            }

            var datas = res.items;
            _this2.pageinfo.pageNum = res.data.pageNum * 1 || 1;
            _this2.pageinfo.total = res.data.total * 1;
            _this2.tableDatas = datas;
          }
        });
      } else {
        this.tableInfo.getTableDatas(this);
      }
    }
  },
  mounted: function mounted() {
    if (this.$refs && this.$refs.multipleTable) {
      this.tableInfo.$_DomTable = this.$refs.multipleTable;
    }
  },
  beforeMount: function beforeMount() {
    var _this3 = this;

    this.handleList();
    this.$on('datatable.refresh', function (opts) {
      //this.pageinfo.pageNum = 1;
      _this3.handleList();
    }); //  console.log('index.columnConfig',this.tableInfo.columnConfig);
    //   console.log('index.tableDatas',this.tableInfo.tableDatas);
  }
});
// CONCATENATED MODULE: ./src/components/DataTable/Index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_DataTable_Indexvue_type_script_lang_js_ = (DataTable_Indexvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/DataTable/Index.vue?vue&type=style&index=0&id=4af72fa7&scoped=true&lang=css&
var Indexvue_type_style_index_0_id_4af72fa7_scoped_true_lang_css_ = __webpack_require__(35);

// CONCATENATED MODULE: ./src/components/DataTable/Index.vue






/* normalize component */

var Index_component = normalizeComponent(
  components_DataTable_Indexvue_type_script_lang_js_,
  Indexvue_type_template_id_4af72fa7_scoped_true_render,
  Indexvue_type_template_id_4af72fa7_scoped_true_staticRenderFns,
  false,
  null,
  "4af72fa7",
  null
  
)

/* hot reload */
if (false) { var Index_api; }
Index_component.options.__file = "src/components/DataTable/Index.vue"
/* harmony default export */ var DataTable_Index = (Index_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/MinDataGrid.vue?vue&type=template&id=38431247&
var MinDataGridvue_type_template_id_38431247_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "min-datagrid-box minextend-datagrid-box" },
    [
      _c(
        "el-row",
        { attrs: { gutter: _vm.formdata.padding || 15 } },
        _vm._l(_vm.formdata.childrens, function(item) {
          return _c(
            "el-col",
            { key: item.id, attrs: { span: item.span || 15 } },
            [
              _c("span", { staticClass: "min-datagrid-header-item" }, [
                _vm._v(_vm._s(item.label))
              ])
            ]
          )
        }),
        1
      ),
      _vm._l(_vm.gridDatas.values, function(valueitem, valueIndex) {
        return _c(
          "el-row",
          { key: valueIndex, attrs: { gutter: _vm.formdata.padding || 15 } },
          [
            _vm._l(_vm.formdata.childrens, function(item) {
              return _c(
                "el-col",
                { key: item.id, attrs: { span: item.span || 15 } },
                [
                  _c("MinFormCell", {
                    attrs: {
                      values: valueitem,
                      index: valueIndex,
                      formdata: item
                    }
                  })
                ],
                1
              )
            }),
            _vm.isCopy
              ? _c(
                  "el-col",
                  [
                    _c(
                      "el-button",
                      {
                        attrs: { type: "primary", size: "mini" },
                        on: {
                          click: function($event) {
                            return _vm.copyRow(valueitem)
                          }
                        }
                      },
                      [_vm._v(_vm._s(_vm.$t("复制")))]
                    )
                  ],
                  1
                )
              : _vm._e()
          ],
          2
        )
      }),
      _c(
        "el-button",
        { attrs: { type: "primary", size: "mini" }, on: { click: _vm.addRow } },
        [_vm._v(_vm._s(_vm.$t("新增")))]
      )
    ],
    2
  )
}
var MinDataGridvue_type_template_id_38431247_staticRenderFns = []
MinDataGridvue_type_template_id_38431247_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/MinDataGrid.vue?vue&type=template&id=38431247&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/MinFormCell.vue?vue&type=template&id=2d24057d&scoped=true&
var MinFormCellvue_type_template_id_2d24057d_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-cell", _vm.className]
    },
    [
      _vm.formdata.datatype == "boolean" && _vm.formdata.formater == "checkbox"
        ? [
            _c(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.formdata.isShowLabel,
                    expression: "formdata.isShowLabel"
                  }
                ],
                ref: "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                attrs: { prop: _vm.formdata.field + "_" + _vm.index }
              },
              [
                _c(
                  "el-checkbox-group",
                  {
                    directives: [
                      {
                        name: "validate",
                        rawName: "v-validate",
                        value: _vm.validaterules,
                        expression: "validaterules"
                      }
                    ],
                    ref: "bwminform_" + _vm.formdata.field,
                    class: {
                      input: true,
                      "is-danger": _vm.errorBags.first(
                        _vm.formdata.field + "_" + _vm.index
                      )
                    },
                    attrs: { name: _vm.formdata.field + "_" + _vm.index },
                    model: {
                      value: _vm.values[_vm.formdata.field],
                      callback: function($$v) {
                        _vm.$set(_vm.values, _vm.formdata.field, $$v)
                      },
                      expression: "values[formdata.field]"
                    }
                  },
                  [
                    _c("el-checkbox", {
                      attrs: {
                        disabled: _vm.formdata.disabled === true,
                        label: "",
                        value: true
                      },
                      on: { change: _vm.fieldChange }
                    })
                  ],
                  1
                ),
                _c("span", { staticClass: "form-item-error" }, [
                  _vm._v(
                    _vm._s(
                      _vm.errorBags.first(_vm.formdata.field + "_" + _vm.index)
                    )
                  )
                ])
              ],
              1
            )
          ]
        : _vm._e(),
      _vm.formdata.datatype == "boolean" &&
      (!_vm.formdata.formater || _vm.formdata.formater == "switch")
        ? [
            _c(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.formdata.isShowLabel,
                    expression: "formdata.isShowLabel"
                  }
                ],
                ref: "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                attrs: { prop: _vm.formdata.field + "_" + _vm.index }
              },
              [
                _c("el-switch", {
                  directives: [
                    {
                      name: "validate",
                      rawName: "v-validate",
                      value: _vm.validaterules,
                      expression: "validaterules"
                    }
                  ],
                  ref: "bwminform_" + _vm.formdata.field,
                  class: {
                    input: true,
                    "is-danger": _vm.errorBags.first(
                      _vm.formdata.field + "_" + _vm.index
                    )
                  },
                  attrs: {
                    placeholder: "",
                    name: _vm.formdata.field + "_" + _vm.index,
                    disabled: _vm.formdata.disabled === true,
                    "active-color": "#13ce66",
                    "inactive-color": "#ff4949"
                  },
                  on: { change: _vm.fieldChange },
                  model: {
                    value: _vm.values[_vm.formdata.field],
                    callback: function($$v) {
                      _vm.$set(_vm.values, _vm.formdata.field, $$v)
                    },
                    expression: "values[formdata.field]"
                  }
                }),
                _c("span", { staticClass: "form-item-error" }, [
                  _vm._v(
                    _vm._s(
                      _vm.errorBags.first(_vm.formdata.field + "_" + _vm.index)
                    )
                  )
                ])
              ],
              1
            )
          ]
        : _vm._e(),
      _vm.formdata.datatype == "string"
        ? [
            _c(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.formdata.isShowLabel,
                    expression: "formdata.isShowLabel"
                  }
                ],
                ref: "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                attrs: { prop: _vm.formdata.field + "_" + _vm.index }
              },
              [
                _c("el-input", {
                  directives: [
                    {
                      name: "validate",
                      rawName: "v-validate",
                      value: _vm.validaterules,
                      expression: "validaterules"
                    }
                  ],
                  ref: "bwminform_" + _vm.formdata.field,
                  class: {
                    input: true,
                    "is-danger": _vm.errorBags.first(
                      _vm.formdata.field + "_" + _vm.index
                    )
                  },
                  attrs: {
                    type:
                      _vm.formdata.formater == "textarea" ? "textarea" : "text",
                    placeholder: "",
                    disabled: _vm.formdata.disabled === true,
                    name: _vm.formdata.field + "_" + _vm.index
                  },
                  on: { input: _vm.fieldChange },
                  model: {
                    value: _vm.values[_vm.formdata.field],
                    callback: function($$v) {
                      _vm.$set(_vm.values, _vm.formdata.field, $$v)
                    },
                    expression: "values[formdata.field]"
                  }
                }),
                _c("span", { staticClass: "form-item-error" }, [
                  _vm._v(
                    _vm._s(
                      _vm.errorBags.first(_vm.formdata.field + "_" + _vm.index)
                    )
                  )
                ])
              ],
              1
            )
          ]
        : _vm._e(),
      _vm.formdata.datatype == "date"
        ? [
            _c(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.formdata.isShowLabel,
                    expression: "formdata.isShowLabel"
                  }
                ],
                ref: "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                attrs: { prop: _vm.formdata.field + "_" + _vm.index }
              },
              [
                _c("el-date-picker", {
                  directives: [
                    {
                      name: "validate",
                      rawName: "v-validate",
                      value: _vm.validaterules,
                      expression: "validaterules"
                    }
                  ],
                  ref: "bwminform_" + _vm.formdata.field,
                  class: {
                    input: true,
                    "is-danger": _vm.errorBags.first(
                      _vm.formdata.field + "_" + _vm.index
                    )
                  },
                  attrs: {
                    placeholder: "",
                    name: _vm.formdata.field + "_" + _vm.index,
                    disabled: _vm.formdata.disabled === true,
                    "value-format": _vm.formdata.dataformat || "",
                    type: "datetime"
                  },
                  on: { change: _vm.fieldChange },
                  model: {
                    value: _vm.values[_vm.formdata.field],
                    callback: function($$v) {
                      _vm.$set(_vm.values, _vm.formdata.field, $$v)
                    },
                    expression: "values[formdata.field]"
                  }
                }),
                _c("span", { staticClass: "form-item-error" }, [
                  _vm._v(
                    _vm._s(
                      _vm.errorBags.first(_vm.formdata.field + "_" + _vm.index)
                    )
                  )
                ])
              ],
              1
            )
          ]
        : _vm._e(),
      _vm.formdata.datatype == "picklist"
        ? [
            !_vm.formdata.mutil && _vm.formdata.formater == "select"
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      ref:
                        "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                      attrs: { prop: _vm.formdata.field + "_" + _vm.index }
                    },
                    [
                      _c(
                        "el-select",
                        {
                          directives: [
                            {
                              name: "validate",
                              rawName: "v-validate",
                              value: _vm.validaterules,
                              expression: "validaterules"
                            }
                          ],
                          ref: "bwminform_" + _vm.formdata.field,
                          class: {
                            input: true,
                            "is-danger": _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          },
                          attrs: {
                            name: _vm.formdata.field + "_" + _vm.index,
                            disabled: _vm.formdata.disabled === true,
                            placeholder: ""
                          },
                          on: { change: _vm.fieldChange },
                          model: {
                            value: _vm.values[_vm.formdata.field],
                            callback: function($$v) {
                              _vm.$set(_vm.values, _vm.formdata.field, $$v)
                            },
                            expression: "values[formdata.field]"
                          }
                        },
                        [
                          !_vm.formdata.required
                            ? _c("el-option", {
                                attrs: { label: _vm.$t("请选择"), value: "" }
                              })
                            : _vm._e(),
                          _vm._l(_vm.formdata.formaterItems, function(item) {
                            return _c("el-option", {
                              key: item.value,
                              attrs: { label: item.label, value: item.value }
                            })
                          })
                        ],
                        2
                      ),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(
                          _vm._s(
                            _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          )
                        )
                      ])
                    ],
                    1
                  )
                ]
              : _vm._e(),
            _vm.formdata.formater == "radio"
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      ref:
                        "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                      attrs: { prop: _vm.formdata.field + "_" + _vm.index }
                    },
                    [
                      _c(
                        "el-radio-group",
                        {
                          directives: [
                            {
                              name: "validate",
                              rawName: "v-validate",
                              value: _vm.validaterules,
                              expression: "validaterules"
                            }
                          ],
                          ref: "bwminform_" + _vm.formdata.field,
                          class: {
                            input: true,
                            "is-danger": _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          },
                          attrs: { name: _vm.formdata.field + "_" + _vm.index },
                          model: {
                            value: _vm.values[_vm.formdata.field],
                            callback: function($$v) {
                              _vm.$set(_vm.values, _vm.formdata.field, $$v)
                            },
                            expression: "values[formdata.field]"
                          }
                        },
                        _vm._l(_vm.formdata.formaterItems, function(item) {
                          return _c(
                            "el-radio",
                            {
                              key: item.value,
                              attrs: {
                                disabled: _vm.formdata.disabled === true,
                                label: item.value,
                                value: item.value
                              },
                              on: { change: _vm.fieldChange }
                            },
                            [
                              _vm._v(
                                "\n                        " +
                                  _vm._s(item.label) +
                                  "\n                        "
                              )
                            ]
                          )
                        }),
                        1
                      ),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(
                          _vm._s(
                            _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          )
                        )
                      ])
                    ],
                    1
                  )
                ]
              : _vm._e(),
            _vm.formdata.mutil && _vm.formdata.formater == "checkbox"
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      ref:
                        "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                      attrs: { prop: _vm.formdata.field + "_" + _vm.index }
                    },
                    [
                      _c(
                        "el-checkbox-group",
                        {
                          directives: [
                            {
                              name: "validate",
                              rawName: "v-validate",
                              value: _vm.validaterules,
                              expression: "validaterules"
                            }
                          ],
                          ref: "bwminform_" + _vm.formdata.field,
                          class: {
                            input: true,
                            "is-danger": _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          },
                          attrs: { name: _vm.formdata.field + "_" + _vm.index },
                          model: {
                            value: _vm.values[_vm.formdata.field],
                            callback: function($$v) {
                              _vm.$set(_vm.values, _vm.formdata.field, $$v)
                            },
                            expression: "values[formdata.field]"
                          }
                        },
                        _vm._l(_vm.formdata.formaterItems, function(item) {
                          return _c(
                            "el-checkbox",
                            {
                              key: item.value,
                              attrs: {
                                disabled: _vm.formdata.disabled === true,
                                label: item.value,
                                value: item.value
                              },
                              on: { change: _vm.fieldChange }
                            },
                            [_vm._v(" " + _vm._s(item.label))]
                          )
                        }),
                        1
                      ),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(
                          _vm._s(
                            _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          )
                        )
                      ])
                    ],
                    1
                  )
                ]
              : _vm._e(),
            _vm.formdata.mutil && _vm.formdata.formater == "select"
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      ref:
                        "bwminformitem_" + _vm.formdata.field + "_" + _vm.index,
                      attrs: { prop: _vm.formdata.field + "_" + _vm.index }
                    },
                    [
                      _c(
                        "el-select",
                        {
                          directives: [
                            {
                              name: "validate",
                              rawName: "v-validate",
                              value: _vm.validaterules,
                              expression: "validaterules"
                            }
                          ],
                          ref: "bwminform_" + _vm.formdata.field,
                          class: {
                            input: true,
                            "is-danger": _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          },
                          attrs: {
                            name: _vm.formdata.field + "_" + _vm.index,
                            disabled: _vm.formdata.disabled === true,
                            multiple: "",
                            placeholder: ""
                          },
                          on: { change: _vm.fieldChange },
                          model: {
                            value: _vm.values[_vm.formdata.field],
                            callback: function($$v) {
                              _vm.$set(_vm.values, _vm.formdata.field, $$v)
                            },
                            expression: "values[formdata.field]"
                          }
                        },
                        [
                          !_vm.formdata.required
                            ? _c("el-option", {
                                attrs: { label: _vm.$t("请选择"), value: "" }
                              })
                            : _vm._e(),
                          _vm._l(_vm.formdata.formaterItems, function(item) {
                            return _c("el-option", {
                              key: item.value,
                              attrs: { label: item.label, value: item.value }
                            })
                          })
                        ],
                        2
                      ),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(
                          _vm._s(
                            _vm.errorBags.first(
                              _vm.formdata.field + "_" + _vm.index
                            )
                          )
                        )
                      ])
                    ],
                    1
                  )
                ]
              : _vm._e()
          ]
        : _vm._e()
    ],
    2
  )
}
var MinFormCellvue_type_template_id_2d24057d_scoped_true_staticRenderFns = []
MinFormCellvue_type_template_id_2d24057d_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/MinFormCell.vue?vue&type=template&id=2d24057d&scoped=true&

// EXTERNAL MODULE: external "jquery"
var external_jquery_ = __webpack_require__(1);
var external_jquery_default = /*#__PURE__*/__webpack_require__.n(external_jquery_);

// CONCATENATED MODULE: ./src/utils/breamcrumb.js
function breamcrumb_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BWBreadCrumb = function BWBreadCrumb(name) {
  breamcrumb_classCallCheck(this, BWBreadCrumb);

  this.name = name || (Math.random() * 1000000).toString(16);
  this.datas = [];
};


// EXTERNAL MODULE: external "element-ui"
var external_element_ui_ = __webpack_require__(21);
var external_element_ui_default = /*#__PURE__*/__webpack_require__.n(external_element_ui_);

// CONCATENATED MODULE: ./src/Message/index.js
function Message_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Message_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Message_createClass(Constructor, protoProps, staticProps) { if (protoProps) Message_defineProperties(Constructor.prototype, protoProps); if (staticProps) Message_defineProperties(Constructor, staticProps); return Constructor; }


var Message = external_element_ui_default.a.Message; // 为了实现Class的私有属性

/** 
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */

var messageOptions = {
  maxCount: 2
};
var showMessage = Symbol('showMessage');

var DonMessage = /*#__PURE__*/function () {
  function DonMessage() {
    Message_classCallCheck(this, DonMessage);
  }

  Message_createClass(DonMessage, [{
    key: "success",
    value: function success(options) {
      var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this[showMessage]('success', options, single);
    }
  }, {
    key: "warning",
    value: function warning(options) {
      var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this[showMessage]('warning', options, single);
    }
  }, {
    key: "info",
    value: function info(options) {
      var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this[showMessage]('info', options, single);
    }
  }, {
    key: "error",
    value: function error(options) {
      var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this[showMessage]('error', options, single);
    }
  }, {
    key: "Message",
    value: function Message(options) {
      var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      this[showMessage](options.type, options, single);
    }
  }, {
    key: showMessage,
    value: function value(type, options, single) {
      if (single) {
        // 判断是否已存在Message
        if (document.getElementsByClassName('el-message').length <= single - 1) {
          Message[type](options);
        }
      } else {
        Message[type](options);
      }
    }
  }]);

  return DonMessage;
}();

var BwMessage = new DonMessage();
var msgOptions = {
  duration: 3000
};
var errorMsg = function errorMsg(msg, type, time, single) {
  BwMessage.Message({
    message: msg || '',
    type: type || 'warning',
    showClose: true,
    duration: time || msgOptions.duration
  }, single);
};
var successMsg = function successMsg(msg, type, time, single) {
  BwMessage.Message({
    message: msg || '',
    type: type || 'success',
    showClose: true,
    duration: time | msgOptions.duration
  }, single);
};
/* harmony default export */ var src_Message = ({
  errorMsg: errorMsg,
  successMsg: successMsg,
  msgOptions: msgOptions,
  BwMessage: BwMessage,
  DonMessage: DonMessage
});
// EXTERNAL MODULE: external "nprogress"
var external_nprogress_ = __webpack_require__(19);
var external_nprogress_default = /*#__PURE__*/__webpack_require__.n(external_nprogress_);

// EXTERNAL MODULE: external "vue-i18n"
var external_vue_i18n_ = __webpack_require__(20);
var external_vue_i18n_default = /*#__PURE__*/__webpack_require__.n(external_vue_i18n_);

// EXTERNAL MODULE: ./src/i18n/lang/zh.js
var zh = __webpack_require__(22);
var zh_default = /*#__PURE__*/__webpack_require__.n(zh);

// EXTERNAL MODULE: ./src/i18n/lang/en.js
var en = __webpack_require__(23);
var en_default = /*#__PURE__*/__webpack_require__.n(en);

// EXTERNAL MODULE: ./src/i18n/lang/responsemsg-zh.js
var responsemsg_zh = __webpack_require__(24);
var responsemsg_zh_default = /*#__PURE__*/__webpack_require__.n(responsemsg_zh);

// EXTERNAL MODULE: ./src/i18n/lang/responsemsg-en.js
var responsemsg_en = __webpack_require__(25);
var responsemsg_en_default = /*#__PURE__*/__webpack_require__.n(responsemsg_en);

// EXTERNAL MODULE: ./src/i18n/lang/responsemsg-zh-tw.js
var responsemsg_zh_tw = __webpack_require__(26);
var responsemsg_zh_tw_default = /*#__PURE__*/__webpack_require__.n(responsemsg_zh_tw);

// EXTERNAL MODULE: external "element-ui/lib/locale/lang/zh-CN"
var zh_CN_ = __webpack_require__(27);
var zh_CN_default = /*#__PURE__*/__webpack_require__.n(zh_CN_);

// EXTERNAL MODULE: external "element-ui/lib/locale/lang/en"
var en_ = __webpack_require__(28);
var lang_en_default = /*#__PURE__*/__webpack_require__.n(en_);

// EXTERNAL MODULE: external "element-ui/lib/locale/lang/zh-TW"
var zh_TW_ = __webpack_require__(29);
var zh_TW_default = /*#__PURE__*/__webpack_require__.n(zh_TW_);

// CONCATENATED MODULE: ./src/i18n/index.js
function i18n_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { i18n_typeof = function _typeof(obj) { return typeof obj; }; } else { i18n_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return i18n_typeof(obj); }

function i18n_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function i18n_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { i18n_ownKeys(Object(source), true).forEach(function (key) { i18n_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { i18n_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function i18n_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










 //elementEnLocale 和elementZhLocale 

var i18n = {
  i18n: null
}; //如果需要加载的模块需要引用VUE，则需要添加 install 方法进行加载

i18n.install = function (Vue) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Vue.use(external_vue_i18n_default.a); //默认的配置

  var defaultConfig = {
    locale: 'zh',
    // 语言标识 
    messages: {
      'zh': i18n_objectSpread(i18n_objectSpread(i18n_objectSpread({}, zh_default.a), responsemsg_zh_default.a), zh_CN_default.a),
      'en': i18n_objectSpread(i18n_objectSpread(i18n_objectSpread({}, en_default.a), responsemsg_en_default.a), lang_en_default.a),
      'zh-TW': i18n_objectSpread(i18n_objectSpread({}, responsemsg_zh_tw_default.a), zh_TW_default.a)
    }
  };
  defaultConfig = extend(true, {}, defaultConfig, config);

  if (false) {}

  var _i18n = new external_vue_i18n_default.a(defaultConfig);

  i18n.i18n = _i18n;
  Vue.use(_i18n);
  return _i18n;
};

function extI18n(Vue) {
  //擴展i18n的方法
  var translate = Vue.prototype.$t;

  Vue.prototype.$t = function (msg, ext) {
    //console.log('test i18nnnnn')
    if (ext) {
      if (i18n_typeof(ext) == 'object') {
        var trnMsg = msg;
        trnMsg = translate.call(this, trnMsg);

        if (trnMsg && trnMsg.indexOf('{{') != -1) {
          Object.keys(ext).forEach(function (item) {
            if (trnMsg && trnMsg.indexOf('{{') != -1 && trnMsg.indexOf(item) != -1) {
              var reg = new RegExp('{{' + item + '}}', 'mg');
              trnMsg = trnMsg.replace(reg, ext[item]);
            }
          });
          return trnMsg;
        } else {
          return translate.call(this, msg, ext);
        }
      }
    } else {
      return translate.call(this, msg, ext);
    }
  };
}

i18n.extI18n = extI18n;
/* harmony default export */ var src_i18n = (i18n);
// EXTERNAL MODULE: external "nprogress/nprogress.css"
var nprogress_css_ = __webpack_require__(37);

// CONCATENATED MODULE: ./src/axios/index.js
function axios_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function axios_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { axios_ownKeys(Object(source), true).forEach(function (key) { axios_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { axios_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function axios_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






/**
 * $\{((\w+|\.)+)\}$/g.exec('${401.account.authen.failure}')
 * echo ['${401.account.authen.failure}','401.account.authen.failure',...]
 */

var responseHandler = function responseHandler(res) {
  return res.data;
};

var axios_options = {
  debug: false,
  isLoading: false,
  filterResponse: null,
  filterRequest: null,
  responseHandler: responseHandler,
  prevSend: null,
  endSend: null,
  errorHandler: null,
  catchHandler: null,
  errorTimeout: 5000,
  showTipsCount: 1
};

var setOption = function setOption(opts) {
  axios_options = Object.assign({}, axios_options, opts);
};

var ERROR_MSG_REG = /\$\{((\w+|\.)+)\}$/g; ///\

var getErrorMsg = function getErrorMsg(msg) {
  //匹配到的时候获取数组中index为1的数据
  return ERROR_MSG_REG.exec(msg);
};

var axiosrequest = external_axios_default.a.interceptors.request.use(function (config) {
  var token = true;

  if (typeof axios_options.filterRequest == "function") {
    axios_options.filterRequest(config);
  }

  if (token) {// config.headers = Object.assign({},config.headers,{ 'token':token})
  }

  return config;
}, function (err) {
  return Promise.reject(err);
});
var axiosresponse = external_axios_default.a.interceptors.response.use(function (res) {
  // if(res.data.code==200){
  if (typeof axios_options.filterResponse == "function") {
    axios_options.filterResponse(res);
  }

  return axios_options.responseHandler(res); //  }
}, function (err) {
  return Promise.reject(err);
}); //根据状态显示错误信息

var errorCodeMsg = function errorCodeMsg(code, msg, extInfo) {
  if (code != 200) {
    msg = axios_getResponsei18nMsg.call(this, msg, extInfo);
  }
}; //根据返回信息显示错误信息(i18n)


var axios_getResponsei18nMsg = function getResponsei18nMsg(msg, extInfo) {
  var showMsg = msg;
  console.log('getResponsei18nMsg', src_i18n);

  if (src_i18n && src_i18n.i18n.t) {
    var perLen = msg.indexOf('%{');

    if (perLen != -1) {
      var msgArr = msg.split('%');
      var msgStrs = [];
      msgArr.forEach(function (item, index) {
        if (index != 0) {
          msgStrs.push(item.replace('{', '').replace('}', ''));
        } else {
          msgStrs.push(src_i18n.i18n.t('responseMsg["' + item + '"]'));
        }
      });
      showMsg = msgStrs.join('');
    } else {
      showMsg = src_i18n.i18n.t('responseMsg["' + msg + '"]');
    }
  }

  return errorMsg(showMsg, "", axios_options.errorTimeout, axios_options.showTipsCount);
};

var axios_loadingHandler = function loadingHandler() {
  if (axios_options.isLoading) {
    external_nprogress_default.a.start();
    return external_nprogress_default.a;
  }
};

var closeLoading = function closeLoading(loading) {
  if (axios_options.isLoading) {
    loading && loading.done();
  }
};

var axios_fetch = function fetch(url, params) {
  var _this = this;

  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var loading = axios_loadingHandler.call(this);

  if (typeof axios_options.prevSend == "function") {
    axios_options.prevSend(url, params, config);
  }

  return new Promise(function (resolve, reject) {
    external_axios_default.a.get(url, axios_objectSpread(axios_objectSpread({}, params), config)).then(function (res) {
      if (res || axios_options.debug) {
        resolve(res);
      } else {
        if (config && config.responseHandler) {
          config.responseHandler(res);
        }
      }

      if (res.error && !config.noShowTips) {
        errorCodeMsg.call(_this, res.code, res.error, axios_options.extInfo);
      }

      if (res.code == 500 && !res.error) {
        if (!config.noShowTips) {
          if (src_i18n && src_i18n.i18n.t) {
            errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
          }
        }
      }

      closeLoading(loading);

      if (typeof axios_options.endSend == "function") {
        axios_options.endSend(url, res, config);
      }
    })["catch"](function (error) {
      if (!config.noShowTips) {
        if (src_i18n && src_i18n.i18n.t) {
          errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
        }
      }

      closeLoading(loading);

      if (typeof axios_options.errorHandler == "function") {
        axios_options.errorHandler(url, error, config);
      }
    });
  })["catch"](function (e) {
    reject(res);
    closeLoading(loading);
    console.log(e);
  });
};

var axios_post = function post(url, params) {
  var _this2 = this;

  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var loading = axios_loadingHandler.call(this);

  if (typeof axios_options.prevSend == "function") {
    axios_options.prevSend(url, params, config);
  }

  return new Promise(function (resolve, reject) {
    external_axios_default.a.post(url, params, config).then(function (res) {
      if (res || axios_options.debug) {
        resolve(res);
      } else {
        if (config && config.responseHandler) {
          config.responseHandler(res);
        }
      }

      if (res.error && !config.noShowTips) {
        errorCodeMsg.call(_this2, res.code, res.error, axios_options.extInfo);
      }

      if (res.code == 500 && !res.error) {
        if (!config.noShowTips) {
          if (src_i18n && src_i18n.i18n.t) {
            errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
          }
        }
      }

      closeLoading(loading);

      if (typeof axios_options.endSend == "function") {
        axios_options.endSend(url, res, config);
      }
    })["catch"](function (error) {
      if (!config.noShowTips) {
        if (src_i18n && src_i18n.i18n.t) {
          errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
        }
      } //reject(error);


      closeLoading(loading);

      if (typeof axios_options.errorHandler == "function") {
        axios_options.errorHandler(url, error, config);
      }
    });
  })["catch"](function (e) {
    reject(e);
    closeLoading(loading);
    console.log(e);
  });
};

var axios_put = function put(url, params) {
  var _this3 = this;

  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var loading = axios_loadingHandler.call(this);

  if (typeof axios_options.prevSend == "function") {
    axios_options.prevSend(url, params, config);
  }

  return new Promise(function (resolve, reject) {
    external_axios_default.a.put(url, params, config).then(function (res) {
      if (res || axios_options.debug) {
        resolve(res);
      } else {
        if (config && config.responseHandler) {
          config.responseHandler(res);
        }
      }

      if (res.error && !config.noShowTips) {
        errorCodeMsg.call(_this3, res.code, res.error, axios_options.extInfo);
      }

      if (res.code == 500 && !res.error) {
        if (!config.noShowTips) {
          if (src_i18n && src_i18n.i18n.t) {
            errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
          }
        }
      }

      closeLoading(loading);

      if (typeof axios_options.endSend == "function") {
        axios_options.endSend(url, res, config);
      }
    })["catch"](function (error) {
      if (!config.noShowTips) {
        if (src_i18n && src_i18n.i18n.t) {
          errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
        }
      } // reject(error);


      closeLoading(loading);

      if (typeof axios_options.errorHandler == "function") {
        axios_options.errorHandler(url, error, config);
      }
    });
  })["catch"](function (e) {
    reject(e);
    closeLoading(loading);
    console.log(e);
  });
};

var axios_$delete = function $delete(url, params) {
  var _this4 = this;

  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var loading = axios_loadingHandler.call(this);

  if (typeof axios_options.prevSend == "function") {
    axios_options.prevSend(url, params, config);
  }

  return new Promise(function (resolve, reject) {
    external_axios_default.a["delete"](url, params, config).then(function (res) {
      if (res || axios_options.debug) {
        resolve(res);
      } else {
        if (config && config.responseHandler) {
          config.responseHandler(res);
        }
      }

      if (res.error && !config.noShowTips) {
        errorCodeMsg.call(_this4, res.code, res.error, axios_options.extInfo);
      }

      if (res.code == 500 && !res.error) {
        if (!config.noShowTips) {
          if (src_i18n && src_i18n.i18n.t) {
            errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
          }
        }
      }

      closeLoading(loading);

      if (typeof axios_options.endSend == "function") {
        axios_options.endSend(url, res, config);
      }
    })["catch"](function (error) {
      if (!config.noShowTips) {
        if (src_i18n && src_i18n.i18n.t) {
          errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
        }
      } // reject(error);


      closeLoading(loading);

      if (typeof axios_options.errorHandler == "function") {
        axios_options.errorHandler(url, error, config);
      }
    });
  })["catch"](function (e) {
    reject(e);
    closeLoading(loading);
    console.log(e);
  });
};

var axios_$axios = function $axios() {
  var _this5 = this;

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var loading = axios_loadingHandler.call(this);

  if (typeof axios_options.prevSend == "function") {
    axios_options.prevSend(config);
  }

  return new Promise(function (resolve, reject) {
    external_axios_default()(config).then(function (res) {
      if (res || axios_options.debug) {
        resolve(res);
      } else {
        if (config && config.responseHandler) {
          config.responseHandler(res);
        }
      }

      if (res.error && !config.noShowTips) {
        errorCodeMsg.call(_this5, res.code, res.error, axios_options.extInfo);
      }

      if (res.code == 500 && !res.error) {
        if (!config.noShowTips) {
          if (src_i18n && src_i18n.i18n.t) {
            errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
          }
        }
      }

      closeLoading(loading);

      if (typeof axios_options.endSend == "function") {
        axios_options.endSend(res, config);
      }
    })["catch"](function (error) {
      if (!config.noShowTips) {
        if (src_i18n && src_i18n.i18n.t) {
          errorMsg(src_i18n.i18n.t('responseMsg.requestError'), "error", "5000", axios_options.showTipsCount);
        }
      } // reject(error);


      closeLoading(loading);

      if (typeof axios_options.errorHandler == "function") {
        axios_options.errorHandler(error, config);
      }
    });
  })["catch"](function (e) {
    reject(e);
    closeLoading(loading);
    console.log(e);
  });
};

var axios_install = function install(Vue, opts) {
  Vue.bwAxios = axiosConfig;
  Vue.prototype.bwAxios = axiosConfig;
  Vue.prototype.$http = external_axios_default.a;
  Vue.prototype.$post = axios_post;
  Vue.prototype.$fetch = axios_fetch;
  Vue.prototype.$put = axios_put;
  Vue.prototype.$axios = axios_$axios;
  Vue.prototype.$fetchDel = axios_$delete;
  return axiosConfig;
};

var axiosConfig = {
  setOption: setOption,
  options: axios_options,
  fetch: axios_fetch,
  post: axios_post,
  put: axios_put,
  $delete: axios_$delete,
  $axios: axios_$axios,
  errorMsg: errorMsg,
  loadingHandler: axios_loadingHandler,
  //必須返回一個loading 在 closeLoading時關閉
  closeLoading: closeLoading,
  axios: external_axios_default.a,
  //暴露当前实例的axios
  axiosrequest: axiosrequest,
  //为了自定义，可以使用axios.interceptors.request.eject(axiosrequest);删除改拦截器
  axiosresponse: axiosresponse //为了自定义，可以使用axios.interceptors.response.eject(axiosresponse);删除改拦截器
  ,
  install: axios_install
};
/* harmony default export */ var axios = (axiosConfig);
// EXTERNAL MODULE: external "jsencrypt"
var external_jsencrypt_ = __webpack_require__(38);

// CONCATENATED MODULE: ./src/utils/index.js
function utils_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { utils_typeof = function _typeof(obj) { return typeof obj; }; } else { utils_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return utils_typeof(obj); }

function utils_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function utils_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { utils_ownKeys(Object(source), true).forEach(function (key) { utils_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { utils_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function utils_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var utils_objsToFormData = function objsToFormData(formdata, postModel, parKey) {
  parKey = parKey || '';
  var type = Object.prototype.toString.call(postModel);

  if (type == '[object Array]') {
    external_jquery_default.a.each(postModel, function (i, n) {
      objsToFormData(formdata, n, parKey + '[' + i + ']');
    });
  } else if (type == '[object Object]') {
    for (var i in postModel) {
      objsToFormData(formdata, postModel[i], parKey ? parKey + '.' + i : i);
    }
  } else {
    formdata.append(parKey, postModel);
  }
};
/**
 * @info 检测perStr中是否可以通过regs里的权限
 * @param {Array} perArr example: 'get-/user,get-/role,put-/user';
 * @param {Array} regs example: ^(GET|POST)-(/user|/users)$;
 * @return 如果其中一个匹配到则直接返回true
 */


function permissionSome(perArr, regs) {
  var res = false;

  if (typeof perArr === 'string' && perArr.indexOf(',') != -1) {
    perArr = perArr.split(',');
  }

  regs.forEach(function (item) {
    var reg = new RegExp(item);
    var isFind = perArr.filter(function (per) {
      return reg.test(per);
    });

    if (isFind.length > 0) {
      res = true;
      return false;
    }
  });
  return res;
} //只能转换 dd/MM/yyyy 或者 dd/MM/yyyy hh:mm:ss格式的时间字符串


function changeStringToDate(strDate) {
  var hasTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var datePrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
  var res = null;

  if (strDate.indexOf(datePrefix) == -1) {
    if (strDate.indexOf('-') != -1) {
      datePrefix = '-';
    }
  }

  if (strDate.indexOf(':') != -1) {
    hasTime = true;
  }

  if (strDate.indexOf('T') != -1) {
    strDate = strDate.replace('T', ' ');
  }

  if (strDate) {
    try {
      if (hasTime) {
        if (datePrefix == '/') {
          var dateTimeArr = strDate.split(' ');
          var dateArr = dateTimeArr[0].split(datePrefix);
          var d = dateArr[0] * 1;
          var m = dateArr[1] * 1;
          var y = dateArr[2] * 1;
          var timeArr = dateTimeArr[1].split(':');
          var h = timeArr[0] * 1;
          var mm = timeArr[1] * 1;
          var s = timeArr[2] ? timeArr[2] * 1 : '00';
          res = new Date(y, m - 1, d, h, mm, s);
        } else {
          var _dateTimeArr = strDate.split(' ');

          var _dateArr = _dateTimeArr[0].split(datePrefix);

          var _d = _dateArr[2] * 1;

          var _m = _dateArr[1] * 1;

          var _y = _dateArr[0] * 1;

          var _timeArr = _dateTimeArr[1].split(':');

          var _h = _timeArr[0] * 1;

          var _mm = _timeArr[1] * 1;

          var _s = _timeArr[2] ? _timeArr[2] * 1 : '00';

          res = new Date(_y, _m - 1, _d, _h, _mm, _s);
        }
      } else {
        if (datePrefix == '/') {
          var _dateArr2 = strDate.split(datePrefix);

          var _d2 = _dateArr2[0] * 1;

          var _m2 = _dateArr2[1] * 1;

          var _y2 = _dateArr2[2] * 1;

          res = new Date(_y2, _m2 - 1, _d2);
        } else {
          var _dateArr3 = strDate.split(datePrefix);

          var _d3 = _dateArr3[2] * 1;

          var _m3 = _dateArr3[1] * 1;

          var _y3 = _dateArr3[0] * 1;

          res = new Date(_y3, _m3 - 1, _d3);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return res;
}

function createEncrypt(publicKey) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt; // let encryptText = ('username=xxxxx&password=xxfxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&clientid=aaaa&clientSecret=bbbbb');
}

function objectToQueryString(obj) {
  var res = [];

  if (obj) {
    Object.keys(obj).forEach(function (item) {
      var temp = [];
      temp.push(item);
      temp.push(obj[item] || '');
      res.push(temp.join('='));
    });
  }

  return res.join('&');
}

var cacheAjax = {
  PageCacheConfig: {
    timeount: 5000,
    step: 50
  },
  PageCacheData: [] //页面异步缓存数据
  ,
  PageCache: function PageCache(type, url, param, callback) {
    //页面缓存数据获取方法，type值同一个页面一样。
    var cacheFactory;

    if (typeof cacheAjax.PageCacheData[type] === 'undefined') {
      cacheFactory = cacheAjax.PageCacheData[type] = [];
      cacheFactory[param.type] = [];
      cacheFactory[param.type]['state'] = 'start';
      cacheFactory[param.type]['data'] = null;
    } else {
      cacheFactory = cacheAjax.PageCacheData[type];

      if (typeof cacheFactory[param.type] == 'undefined') {
        cacheFactory[param.type] = [];
        cacheFactory[param.type]['state'] = 'start';
        cacheFactory[param.type]['data'] = null;
      }
    } //console.log(cacheFactory)


    if (cacheFactory[param.type]['state'] == 'init' || cacheFactory[param.type]['state'] == 'loaded') {
      var starttime = 0;
      var timer = setInterval(function () {
        if (cacheFactory[param.type]['state'] == 'loaded') {
          if (cacheFactory[param.type]['data']) {
            clearInterval(timer);
            callback(cacheFactory[param.type]['data']);
          }
        }
      }, cacheAjax.PageCacheConfig.step);
    } else if (cacheFactory[param.type]['state'] == 'start' && cacheFactory[param.type]['state'] != 'loaded') {
      console.log(cacheFactory[param.type]['state']);
      cacheFactory[param.type]['state'] = 'init';
      axios.fetch(url, param.data).then(function (data) {
        if (data.code == 200) {
          cacheFactory[param.type]['state'] = 'loaded';
          cacheFactory[param.type]['data'] = data;
          callback(data);
        } else {
          cacheFactory[param.type] = [];
        }
      })["catch"](function (e) {
        console.warn(e);
      });
    }
  }
};

var utils = utils_objectSpread({
  objsToFormData: utils_objsToFormData,
  permissionSome: permissionSome,
  changeStringToDate: changeStringToDate,
  cacheAjax: cacheAjax,
  createEncrypt: createEncrypt,
  objectToQueryString: objectToQueryString,
  //permissionAll,
  queryByKeyValue: function queryByKeyValue(arr, key, value) {
    var res = [];
    arr.filter(function (item, index) {
      return item[key] == value;
    });
    return res;
  },
  $: external_jquery_default.a,
  extend: external_jquery_default.a.extend,
  deboundsEvent: function deboundsEvent(timeout) {
    var isRun = false;
    return function (callback) {
      if (isRun == true) return false;
      isRun = true;
      callback && callback();
      setTimeout(function () {
        isRun = false;
      }, timeout);
    };
  },
  breamcrumb: BWBreadCrumb
}, guid);

var isEmpty = function isEmpty(keys) {
  if (typeof keys === "string") {
    keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, "");

    if (keys == "" || keys == null || keys == "null" || keys === "undefined") {
      return true;
    } else {
      return false;
    }
  } else if (typeof keys === "undefined") {
    // 未定义
    return true;
  } else if (typeof keys === "number") {
    return false;
  } else if (typeof keys === "boolean") {
    return false;
  } else if (utils_typeof(keys) == "object") {
    if (JSON.stringify(keys) == "{}") {
      return true;
    } else if (keys == null) {
      // null
      return true;
    } else {
      return false;
    }
  }

  if (keys instanceof Array && keys.length == 0) {
    // 数组
    return true;
  }
};
var extend = external_jquery_default.a.extend;
/* harmony default export */ var src_utils = (utils);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/MinFormCell.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var MinFormCellvue_type_script_lang_js_ = ({
  name: 'MinFormCell',
  inject: ['formConfigs'],
  components: {},
  props: {
    index: {
      type: Number
    },
    values: {
      "default": function _default() {
        return {};
      }
    },
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: 'string',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            field: '',
            change: function change() {}
          }]
        },
        childrens: [{}]
      }
    }
  },
  methods: {
    resetForm: function resetForm() {
      var $dom = this.$refs['bwminformitem_' + this.formdata.field];

      if ($dom) {
        $dom.resetField();
      }
    },
    validateForm: function validateForm() {
      // this.$validator.validateAll().then(res=>{
      //     console.log(res)
      // });
      return this.$validator.validateAll();
    },
    resetValidate: function resetValidate() {
      this.mountedChange();
      return this.$validator.reset();
    },
    getAttributeInfo: function getAttributeInfo(list, field) {
      var _this = this;

      var res = null;
      list.forEach(function (item) {
        if (item.field == field) {
          res = item;
          return false;
        }

        if (item.childrens && item.childrens.length > 0) {
          res = _this.getAttributeInfo(item.childrens, field);

          if (res) {
            return false;
          }
        }
      });
      return res;
    },
    getTargetVm: function getTargetVm(field) {
      var vm = this.formConfigs.$validaters.filter(function (item) {
        return item.field == field;
      });

      if (vm && vm.length > 0) {
        return vm[0];
      }
    },
    mountedChange: function mountedChange(value) {
      var _this2 = this;

      if (this.formdata.relationship && this.formdata.relationship.targets && this.formdata.relationship.targets.length > 0) {
        var targets = this.formdata.relationship.targets;
        targets.forEach(function (item) {
          var field = item.field;
          var handler = item.change;
          var _super = item._super;

          var targetInfo = _this2.getAttributeInfo(_this2.formConfigs.datas, field);

          var targetVm = _this2.getTargetVm(field); // console.log('targetInfo',targetInfo);


          if (field && targetVm) {
            if (external_lodash_default.a.isFunction(handler)) {
              handler.call(_this2, targetVm.$vm, value, _this2.formConfigs.formData[field], _this2, _super);
            } else if (typeof handler === 'string') {
              var funHandler = new Function(['target', 'value', 'targetValue', '$vm', '_super'], handler);

              try {
                funHandler.call(_this2, targetVm.$vm, value, _this2.formConfigs.formData[field], _this2, _super);
              } catch (e) {
                console.log(e);
              }
            }

            targetVm.$vm.$forceUpdate();
          }
        });
      }
    },
    fieldChange: function fieldChange(value) {
      var _this3 = this;

      if (this.formdata.relationship && this.formdata.relationship.targets && this.formdata.relationship.targets.length > 0) {
        var targets = this.formdata.relationship.targets;
        targets.forEach(function (item) {
          var field = item.field;
          var handler = item.change;
          var _super = item._super;

          var targetInfo = _this3.getAttributeInfo(_this3.formConfigs.datas, field);

          var targetVm = _this3.getTargetVm(field);

          if (field && targetVm) {
            if (external_lodash_default.a.isFunction(handler)) {
              handler.call(_this3, targetVm.$vm, value, _this3.formConfigs.formData[field], _this3, _super);
            } else if (typeof handler === 'string') {
              var funHandler = new Function(['target', 'value', 'targetValue', '$vm', '_super'], handler);

              try {
                funHandler.call(_this3, targetVm.$vm, value, _this3.formConfigs.formData[field], _this3, _super);
              } catch (e) {
                console.log(e);
              }
            }

            targetVm.$vm.$forceUpdate();
          }
        });
      }
    },
    setValue: function setValue(value) {
      this.values[this.formdata.field] = value;
    },
    setFormdata: function setFormdata(key, value) {
      this.formdata[key] = value;
    }
  },
  beforeCreate: function beforeCreate() {},
  created: function created() {
    // this.formdata.field = 'subgrid_'+this.formdata.field
    //  console.log('__super',this.formConfigs.__super);                   
    if (!this.values) {
      this.values = {};
    }

    if (this.formdata.mutil && (this.formdata.formater == 'checkbox' || this.formdata.formater == 'select')) {
      this.values[this.formdata.field] = [];
    } else {
      this.values[this.formdata.field] = '';
    }

    if (this.formdata.datatype == 'boolean' && !this.values[this.formdata.field]) {
      this.values[this.formdata.field] = false;
    }

    var tempRules = [];
    this.formdata.required && tempRules.push('required');

    if (this.formdata.rules && this.formdata.rules.length > 0) {
      tempRules = tempRules.concat(this.formdata.rules);
    }

    this.validaterules = tempRules.join('|'); // console.log(this.validaterules);
  },
  mounted: function mounted() {
    // console.log('formcell',this.formConfigs);
    //this.values[this.formdata.field];
    var $dom = this.$refs['bwminform_' + this.formdata.field];

    if ($dom) {
      this.formConfigs.$validaters.push({
        field: this.formdata.field,
        $vm: this,
        $el: $dom,
        validateHandler: this.validateForm,
        resetValidate: this.resetValidate,
        mountedChange: this.mountedChange,
        resetForm: this.resetForm
      });
    }
  },
  data: function data() {
    return {
      validaterules: ''
    };
  }
});
// CONCATENATED MODULE: ./src/components/Form/MinFormCell.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_MinFormCellvue_type_script_lang_js_ = (MinFormCellvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Form/MinFormCell.vue





/* normalize component */

var MinFormCell_component = normalizeComponent(
  Form_MinFormCellvue_type_script_lang_js_,
  MinFormCellvue_type_template_id_2d24057d_scoped_true_render,
  MinFormCellvue_type_template_id_2d24057d_scoped_true_staticRenderFns,
  false,
  null,
  "2d24057d",
  null
  
)

/* hot reload */
if (false) { var MinFormCell_api; }
MinFormCell_component.options.__file = "src/components/Form/MinFormCell.vue"
/* harmony default export */ var MinFormCell = (MinFormCell_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/MinDataGrid.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var MinDataGridvue_type_script_lang_js_ = ({
  name: "MinDataGrid",
  props: ["gridDatas", "formdata"],
  components: {
    MinFormCell: MinFormCell
  },
  data: function data() {
    return {
      isCopy: false,
      rowData: null
    };
  },
  methods: {
    copyRow: function copyRow(valueitem) {
      var temp = {};
      this.gridDatas.values.push(temp);
      external_jquery_default.a.extend(temp, valueitem);
      this.$forceUpdate();
    },
    addRow: function addRow() {
      this.gridDatas.values.push({});
      this.$forceUpdate();
    }
  },
  beforeMount: function beforeMount() {},
  mounted: function mounted() {}
});
// CONCATENATED MODULE: ./src/components/Form/MinDataGrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_MinDataGridvue_type_script_lang_js_ = (MinDataGridvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/MinDataGrid.vue?vue&type=style&index=0&lang=css&
var MinDataGridvue_type_style_index_0_lang_css_ = __webpack_require__(39);

// CONCATENATED MODULE: ./src/components/Form/MinDataGrid.vue






/* normalize component */

var MinDataGrid_component = normalizeComponent(
  Form_MinDataGridvue_type_script_lang_js_,
  MinDataGridvue_type_template_id_38431247_render,
  MinDataGridvue_type_template_id_38431247_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MinDataGrid_api; }
MinDataGrid_component.options.__file = "src/components/Form/MinDataGrid.vue"
/* harmony default export */ var MinDataGrid = (MinDataGrid_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/Form.vue?vue&type=template&id=478c5062&
var Formvue_type_template_id_478c5062_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "el-form",
        {
          ref: "bw_form_" + _vm.formConfigs.formid,
          attrs: {
            resetFields: _vm.formReset,
            model: _vm.formConfigs.formData,
            "label-width": _vm.formConfigs.styles.labelWidth,
            "label-position": _vm.formConfigs.styles.labelPostion,
            size: _vm.formConfigs.styles.size,
            disabled: _vm.formConfigs.styles.disabled
          }
        },
        [
          _vm._t("default"),
          _vm._t("bwformprev", null, null, { _that: this }),
          _vm._l(_vm.formInfo.datas, function(item) {
            return _c(
              "FormLayout",
              { key: item.id, attrs: { formdata: item } },
              [
                _vm._l(_vm.$slots, function(_, slot) {
                  return [_c("template", { slot: slot }, [_vm._t(slot)], 2)]
                })
              ],
              2
            )
          }),
          _vm._t("bwformlast", null, null, { _that: this })
        ],
        2
      )
    ],
    1
  )
}
var Formvue_type_template_id_478c5062_staticRenderFns = []
Formvue_type_template_id_478c5062_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/Form.vue?vue&type=template&id=478c5062&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormLayout.vue?vue&type=template&id=250804d9&scoped=true&
var FormLayoutvue_type_template_id_250804d9_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-layout", _vm.className]
    },
    [
      _c(
        "h3",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.formdata.isShowTitle,
              expression: "formdata.isShowTitle"
            }
          ],
          staticClass: "bw-form-layout-title"
        },
        [
          _vm._v(
            _vm._s(
              _vm.formdata.i18nLabel
                ? _vm.$t(_vm.formdata.title)
                : _vm.formdata.title
            )
          )
        ]
      ),
      _c(
        "el-row",
        { attrs: { gutter: _vm.formdata.padding || 0 } },
        _vm._l(_vm.formdata.childrens, function(item) {
          return _c(
            "el-col",
            { key: item.id, attrs: { span: item.span || 24 } },
            [
              _c(
                "FormTab",
                { attrs: { formdata: item } },
                [
                  _vm._l(_vm.$slots, function(_, slot) {
                    return [_c("template", { slot: slot }, [_vm._t(slot)], 2)]
                  })
                ],
                2
              )
            ],
            1
          )
        }),
        1
      )
    ],
    1
  )
}
var FormLayoutvue_type_template_id_250804d9_scoped_true_staticRenderFns = []
FormLayoutvue_type_template_id_250804d9_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/FormLayout.vue?vue&type=template&id=250804d9&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormTab.vue?vue&type=template&id=b7161a14&scoped=true&
var FormTabvue_type_template_id_b7161a14_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-tab", _vm.className]
    },
    [
      _c(
        "h3",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.formdata.isShowTitle,
              expression: "formdata.isShowTitle"
            }
          ],
          staticClass: "bw-form-tab-title"
        },
        [
          _vm._v(
            _vm._s(
              _vm.formdata.i18nLabel
                ? _vm.$t(_vm.formdata.title)
                : _vm.formdata.title
            )
          )
        ]
      ),
      _c(
        "el-row",
        { attrs: { gutter: _vm.formdata.padding || 0 } },
        _vm._l(_vm.formdata.childrens, function(item) {
          return _c(
            "el-col",
            { key: item.id, attrs: { span: item.span || 24 } },
            [
              _c(
                "FormTable",
                { attrs: { formdata: item } },
                [
                  _vm._l(_vm.$slots, function(_, slot) {
                    return [_c("template", { slot: slot }, [_vm._t(slot)], 2)]
                  })
                ],
                2
              )
            ],
            1
          )
        }),
        1
      )
    ],
    1
  )
}
var FormTabvue_type_template_id_b7161a14_scoped_true_staticRenderFns = []
FormTabvue_type_template_id_b7161a14_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/FormTab.vue?vue&type=template&id=b7161a14&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormTable.vue?vue&type=template&id=787e0722&scoped=true&
var FormTablevue_type_template_id_787e0722_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-table", _vm.className]
    },
    [
      _c(
        "h3",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.formdata.isShowTitle,
              expression: "formdata.isShowTitle"
            }
          ],
          staticClass: "bw-form-table-title",
          on: {
            click: function($event) {
              _vm.showContent = !_vm.showContent
            }
          }
        },
        [
          _vm._v(
            _vm._s(
              _vm.formdata.i18nLabel
                ? _vm.$t(_vm.formdata.title)
                : _vm.formdata.title
            )
          )
        ]
      ),
      _c(
        "transition",
        { attrs: { name: "el-fade-in-linear" } },
        [
          _c(
            "el-row",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.showContent,
                  expression: "showContent"
                }
              ],
              attrs: { gutter: _vm.formdata.padding || 0 }
            },
            _vm._l(_vm.formdata.childrens, function(item) {
              return _c(
                "el-col",
                { key: item.id, attrs: { span: item.span || 24 } },
                [
                  _c(
                    "FormRows",
                    { attrs: { formdata: item } },
                    [
                      _vm._l(_vm.$slots, function(_, slot) {
                        return [
                          _c("template", { slot: slot }, [_vm._t(slot)], 2)
                        ]
                      })
                    ],
                    2
                  )
                ],
                1
              )
            }),
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var FormTablevue_type_template_id_787e0722_scoped_true_staticRenderFns = []
FormTablevue_type_template_id_787e0722_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/FormTable.vue?vue&type=template&id=787e0722&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormRows.vue?vue&type=template&id=267fb5c8&scoped=true&
var FormRowsvue_type_template_id_267fb5c8_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-rows", _vm.className]
    },
    [
      _c(
        "h3",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.formdata.isShowTitle,
              expression: "formdata.isShowTitle"
            }
          ],
          staticClass: "bw-form-rows-title"
        },
        [
          _vm._v(
            _vm._s(
              _vm.formdata.i18nLabel
                ? _vm.$t(_vm.formdata.title)
                : _vm.formdata.title
            )
          )
        ]
      ),
      _c(
        "el-row",
        { attrs: { gutter: _vm.formdata.padding || 0 } },
        _vm._l(_vm.formdata.childrens, function(item) {
          return _c(
            "el-col",
            { key: item.id, attrs: { span: item.span || 6 } },
            [
              _c(
                "FormCell",
                { attrs: { formdata: item } },
                [
                  _vm._l(_vm.$slots, function(_, slot) {
                    return [_c("template", { slot: slot }, [_vm._t(slot)], 2)]
                  })
                ],
                2
              )
            ],
            1
          )
        }),
        1
      )
    ],
    1
  )
}
var FormRowsvue_type_template_id_267fb5c8_scoped_true_staticRenderFns = []
FormRowsvue_type_template_id_267fb5c8_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/FormRows.vue?vue&type=template&id=267fb5c8&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormCell.vue?vue&type=template&id=27b05e5e&scoped=true&
var FormCellvue_type_template_id_27b05e5e_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.formdata.isShow !== false,
          expression: "formdata.isShow!==false"
        }
      ],
      class: ["bw-form-cell", _vm.className]
    },
    [
      _vm.formdata.type == "customerCell"
        ? [
            _vm._t(_vm.formdata.customerName, null, null, {
              formdata: _vm.formdata,
              formConfigs: _vm.formConfigs
            })
          ]
        : _vm._e(),
      _vm.formdata.type == "subgrid"
        ? [
            _c("MinDataGrid", {
              attrs: {
                gridDatas: _vm.formConfigs.formData[_vm.formdata.field],
                formdata: _vm.formdata
              }
            })
          ]
        : _vm._e(),
      _vm.formdata.datatype == "boolean" && _vm.formdata.formater == "checkbox"
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _c("span", [
                        _vm._v(
                          _vm._s(
                            _vm.formConfigs.formData[_vm.formdata.field] == true
                              ? _vm.$t("是")
                              : _vm.$t("否")
                          )
                        )
                      ])
                    ]
                  )
                ]
              : [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: [
                        _vm.formdata.required ? "is-required" : "",
                        "bw-form-checkbox"
                      ],
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel()
                      }
                    },
                    [
                      _c("el-checkbox", {
                        directives: [
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: _vm.validaterules,
                            expression: "validaterules"
                          }
                        ],
                        ref: "bwform_" + _vm.formdata.field,
                        class: {
                          input: true,
                          "is-danger": _vm.errorBags.first(_vm.formdata.field)
                        },
                        attrs: {
                          placeholder: "",
                          name: _vm.formdata.field,
                          disabled: _vm.formdata.disabled === true
                        },
                        on: { change: _vm.fieldChange },
                        model: {
                          value: _vm.formConfigs.formData[_vm.formdata.field],
                          callback: function($$v) {
                            _vm.$set(
                              _vm.formConfigs.formData,
                              _vm.formdata.field,
                              $$v
                            )
                          },
                          expression: "formConfigs.formData[formdata.field]"
                        }
                      }),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(_vm._s(_vm.errorBags.first(_vm.formdata.field)))
                      ])
                    ],
                    1
                  )
                ]
          ]
        : _vm._e(),
      _vm.formdata.datatype == "boolean" &&
      (!_vm.formdata.formater || _vm.formdata.formater == "switch")
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _c("span", [
                        _vm._v(
                          _vm._s(
                            _vm.formConfigs.formData[_vm.formdata.field] == true
                              ? _vm.$t("是")
                              : _vm.$t("否")
                          )
                        )
                      ])
                    ]
                  )
                ]
              : [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel()
                      }
                    },
                    [
                      _c("el-switch", {
                        directives: [
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: _vm.validaterules,
                            expression: "validaterules"
                          }
                        ],
                        ref: "bwform_" + _vm.formdata.field,
                        class: {
                          input: true,
                          "is-danger": _vm.errorBags.first(_vm.formdata.field)
                        },
                        attrs: {
                          placeholder: "",
                          name: _vm.formdata.field,
                          disabled: _vm.formdata.disabled === true,
                          "active-color": "#13ce66",
                          "inactive-color": "#ff4949"
                        },
                        on: { change: _vm.fieldChange },
                        model: {
                          value: _vm.formConfigs.formData[_vm.formdata.field],
                          callback: function($$v) {
                            _vm.$set(
                              _vm.formConfigs.formData,
                              _vm.formdata.field,
                              $$v
                            )
                          },
                          expression: "formConfigs.formData[formdata.field]"
                        }
                      }),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(_vm._s(_vm.errorBags.first(_vm.formdata.field)))
                      ])
                    ],
                    1
                  )
                ]
          ]
        : _vm._e(),
      _vm.formdata.datatype == "string"
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _vm.formdata.formater == "textarea"
                        ? _c("span", {
                            staticStyle: { "word-break": "break-all" },
                            domProps: {
                              innerHTML: _vm._s(
                                _vm.formConfigs.formData["x_comments"]
                                  ? _vm.formConfigs.formData[
                                      "x_comments"
                                    ].replace(/\n|\t|\r/g, "<br>")
                                  : ""
                              )
                            }
                          })
                        : _c("span", [
                            _vm._v(
                              _vm._s(
                                _vm.formConfigs.formData[_vm.formdata.field]
                              )
                            )
                          ])
                    ]
                  )
                ]
              : [
                  _vm.formdata.formater && _vm.formdata.formater == "password"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c("el-input", {
                              directives: [
                                {
                                  name: "validate",
                                  rawName: "v-validate",
                                  value: _vm.validaterules,
                                  expression: "validaterules"
                                }
                              ],
                              ref: "bwform_" + _vm.formdata.field,
                              class: {
                                input: true,
                                "is-danger": _vm.errorBags.first(
                                  _vm.formdata.field
                                )
                              },
                              attrs: {
                                type: "password",
                                placeholder: "",
                                rows: 3,
                                clearable: _vm.formdata.clearable || false,
                                maxlength: _vm.formdata.maxLength || "",
                                "show-word-limit":
                                  _vm.formdata.showWordLimit || false,
                                disabled: _vm.formdata.disabled === true,
                                name: _vm.formdata.field
                              },
                              on: { input: _vm.fieldChange },
                              model: {
                                value:
                                  _vm.formConfigs.formData[_vm.formdata.field],
                                callback: function($$v) {
                                  _vm.$set(
                                    _vm.formConfigs.formData,
                                    _vm.formdata.field,
                                    $$v
                                  )
                                },
                                expression:
                                  "formConfigs.formData[formdata.field]"
                              }
                            }),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c("el-input", {
                              directives: [
                                {
                                  name: "validate",
                                  rawName: "v-validate",
                                  value: _vm.validaterules,
                                  expression: "validaterules"
                                }
                              ],
                              ref: "bwform_" + _vm.formdata.field,
                              class: {
                                input: true,
                                "is-danger": _vm.errorBags.first(
                                  _vm.formdata.field
                                )
                              },
                              attrs: {
                                type:
                                  _vm.formdata.formater == "textarea"
                                    ? "textarea"
                                    : "text",
                                placeholder: "",
                                rows: 3,
                                clearable: _vm.formdata.clearable || false,
                                maxlength: _vm.formdata.maxLength || "",
                                "show-word-limit":
                                  _vm.formdata.showWordLimit || false,
                                disabled: _vm.formdata.disabled === true,
                                name: _vm.formdata.field
                              },
                              on: { input: _vm.fieldChange },
                              model: {
                                value:
                                  _vm.formConfigs.formData[_vm.formdata.field],
                                callback: function($$v) {
                                  _vm.$set(
                                    _vm.formConfigs.formData,
                                    _vm.formdata.field,
                                    $$v
                                  )
                                },
                                expression:
                                  "formConfigs.formData[formdata.field]"
                              }
                            }),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                ]
          ]
        : _vm._e(),
      _vm.formdata.datatype == "number"
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _c("span", [
                        _vm._v(
                          _vm._s(_vm.formConfigs.formData[_vm.formdata.field])
                        )
                      ])
                    ]
                  )
                ]
              : [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel()
                      }
                    },
                    [
                      _c("el-input", {
                        directives: [
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: _vm.validaterules,
                            expression: "validaterules"
                          }
                        ],
                        ref: "bwform_" + _vm.formdata.field,
                        class: {
                          input: true,
                          "is-danger": _vm.errorBags.first(_vm.formdata.field)
                        },
                        attrs: {
                          type: "number",
                          placeholder: "",
                          rows: 3,
                          clearable: _vm.formdata.clearable || false,
                          maxlength: _vm.formdata.maxLength || "",
                          "show-word-limit":
                            _vm.formdata.showWordLimit || false,
                          disabled: _vm.formdata.disabled === true,
                          name: _vm.formdata.field
                        },
                        on: { input: _vm.fieldChange },
                        model: {
                          value: _vm.formConfigs.formData[_vm.formdata.field],
                          callback: function($$v) {
                            _vm.$set(
                              _vm.formConfigs.formData,
                              _vm.formdata.field,
                              $$v
                            )
                          },
                          expression: "formConfigs.formData[formdata.field]"
                        }
                      }),
                      _c("span", { staticClass: "form-item-error" }, [
                        _vm._v(_vm._s(_vm.errorBags.first(_vm.formdata.field)))
                      ])
                    ],
                    1
                  )
                ]
          ]
        : _vm._e(),
      _vm.formdata.datatype == "date"
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _c("span", [
                        _vm._v(
                          _vm._s(
                            _vm.formConfigs.formData[_vm.formdata.field]
                              ? new Date(
                                  _vm.formConfigs.formData[_vm.formdata.field]
                                ).format(
                                  _vm.formdata.viewformat ||
                                    _vm.formdata.dataformat ||
                                    "yyyy-MM-dd"
                                )
                              : ""
                          )
                        )
                      ])
                    ]
                  )
                ]
              : [
                  _vm.formdata.dataformat &&
                  _vm.formdata.dataformat.indexOf("hh") == -1
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c("el-date-picker", {
                              directives: [
                                {
                                  name: "validate",
                                  rawName: "v-validate",
                                  value: _vm.validaterules,
                                  expression: "validaterules"
                                }
                              ],
                              ref: "bwform_" + _vm.formdata.field,
                              class: {
                                input: true,
                                "is-danger": _vm.errorBags.first(
                                  _vm.formdata.field
                                )
                              },
                              attrs: {
                                placeholder: "",
                                name: _vm.formdata.field,
                                disabled: _vm.formdata.disabled === true,
                                clearable: _vm.formdata.clearable || false,
                                "value-format":
                                  _vm.formdata.dataformat || "yyyy-MM-dd",
                                format:
                                  _vm.formdata.viewformat ||
                                  _vm.formdata.dataformat ||
                                  "yyyy-MM-dd",
                                type: "date"
                              },
                              on: { change: _vm.fieldChange },
                              model: {
                                value:
                                  _vm.formConfigs.formData[_vm.formdata.field],
                                callback: function($$v) {
                                  _vm.$set(
                                    _vm.formConfigs.formData,
                                    _vm.formdata.field,
                                    $$v
                                  )
                                },
                                expression:
                                  "formConfigs.formData[formdata.field]"
                              }
                            }),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e(),
                  !_vm.formdata.dataformat ||
                  (_vm.formdata.dataformat &&
                    _vm.formdata.dataformat.indexOf("hh") != -1)
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c("el-date-picker", {
                              directives: [
                                {
                                  name: "validate",
                                  rawName: "v-validate",
                                  value: _vm.validaterules,
                                  expression: "validaterules"
                                }
                              ],
                              ref: "bwform_" + _vm.formdata.field,
                              class: {
                                input: true,
                                "is-danger": _vm.errorBags.first(
                                  _vm.formdata.field
                                )
                              },
                              attrs: {
                                placeholder: "",
                                name: _vm.formdata.field,
                                disabled: _vm.formdata.disabled === true,
                                clearable: _vm.formdata.clearable || false,
                                "value-format":
                                  _vm.formdata.dataformat ||
                                  "yyyy-MM-dd hh:mm:ss",
                                format:
                                  _vm.formdata.viewformat ||
                                  _vm.formdata.dataformat ||
                                  "yyyy-MM-dd",
                                type: "datetime"
                              },
                              on: { change: _vm.fieldChange },
                              model: {
                                value:
                                  _vm.formConfigs.formData[_vm.formdata.field],
                                callback: function($$v) {
                                  _vm.$set(
                                    _vm.formConfigs.formData,
                                    _vm.formdata.field,
                                    $$v
                                  )
                                },
                                expression:
                                  "formConfigs.formData[formdata.field]"
                              }
                            }),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e()
                ]
          ]
        : _vm._e(),
      _vm.formdata.datatype == "picklist"
        ? [
            _vm.formdata.editable == false
              ? [
                  _c(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.formdata.isShowLabel,
                          expression: "formdata.isShowLabel"
                        }
                      ],
                      class: _vm.formdata.required ? "is-required" : "",
                      attrs: {
                        "label-width":
                          _vm.formdata.labelWidth ||
                          _vm.formConfigs.labelWidth ||
                          "100px",
                        prop: _vm.formdata.field,
                        label: _vm.transfromLabel() + ":"
                      }
                    },
                    [
                      _c("span", [
                        _vm._v(
                          _vm._s(
                            _vm.getPickListValue(
                              _vm.formConfigs.formData[_vm.formdata.field]
                            )
                          )
                        )
                      ])
                    ]
                  )
                ]
              : [
                  _vm.formdata.remote == true &&
                  _vm.formdata.formater == "select"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c(
                              "el-select",
                              {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: _vm.validaterules,
                                    expression: "validaterules"
                                  }
                                ],
                                ref: "bwform_" + _vm.formdata.field,
                                class: {
                                  input: true,
                                  "is-danger": _vm.errorBags.first(
                                    _vm.formdata.field
                                  )
                                },
                                attrs: {
                                  filterable: "",
                                  remote: "",
                                  "reserve-keyword": "",
                                  "remote-method": _vm.remoteMethod,
                                  loading: _vm.loading,
                                  clearable: _vm.formdata.clearable || false,
                                  name: _vm.formdata.field,
                                  "popper-append-to-body": false,
                                  disabled: _vm.formdata.disabled === true,
                                  placeholder: ""
                                },
                                on: { change: _vm.fieldChange },
                                model: {
                                  value:
                                    _vm.formConfigs.formData[
                                      _vm.formdata.field
                                    ],
                                  callback: function($$v) {
                                    _vm.$set(
                                      _vm.formConfigs.formData,
                                      _vm.formdata.field,
                                      $$v
                                    )
                                  },
                                  expression:
                                    "formConfigs.formData[formdata.field]"
                                }
                              },
                              _vm._l(_vm.formdata.formaterItems, function(
                                item
                              ) {
                                return _c("el-option", {
                                  key: item.value,
                                  attrs: {
                                    label: item.label,
                                    value: item.value
                                  }
                                })
                              }),
                              1
                            ),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e(),
                  !_vm.formdata.remote &&
                  !_vm.formdata.mutil &&
                  _vm.formdata.formater == "select"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c(
                              "el-select",
                              {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: _vm.validaterules,
                                    expression: "validaterules"
                                  }
                                ],
                                ref: "bwform_" + _vm.formdata.field,
                                class: {
                                  input: true,
                                  "is-danger": _vm.errorBags.first(
                                    _vm.formdata.field
                                  )
                                },
                                attrs: {
                                  filterable: "",
                                  name: _vm.formdata.field,
                                  clearable: _vm.formdata.clearable || false,
                                  "popper-append-to-body": false,
                                  disabled: _vm.formdata.disabled === true,
                                  placeholder: ""
                                },
                                on: { change: _vm.fieldChange },
                                model: {
                                  value:
                                    _vm.formConfigs.formData[
                                      _vm.formdata.field
                                    ],
                                  callback: function($$v) {
                                    _vm.$set(
                                      _vm.formConfigs.formData,
                                      _vm.formdata.field,
                                      $$v
                                    )
                                  },
                                  expression:
                                    "formConfigs.formData[formdata.field]"
                                }
                              },
                              _vm._l(_vm.formdata.formaterItems, function(
                                item
                              ) {
                                return _c("el-option", {
                                  key: item.value,
                                  attrs: {
                                    label: item.label,
                                    value: item.value
                                  }
                                })
                              }),
                              1
                            ),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e(),
                  _vm.formdata.formater == "radio"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c(
                              "el-radio-group",
                              {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: _vm.validaterules,
                                    expression: "validaterules"
                                  }
                                ],
                                ref: "bwform_" + _vm.formdata.field,
                                class: {
                                  input: true,
                                  "is-danger": _vm.errorBags.first(
                                    _vm.formdata.field
                                  )
                                },
                                attrs: { name: _vm.formdata.field },
                                model: {
                                  value:
                                    _vm.formConfigs.formData[
                                      _vm.formdata.field
                                    ],
                                  callback: function($$v) {
                                    _vm.$set(
                                      _vm.formConfigs.formData,
                                      _vm.formdata.field,
                                      $$v
                                    )
                                  },
                                  expression:
                                    "formConfigs.formData[formdata.field]"
                                }
                              },
                              _vm._l(_vm.formdata.formaterItems, function(
                                item
                              ) {
                                return _c(
                                  "el-radio",
                                  {
                                    key: item.value,
                                    attrs: {
                                      disabled: _vm.formdata.disabled === true,
                                      label: item.value,
                                      value: item.value
                                    },
                                    on: { change: _vm.fieldChange }
                                  },
                                  [
                                    _vm._v(
                                      "\n                            " +
                                        _vm._s(item.label) +
                                        "\n                            "
                                    )
                                  ]
                                )
                              }),
                              1
                            ),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e(),
                  _vm.formdata.mutil && _vm.formdata.formater == "checkbox"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: [
                              _vm.formdata.required ? "is-required" : "",
                              "bw-form-checkbox"
                            ],
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c(
                              "el-checkbox-group",
                              {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: _vm.validaterules,
                                    expression: "validaterules"
                                  }
                                ],
                                ref: "bwform_" + _vm.formdata.field,
                                class: {
                                  input: true,
                                  "is-danger": _vm.errorBags.first(
                                    _vm.formdata.field
                                  )
                                },
                                attrs: { name: _vm.formdata.field },
                                model: {
                                  value:
                                    _vm.formConfigs.formData[
                                      _vm.formdata.field
                                    ],
                                  callback: function($$v) {
                                    _vm.$set(
                                      _vm.formConfigs.formData,
                                      _vm.formdata.field,
                                      $$v
                                    )
                                  },
                                  expression:
                                    "formConfigs.formData[formdata.field]"
                                }
                              },
                              _vm._l(_vm.formdata.formaterItems, function(
                                item
                              ) {
                                return _c(
                                  "el-checkbox",
                                  {
                                    key: item.value,
                                    attrs: {
                                      disabled: _vm.formdata.disabled === true,
                                      label: item.value,
                                      value: item.value
                                    },
                                    on: { change: _vm.fieldChange }
                                  },
                                  [_vm._v(" " + _vm._s(item.label))]
                                )
                              }),
                              1
                            ),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e(),
                  _vm.formdata.mutil && _vm.formdata.formater == "select"
                    ? [
                        _c(
                          "el-form-item",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: _vm.formdata.isShowLabel,
                                expression: "formdata.isShowLabel"
                              }
                            ],
                            class: _vm.formdata.required ? "is-required" : "",
                            attrs: {
                              "label-width":
                                _vm.formdata.labelWidth ||
                                _vm.formConfigs.labelWidth ||
                                "100px",
                              prop: _vm.formdata.field,
                              label: _vm.transfromLabel()
                            }
                          },
                          [
                            _c(
                              "el-select",
                              {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: _vm.validaterules,
                                    expression: "validaterules"
                                  }
                                ],
                                ref: "bwform_" + _vm.formdata.field,
                                class: {
                                  input: true,
                                  "is-danger": _vm.errorBags.first(
                                    _vm.formdata.field
                                  )
                                },
                                attrs: {
                                  filterable: "",
                                  name: _vm.formdata.field,
                                  multiple: "",
                                  clearable: _vm.formdata.clearable || false,
                                  "popper-append-to-body": false,
                                  disabled: _vm.formdata.disabled === true,
                                  placeholder: ""
                                },
                                on: { change: _vm.fieldChange },
                                model: {
                                  value:
                                    _vm.formConfigs.formData[
                                      _vm.formdata.field
                                    ],
                                  callback: function($$v) {
                                    _vm.$set(
                                      _vm.formConfigs.formData,
                                      _vm.formdata.field,
                                      $$v
                                    )
                                  },
                                  expression:
                                    "formConfigs.formData[formdata.field]"
                                }
                              },
                              _vm._l(_vm.formdata.formaterItems, function(
                                item
                              ) {
                                return _c("el-option", {
                                  key: item.value,
                                  attrs: {
                                    label: item.label,
                                    value: item.value
                                  }
                                })
                              }),
                              1
                            ),
                            _c("span", { staticClass: "form-item-error" }, [
                              _vm._v(
                                _vm._s(_vm.errorBags.first(_vm.formdata.field))
                              )
                            ])
                          ],
                          1
                        )
                      ]
                    : _vm._e()
                ]
          ]
        : _vm._e()
    ],
    2
  )
}
var FormCellvue_type_template_id_27b05e5e_scoped_true_staticRenderFns = []
FormCellvue_type_template_id_27b05e5e_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Form/FormCell.vue?vue&type=template&id=27b05e5e&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(41);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormCell.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var FormCellvue_type_script_lang_js_ = ({
  inject: ['formConfigs'],
  name: 'FormCell',
  data: function data() {
    return {
      that: this,
      loading: false // validaterules:''

    };
  },
  components: {
    MinDataGrid: MinDataGrid
  },
  props: {
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: 'string',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            field: '',
            change: function change() {}
          }]
        }
      }
    }
  },
  methods: {
    transfromLabel: function transfromLabel() {
      if (this.formConfigs.translater) {
        return this.formConfigs.translater.call(this, this.formdata);
      }

      if (this.formdata.i18nLabel && this.$t) {
        return this.$t(this.formdata.label);
      }

      return this.formdata.label;
    },
    remoteMethod: function remoteMethod(e, a, b) {
      var _this = this;

      if (this.formdata.remoteUrl) {
        this.loading = true;
        this.$fetch(this.formdata.remoteUrl, {
          params: {
            keyword: e
          }
        }).then(function (res) {
          _this.loading = false;
          console.log(res);
          var options = res.data.items;

          if (_this.formdata.filterData) {
            options = _this.formdata.filterData(res);
          }

          _this.formdata.formaterItems = options;

          _this.$forceUpdate();
        });
      }

      console.log(e, a, b);
    },
    validateForm: function validateForm() {
      // this.$validator.validateAll().then(res=>{
      //     console.log(res)
      // });
      // this.$validator.validateAll().then(result=>{
      //     console.log('formCell'+this.formdata.field,result);
      // })
      return this.$validator.validateAll();
    },
    resetValidate: function resetValidate() {
      this.mountedChange();
      return this.$validator.reset();
    },
    getAttributeInfo: function getAttributeInfo(list, field) {
      var _this2 = this;

      var res = null;
      list.forEach(function (item) {
        if (item.field == field) {
          res = item;
          return false;
        }

        if (item.childrens && item.childrens.length > 0) {
          res = _this2.getAttributeInfo(item.childrens, field);

          if (res) {
            return false;
          }
        }
      });
      return res;
    },
    getTargetVm: function getTargetVm(field) {
      var vm = this.formConfigs.$validaters.filter(function (item) {
        return item.field == field;
      });

      if (vm && vm.length > 0) {
        return vm[0];
      }
    },
    mountedChange: function mountedChange(value) {
      var _this3 = this;

      if (this.formdata.relationship && this.formdata.relationship.targets && this.formdata.relationship.targets.length > 0) {
        var targets = this.formdata.relationship.targets;
        targets.forEach(function (item) {
          var field = item.field;
          var handler = item.change;
          var _super = item._super;

          var targetInfo = _this3.getAttributeInfo(_this3.formConfigs.datas, field);

          var targetVm = _this3.getTargetVm(field);

          if (!targetVm) {
            targetVm = _this3;
          } // console.log('targetInfo',targetInfo);


          if (targetVm) {
            if (external_lodash_default.a.isFunction(handler)) {
              handler.call(_this3, targetVm.$vm, value, _this3.formConfigs.formData[field], _this3, _super);
            } else if (typeof handler === 'string') {
              var funHandler = new Function(['target', 'value', 'targetValue', '$vm', '_super'], handler);

              try {
                funHandler.call(_this3, targetVm.$vm, value, _this3.formConfigs.formData[field], _this3, _super);
              } catch (e) {
                console.log(e);
              }
            }

            targetVm && targetVm.$vm && targetVm.$vm.$forceUpdate();
          }
        });
      }
    },
    fieldChange: function fieldChange(value) {
      var _this4 = this;

      if (this.formdata.relationship && this.formdata.relationship.targets && this.formdata.relationship.targets.length > 0) {
        var targets = this.formdata.relationship.targets;
        targets.forEach(function (item) {
          var field = item.field;
          var handler = item.change;
          var _super = item._super;

          var targetInfo = _this4.getAttributeInfo(_this4.formConfigs.datas, field);

          var targetVm = _this4.getTargetVm(field);

          if (!targetVm) {
            targetVm = _this4;
          } // console.log('targetInfo',targetInfo);


          if (targetVm) {
            if (external_lodash_default.a.isFunction(handler)) {
              handler.call(_this4, targetVm.$vm, value, _this4.formConfigs.formData[field], _this4, _super);
            } else if (typeof handler === 'string') {
              var funHandler = new Function(['target', 'value', 'targetValue', '$vm', '_super'], handler);

              try {
                funHandler.call(_this4, targetVm.$vm, value, _this4.formConfigs.formData[field], _this4, _super);
              } catch (e) {
                console.log(e);
              }
            }

            targetVm && targetVm.$vm && targetVm.$vm.$forceUpdate();
          }
        });
      }
    },
    setValue: function setValue(value) {
      this.formConfigs.formData[this.formdata.field] = value;
    },
    setFormdata: function setFormdata(key, value) {
      this.formdata[key] = value;
    },
    getPickListValue: function getPickListValue(field, Vm) {
      var value = this.formConfigs.formData[this.formdata.field];
      console.log('getPickListValue', value);

      if (value) {
        if (this.formdata.formaterItems && this.formdata.formaterItems.length > 0) {
          var res = this.formdata.formaterItems.filter(function (item) {
            return item.value == value;
          });

          if (res && res.length > 0) {
            return res[0].label;
          }
        }

        return value;
      } else {
        return '';
      }
    }
  },
  filters: {},
  created: function created() {
    var _this5 = this;

    //  console.log('__super',this.formConfigs.__super);
    if (this.formdata.mutil && (this.formdata.formater == 'checkbox' || this.formdata.formater == 'select')) {
      this.$set(this.formConfigs.formData, this.formdata.field, []); //this.formConfigs.formData[this.formdata.field] = [];
    } else if (this.formdata.type == 'subgrid' && !this.formConfigs.formData[this.formdata.field]) {
      this.$set(this.formConfigs.formData, this.formdata.field, {
        values: []
      }); //this.formConfigs.formData[this.formdata.field] = {values:[]};
    } else if (this.formdata.datatype == 'boolean') {
      this.$set(this.formConfigs.formData, this.formdata.field, false); // this.formConfigs.formData[this.formdata.field]= false;
    } else {
      this.$set(this.formConfigs.formData, this.formdata.field, ''); // this.formConfigs.formData[this.formdata.field] = '';
    }

    if (this.formConfigs.$fields) {
      this.formConfigs.$formCells.push(this);
    }

    this.formConfigs.__super.$on('file.formCellUpdate', function () {
      _this5.$forceUpdate();
    }); // console.log(this.validaterules);

  },
  computed: {
    validaterules: function validaterules() {
      var tempRules = [];
      this.formdata.required && tempRules.push('required');

      if (this.formdata.rules && this.formdata.rules.length > 0) {
        tempRules = tempRules.concat(this.formdata.rules);
      }

      return tempRules.join('|');
    }
  },
  mounted: function mounted() {
    // console.log('formcell',this.formConfigs);
    //this.formConfigs.formData[this.formdata.field];
    var $dom = this.$refs['bwform_' + this.formdata.field];

    if ($dom) {
      this.formConfigs.$validaters.push({
        field: this.formdata.field,
        $vm: this,
        $el: $dom,
        validateHandler: this.validateForm,
        resetValidate: this.resetValidate,
        mountedChange: this.mountedChange
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/Form/FormCell.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_FormCellvue_type_script_lang_js_ = (FormCellvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Form/FormCell.vue





/* normalize component */

var FormCell_component = normalizeComponent(
  Form_FormCellvue_type_script_lang_js_,
  FormCellvue_type_template_id_27b05e5e_scoped_true_render,
  FormCellvue_type_template_id_27b05e5e_scoped_true_staticRenderFns,
  false,
  null,
  "27b05e5e",
  null
  
)

/* hot reload */
if (false) { var FormCell_api; }
FormCell_component.options.__file = "src/components/Form/FormCell.vue"
/* harmony default export */ var FormCell = (FormCell_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormRows.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var FormRowsvue_type_script_lang_js_ = ({
  inject: ['formConfigs'],
  name: 'FormRows',
  components: {
    FormCell: FormCell
  },
  props: {
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: '',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            attributename: '',
            change: function change() {}
          }]
        },
        childrens: [{}]
      }
    }
  },
  created: function created() {//  console.log('formrows',this.formConfigs);
  },
  data: function data() {
    return {};
  }
});
// CONCATENATED MODULE: ./src/components/Form/FormRows.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_FormRowsvue_type_script_lang_js_ = (FormRowsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/FormRows.vue?vue&type=style&index=0&id=267fb5c8&scoped=true&lang=css&
var FormRowsvue_type_style_index_0_id_267fb5c8_scoped_true_lang_css_ = __webpack_require__(42);

// CONCATENATED MODULE: ./src/components/Form/FormRows.vue






/* normalize component */

var FormRows_component = normalizeComponent(
  Form_FormRowsvue_type_script_lang_js_,
  FormRowsvue_type_template_id_267fb5c8_scoped_true_render,
  FormRowsvue_type_template_id_267fb5c8_scoped_true_staticRenderFns,
  false,
  null,
  "267fb5c8",
  null
  
)

/* hot reload */
if (false) { var FormRows_api; }
FormRows_component.options.__file = "src/components/Form/FormRows.vue"
/* harmony default export */ var FormRows = (FormRows_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormTable.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var FormTablevue_type_script_lang_js_ = ({
  inject: ['formConfigs'],
  name: 'FormTable',
  components: {
    FormRows: FormRows
  },
  props: {
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: '',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            attributename: '',
            change: function change() {}
          }]
        },
        childrens: [{}]
      }
    }
  },
  created: function created() {// console.log('formtable',this.formConfigs);
  },
  data: function data() {
    return {
      showContent: true
    };
  }
});
// CONCATENATED MODULE: ./src/components/Form/FormTable.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_FormTablevue_type_script_lang_js_ = (FormTablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/FormTable.vue?vue&type=style&index=0&id=787e0722&scoped=true&lang=css&
var FormTablevue_type_style_index_0_id_787e0722_scoped_true_lang_css_ = __webpack_require__(44);

// CONCATENATED MODULE: ./src/components/Form/FormTable.vue






/* normalize component */

var FormTable_component = normalizeComponent(
  Form_FormTablevue_type_script_lang_js_,
  FormTablevue_type_template_id_787e0722_scoped_true_render,
  FormTablevue_type_template_id_787e0722_scoped_true_staticRenderFns,
  false,
  null,
  "787e0722",
  null
  
)

/* hot reload */
if (false) { var FormTable_api; }
FormTable_component.options.__file = "src/components/Form/FormTable.vue"
/* harmony default export */ var FormTable = (FormTable_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormTab.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var FormTabvue_type_script_lang_js_ = ({
  inject: ['formConfigs'],
  name: 'FormTab',
  components: {
    FormTable: FormTable
  },
  props: {
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: '',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            attributename: '',
            change: function change() {}
          }]
        },
        childrens: [{}]
      }
    }
  },
  created: function created() {//  console.log('formtab',this.formConfigs);
  },
  data: function data() {
    return {};
  }
});
// CONCATENATED MODULE: ./src/components/Form/FormTab.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_FormTabvue_type_script_lang_js_ = (FormTabvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/FormTab.vue?vue&type=style&index=0&id=b7161a14&scoped=true&lang=css&
var FormTabvue_type_style_index_0_id_b7161a14_scoped_true_lang_css_ = __webpack_require__(46);

// CONCATENATED MODULE: ./src/components/Form/FormTab.vue






/* normalize component */

var FormTab_component = normalizeComponent(
  Form_FormTabvue_type_script_lang_js_,
  FormTabvue_type_template_id_b7161a14_scoped_true_render,
  FormTabvue_type_template_id_b7161a14_scoped_true_staticRenderFns,
  false,
  null,
  "b7161a14",
  null
  
)

/* hot reload */
if (false) { var FormTab_api; }
FormTab_component.options.__file = "src/components/Form/FormTab.vue"
/* harmony default export */ var FormTab = (FormTab_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/FormLayout.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var FormLayoutvue_type_script_lang_js_ = ({
  inject: ['formConfigs'],
  name: 'FormLayout',
  components: {
    FormTab: FormTab
  },
  props: {
    className: {
      type: String,
      "default": function _default() {
        return '';
      }
    },
    formdata: {
      type: Object,
      "default": {
        ___id: src_utils.NewGuid(),
        id: '',
        title: 'layout-title',
        span: 6,
        //页面显示时占宽度的分数，一共24分；
        isShowTitle: false,
        isShowLabel: true,
        type: 'layout',
        //layout,tab,table,rows,cell
        datatype: '',
        formater: '',
        //如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
        formaterItems: [],
        //如果是单选，多选的时候的数据来源
        required: false,
        label: '',
        //显示的名字
        field: '',
        //字段名
        validate: {//需要的验证信息 min,max,length
        },
        relationship: {
          //关联的字段的配置信息
          targets: [{
            attributename: '',
            change: function change() {}
          }]
        },
        childrens: [{}]
      }
    }
  },
  created: function created() {//  console.log('formlayout',this.formConfigs);
  },
  data: function data() {
    return {};
  }
});
// CONCATENATED MODULE: ./src/components/Form/FormLayout.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_FormLayoutvue_type_script_lang_js_ = (FormLayoutvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/FormLayout.vue?vue&type=style&index=0&id=250804d9&scoped=true&lang=css&
var FormLayoutvue_type_style_index_0_id_250804d9_scoped_true_lang_css_ = __webpack_require__(48);

// CONCATENATED MODULE: ./src/components/Form/FormLayout.vue






/* normalize component */

var FormLayout_component = normalizeComponent(
  Form_FormLayoutvue_type_script_lang_js_,
  FormLayoutvue_type_template_id_250804d9_scoped_true_render,
  FormLayoutvue_type_template_id_250804d9_scoped_true_staticRenderFns,
  false,
  null,
  "250804d9",
  null
  
)

/* hot reload */
if (false) { var FormLayout_api; }
FormLayout_component.options.__file = "src/components/Form/FormLayout.vue"
/* harmony default export */ var FormLayout = (FormLayout_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Form/Form.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var Formvue_type_script_lang_js_ = ({
  props: {
    formConfigs: {
      type: Object,
      "default": function _default() {
        return {
          formid: 'formid_1',
          formData: {},
          $validaters: [],
          datas: [],
          __super: null,
          styles: {}
        };
      }
    }
  },
  provide: function provide() {
    return {
      formConfigs: this.formConfigs
    };
  },
  components: {
    FormLayout: FormLayout
  },
  methods: {
    getFieldInfo: function getFieldInfo(fieldName) {},
    formSubmit: function formSubmit() {
      var validaters = [];
      this.formConfigs.$validaters.forEach(function (item) {
        var res = item.validateHandler(); //    res.then(result=>{
        //        console.log(result);
        //    })

        validaters.push(res);
      }); //  console.log('formSubmit',validaters)
      //    var $form = this.$refs['bw_form_'+this.formConfigs.formid];
      //    validaters.push(this.$validator.validateAll());
      // Promise.all(validaters).then(res=>{
      //     console.log('promise_result',res);
      // })

      return Promise.all(validaters);
    },
    upDateChildrens: function upDateChildrens() {
      //    this.$nextTick(res=>{
      //         this.formConfigs.$formCells.forEach(item=>{
      //             item.$forceUpdate();
      //         });
      //    })
      this.$emit('file.formCellUpdate');
    },
    getFormValidates: function getFormValidates() {
      var validaters = [];
      this.formConfigs.$validaters.forEach(function (item) {
        var res = item.validateHandler();
        validaters.push(res);
      });
      return validaters;
    },
    formReset: function formReset() {
      var _this = this;

      var $form = this.$refs['bw_form_' + this.formConfigs.formid];

      if ($form) {
        var resets = []; // this.formConfigs.$validaters.forEach(item=>{
        //     if(item.resetForm){
        //         resets.push(item.resetForm());
        //     }
        // });

        this.validateReset();
        $form.resetFields();
        setTimeout(function () {
          _this.$forceUpdate();
        }, 100);
      }
    },
    validateReset: function validateReset() {
      var validaters = [];
      this.formConfigs.$validaters.forEach(function (item) {
        validaters.push(item.resetValidate());
        item.mountedChange();
      });
      return Promise.all(validaters).then(function (results) {
        if (results.indexOf(false) > -1) {
          console.log("没能全部reset");
          return;
        } // 校验全部通过处理


        console.log("全部reset"); // this.$emit('formSubmit')
      });
    }
  },
  created: function created() {
    // this.formConfigs.$validaters = [];
    this.formInfo = this.formConfigs;

    if (!this.formConfigs.formid) {
      this.formConfigs.formid = src_utils.NewGuid().ToString();
    }

    if (!this.formConfigs.$formCells) {
      this.formConfigs.$formCells = [];
    }

    this.formConfigs.__super = this;
    var defaultStyles = {
      labelWidth: "auto",
      labelPostion: 'right',
      size: 'mini',
      disabled: false
    };

    if (!this.formConfigs.styles) {
      this.formConfigs.styles = defaultStyles;
    } else {
      this.formConfigs.styles = external_jquery_default.a.extend(true, {}, defaultStyles, this.formConfigs.styles);
    } //  console.log('form component',this.formConfigs)

  },
  data: function data() {
    return {
      __super: this,
      formInfo: {}
    };
  }
});
// CONCATENATED MODULE: ./src/components/Form/Form.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_Formvue_type_script_lang_js_ = (Formvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Form/Form.vue?vue&type=style&index=0&lang=css&
var Formvue_type_style_index_0_lang_css_ = __webpack_require__(50);

// CONCATENATED MODULE: ./src/components/Form/Form.vue






/* normalize component */

var Form_component = normalizeComponent(
  Form_Formvue_type_script_lang_js_,
  Formvue_type_template_id_478c5062_render,
  Formvue_type_template_id_478c5062_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Form_api; }
Form_component.options.__file = "src/components/Form/Form.vue"
/* harmony default export */ var Form = (Form_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/BreadCrumb/Index.vue?vue&type=template&id=3d054694&scoped=true&
var Indexvue_type_template_id_3d054694_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.$breadcrumbList
    ? _c(
        "el-breadcrumb",
        { attrs: { "separator-class": _vm.icon } },
        _vm._l(_vm.$breadcrumbList, function(item, index) {
          return _c(
            "el-breadcrumb-item",
            { key: index, attrs: { to: { path: item.to.path } } },
            [
              _vm._v(
                "\n        " +
                  _vm._s(item.to.breadcrumbTitle || item.to.title || "") +
                  "\n        "
              ),
              _vm._t("default", null, null, item)
            ],
            2
          )
        }),
        1
      )
    : _vm._e()
}
var Indexvue_type_template_id_3d054694_scoped_true_staticRenderFns = []
Indexvue_type_template_id_3d054694_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/BreadCrumb/Index.vue?vue&type=template&id=3d054694&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/BreadCrumb/Index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
/* harmony default export */ var BreadCrumb_Indexvue_type_script_lang_js_ = ({
  name: 'BwBreadCrumb',
  props: {
    icon: {
      "default": function _default() {
        return 'el-icon-arrow-right';
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/BreadCrumb/Index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_BreadCrumb_Indexvue_type_script_lang_js_ = (BreadCrumb_Indexvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/BreadCrumb/Index.vue





/* normalize component */

var BreadCrumb_Index_component = normalizeComponent(
  components_BreadCrumb_Indexvue_type_script_lang_js_,
  Indexvue_type_template_id_3d054694_scoped_true_render,
  Indexvue_type_template_id_3d054694_scoped_true_staticRenderFns,
  false,
  null,
  "3d054694",
  null
  
)

/* hot reload */
if (false) { var BreadCrumb_Index_api; }
BreadCrumb_Index_component.options.__file = "src/components/BreadCrumb/Index.vue"
/* harmony default export */ var BreadCrumb_Index = (BreadCrumb_Index_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Uploader/Index.vue?vue&type=template&id=38cc60fe&scoped=true&
var Indexvue_type_template_id_38cc60fe_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {}, [
    _c("div", { staticClass: "avatar-uploader" }, [
      _c(
        "div",
        {
          ref: "elUploader",
          staticClass: "el-upload el-upload--text",
          on: { click: _vm.triggerChange }
        },
        [
          _vm._t("default"),
          _c("input", {
            staticClass: "el-upload__input",
            attrs: { type: "file", name: _vm.name },
            on: { change: _vm.fileChange }
          })
        ],
        2
      )
    ])
  ])
}
var Indexvue_type_template_id_38cc60fe_scoped_true_staticRenderFns = []
Indexvue_type_template_id_38cc60fe_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Uploader/Index.vue?vue&type=template&id=38cc60fe&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Uploader/Index.vue?vue&type=script&lang=js&
function Indexvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function Indexvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Indexvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { Indexvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Indexvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Indexvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var Uploader_Indexvue_type_script_lang_js_ = ({
  name: "Uploader",
  props: {
    dataInfo: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    url: {
      type: String,
      "default": ''
    },
    name: {
      type: String,
      "default": 'file'
    },
    maxSize: {
      type: String,
      "default": '2'
    },
    fileType: {
      type: String,
      "default": 'jpeg|png|gif|jpg|bmp|tif'
    },
    handleSuccess: {
      type: Function
    },
    beforeChange: {
      type: Function,
      "default": function _default() {
        return true;
      }
    }
  },
  data: function data() {
    return {
      defaultConfig: {
        fileType: 'jpeg|png|gif|jpg|bmp|tif' //\.jpg||\.jpeg||\.png||\.bmp||\.tif

      }
    };
  },
  mounted: function mounted() {
    // let $dom = this.$refs.elUploader;
    // if($dom){
    //   var $input = $dom.$el.querySelector('input');
    //   $input.addEventListener('click')
    // }
    console.log(this);
  },
  methods: {
    triggerChange: function triggerChange(e) {
      var $dom = this.$refs.elUploader;

      if ($dom) {
        var $input = $dom.querySelector('input');
        $input.click();
      }
    },
    clearFiles: function clearFiles(e) {
      var $dom = this.$refs.elUploader;

      if ($dom) {
        var $input = $dom.querySelector('input');
        $input.value = '';
      }
    },
    fileChange: function fileChange(e) {
      var self = this;
      var target = e.target;
      var files = target.files;

      if (files.length > 0) {
        var file = files[0];
        var flag = this.beforeChange(file, target, e, this);

        if (!flag) {
          return false;
        }

        var reader = new FileReader(); //用于图片显示不需要传入后台，reader.result的结果是base64编码数据，直接放入img的src中即可

        reader.readAsDataURL(file);

        reader.onload = function () {
          self.handleSuccess(file, reader, e, self);
        };
      }
    },
    handleRemove: function handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview: function handlePreview(file) {
      console.log(file);
    },
    handleAvatarSuccess: function handleAvatarSuccess(res, file) {
      console.log(file);
      this.addform.imageUrl = URL.createObjectURL(file.raw);
      this.addform.imgFile = file.raw;
    },
    beforeAvatarUpload: function beforeAvatarUpload(file) {
      var isJPG = new RegExp(this.uploadConfig.fileType, 'mg').test(file.type); // === 'image/jpeg';

      var isLt2M = file.size / 1024 / 1024 < this.uploadConfig.maxSize;

      if (!isJPG) {
        this.$message.error("\u4E0A\u4F20\u5934\u50CF\u56FE\u7247\u53EA\u80FD\u662F ".concat(this.uploadConfig.fileType.replace('\|', ','), " \u683C\u5F0F!"));
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      isJPG = (_readOnlyError("isJPG"), true);
      return isJPG && isLt2M;
    },
    addbwForm: function addbwForm() {
      var _this = this;

      var imgFile = this.addform.imageUrl;
      console.log(this.addform);

      function objsToFormData(formdata, postModel, parKey) {
        parKey = parKey || '';
        var type = Object.prototype.toString.call(postModel);

        if (type == '[object Array]') {
          $.each(postModel, function (i, n) {
            objsToFormData(formdata, n, parKey + '[' + i + ']');
          });
        } else if (type == '[object Object]') {
          for (var i in postModel) {
            objsToFormData(formdata, postModel[i], parKey ? parKey + '.' + i : i);
          }
        } else {
          formdata.append(parKey, postModel);
        }
      }

      var formdata = new FormData();
      var $uploaderImage = this.$refs.uploaderImage;

      if ($uploaderImage) {
        var singleFile = $uploaderImage.$el.children[0].children[1];

        if (singleFile.length > 0) {
          formdata.append('imgFile', singleFile.files[0]);
        }
      }

      var postModel = Indexvue_type_script_lang_js_objectSpread({
        libId: this.formData.libId
      }, this.addform);

      objsToFormData(formdata, postModel);
      this.$post(this.url, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        var rcode = response.code;

        if (rcode == 200) {
          _this.$errorMsg("添加成功！", "success", 3000);

          _this.handleList();
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/Uploader/Index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Uploader_Indexvue_type_script_lang_js_ = (Uploader_Indexvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Uploader/Index.vue?vue&type=style&index=0&id=38cc60fe&scoped=true&lang=css&
var Indexvue_type_style_index_0_id_38cc60fe_scoped_true_lang_css_ = __webpack_require__(52);

// CONCATENATED MODULE: ./src/components/Uploader/Index.vue






/* normalize component */

var Uploader_Index_component = normalizeComponent(
  components_Uploader_Indexvue_type_script_lang_js_,
  Indexvue_type_template_id_38cc60fe_scoped_true_render,
  Indexvue_type_template_id_38cc60fe_scoped_true_staticRenderFns,
  false,
  null,
  "38cc60fe",
  null
  
)

/* hot reload */
if (false) { var Uploader_Index_api; }
Uploader_Index_component.options.__file = "src/components/Uploader/Index.vue"
/* harmony default export */ var Uploader_Index = (Uploader_Index_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Selecter/MutilSelecter.vue?vue&type=template&id=646f81e2&scoped=true&
var MutilSelectervue_type_template_id_646f81e2_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "mutilselecter-box", style: "width:" + _vm.width },
    [
      _c(
        "el-row",
        { attrs: { gutter: 10 } },
        [
          _c("el-col", { attrs: { span: 10 } }, [
            _c(
              "div",
              { staticClass: "mutilselecter-selecter-search" },
              [
                _c(
                  "el-input",
                  {
                    attrs: { size: "mini", placeholder: "" },
                    on: { input: _vm.searchByKeyword },
                    model: {
                      value: _vm.keyword,
                      callback: function($$v) {
                        _vm.keyword = $$v
                      },
                      expression: "keyword"
                    }
                  },
                  [
                    _c("el-button", {
                      attrs: { slot: "append", icon: "el-icon-search" },
                      slot: "append"
                    })
                  ],
                  1
                )
              ],
              1
            )
          ])
        ],
        1
      ),
      _c(
        "el-row",
        { attrs: { gutter: 10 } },
        [
          _c("el-col", { attrs: { span: 10 } }, [
            _c(
              "div",
              { staticClass: "mutilselecter-selecter mutilselecter-item-box" },
              [
                _vm.closeable
                  ? _c("div", { staticClass: "mutilselecter-item-tools" }, [
                      _c("span", {
                        staticClass: "el-icon-circle-close",
                        on: { click: _vm.clearDatasActived }
                      })
                    ])
                  : _vm._e(),
                _c(
                  "ul",
                  { style: "height:" + _vm.height },
                  [
                    _vm._l(_vm.datalist, function(item, index) {
                      return [
                        _vm.selecteds.filter(function(jitem) {
                          return jitem.value == item.value
                        }).length == 0 && item.isShow
                          ? _c(
                              "li",
                              {
                                key: index,
                                class: item.active ? "active" : "",
                                on: {
                                  dblclick: function(e) {
                                    _vm.quickAddItem(item, index)
                                  },
                                  click: function(e) {
                                    _vm.activeItem(item, index)
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n                            " +
                                    _vm._s(item.label) +
                                    "\n                        "
                                )
                              ]
                            )
                          : _vm._e()
                      ]
                    })
                  ],
                  2
                )
              ]
            )
          ]),
          _c("el-col", { attrs: { span: 4 } }, [
            _c(
              "div",
              { staticClass: " ", style: "margin-top:" + _vm.ctrlMarginTop },
              [
                _c("div", { staticClass: "mutilselecter-ctrler text-center" }, [
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          attrs: { type: "default", size: "mini" },
                          on: { click: _vm.addToSelected }
                        },
                        [_c("span", { staticClass: "el-icon-arrow-right" })]
                      )
                    ],
                    1
                  ),
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          attrs: { type: "default", size: "mini" },
                          on: { click: _vm.backToDatas }
                        },
                        [_c("span", { staticClass: "el-icon-arrow-left" })]
                      )
                    ],
                    1
                  ),
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          attrs: { type: "default", size: "mini" },
                          on: { click: _vm.addToSelectedALL }
                        },
                        [_c("span", { staticClass: "el-icon-d-arrow-right" })]
                      )
                    ],
                    1
                  ),
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          attrs: { type: "default", size: "mini" },
                          on: { click: _vm.backToDatasALL }
                        },
                        [_c("span", { staticClass: "el-icon-d-arrow-left" })]
                      )
                    ],
                    1
                  )
                ])
              ]
            )
          ]),
          _c("el-col", { attrs: { span: 10 } }, [
            _c(
              "div",
              { staticClass: "mutilselecter-result mutilselecter-item-box" },
              [
                _vm.closeable
                  ? _c("div", { staticClass: "mutilselecter-item-tools" }, [
                      _c("span", {
                        staticClass: "el-icon-circle-close",
                        on: { click: _vm.clearSelectedActived }
                      })
                    ])
                  : _vm._e(),
                _c(
                  "ul",
                  { style: "height:" + _vm.height },
                  _vm._l(_vm.selecteds, function(item, index) {
                    return _c(
                      "li",
                      {
                        key: index,
                        class: item.selectedActive ? "active" : "",
                        on: {
                          click: function(e) {
                            _vm.activeSelectedItem(item, index)
                          }
                        }
                      },
                      [
                        _vm._v(
                          "\n                        " +
                            _vm._s(item.label) +
                            "\n                    "
                        )
                      ]
                    )
                  }),
                  0
                )
              ]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var MutilSelectervue_type_template_id_646f81e2_scoped_true_staticRenderFns = []
MutilSelectervue_type_template_id_646f81e2_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/components/Selecter/MutilSelecter.vue?vue&type=template&id=646f81e2&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Selecter/MutilSelecter.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MutilSelectervue_type_script_lang_js_ = ({
  name: 'bwMutilSelecter',
  data: function data() {
    return {
      // datalist:[],
      keyword: '' // results:[]

    };
  },
  model: {
    prop: 'selecteds',
    event: 'change'
  },
  props: {
    closeable: {
      type: Boolean,
      "default": false
    },
    datas: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    selecteds: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    height: {
      type: String,
      "default": '300px'
    },
    width: {
      type: String,
      "default": '700px'
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.$emit('change', []);
  },
  created: function created() {
    console.log('mutil init', this);
  },
  computed: {
    datalist: function datalist() {
      this.datas.forEach(function (item) {
        if (item.isShow === undefined) {
          item.isShow = true;
        }
      });
      return this.datas;
    },
    ctrlMarginTop: function ctrlMarginTop() {
      var res = 100;

      if (this.height && this.height.indexOf('px') != -1) {
        res = this.height.replace('px', '') * 1;
        res = res / 2 >> 0;
      }

      return res + 'px';
    } // results(){
    //     return this.selecteds;
    // }

  },
  methods: {
    clearDatasActived: function clearDatasActived() {
      this.datas.forEach(function (item) {
        item.active = false;
      });
      this.$forceUpdate();
    },
    clearSelectedActived: function clearSelectedActived() {
      var actives = [];
      this.selecteds.forEach(function (item) {
        //只保留没有激活的  
        actives.push(item);
      });
      actives.forEach(function (item) {
        item.selectedActive = false;
      });
      this.$emit('change', actives);
    },
    searchByKeyword: function searchByKeyword(value) {
      this.datas.forEach(function (item) {
        if (new RegExp(value, 'img').test(item.label) == false) {
          item.isShow = false;
          item.active = false;
        } else {
          item.isShow = true;
        }
      });
    },
    update: function update() {
      this.$forceUpdate();
    },
    activeItem: function activeItem(itemData) {
      if (itemData) {
        if (itemData.active == true) {
          itemData.active = false;
        } else {
          itemData.active = true;
        }

        this.$forceUpdate();
      }
    },
    activeSelectedItem: function activeSelectedItem(itemData) {
      if (itemData) {
        if (itemData.selectedActive == true) {
          itemData.selectedActive = false;
        } else {
          itemData.selectedActive = true;
        }

        this.$forceUpdate();
      }
    },
    backToDatas: function backToDatas() {
      var actives = [];
      this.selecteds.forEach(function (item) {
        //只保留没有激活的  
        if (!item.selectedActive) {
          actives.push(item);
        }
      });
      actives.forEach(function (item) {
        item.selectedActive = false;
        item.active = false;
      });
      this.$emit('change', actives);
    },
    backToDatasALL: function backToDatasALL() {
      var actives = [];
      this.$emit('change', actives);
    },
    quickAddItem: function quickAddItem(itemData) {
      var actives = [];
      itemData.active = false;
      this.selecteds.push(itemData);
      this.$emit('change', this.selecteds);
    },
    addToSelectedALL: function addToSelectedALL() {
      var _this = this;

      var actives = [];
      this.datalist.forEach(function (item) {
        actives.push(item);

        _this.selecteds.push(item);
      });
      actives.forEach(function (item) {
        item.active = false;
        item.selectedActive = false;
      });
      this.$emit('change', this.selecteds);
    },
    addToSelected: function addToSelected() {
      var _this2 = this;

      // this.$emit('change',()=>{
      //     this.selecteds.push(itemData);
      // });
      var actives = [];
      this.datalist.forEach(function (item) {
        if (item.active == true) {
          actives.push(item);
          item.selectedActive = false;

          _this2.selecteds.push(item);
        }
      });
      actives.forEach(function (item) {
        item.active = false;
      });
      this.$emit('change', this.selecteds); //this.selecteds = actives;
    }
  }
});
// CONCATENATED MODULE: ./src/components/Selecter/MutilSelecter.vue?vue&type=script&lang=js&
 /* harmony default export */ var Selecter_MutilSelectervue_type_script_lang_js_ = (MutilSelectervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Selecter/MutilSelecter.vue?vue&type=style&index=0&id=646f81e2&scoped=true&lang=css&
var MutilSelectervue_type_style_index_0_id_646f81e2_scoped_true_lang_css_ = __webpack_require__(54);

// CONCATENATED MODULE: ./src/components/Selecter/MutilSelecter.vue






/* normalize component */

var MutilSelecter_component = normalizeComponent(
  Selecter_MutilSelectervue_type_script_lang_js_,
  MutilSelectervue_type_template_id_646f81e2_scoped_true_render,
  MutilSelectervue_type_template_id_646f81e2_scoped_true_staticRenderFns,
  false,
  null,
  "646f81e2",
  null
  
)

/* hot reload */
if (false) { var MutilSelecter_api; }
MutilSelecter_component.options.__file = "src/components/Selecter/MutilSelecter.vue"
/* harmony default export */ var MutilSelecter = (MutilSelecter_component.exports);
// CONCATENATED MODULE: ./src/components/index.js











/* harmony default export */ var components = ({
  Menu: Index,
  DashBoard: DashBoard,
  BarChart: Bar,
  HBarChart: HBar,
  PieChart: Pie,
  DataTable: DataTable_Index,
  MinDataGrid: MinDataGrid,
  Form: Form,
  BwBreadCrumb: BreadCrumb_Index,
  BwMutilSelecter: MutilSelecter,
  Uploader: Uploader_Index
});
// CONCATENATED MODULE: ./src/directives/index.js

var directives = {};

directives.install = function (Vue) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Vue.directive('dialogDrag', {
    bind: function bind(el, binding, vnode, oldVnode) {
      var dialogHeaderEl = el.querySelector('.el-dialog__header');
      var dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move'; // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);

      var sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

      dialogHeaderEl.onmousedown = function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        var disX = e.clientX - dialogHeaderEl.offsetLeft;
        var disY = e.clientY - dialogHeaderEl.offsetTop; // 获取到的值带px 正则匹配替换

        var styL, styT; // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px

        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        }

        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          var l = e.clientX - disX;
          var t = e.clientY - disY; // 移动当前元素

          dragDom.style.left = "".concat(l + styL, "px");
          dragDom.style.top = "".concat(t + styT, "px"); // 将此时的位置传出去
          // binding.value({x:e.pageX,y:e.pageY})
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }); // v-dialogDragWidth: 弹窗宽度拖大 拖小

  Vue.directive('dialogDragWidth', {
    bind: function bind(el, binding, vnode, oldVnode) {
      var dragDom = binding.value.$el.querySelector('.el-dialog');

      el.onmousedown = function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        var disX = e.clientX - el.offsetLeft;

        document.onmousemove = function (e) {
          e.preventDefault(); // 移动时禁用默认事件
          // 通过事件委托，计算移动的距离

          var l = e.clientX - disX;
          dragDom.style.width = "".concat(l, "px");
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }); // 在组件中，使用自定义的事件：v-loadmore="loadMore" 在methods中调用loadMore

  Vue.directive('loadmore', {
    bind: function bind(el, binding) {
      var p = 0;
      var t = 0;
      var down = true;
      var selectWrap = el.querySelector('.el-table__body-wrapper');
      selectWrap.addEventListener('scroll', function () {
        //判断是否向下滚动
        p = this.scrollTop; // if ( t < p){down=true}else{down=false}

        if (t < p) {
          down = true;
        } else {
          down = false;
        }

        t = p; //判断是否到底

        var sign = 10;
        var scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;

        if (scrollDistance <= sign && down) {
          binding.value();
        }
      });
    }
  });
  /**
  * 文本框聚焦，且光标定位于文本末尾
  * 适用于v-if组件下的文本框
  */

  Vue.directive('focusCursorEnd', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function inserted(el) {
      var pos = el.value.length;

      if (el.createTextRange) {
        //IE浏览器 IE浏览器中有TextRange  对body,textarea,button有效
        var range = el.createTextRange(); //创建textRange

        range.moveStart("character", pos); //移动开始点（应移动到末尾），以字符为单位

        range.collapse(true); //没有移动结束点直接 折叠到一个点

        range.select(); //选择这个点
      } else {
        //非IE浏览器,如firefox,chrome
        el.setSelectionRange(el.value.length, pos);
      }

      el.focus();
    }
  }); //点击空白处关闭

  Vue.directive('clickOutsideClose', {
    bind: function bind(el, binding) {
      function handleClick(e) {
        if (el.contains(e.target)) {
          return false;
        }

        if (binding.expression) {
          binding.value(e);
        }
      }

      el.__vueClickClose = handleClick;
      document.addEventListener('click', el.__vueClickClose);
    },
    unbind: function unbind(el, binding) {
      document.removeEventListener('click', el.__vueClickClose);
    }
  });
  /**
  * 多行文本换行省略
  */

  Vue.directive('autoElli', {
    inserted: function inserted(el) {
      var s = el.textContent || el.innerText,
          n = el.offsetHeight;

      for (var i = 0; i < s.length; i++) {
        el.innerHTML = s.substr(0, i + 1);

        if (n < el.scrollHeight) {
          el.style.overflow = 'hidden';
          el.innerHTML = s.substr(0, i - 3) + '...';
          break;
        }
      }
    }
  });
  /**
   * 防止重复点击
   * 使用 v-debound-click:fn="args"
   */

  Vue.directive('deboundClick', {
    inserted: function inserted(el, binding, vnode) {
      function handleClick(e, args) {
        el.__deboundevent(function () {
          if (binding.expression) {
            var that = vnode.context;
            that[binding.arg](binding.value, e);
          }
        });
      }

      el.__vueDeboundClick = handleClick;
      el.__deboundevent = src_utils.deboundsEvent(2000);
      el.addEventListener('click', el.__vueDeboundClick, false);
    },
    unbind: function unbind(el, binding) {
      el.removeEventListener('click', el.__vueDeboundClick);
    }
  });
  /**
     * 設置高度為父節點高度
     * 使用 v-full-height="args"
     */

  Vue.directive('fullHeight', {
    inserted: function inserted(el, binding, vnode) {
      var $par = el.parentNode;

      if ($par) {
        var parHeight = $par.offsetHeight;
        console.log('fullHeight', parHeight);

        if (parHeight) {
          el.style.height = parHeight + 'px';
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      var $par = el.parentNode;

      if ($par) {
        var parHeight = $par.offsetHeight;
        console.log('fullHeightcomponentUpdated', parHeight);

        if (parHeight) {
          el.style.height = parHeight + 'px';
        }
      }
    },
    unbind: function unbind(el, binding) {}
  });
  /**
     * 設置高度為父節點高度
     * 使用 v-full-height="args"
     */

  Vue.directive('fullWinHeight', {
    inserted: function inserted(el, binding, vnode) {
      var $win = window;

      if ($win) {
        var parHeight = $win.innerHeight;
        var offsetParent = el.offsetParent;
        var parentTop = 0;
        var elOffetTop = el.offsetTop;

        if (offsetParent) {
          parentTop = offsetParent.offsetTop;
          elOffetTop += parentTop;
        }

        var fixedHeight = -15;
        console.log('fullHeight', parHeight, binding);

        if (binding.value) {
          fixedHeight = binding.value * 1;
        }

        if (parHeight) {
          el.style.height = parHeight * 1 - elOffetTop * 1 + fixedHeight + 'px';
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      var $win = window;

      if ($win) {
        var parHeight = $win.innerHeight;
        var offsetParent = el.offsetParent;
        var parentTop = 0;
        var elOffetTop = el.offsetTop;

        if (offsetParent) {
          parentTop = offsetParent.offsetTop;
          elOffetTop += parentTop;
        }

        var fixedHeight = -15;
        console.log('fullHeight', parHeight, binding);

        if (binding.value) {
          fixedHeight = binding.value * 1;
        }

        if (parHeight) {
          el.style.height = parHeight * 1 - elOffetTop * 1 + fixedHeight + 'px';
        }
      }
    },
    unbind: function unbind(el, binding) {}
  });
  /**
     * 根据权限是否显示
     * 使用 v-per-ctrl="pers"
     * pers  example: 'get-/user,get-/role,put-/user' 数组或字符串（,隔开）
     * __$permissions
     * regs  example: ^(GET|POST)-(/user|/users)$    数组
     */

  Vue.directive('perCtrl', {
    inserted: function inserted(el, binding, vnode) {
      var isShow = true;

      if (binding.value) {
        var pers = binding.value;

        if (typeof pers == 'string') {
          pers = pers.split(',');
        }

        isShow = src_utils.permissionSome(pers, vnode.__$permissions);
      }

      if (isShow == true) {
        el.style.display = 'inline-block';
      } else {
        el.style.display = 'none';
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      var isShow = true;

      if (binding.value) {
        var pers = binding.value;

        if (typeof pers == 'string') {
          pers = pers.split(',');
        }

        isShow = src_utils.permissionSome(pers, vnode.__$permissions);
      }

      if (isShow == true) {
        el.style.display = 'inline-block';
      } else {
        el.style.display = 'none';
      }
    },
    unbind: function unbind(el, binding) {}
  });
};

/* harmony default export */ var src_directives = (directives);
// EXTERNAL MODULE: external "vue-cookies"
var external_vue_cookies_ = __webpack_require__(6);
var external_vue_cookies_default = /*#__PURE__*/__webpack_require__.n(external_vue_cookies_);

// EXTERNAL MODULE: ./src/polyfill/index.js
var polyfill = __webpack_require__(56);

// CONCATENATED MODULE: ./src/token/index.js
function token_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function token_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function token_createClass(Constructor, protoProps, staticProps) { if (protoProps) token_defineProperties(Constructor.prototype, protoProps); if (staticProps) token_defineProperties(Constructor, staticProps); return Constructor; }




var token_errorCodeMsg = axios.errorCodeMsg;
var token_post = axios.post;

var token_RefreshToken = /*#__PURE__*/function () {
  function RefreshToken(opts) {
    token_classCallCheck(this, RefreshToken);

    this.tokenOpts = {
      refreshPrev: null,
      refreshNext: null,
      refreshCatch: null,
      refreshUrl: '',
      timeout: 3000000
    };
    this.context = null;
    this.timer = null;
    Object.assign(this.tokenOpts, opts);
  }

  token_createClass(RefreshToken, [{
    key: "setOptions",
    value: function setOptions(opts) {
      Object.assign(this.tokenOpts, opts);
    }
  }, {
    key: "runRefresh",
    value: function runRefresh(opts) {
      var _this = this;

      if (opts && opts.context) {
        this.context = opts.context;
      }

      if (!this.timer) {
        console.log('refreshToken', this);
        this.timer = setInterval(function () {
          _this.refresh_token();
        }, this.tokenOpts.timeout);
      }
    }
  }, {
    key: "stopRefreshToken",
    value: function stopRefreshToken() {
      clearInterval(this.timer);
      this.timer = null;
    }
  }, {
    key: "refresh_token",
    value: function refresh_token() {
      var _this2 = this;

      var rtoken = external_vue_cookies_default.a.get("refreshToken");
      var typ = localStorage.getItem("typ"); //const userlogin = sessionStorage.getItem("userlogin");

      if (!rtoken || !typ) return false;

      if (this.tokenOpts.refreshNext) {
        this.tokenOpts.refreshNext.call(this, response);
      }

      console.log('refreshToken', rtoken, typ);
      this.context && this.context.$post && this.context.$post(this.tokenOpts.refreshUrl, {}, {
        headers: {
          typ: typ,
          bw_token: rtoken
        }
      }, {
        noShowTips: true
      }).then(function (response) {
        var rcode = response.code;

        if (rcode == 200) {
          //生效token
          var accessToken = response.data.accessToken; //刷新token

          var refreshToken = response.data.refreshToken; //设置生效token

          external_vue_cookies_default.a.set("accessToken", accessToken, "1h");
          external_vue_cookies_default.a.set("TokenTime", true, "50MIN"); //设置刷新token

          console.log('refreshToken', refreshToken);
          external_vue_cookies_default.a.set("refreshToken", refreshToken, "2h");
        } else if (rcode == 401) {
          sessionStorage.removeItem("userlogin");
        }

        if (_this2.tokenOpts.refreshNext) {
          _this2.tokenOpts.refreshNext.call(_this2, response);
        }
      })["catch"](function (err) {
        console.log(err);
        sessionStorage.removeItem("userlogin");

        if (_this2.tokenOpts.refreshCatch) {
          _this2.tokenOpts.refreshCatch.call(_this2, err);
        }
      });
    }
  }]);

  return RefreshToken;
}();


var createRefreshToken = function createRefreshToken(opts) {
  return new token_RefreshToken(opts);
};
// EXTERNAL MODULE: external "vee-validate"
var external_vee_validate_ = __webpack_require__(5);
var external_vee_validate_default = /*#__PURE__*/__webpack_require__.n(external_vee_validate_);

// CONCATENATED MODULE: ./src/validate/config.js
//表单验证的i18n
var dictionary = {
  en: {
    messages: {
      required: function required() {
        return 'Required';
      },
      effective: function effective(field) {
        return 'Please enter valid text';
      },
      integer: function integer() {
        return 'Please enter valid integer';
      },
      address: function address() {
        return 'Please enter valid address';
      },
      max_value: function max_value(field, other) {
        return "Not greater than ".concat(other[0]);
      },
      min_value: function min_value(field, other) {
        return "Not less than ".concat(other[0]);
      }
    }
  },
  zh: {
    messages: {
      required: function required() {
        return '不能为空';
      },
      effective: function effective(field) {
        return '请输入中文，英文或数字';
      },
      integer: function integer() {
        return '请输入整数';
      },
      address: function address() {
        return '请输入正確地址';
      },
      max_value: function max_value(field, other) {
        return "\u4E0D\u80FD\u5927\u4E8E ".concat(other[0]);
      },
      min_value: function min_value(field, other) {
        return "\u4E0D\u80FD\u5C0F\u4E8E ".concat(other[0]);
      }
    }
  },
  'TW': {
    messages: {
      required: function required() {
        return '不能爲空';
      },
      effective: function effective(field) {
        return '請輸入中文，英文或數字';
      },
      integer: function integer() {
        return '請輸入整數';
      },
      address: function address() {
        return '請輸入正確地址';
      },
      max_value: function max_value(field, other) {
        return "\u4E0D\u80FD\u5927\u65BC ".concat(other[0]);
      },
      min_value: function min_value(field, other) {
        return "\u4E0D\u80FD\u5C0F\u65BC ".concat(other[0]);
      }
    }
  }
};
/* harmony default export */ var validate_config = (dictionary);
// CONCATENATED MODULE: ./src/validate/index.js




external_vee_validate_["Validator"].extend('address', {
  // getMessage: field => 'The ' + field + ' value is not truthy.',
  validate: function validate(value, target) {
    return /^[\u4e00-\u9fa5\w\s\_\.\-\(\)]+$/mg.test(value);
  }
});
external_vee_validate_["Validator"].extend('effective', {
  // getMessage: field => 'The ' + field + ' value is not truthy.',
  validate: function validate(value, target) {
    return /^[\u4e00-\u9fa5\w]+$/mg.test(value);
  }
});
var validate = {
  validate: null
}; //如果需要加载的模块需要引用VUE，则需要添加 install 方法进行加载

validate.install = function (Vue) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  //默认的配置
  var defaultConfig = external_jquery_default.a.extend(true, {}, validate_config);
  defaultConfig = external_jquery_default.a.extend(true, {}, defaultConfig, config);

  if (false) {}

  console.log(defaultConfig);

  if (defaultConfig.preUseHandler) {
    defaultConfig.preUseHandler(external_vee_validate_default.a, external_vee_validate_["Validator"], defaultConfig);
  }

  Vue.use(external_vee_validate_default.a, {
    i18nRootKey: 'validations',
    // customize the root path for validation messages.
    i18n: src_i18n.i18n,
    errorBagName: 'errorBags',
    // change if property conflicts.
    fieldsBagName: 'fieldBags',
    defaultConfig: defaultConfig
  });
  validate.VeeValidate = external_vee_validate_default.a;
  validate.Validator = external_vee_validate_["Validator"];
};

/* harmony default export */ var src_validate = (validate);
// CONCATENATED MODULE: ./src/mixins/common.js
function common_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function common_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { common_ownKeys(Object(source), true).forEach(function (key) { common_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { common_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function common_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var commonobj = {
  getImageUrl: function getImageUrl(value, url) {
    if (!url) {
      url = this.bw_imageHost + '/';
    } else if (url == 'BUFF') {
      url = 'data:image/jpeg;base64,';
    }

    if (value) {
      return url + value;
    } else {
      return value;
    }
  },
  temperatureToC: function temperatureToC(num) {
    return num + '°C';
  },
  parseTime: function parseTime(value) {
    if (value) {
      return value + "" && value.replace(/T/g, " ");
    } else {
      return '';
    }
  },
  checkStranger: function checkStranger(value) {
    return value === '0000-0000';
  }
};
var commonMixins = {
  data: function data() {
    return {
      bw_imageHost: ''
    };
  },
  methods: common_objectSpread(common_objectSpread({}, commonobj), {}, {
    findField: function findField(arr, name) {
      var _this = this;

      var res = null;

      if (arr && arr.length > 0) {
        arr.forEach(function (item) {
          if (item.field && item.field == name) {
            res = item;
            return false;
          } else {
            if (item.childrens && item.childrens.length > 0) {
              res = _this.findField(item.childrens, name);

              if (res) {
                return false;
              }
            }
          }
        });
      }

      return res;
    },
    getFieldInstance: function getFieldInstance(name) {
      var res = null;

      if (this.formConfigs && this.formConfigs.datas && this.formConfigs.datas.length > 0) {
        res = this.findField(this.formConfigs.datas, name);
      }

      return res;
    },
    dataURLtoBlob: function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], {
        type: mime
      });
    },
    //将blob转换为file
    blobToFile: function blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },
    exportData: function exportData(url, opts) {
      var _this2 = this;

      this.$axios({
        // 用axios发送请求
        method: 'get',
        url: url,
        // 请求地址
        data: opts.data,
        // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型

      }).then(function (res) {
        // 处理返回的文件流
        if (opts && opts.filterData) {
          res = opts.filterData(res);
        }

        var blob = _this2.dataURLtoBlob(res);

        var fileName = opts.fileName;

        if ('download' in document.createElement('a')) {
          // 非IE下载
          var elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象

          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    getRandomId: function getRandomId() {
      return (Math.random() * 100000 >> 0).toString(16) + (Math.random() * 100000 >> 0).toString(16) + (Math.random() * 100000 >> 0).toString(16);
    },
    changeGender: function changeGender(value) {
      var res = value;

      if (value) {
        if (this.$t) {
          res = value == 1 ? this.$t('formPlaceHolder.male') : this.$t('formPlaceHolder.female');
        } else {
          res = value;
        }
      }

      return res;
    },
    changeLang: function changeLang(lang) {
      console.log(lang);
      localStorage.setItem('currentLang', lang);
      this.$i18n && lang && (this.$i18n.locale = lang);

      if (this.$root && this.$root.Bus) {
        this.$root.Bus.$emit('i18nChangeLang', {
          locale: lang,
          i18n: this.$i18n
        });
      }
    },
    //i18n转换方法
    translater: function translater(value, opts) {
      if (!value) return '';
      var res = '',
          transer = this.$t;

      if (opts && opts.filterPre) {
        value = opts.filterPre.call(this, value);
      }

      if (opts && opts.transer) {
        transer = opts.transer;
      }

      if (transer) {
        var msg = transer.call(this, value);

        if (msg) {
          res = msg;
        } else {
          res = value;
        }
      }

      if (opts && opts.filterEnd) {
        res = opts.filterEnd.call(this, value);
      }

      return res;
    }
  }),
  filters: common_objectSpread(common_objectSpread({}, commonobj), {}, {
    //i18n转换方法
    translater: function translater(value, context, opts) {
      if (!value) return '';
      var res = '',
          transer = context.$t;

      if (opts && opts.filterPre) {
        value = opts.filterPre.call(this, value);
      }

      if (opts && opts.transer) {
        transer = opts.transer;
      }

      if (transer) {
        var msg = transer.call(context, value);

        if (msg) {
          res = msg;
        } else {
          res = value;
        }
      }

      if (opts && opts.filterEnd) {
        res = opts.filterEnd.call(this, value);
      }

      return res;
    }
  })
};
// CONCATENATED MODULE: ./src/mixins/index.js
function mixins_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function mixins_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { mixins_ownKeys(Object(source), true).forEach(function (key) { mixins_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { mixins_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function mixins_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var mixins = external_jquery_default.a.extend(true, {}, commonMixins, mixins_tablehandler); //console.log(commonMixins);
//console.log(tablemix)

/* harmony default export */ var src_mixins = (mixins_objectSpread({}, mixins));
// CONCATENATED MODULE: ./src/index.js
function src_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function src_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { src_ownKeys(Object(source), true).forEach(function (key) { src_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { src_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function src_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }













var pkg = __webpack_require__(57); //console.log(components)

/**
 *  加载需要的模块
 * ['i18n','filters'] 需要加载的模块，如果是对象,格式为{modulename:'',config:''}, modulename为模块名字，config为需要自定义的配置信息
 *  @param bwmodules <string|object>:{modulename:'',config:{}}
 * Vue instance
 *  @param Vue 
 * */


var src_install = function install(bwmodules, Vue, config) {
  var realModules = [];
  config = config || {};

  if (bwmodules) {
    bwmodules.forEach(function (item) {
      var modulename = '';

      if (typeof item === 'string') {
        modulename = item;
      } else {
        modulename = item.modulename;

        if (item.config) {
          config = Object.assign(config, item.config);
        }
      }

      var _module = getModule(modulename); //获取对应模块


      if (!_module) throw new Error('not found module: ' + modulename);
      var defaultInstaller = _module.install; //加载需要的模块 install方法有两个参数 (Vue,config={})

      if (!defaultInstaller) {
        realModules[modulename] = _module; //不需要引用VUE的模块不需要 install 方法
      } else {
        realModules[modulename] = defaultInstaller(Vue, config);
      }
    });
  } else {
    bwmodules = Object.keys(modulesModel);
    bwmodules.forEach(function (item) {
      var modulename = '';

      if (typeof item === 'string') {
        modulename = item;
      } else {
        modulename = item.modulename;
      }

      var tempconfig = {};

      if (config[modulename]) {
        tempconfig = external_jquery_default.a.extend(true, {}, config);
        tempconfig = external_jquery_default.a.extend(true, {}, tempconfig, config[modulename]);
      }

      var _module = getModule(modulename); //获取对应模块


      if (!_module) {
        console.log('not found module: ' + modulename);
        return true;
      }

      var defaultInstaller = _module.install; //加载需要的模块 install方法有两个参数 (Vue,config={})

      if (!defaultInstaller) {
        realModules[modulename] = _module; //不需要引用VUE的模块不需要 install 方法
      } else {
        realModules[modulename] = defaultInstaller(Vue, tempconfig);
      }
    });
  }

  return realModules;
};

var getModule = function getModule(name) {
  return modulesModel[name];
}; //可供加载的模块


var modulesModel = src_objectSpread({
  filters: filters,
  utils: src_utils,
  axiosConfig: axios,
  bwAxios: axios,
  tokenService: token_RefreshToken,
  directives: src_directives,
  mixins: src_mixins,
  // DataList,
  i18n: src_i18n,
  Message: src_Message,
  components: components
}, components);

var bwFilters = filters;
var bwUtils = src_utils;
var bwAxios = axios;
var bwTokenService = token_RefreshToken;
var bwI18n = src_i18n;
var bwMessage = src_Message;
/* harmony default export */ var src = __webpack_exports__["default"] = (src_objectSpread(src_objectSpread({}, modulesModel), {}, {
  version: pkg.version,
  install: src_install
}));
/* Automatically generated by './build/bin/build-entry.js' */
// import Pagination from '../packages/pagination/index.js';
// import Dialog from '../packages/dialog/index.js';
// import Notification from '../packages/notification/index.js';
// import Loading from '../packages/loading/index.js';
// import InfiniteScroll from '../packages/infinite-scroll/index.js';
// import locale from 'element-ui/src/locale';
// import CollapseTransition from 'element-ui/src/transitions/collapse-transition';
// const components = [
//   Pagination,
//   Dialog
// ];
// const install = function(Vue, opts = {}) {
//   locale.use(opts.locale);
//   locale.i18n(opts.i18n);
//   components.forEach(component => {
//     Vue.component(component.name, component);
//   });
//   Vue.use(InfiniteScroll);
//   Vue.use(Loading.directive);
//   Vue.prototype.$ELEMENT = {
//     size: opts.size || '',
//     zIndex: opts.zIndex || 2000
//   };
//   Vue.prototype.$loading = Loading.service;
//   Vue.prototype.$msgbox = MessageBox;
//   Vue.prototype.$alert = MessageBox.alert;
//   Vue.prototype.$confirm = MessageBox.confirm;
//   Vue.prototype.$prompt = MessageBox.prompt;
//   Vue.prototype.$notify = Notification;
//   Vue.prototype.$message = Message;
// };
// /* istanbul ignore if */
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
// export default {
//   version: '2.13.1',
//   locale: locale.use,
//   i18n: locale.i18n,
//   install,
//   CollapseTransition,
//   Loading
// };

/***/ })
/******/ ])["default"];