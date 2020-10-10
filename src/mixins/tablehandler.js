/**
 * 帶分頁列表頁面控制mixin
 * 必須自定義一個 handleList的方法
 */
const tablehandler = {
    data () {
        return {
            tableDatas:[],//當前列表頁存放列表數據，在handleList中賦值即可在
            pageinfo:{
                pageNum: 1, //查询第几页
                currentPage: 1, //页码对应值
                total: 0, //总页数
                pageSize: 10, //显示条数
                pageSizes:[10,20,50,100]
            },
            multipleSelection: [] //存放选中那些记录
        }
    },
    methods: {
        seacherHander(){
            this.pageinfo.pageNum=1;
            this.pageinfo.currentPage=1;
            this.handleList();
        },
        //选中记录触发
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(page){
            this.pageinfo.pageNum = page;
            if(this.tableInfo && this.tableInfo.handleCurrentChange){
                this.tableInfo.handleCurrentChange.call(this,this,page);
            }
            let tableInfoCache = localStorage.getItem(this.$route.name);
            let tableInfoObj = null
            if(tableInfoCache){
                tableInfoObj = JSON.parse(tableInfoCache);
            
            }else{
                tableInfoObj= {};
            }
            tableInfoObj.pageinfo = this.pageinfo;
            localStorage.setItem(this.$route.name,JSON.stringify(tableInfoObj));
            this.handleList();
        },
        //改变每页多少条
        handleSizeChange(val) {
            sessionStorage.setItem("ContpageSize", val);
            this.pageinfo.pageSize = val;
            this.pageinfo.pageNum = 1;
            this.pageinfo.currentPage = 1;
            this.handleList();
            // console.log(`每页 ${val} 条`);
        },
        //删除数据
        handledelete(row) {
            let txt = "是否确认删除该记录?";
            let typetxt = "error";
            this.$confirm(txt, "提示", {
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                type: typetxt
            })
            .then(() => {
                this.delbwForm(row);
            })
            .catch(() => {});
        }
        
    }
    
}
export default  tablehandler