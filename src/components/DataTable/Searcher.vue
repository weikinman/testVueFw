<template>
    <div>
       <div class="search-item">
          <h1 class="table-title">Report</h1>
          <!-- <div class="searchBox"> -->
          <el-input placeholder="Search" v-model="Reportquery" class="searchClass">
            <el-button slot="append" icon="el-icon-search" @click="handleList"></el-button>
          </el-input>
          <!-- <el-input
            placeholder="Report Number"
            v-model="ReportNumber"
            class="searchClass"
            style="padding-left:15px;"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleList"></el-button>
          </el-input>-->
          <el-select
            v-model="CustomerValue"
            placeholder="Customer Name"
            style="width:180px;padding-left:15px;"
          >
            <el-option
              v-for="item in Customeroptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="ReportType"
            placeholder="Report Type"
            style="width:180px;padding-left:15px;"
          >
            <el-option
              v-for="item in reportTypeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" class="new-customer" @click="Newreport">New Report</el-button>
          <!-- </div> -->
        </div>
    </div>
</template>

<script>

export default {
    name: "Searcher",
    inject:['columnConfig'],
    data() {
        return {

        }
    },
    created () {
        console.log(this.columnConfig);
    }
}
</script>
<style scoped>

</style>