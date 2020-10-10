import ElementUI from 'element-ui';
const Message = ElementUI.Message;
// 为了实现Class的私有属性
/** 
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
let messageOptions = {
  maxCount:2
}
const showMessage = Symbol('showMessage')
class DonMessage {
  success (options, single = 2) {
    this[showMessage]('success', options, single)
  }
  warning (options, single = 2) {
    this[showMessage]('warning', options, single)
  }
  info (options, single = 2) {
    this[showMessage]('info', options, single)
  }
  error (options, single = 2) {
    this[showMessage]('error', options, single)
  }
  Message(options, single = 2){
      this[showMessage](options.type,options,single);
  }
  [showMessage] (type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length <=(single-1)) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}
export const BwMessage = new DonMessage();
export const msgOptions = {
    duration:3000
}
export const errorMsg = function (msg, type, time,single) {
    BwMessage.Message({
        message: msg || '',
        type: type || 'warning',
        showClose: true,
        duration: time||msgOptions.duration,
    },single);
}

export const successMsg = function (msg, type, time,single) {
    BwMessage.Message({
        message: msg || '',
        type: type || 'success',
        showClose: true,
        duration: time|msgOptions.duration,
    },single);
}

export default {
    errorMsg,
    successMsg,
    msgOptions,
    BwMessage,
    DonMessage
}