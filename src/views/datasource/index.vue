<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTab">
      <el-tab-pane v-for="item in dbTypes" :key="item.key" :label="item.label" :name="item.key">
        <div class="filter-container">
          <el-button class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
        </div>
        <el-row :gutter="20">
          <el-col v-for="dbItem in dbList" :key="dbItem.source_name" style="min-width: 250px; " :span="4">
            <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
              <div>
                <span><i class="el-icon-coin" style="float: right; height: 20px; margin-bottom: 5px" /></span>
              </div>
              <div style="height:60px; vertical-align: middle; cursor:pointer;" class="text-center clearfix" @click="jumpTable(dbItem)">
                <h3>{{ dbItem.source_name }}</h3>
                <h4>{{ dbItem.db_name }}</h4>
              </div>
              <div>
                <span><i class="el-icon-refresh" style="float: right; height: 20px; margin-bottom: 5px; cursor:pointer;" @click="refreshDb(dbItem)" /></span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="新增数据源" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :rules="rules" :model="formData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="数据源类型" prop="source_type" :rules="[rules.required]">
          <el-select v-model="formData.source_type" class="filter-item" placeholder="请选择" disabled>
            <el-option v-for="item in dbTypes" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义名称" prop="source_name" :rules="[rules.required]">
          <el-input v-model="formData.source_name" placeholder="自定义名称，仅用于显示" />
        </el-form-item>
        <el-form-item label="主机地址" prop="host" :rules="[rules.required]">
          <el-input v-model="formData.host" />
        </el-form-item>
        <el-form-item label="主机端口" prop="port" :rules="[rules.required]">
          <el-input v-model="formData.port" />
        </el-form-item>
        <el-form-item v-if="formData.source_type !== 'es'" label="数据库名" prop="db_name" :rules="[rules.required]">
          <el-input v-model="formData.db_name" placeholder="请输入数据库名" />
        </el-form-item>
        <el-form-item label="用户名" prop="user" :rules="[rules.required]">
          <el-input v-model="formData.user" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[rules.required]">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="testConnection">测试连接</el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="createData">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDatabases, addDatasource, testConnect, refresh } from '@/api/datasource'

export default {
  name: 'Datasource',
  data() {
    this.rules = {
      required: { required: true, message: '必填项', trigger: 'change' }
    }

    this.dbTypes = [
      { label: 'Mysql', key: 'mysql' },
      { label: 'Hive', key: 'hive' },
      { label: 'ClickHouse', key: 'clickhouse' },
      { label: 'ES', key: 'es' }
    ]

    return {
      activeName: 'mysql',
      dbList: [],
      dialogFormVisible: false,
      formData: {
        host: '',
        port: null,
        user: '',
        db_name: '',
        source_name: '',
        source_type: '',
        password: ''
      }
    }
  },
  created() {
    this.queryDatabase(this.activeName)
  },
  methods: {
    queryDatabase(type) {
      queryDatabases({ source_type: type }).then(res => {
        this.dbList = res.data
      })
    },

    handleTab(tab) {
      this.queryDatabase(this.dbTypes[tab.index].key)
    },

    handleCreate() {
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.$set(this.formData, 'source_type', this.activeName)
      })
    },

    createData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addDatasource(this.formData).then(() => {
            this.queryDatabase(this.formData.source_type)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success'
            })
          })

          this.queryDatabase(this.activeName)
        }
      })
    },

    testConnection() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          testConnect(this.formData).then(() => {
            this.$notify({
              title: '成功',
              message: '测试连接成功',
              type: 'success'
            })
          })
        }
      })
    },

    jumpTable(item) {
      this.$router.push({ path: '/datasource/table', query: item })
    },

    refreshDb(item) {
      refresh({ db_code: item.db_code }).then(res => {
        this.$notify({
          title: '成功',
          message: '刷新 ' + item.source_name + ' 成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
