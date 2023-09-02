<template>
  <div class="head">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="user-name">{{chatStore.userName}}</span>
          <div>
            <el-tooltip placement="bottom" content="导入">
              <el-button type="primary" class="button" @click="onImportBtnClick" circle plain :icon="BottomRight"></el-button>
            </el-tooltip>
            <el-tooltip placement="bottom" content="导出">
              <el-button type="primary" class="button" @click="onExportBtnClick" circle plain :icon="BottomLeft"></el-button>
            </el-tooltip>
            <el-tooltip placement="bottom" content="将微信当前聊天窗口放入到检测列表中">
              <el-button type="primary" class="button" @click="onPutBtnClick" circle plain :icon="Aim"></el-button>
            </el-tooltip>
            <el-tooltip placement="bottom" content="手动捕获微信当前聊天窗口（已被添加到检测列表中）新消息">
              <el-button type="primary" class="button" @click="onDetectBtnClick" circle plain :icon="View"></el-button>
            </el-tooltip>
            <el-tooltip placement="bottom" :content="disableBtnTipText">
              <el-button type="primary" class="button" :class="disableBtnClass" @click="onDisableBtnClick">{{disableBtnText}}</el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
      <el-collapse v-model="chatStore.tableActiveName" @change="handleCollapseChange" accordion>
        <el-collapse-item  :title="item.name" :name="item.name" :key="item.id" v-for="item in chatStore.listenChatList">
          <el-table :row-class-name="tableRowClassName" :data="item.messages.slice((item.currentPage-1)*10, item.currentPage*10)" style="width: 100%" max-height="330">
            <el-table-column prop="speaker" label="发言者" width="120"></el-table-column>
            <el-table-column prop="message" label="内容"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template #default="scope">
                <el-button type="danger" plain size="small" @click="onDeleteBtnClick(scope, item.messages)">删除</el-button>
                <el-button type="primary" plain v-show="!item.messages[scope.$index].hidden" size="small" @click="onHideOrShowBtnClick(scope)">隐藏</el-button>
                <el-button type="success" plain v-show="item.messages[scope.$index].hidden" size="small" @click="onHideOrShowBtnClick(scope)">显示</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" v-model:current-page="item.currentPage"
                         @current-change="handleCurrentChange" :total="item.messages.length"></el-pagination>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>

  <el-dialog v-model="exportDialogTableVisible" title="请选择要导出的聊天（可多选）">
    <el-checkbox-group v-model="exportCheckboxGroup" size="large">
      <el-checkbox-button v-for="item in chatStore.listenChatList" :key="item.id" :label="item.name">
        {{ item.name }}
      </el-checkbox-button>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exportDialogCancelBtnClick">Cancel</el-button>
        <el-button type="primary" @click="exportDialogConfirmBtnClick">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="importDialogTableVisible" title="请选择要导入的聊天对象（单选）">
    <el-radio-group v-model="importRadio" size="large">
      <el-radio-button v-for="item in chatStore.listenChatList" :key="item.id" :label="item.name"/>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="importDialogCancelBtnClick">Cancel</el-button>
        <el-button type="primary" @click="importDialogConfirmBtnClick">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import type {Ref} from "vue"
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {useChatStore} from "@/stores";
import {Aim, BottomLeft, BottomRight, View} from "@element-plus/icons-vue";
const {ipcRenderer} = window.require('electron');

const path = require("path")

const chatStore = useChatStore()

// setInterval(() => {
//   console.log(chatStore.tableActiveName)
// }, 1000)

if (chatStore.userName === "") {
  axios.get('http://localhost:5031/func', {
    params: {
      funcNum: 1,
    }
  }).then(r => {
    if (r.status === 200) {
      chatStore.userName = r.data.body
    }
  })
}

const exportDialogTableVisible = ref(false)
const importDialogTableVisible = ref(false)
const exportCheckboxGroup:Ref<string[]> = ref([])
const importRadio = ref("")

interface message {
  speaker: string
  message: string
  hidden: boolean
}

