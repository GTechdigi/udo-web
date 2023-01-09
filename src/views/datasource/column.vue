<template>
  <div >
    <aside>
      <el-breadcrumb separator="/" style="padding: 10px 0">
        <el-breadcrumb-item :to="{ path: '/datasource' }">数据源管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/datasource' }">{{ queryParams.source_type }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ source_name }}</el-breadcrumb-item>
        <el-breadcrumb-item>【{{ table_name }}】表字段列表</el-breadcrumb-item>
      </el-breadcrumb>
    </aside>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.source_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列名" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.field_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.field_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认值" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.default_value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可为空" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_null }}</span>
        </template>
      </el-table-column>
      <el-table-column label="键" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.primary_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段描述" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.field_describe }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { queryField } from '@/api/datasource'
export default {
  name: 'Column',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [{ }],
      listLoading: true,
      source_name: this.$route.query.source_name,
      table_name: this.$route.query.table_name,
      queryParams: {
        source_type: this.$route.query.source_type,
        table_code: this.$route.query.table_code
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.queryParams.source_type && this.queryParams.table_code) {
        this.listLoading = true
        queryField(this.queryParams).then(res => {
          this.list = res.data
          this.list.forEach(function(x, index) {
            x.table_name = this.table_name
          })
        })
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>
