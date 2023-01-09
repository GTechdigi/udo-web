<template>
  <div >
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="用户名" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="bindProjectDisplay(row.username)">
            项目
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />

    <el-dialog title="绑定项目" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="margin:0 50px;">
        <el-form-item label="项目名称：" prop="type">
          <el-select v-model="temp.project_code" class="filter-item" placeholder="选择项目" clearable filterable>
            <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_name" :value="item.project_code" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addUserToProject">
            添加
          </el-button>
        </el-form-item>
        <el-table
          :data="projectUserList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="项目名称" align="center" min-width="150">
            <template slot-scope="{row}">
              <span>{{ row.project_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150">
            <template slot-scope="{row}">
              <el-button v-waves class="filter-item" type="danger" icon="el-icon-delete" @click="deleteUserFromProject(row.project_code)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="dialogUserFormVisible">
      <el-form ref="dataUserForm" :model="user_add_body" :rules="rules" label-position="left" label-width="90px" style="margin:0 50px;">
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="user_add_body.username"
            placeholder="请输入用户名"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="user_add_body.password"
            placeholder="请输入密码"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="姓：" prop="last_name">
          <el-input
            v-model="user_add_body.last_name"
            placeholder="请输入姓"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="名：" prop="first_name">
          <el-input
            v-model="user_add_body.first_name"
            placeholder="请输入名"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input
            v-model="user_add_body.email"
            placeholder="请输入邮箱"
            style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUser">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="dialogUserFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, addUser, queryList } from '@/api/user'
import { addProjectUser, deleteProjectUser, projectUserList, queryProject } from '@/api/project'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
export default {
  name: 'Datamonitor',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      queryParams: { project_name: null, page_num: 1, page_size: 10, project_description: null },
      list: [],
      total: 0,
      projectUserList: [],
      temp: {
        username: null,
        project_code: null
      },
      dialogFormVisible: false,
      dialogUserFormVisible: false,
      projectList: [],
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }],
        last_name: [{ required: true, message: '姓不能为空', trigger: 'blur' }],
        first_name: [{ required: true, message: '名不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }]
      },
      user_add_body: {}
    }
  },
  created() {
    this.getList()
    this.queryProjectList()
  },
  methods: {
    getList() {
      queryList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    queryProjectList() {
      queryProject().then(res => {
        this.projectList = res.data.list
      })
    },
    handleFilter() {
      this.list = null
      this.queryParams.page_num = 1
      this.getList()
    },
    viewUser(username) {
      getUser(this.username).then((res) => {
        this.request_body = res.data
      })
    },
    handleCreate() {
      this.dialogUserFormVisible = true
    },
    addUser() {
      this.$refs['dataUserForm'].validate(async(valid) => {
        if (valid) {
          addUser(this.user_add_body).then(res => {
            this.$notify({
              title: '成功',
              message: '添加用户成功',
              type: 'success'
            })
            this.getList()
            this.user_add_body = {}
            this.dialogUserFormVisible = false
          })
        }
      })
    },
    bindProjectDisplay(username) {
      this.temp.username = username
      this.dialogFormVisible = true
      this.queryProjectUserList()
    },
    queryProjectUserList() {
      this.projectUserList = []
      projectUserList({ 'username': this.temp.username, 'page_size': 1000 }).then(res => {
        this.projectUserList = [...res.data.list]
      })
    },
    addUserToProject() {
      if (this.temp.project_code) {
        addProjectUser(this.temp).then(res => {
          this.$notify({
            title: '成功',
            message: '添加项目成功',
            type: 'success'
          })
          this.queryProjectUserList()
          this.temp.project_code = null
        })
      }
    },
    deleteUserFromProject(project_code) {
      deleteProjectUser({ 'project_code': project_code, 'username': this.temp.username }).then(res => {
        this.$notify({
          title: '成功',
          message: '删除项目成功',
          type: 'success'
        })
        this.queryProjectUserList()
      })
    }
  }
}
</script>
<style scoped>
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
.pagetitle > p {
  margin-top: 0
  font-size 20px
  padding-bottom 10px
  border-bottom-style solid
  border-width 1px
  border-color rgba(151, 151, 151, 0.3)
}
.pagetitle {
  margin-bottom: 10px
}

.ctable {
  margin-top: 10px
}
.Pagination {
  padding: 10px
}
</style>

