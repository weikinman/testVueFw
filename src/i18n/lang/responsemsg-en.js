module.exports = {
    responseMsg:{
        "${200.wf.instance.start.success}":"The instance start success",
        "${200.wf.task.commit.success}":"The task commit successfully",
        
        "${401.token.required}":"Token is required",
        "${401.token.expired}":"Token is expired",
        "${401.token.type.required}":"Token type is required",
        "${401.token.type.error}":"Token transational type error",
        "${401.account.authen.failure}":"Account authentication failure",
        "${401.client.id.required}":"client_id is required",
        "${401.client.secret.required}":"client_secret is required",
        "${401.param.long.type.error}":"Parameter data type error",

        "${403.Authority.failure}":"Authority failure",
        "${403.access.refuse}":"Access refuse",

        "${404.channel.closed}":"Message can not send, Micro-server channel is closed",
        "${404.channel.timeout}":"Connecting Micro-server channel is timeout",

        "${504.server.busy}":"Server busy",
        
        "${400.file.type.error}":"Wrong file type",
        "${400.file.type.must.be.zip}":"The compressed file type must be zip",
        "${400.file.format.type.must.be}":"The file format in the compressed file must be (.png/.jpg/.jpeg/.bmp/.tif)",
        "${400.file.not.exist}":"File cannot be empty",
        "${400.file.upload.unknown.error}":"Unknown mistake",
        "${400.account.type.error}":"Account type error",
        "${400.version.lock.error}":"The record is modify by other person",
        "${400.tcc.confirm.process.failure}":"Process failure after confirm",
        "${400.tcc.cancel.process.failure}":"Process failure after cancel",
        "${400.record.not.present}":"The record is not present",
        "${400.owner.not.present}":"The owner is not present",
        "${400.wf.task.create.failure}":"Cannot new any tasks",
        "${400.wf.instance.closed.error}":"The instance has been closed",
        "${400.wf.instance.start.failure}":"Start instance failure",
        "${400.wf.instance.not.closed.error}":"This owner has a instance that is not finished",
        "${400.public.id.empty}":"Param id cannot null",
        "${400.adm.user.not.exist}":"User does not exists",
        "${400.adm.user.exist}":"User already exists!",
        "${400.devi.device.not.exist}":"The device does not exists",
        "${400.devi.device.temporary.name.exist}":"The temporary name of the device already exists",
        "${400.devi.device.username.and.camera.ip.exist}":"The username for this camera IP already exists",
        "${400.devi.device.username.and.nebula.ip.exist}":"The username for this nebula IP already exists",
        "${400.devi.device.group.not.exist}":"The group does not exists",
        "${400.devi.device.group.exist}":"The group already exists",
        "${400.devi.device.relationship.not.exist}":"The relationship device does not exist",
        "${400.param.date.time.type.error}":"Time format error ",
        "${400.lib.library.exist}":"The face library already exist",
        "${400.lib.library.not.exist}":"The face library does not exist",
        "${400.lib.image.person.not.exist}":"The id of person does not exist",
        "${400.lib.image.not.exist}":"The image does not exist",
        "${400.lib.image.upload.fail}":"File upload failed",
        "${400.lib.image.not.face.detected}":"No face detected ",
        "${400.lib.image.too.low}":"The face image quality is too low ",
        "${400.lib.image.incorrect.or.broken}":"Incorrect image format or broken image",
        "${400.param.input.error}":"Parameter input error",
        "${400.msg.id.error}":"'msg_id' error",
        "${400.system.internal.error}":"System internal error ",
        "${400.alarm.record.not.exist}":"The record of alarm does not exists",
        "${400.alarm.record.is.empty}":"The query alarm record is empty"
    }
}