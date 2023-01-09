<template>
  <div>
    <aside>
      <el-breadcrumb separator="/" style="padding: 10px 0">
        <el-breadcrumb-item :to="{ path: '/datasource' }">数据源管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/datasource' }">{{ queryParams.source_type }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ source_name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </aside>
    <el-row :gutter="20" style="margin: 20px 0">
      <el-col v-for="(tableItem,idx) in tableList" :key="idx" :span="6">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
          <div style="height:25px; vertical-align: middle; cursor:pointer;" class="clearfix" @click="jumpColumn(tableItem)">
            <span><svg-icon icon-class="table" /> {{ tableItem.table_name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryTables } from '@/api/datasource'
export default {
  name: 'Table',
  data() {
    return {
      queryParams: {
        source_type: this.$route.query.source_type,
        db_code: this.$route.query.db_code
      },
      source_name: this.$route.query.source_name,
      tableList: null
    }
  },
  created() {
    this.queryTableList()
  },
  methods: {
    queryTableList() {
      if (this.queryParams.db_code && this.queryParams.source_type) {
        queryTables(this.queryParams).then(res => {
          this.tableList = res.data
        })
      }
    },
    jumpColumn(item) {
      item.source_name = this.source_name
      this.$router.push({ path: '/datasource/column', query: item })
    }
  }
}
</script>

<style scoped>
.hove_color{
  color: #1890ff;
}
.box-card:hover{
  color: #1890ff;
}
</style>
