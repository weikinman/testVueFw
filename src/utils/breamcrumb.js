export default class BWBreadCrumb {
    constructor(name){
        this.name = name || (Math.random()*1000000).toString(16);
        this.datas = []
    }
    
}