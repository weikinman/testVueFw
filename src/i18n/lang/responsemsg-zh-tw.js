module.exports = {
    responseMsg:{
        "${200.wf.instance.start.success}":"流程实例开始成功",
        "${200.wf.task.commit.success}":"任务提交成功",
        "${401.token.required}":"令牌不能為空",
        "${401.token.expired}":"令牌已過期",
        "${401.token.type.required}":"令牌類型不能為空",
        "${401.token.type.error}":"令牌類型錯誤",
        "${401.account.authen.failure}":"用戶驗證失敗",
        "${401.client.id.required}":"client_id不能為空",
        "${401.client.secret.required}":"client_secret不能為空",
        "${401.param.long.type.error}":"數據太大",
        "${403.Authority.failure}":"驗證錯誤",
        "${403.access.refuse}":"Access refuse",
        "${404.channel.closed}":"Message can not send, Micro-server channel is closed",
        "${404.channel.timeout}":"Connecting Micro-server channel is timeout",
        "${504.server.busy}":"服务繁忙",//服务繁忙
        "${400.file.type.error}":"文件類型錯誤", //文件類型錯誤
        "${400.file.type.must.be.zip}":"壓縮文件類型必須是ZIP", //壓縮文件類型必須是ZIP
        "${400.file.format.type.must.be}":"圖片類型必須是 (.png/.jpg/.jpeg/.bmp/.tif)", //圖片類型必須是：（.png/.jpg/.jpeg/.bmp/.tif）
        "${400.file.not.exist}":"文件不能爲空",//文件不能爲空
        "${400.file.upload.unknown.error}":"上傳文件未知錯誤",//上傳文件未知錯誤
        "${400.account.type.error}":"帐户类型错误",//帐户类型错误
        "${400.version.lock.error}":"记录被其他人修改",//记录被其他人修改
        "${400.tcc.confirm.process.failure}":"确认后处理失败",//确认后处理失败
        "${400.tcc.cancel.process.failure}":"取消后处理失败",//取消后处理失败
        "${400.record.not.present}":"记录不存在",//记录不存在
        "${400.owner.not.present}":"所有者不存在",//所有者不存在
        "${400.wf.task.create.failure}":"无法新增任何任务",//无法新增任何任务
        "${400.wf.instance.closed.error}":"實例已關閉",
        "${400.wf.instance.start.failure}":"開啟實例失敗",
        "${400.wf.instance.not.closed.error}":"實例無法正常關閉",
        "${400.public.id.empty}":"参数ID不能为空",//参数ID不能为空
        "${400.adm.user.not.exist}":"用户不存在",//用户不存在
        "${400.adm.user.exist}":"用户已存在!",//用户已存在
        "${400.devi.device.not.exist}":"该设备不存在",//该设备不存在
        "${400.devi.device.temporary.name.exist}":"设备的临时名称已存在",//设备的临时名称已存在
        "${400.devi.device.username.and.camera.ip.exist}":"该摄像机工作模式的用户名已存在",//该摄像机工作模式的用户名已存在
        "${400.devi.device.username.and.nebula.ip.exist}":"该星云IP的用户名已存在",//该星云IP的用户名已存在
        "${400.devi.device.group.not.exist}":"该组别不存在",//该组别不存在
        "${400.devi.device.group.exist}":"该组别已存在",//该组别已存在
        "${400.devi.device.relationship.not.exist}":"当前两设备的关系已存在",//当前两设备的关系已存在
        "${400.param.date.time.type.error}":"时间格式错误",//时间格式错误
        "${400.lib.library.exist}":"人脸库已存在",//人脸库已存在
        "${400.lib.library.not.exist}":"人脸库不存在",//人脸库不存在
        "${400.lib.image.person.not.exist}":"图片的人物信息不存在",//图片的人物信息不存在
        "${400.lib.image.not.exist}":"人脸图片不存在",//人脸图片不存在
        "${400.lib.image.upload.fail}":"上传失败",//上传失败
        "${400.lib.image.not.face.detected}":"未发现人脸",//未发现人脸
        "${400.lib.image.too.low}":"人臉圖片品質過低",//人臉圖片品質過低
        "${400.lib.image.incorrect.or.broken}":"圖片格式不正確或圖片破損",//圖片格式不正確或圖片破損
        "${400.param.input.error}}":"參數輸入錯誤",//參數輸入錯誤
        "${400.msg.id.error}":"msg_id 错误",//msg_id 错误
        "${400.system.internal.error}":"nebula设备错误", //nebula设备错误
        "${400.alarm.record.not.exist}":"告警记录不存在", //告警记录不存在
        "${400.alarm.record.is.empty}":"查询的告警记录为空"//查询的告警记录为空
    }
}