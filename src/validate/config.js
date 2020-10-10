//表单验证的i18n
const dictionary = {
    en: {
      messages:{
        required: () => 'Required',
        effective:(field)=>{return 'Please enter valid text';},
        integer:()=>'Please enter valid integer',
        address:()=>'Please enter valid address',
        max_value:(field,other)=>`Not greater than ${other[0]}`,
        min_value:(field,other)=>`Not less than ${other[0]}`
      }
    },
    zh: {
      messages: {
        required:() => '不能为空',
        effective:(field)=>{return '请输入中文，英文或数字';},
        integer:()=>'请输入整数',
        address:()=>'请输入正確地址',
        max_value:(field,other)=>`不能大于 ${other[0]}`,
        min_value:(field,other)=>`不能小于 ${other[0]}`
      }
    },
    'TW': {
      messages: {
        required:() => '不能爲空',
        effective:(field)=>{return '請輸入中文，英文或數字';},
        integer:()=>'請輸入整數',
        address:()=>'請輸入正確地址',
        max_value:(field,other)=>`不能大於 ${other[0]}`,
        min_value:(field,other)=>`不能小於 ${other[0]}`
      }
    }
  }
  export default dictionary