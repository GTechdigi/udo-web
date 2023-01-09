<template>
  <div >
    <div class="filter-container">
      <el-input v-model="queryParams.project_name" placeholder="项目名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="getList" />
      <el-input v-model="queryParams.project_description" placeholder="项目描述" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">
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
      <el-table-column label="项目名称" min-width="150">
        <template slot-scope="{row}">
          <router-link :to="{path:'/project/add', query: {project_code:row.project_code}}"><span>{{ row.project_name }}</span></router-link>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <router-link :to="{path:'/project/add', query: {project_code:row.project_code}}">{{ row.project_description }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="企微机器人" min-width="230">
        <template slot-scope="{row}">
          <span>{{ row.we_work_robot }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="100">
        <template slot-scope="{row}">
          {{ row.create_user }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" min-width="100">
        <template slot-scope="{row}">
          {{ row.update_user }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="160">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" min-width="230" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="bindUserDisplay(row.project_code)">
            用戶
          </el-button>
          <el-button type="primary" size="mini" @click="viewProject(row.project_code)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @onConfirm="deleteProject(row.project_code)"
          >
            <el-button type="danger" slot="reference" size="mini">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page_num" :limit.sync="queryParams.page_size" @pagination="getList" />

    <el-dialog title="绑定用户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="margin:0 50px;">
        <el-form-item label="用户名：" prop="type">
          <el-select v-model="temp.username" class="filter-item" placeholder="选择用户" clearable filterable>
            <el-option v-for="item in userList" :key="item.username" :label="item.username" :value="item.username" />
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
          <el-table-column label="用户名" align="center" min-width="150">
            <template slot-scope="{row}">
              <span>{{ row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150">
            <template slot-scope="{row}">
              <el-button v-waves class="filter-item" type="danger" icon="el-icon-delete" @click="deleteUserFromProject(row.username)">
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
  </div>
</template>

<script>
import { queryProject, deleteProject, projectUserList, addProjectUser, deleteProjectUser} from '@/api/project'
import { queryList } from '@/api/user'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'Datamonitor',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogFormVisible: false,
      queryParams: { project_name: null, page_num: 1, page_size: 10, project_description: null },
      list: [],
      userList: [],
      projectUserList: [],
      temp: {
        username: null,
        project_code: null
      },
      total: 0
    }
  },
  created() {
    this.getList()
    this.queryUserList()
  },
  methods: {
    getList() {
      queryProject(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    queryUserList() {
      queryList({ 'page_num': 1, 'page_size': 100 }).then(res => {
        this.userList = res.data.list
      })
    },
    handleFilter() {
      this.list = null
      this.queryParams.page_num = 1
      this.getList()
    },
    viewProject(project_code) {
      this.$router.push({
        path: '/project/add',
        query: {
          project_code: project_code
        }
      })
    },
    bindUserDisplay(project_code) {
      this.temp.project_code = project_code
      this.dialogFormVisible = true
      this.queryProjectUserList()
    },
    queryProjectUserList() {
      this.projectUserList = []
      projectUserList({ 'project_code': this.temp.project_code, 'page_size': 1000 }).then(res => {
        this.projectUserList = [...res.data.list]
      })
    },
    deleteProject(project_code) {
      deleteProject({ 'project_code': project_code }).then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除项目成功',
          type: 'success'
        })
      })
    },
    add() {
      this.$router.push('/project/add')
    },
    addUserToProject() {
      if (this.temp.username) {
        addProjectUser(this.temp).then(res => {
          this.$notify({
            title: '成功',
            message: '添加用户成功',
            type: 'success'
          })
          this.queryProjectUserList()
          this.temp.username = null
        })
      }
    },
    deleteUserFromProject(username) {
      deleteProjectUser({ 'project_code': this.temp.project_code, 'username': username }).then(res =>{
        this.$notify({
          title: '成功',
          message: '删除用户成功',
          type: 'success'
        })
        this.queryProjectUserList()
      })
    }
  }
}
</script>
<style>
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
.el-dialog__body .el-table--enable-row-transition{
  max-height: 400px;
  overflow-y:auto
}
</style>

