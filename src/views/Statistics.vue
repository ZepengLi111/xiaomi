<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>数量统计</span>
<!--        <el-button class="button" text>Operation button</el-button>-->
      </div>
    </template>
    <el-table :data="numberData" style="width: 100%">
      <el-table-column prop="name" label="群聊名称"  />
      <el-table-column prop="total" label="发言总数"  />
      <el-table-column prop="own" label="您发言的数量" />
      <el-table-column prop="percent" label="比例" />
    </el-table>
  </el-card>

  <el-card class="line-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>发言数折线图</span>
        <!--        <el-button class="button" text>Operation button</el-button>-->
      </div>
    </template>
    <div id="numberLineChartDiv"><canvas id="numberLineChartCanvas"></canvas></div>
  </el-card>



</template>

<script setup lang="ts">
import {useChatStore} from "@/stores"
import {Chart} from "chart.js/auto";
import {onMounted} from "vue";

const chatStore = useChatStore()

const numberData = []
for (let i = 0; i < chatStore.listenChatList.length; i++)
{
  numberData.push({
    name: chatStore.listenChatList[i].name,
    total: chatStore.listenChatList[i].messages.filter(item => item.speaker !== "SYS" && item.speaker !== "TIME").length,
    own: chatStore.listenChatList[i].messages.filter(item => item.speaker === chatStore.userName).length,
    percent: (Math.round(chatStore.listenChatList[i].messages.filter(item => item.speaker === chatStore.userName).length / chatStore.listenChatList[i].messages.filter(item => item.speaker !== "SYS" && item.speaker !== "TIME").length * 10000) / 100).toString() + "%"
  })
}

let temp = chatStore.getNumberLineData()
let lineNumberList = temp[0]
let lineDateList:string[] = temp[1] as string[]

onMounted(() => {
  new Chart(document.getElementById("numberLineChartCanvas") as HTMLCanvasElement, {
    type: "line",
    data: {
      labels: lineDateList,
      datasets: [
        {
          label: '发言数',
          data: lineNumberList,

          // fillColor: "rgba(151,249,190,0.5)",
          // strokeColor: "rgba(255,255,255,1)",
          // pointColor: "rgba(220,220,220,1)",
          // pointStrokeColor: "#fff",
        }
      ]
    },
    options: {
      responsive: true,
    }
  })
})

console.log(123)

</script>

<style>
  .line-card {
    margin-top:  20px;
    width: 50%;
    height: 50%;
  }
</style>