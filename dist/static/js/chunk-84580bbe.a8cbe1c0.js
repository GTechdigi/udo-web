(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-84580bbe"],{"0299":function(e,t,n){},"24d2":function(e,t,n){"use strict";n.d(t,"g",(function(){return a})),n.d(t,"e",(function(){return o})),n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return u})),n.d(t,"h",(function(){return l})),n.d(t,"f",(function(){return c})),n.d(t,"b",(function(){return s})),n.d(t,"d",(function(){return d}));var r=n("b775");function a(e){return Object(r["a"])({url:"/project/list",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/project/"+e,method:"get"})}function i(e){return Object(r["a"])({url:"/project/add",method:"post",data:e})}function u(e){return Object(r["a"])({url:"/project/delProject",method:"get",params:e})}function l(e,t){return Object(r["a"])({url:"/project/update/"+e,method:"post",data:t})}function c(e){return Object(r["a"])({url:"/projectUser/list",method:"get",params:e})}function s(e){return Object(r["a"])({url:"/projectUser/add",method:"post",data:e})}function d(e){return Object(r["a"])({url:"/projectUser/delete",method:"get",params:e})}},"333d":function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"show",rawName:"v-show",value:!e.hidden,expression:"!hidden"}],staticClass:"pagination-container"},[n("el-pagination",e._b({attrs:{background:e.background,"current-page":e.currentPage,"page-size":e.pageSize,layout:e.layout,"page-sizes":e.pageSizes,total:e.total},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"update:pageSize":function(t){e.pageSize=t},"update:page-size":function(t){e.pageSize=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},"el-pagination",e.$attrs,!1))],1)},a=[];n("a9e3");Math.easeInOutQuad=function(e,t,n,r){return e/=r/2,e<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)};var o=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function i(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function u(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function l(e,t,n){var r=u(),a=e-r,l=20,c=0;t="undefined"===typeof t?500:t;var s=function e(){c+=l;var u=Math.easeInOutQuad(c,r,a,t);i(u),c<t?o(e):n&&"function"===typeof n&&n()};s()}var c={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:20},pageSizes:{type:Array,default:function(){return[10,20,30,50]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(e){this.$emit("update:page",e)}},pageSize:{get:function(){return this.limit},set:function(e){this.$emit("update:limit",e)}}},methods:{handleSizeChange:function(e){this.$emit("pagination",{page:this.currentPage,limit:e}),this.autoScroll&&l(0,800)},handleCurrentChange:function(e){this.$emit("pagination",{page:e,limit:this.pageSize}),this.autoScroll&&l(0,800)}}},s=c,d=(n("ffd1"),n("2877")),p=Object(d["a"])(s,r,a,!1,null,null,null);t["a"]=p.exports},4780:function(e,t,n){"use strict";n("0299")},"76fe":function(e,t,n){"use strict";n.d(t,"e",(function(){return a})),n.d(t,"a",(function(){return o})),n.d(t,"f",(function(){return i})),n.d(t,"c",(function(){return u})),n.d(t,"d",(function(){return l})),n.d(t,"b",(function(){return c}));var r=n("b775");function a(e){return Object(r["a"])({url:"/job/queryJob",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/job/addJob",method:"post",data:e})}function i(e){return Object(r["a"])({url:"/job/updateJobInfo/"+e.job_id,method:"post",data:e})}function u(e){return Object(r["a"])({url:"/job/delJob",method:"get",params:e})}function l(e){return Object(r["a"])({url:"/job/info/"+e,method:"get"})}function c(e){return Object(r["a"])({url:"/job/changeStatus",method:"post",data:e})}},"9d83":function(e,t,n){},fac5:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"filter-container"},[n("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择项目",clearable:""},on:{change:e.handleFilter},model:{value:e.queryParams.project_code,callback:function(t){e.$set(e.queryParams,"project_code",t)},expression:"queryParams.project_code"}},e._l(e.projects,(function(e){return n("el-option",{key:e.project_code,attrs:{label:e.project_name,value:e.project_code}})})),1),n("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"任务名称",clearable:""},on:{clear:e.getList},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleFilter(t)}},model:{value:e.queryParams.job_name,callback:function(t){e.$set(e.queryParams,"job_name",t)},expression:"queryParams.job_name"}}),n("el-select",{staticClass:"filter-item",attrs:{clearable:"",placeholder:"请选择调度方式"},on:{change:e.handleFilter},model:{value:e.queryParams.trigger,callback:function(t){e.$set(e.queryParams,"trigger",t)},expression:"queryParams.trigger"}},e._l(e.triggers,(function(e){return n("el-option",{key:e.name,attrs:{label:e.name,value:e.trigger}})})),1),n("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"规则名称",clearable:""},on:{clear:e.getList},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleFilter(t)}},model:{value:e.queryParams.rule_name,callback:function(t){e.$set(e.queryParams,"rule_name",t)},expression:"queryParams.rule_name"}}),n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleFilter}},[e._v(" "+e._s(e.$t("table.search"))+" ")]),n("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:e.add}},[e._v(" "+e._s(e.$t("table.add"))+" ")])],1),n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.list,border:"",fit:"","highlight-current-row":""}},[n("el-table-column",{attrs:{label:"项目名称","min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[n("span",[e._v(e._s(r.project_name))])]}}])}),n("el-table-column",{attrs:{label:"任务名称","show-overflow-tooltip":!0,"min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[n("span",[e._v(e._s(r.job_name))])]}}])}),n("el-table-column",{attrs:{label:"规则名称","show-overflow-tooltip":!0,"min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[r.rule_name.indexOf(",")<0?n("router-link",{attrs:{to:{path:"/rule/add",query:{rule_code:r.rule_code}}}},[e._v(e._s(r.rule_name||r.rule_code))]):n("span",[e._v(e._s(r.rule_name))])]}}])}),n("el-table-column",{attrs:{label:"调度方式",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return e._l(e.triggers,(function(t){return t.trigger===r.trigger?n("el-tag",{attrs:{type:"info"}},[e._v(" "+e._s(t.name)+" ")]):e._e()}))}}])}),n("el-table-column",{attrs:{label:"状态",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-switch",{staticStyle:{display:"block",width:"auto"},attrs:{"active-value":1,"inactive-value":0,"active-color":"#13ce66","inactive-color":"#ff4949","active-text":"开","inactive-text":"关"},on:{change:function(n){return e.changestatus(t.row.job_id,t.row.is_run)}},model:{value:t.row.is_run,callback:function(n){e.$set(t.row,"is_run",n)},expression:"scope.row.is_run"}})]}}])}),n("el-table-column",{attrs:{label:"下次运行时间","min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[n("span",[e._v(e._s(r.next_run_time))])]}}])}),n("el-table-column",{attrs:{label:"创建时间","min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[n("span",[e._v(e._s(r.create_time))])]}}])}),n("el-table-column",{attrs:{label:e.$t("table.actions"),align:"center","min-width":"230","class-name":"small-padding fixed-width",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){return e.viewJob(r.job_id)}}},[e._v(" 查看 ")]),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){return e.viewLog(r.rule_type,r.rule_code)}}},[e._v(" 日志 ")]),n("el-popconfirm",{staticStyle:{"margin-left":"10px"},attrs:{title:"确定删除吗？"},on:{onConfirm:function(t){return e.delJob(r.job_id)}}},[n("el-button",{attrs:{slot:"reference",type:"danger",size:"mini"},slot:"reference"},[e._v(" 删除 ")])],1)]}}])})],1),n("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.queryParams.page_num,limit:e.queryParams.page_size},on:{"update:page":function(t){return e.$set(e.queryParams,"page_num",t)},"update:limit":function(t){return e.$set(e.queryParams,"page_size",t)},pagination:e.getList}})],1)},a=[],o=(n("14d9"),n("76fe")),i=n("333d"),u=n("24d2"),l={name:"Datamonitor",components:{Pagination:i["a"]},data:function(){return{trigger:null,queryParams:{rule_name:null,trigger:null,job_name:null,page_num:1,page_size:10,project_name:null},list:[],total:0,projects:[],triggers:[{name:"指定时间执行",trigger:"date"},{name:"间隔执行",trigger:"interval"},{name:"cron调度器",trigger:"cron"}]}},created:function(){this.getList(),this.getProjectList()},methods:{getList:function(){var e=this;Object(o["e"])(this.queryParams).then((function(t){e.list=t.data.list,e.total=t.data.total}))},getProjectList:function(e){var t=this;Object(u["g"])({project_name:e}).then((function(e){t.projects=e.data.list}))},handleFilter:function(){this.list=null,this.queryParams.page_num=1,this.getList()},viewJob:function(e){this.$router.push({path:"/job/add",query:{job_id:e}})},viewLog:function(e,t){this.$router.push({path:"/logs/list",query:{rule_type:e,rule_code:t}})},delJob:function(e){var t=this;console.log(e),Object(o["c"])({job_id:e}).then((function(e){t.getList(),t.$notify({title:"成功",message:"删除调度任务成功",type:"success"})}))},add:function(){this.$router.push("/job/add")},changestatus:function(e,t){var n=this;Object(o["b"])({job_id:e,is_run:t}).then((function(e){n.$notify({title:"成功",message:"更新调度任务状态成功",type:"success"})}))}}},c=l,s=(n("4780"),n("2877")),d=Object(s["a"])(c,r,a,!1,null,"0146aa1a",null);t["default"]=d.exports},ffd1:function(e,t,n){"use strict";n("9d83")}}]);