import _ from 'lodash'
const defaultConfig = {

}
class FwConfig{
    constructor(opts){
        this.config = {};
        this.axiosConfig = {
            baseUrl:''
        }
    }
    setConfig(configs){
        this.config = _.cloneDeep(configs);
    }
}

export default FwConfig