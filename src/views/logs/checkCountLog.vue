<template>
  <div class="block">
    <el-tabs tab-position="top" style="height: 200px">
      <div class="env">
        <!-- <div class="search-box">
          <el-input
            v-model="input"
            placeholder="请输入名称"
            prefix-icon="el-icon-search"
            style="”width: 200px”"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="findAll"
          >搜索</el-button>
        </div> -->
        <div class="ctable">
          <el-table :data="list" border style="width: 100%" height="585" :row-class-name="tableRowClassName">
            <el-table-column
              prop="rule_name"
              label="规则名称"
              width="150"
            />
            <el-table-column
              prop="rule_type"
              label="规则类型"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="check_value"
              label="原表结果值"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="contrast_value"
              label="对比表结果值"
              width="200"
            />
            <el-table-column
              label="执行结果"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.original_and_comparison=='1'" style="color:#01DF3A">成功</span>
                <span v-else style="color:red">失败</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="执行时间"
              width="200"
            />
            <el-table-column label="操作">
              <!-- <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="small"
                />
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="small"
                  @click="deleteRule(scope.row.alarm_id)"
                />
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />
    </el-tabs>
  </div>
</template>

<script>
import { queryLogList } from '@/api/logs'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      datas: [],
      list: [],
      queryParams: { rule_type: 'check_count', page_num: 1, page_size: 10, rule_code: this.$route.query.rule_code }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      queryLogList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.original_and_comparison === '1') {
        return 'success-row'
      } else if (row.original_and_comparison === '0') {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>
<style >
/* .block .daterange,.env,.cname{
  display: inline
  margin-right: 50px
} */
.block {
  margin-left: 20px
}
.env > div > div {
  margin-right: 50px
}
.env .search-box .el-button--primary {
  float: right
  margin-right 100px
}
.env .el-input {
  width: 230px
}

.ctable {
  margin: 10px 0 30px 0
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