const handleCurrentChange = (val: number) => {
  console.log(val)
}

const handleCollapseChange = (val: string) => {

}

// chatStore.exportChat("D://123", 0)

const parseMessageBody = (body:string) => {
  const chatName = body.substring(body.lastIndexOf("'chatName': '")+13, body.lastIndexOf("'"))
  const messageStr = body.substring(body.indexOf("'message': ")+14, body.indexOf("'chatName': '")-5)
  let messageStrList = messageStr.split('), (')
  let messageList = []
  for (let i = 0; i < messageStrList.length; i++)
  {
    messageStrList[i] = messageStrList[i].replaceAll("'", "")
    messageList.push(messageStrList[i].split(", "))
  }
  return {chatName: chatName, messageList: messageList}
}

const tableRowClassName = ({row, rowIndex}: { row: message, rowIndex: number }) => {
  if (row.hidden) {
    return "hidden-row"
  }
  return ''
}

const onHideOrShowBtnClick = (scope:any) => {
  scope.row.hidden = !scope.row.hidden
}

const onDeleteBtnClick = (scope:any, messages:message[]) => {
  messages.splice(scope.$index, 1)
}

const onImportBtnClick = () => {
  importDialogTableVisible.value = true
}
const importDialogConfirmBtnClick = () => {
  importDialogTableVisible.value = false
  ipcRenderer.send("read-chat-file")
  ipcRenderer.once("read-chat-file-finished", (event, data) => {
    if (data) {
      let success = false
      for (let i = 0; i < data.length; i++)
      {
        let content = ""
        let speaker = ""
        for (let p in data[i]) {
          // console.log(typeof a)
          // console.log(data[i][a])
          if (p === "content") {content = data[i][p]}
          // console.log(p[0])
          // console.log(p[7])
          // console.log(p)
          // console.log(p.length)
          // console.log("speaker".length)
          // console.log(p.trim() == "speaker")
          if (p.trim() === "speaker") {speaker = data[i][p]}
        }
        if (content !== "" && speaker !== "") {
          success = true
          chatStore.addMessage(importRadio.value, content, speaker)
        }
      }
      if (success) {
        ElMessage({
          message: '导入成功',
          type: 'success',
        })
      }
      else  {
        ElMessage.error("导入失败，您导入的文件格式不正确")
      }
    }
    else {
      ElMessage.error("导入失败")
    }
  })
}
const importDialogCancelBtnClick = () => {
  importDialogTableVisible.value = false
}

const onExportBtnClick = () => {
  exportDialogTableVisible.value = true
}
const exportDialogConfirmBtnClick = () => {
  exportDialogTableVisible.value = false
  let chosenChat = chatStore.listenChatList.filter(value => {
    return exportCheckboxGroup.value.indexOf(value.name) >= 0;
  })
  if (chosenChat.length > 0) {
    let csvContents = []
    let names = []
    for (let i = 0; i < chosenChat.length; i++)
    {
      let content = '\ufeff' + ["speaker", "content"].join(',') + '\n'
      const messages = chosenChat[i].messages
      for (let j = 0; j < messages.length; j++)
      {
        content += [messages[j].speaker, messages[j].message].join(',') + '\n'
      }
      csvContents.push(content)
      names.push(chosenChat[i].name)
    }
    ipcRenderer.send("choose-folder", csvContents, names)
    ipcRenderer.once("choose-folder-finished", (event, errNames:string[]) => {
      if (errNames.length > 0) {
        ElMessage.error("聊天" + errNames.join(",") + "导出失败，请稍后重试")
      }
      else {
        ElMessage({
          message: '导出成功',
          type: 'success',
        })
      }
    })
  }
  exportCheckboxGroup.value = []
}
const exportDialogCancelBtnClick = () => {
  exportDialogTableVisible.value = false
}

const listenOne = function () {
  let listening:boolean = true
  return () => {
    if (listening)
    {
      return
    }
    else {
      axios.get('http://localhost:5031/func', {
        params: {
          funcNum: 2,
        }
      }).then(r => {
        listening = false
        if (r.status === 200 && r.data.status === 0) {
          let result = parseMessageBody(r.data.body)
          for (let i = 0; i < result.messageList.length; i++)
          {
            chatStore.addMessage(result.chatName, result.messageList[i][1], result.messageList[i][0])
          }
        }
      }).catch(e => {
        listening = false
      })
    }
  }
}()

const disableBtnClass = ref("")
const disableBtnText = ref("自动检测中")
const disableBtnTipText = ref("正在已一定时间间隔检测新的聊天消息，点击可暂停")
let internal = setInterval(listenOne, 4000)
const onDisableBtnClick = () => {
  if (disableBtnClass.value === "") {
    disableBtnClass.value = "is-plain"
    disableBtnText.value = "自动检测(已暂停)"
    disableBtnTipText.value = "周期检测新聊天信息功能已暂停，您可以点击恢复，或者点击旁边的detect按钮手动检测"
    clearInterval(internal)
  }
  else {
    disableBtnClass.value = ""
    disableBtnText.value = "internal: 2s"
    disableBtnTipText.value = "正在已一定时间间隔检测新的聊天消息，点击可暂停"
    internal = setInterval(listenOne, 4000)
  }
}

const onDetectBtnClick = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在搜索消息，请稍候',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  axios.get('http://localhost:5031/func', {
    params: {
      funcNum: 2,
    }
  }).then(r => {
    loading.close()
    if (r.status === 200 && r.data.status === 0) {
      let result = parseMessageBody(r.data.body)
      for (let i = 0; i < result.messageList.length; i++)
      {
        chatStore.addMessage(result.chatName, result.messageList[i][1], result.messageList[i][0])
      }
    }
    else if (r.status === 200 && r.data.status === 1) {
      if (r.data.message !== "") ElMessage.error(r.data.message)
      else {
        ElMessage.error("搜索消息失败，请将聊天界面切换到有新消息并且已经处于观测列表的聊天并稍后重试")
      }
    }
  }).catch(e => {
    loading.close()
    ElMessage.error("搜索消息失败，请将聊天界面切换到有新消息并且已经处于观测列表的聊天并稍后重试")
  })
}

const onPutBtnClick = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在搜索，请稍候（最大等待时间：10s）',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  axios.get("http://localhost:5031/func", {
    params: {
      funcNum: 3,
    }
  }).then(r => {
    loading.close()
    if (r.status === 200 && r.data.body) {
      ElMessageBox.confirm(r.data.message, "添加确认", {
        confirmButtonText: "确认添加",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        const loading2 = ElLoading.service({
          lock: true,
          text: '正在添加，请稍候',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        axios.get("http://localhost:5031/func", {
          params: {
            funcNum: 4,
            name: r.data.body,
            agree: 1
          }
        }).then((r) => {
          loading2.close()
          if (r.status === 200 && r.data.body) {
            chatStore.addChat(r.data.body)
            ElMessage({
              message: r.data.message,
              type: "success"
            })
            if (chatStore.tableActiveName === "") chatStore.tableActiveName = r.data.body
          }
        }).catch(e => {
          loading2.close()
          ElMessage.error("添加失败，请稍后重试或者提交bug")
        })
      }).catch(() => {
        axios.get("http://localhost:5031/func", {
          params: {
            funcNum: 4,
            name: r.data.name,
            agree: 0
          }
        })
      })
    }
    else {
      ElMessage.error("搜索聊天失败，请稍后重试或者提交bug")
    }
  }).catch(e => {
    loading.close()
    ElMessage.error("搜索聊天失败，请稍后重试或者提交bug")
  })
}



// setInterval(listenOne, 2000)






</script>

<style lang="less">

.box-card {
  border-radius: 15px;
  width: 100%;
  .card-header {
    .user-name {
      font-weight: bold;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .el-table .hidden-row {
    --el-table-tr-bg-color: rgb(236, 245, 255);
  }
}
</style>