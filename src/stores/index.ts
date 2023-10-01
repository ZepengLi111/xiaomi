import {defineStore} from 'pinia'
import {Names} from './store-name'
import {ref} from "vue";
import type {Ref} from "vue"
import axios from "axios";


export const useChatStore = defineStore(Names.CHAT, () => {
    interface message {
        speaker: string
        message: string
        hidden: boolean
        time: string
    }

    const timestampToTime = (timestamp:number) => {
        const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y+M+D+h+m+s;
    }

    const listenChatList:Ref<{id:number, name:string, messages: {speaker: string, message: string, hidden: boolean, time: string}[], currentPage:number}[]> = ref([])
    // const listenChatList = ref([{id:0, name: "午夜食堂", messages: [{speaker: "lvzhipin", message: "啊哈哈哈哈哈", hidden: true}, {speaker: "lvzhipin", message: "123456", hidden: false}]}])

    const daysToDate = (date1:string, date2:string) => {
        // 比较两个日期的天数间隔，日期一距离日期二，正数代表日期一更晚
        let d1 = new Date(date1.slice(0, 10))
        let d2 = new Date(date2.slice(0, 10))
        return (d1.getTime() - d2.getTime()) / 1000 / 60 / 60 / 24
    }

    const getNumberLineData = () => {
        let now = timestampToTime(new Date().getTime())
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()

        let currentDay = new Date();
        const numberList = [0, 0, 0, 0, 0, 0, 0]
        const dateList = []
        for (let i = 0; i < 7; i++)
        {
            let Day = new Date();
            Day.setDate(currentDay.getDate() - i)
            dateList.push(Day.toJSON().slice(5, 10))
        }
        for (let item of listenChatList.value)
        {
            for (let message of item.messages.filter(i => i.speaker !== "SYS" && i.speaker !== "TIME").reverse())
            {
                let days = daysToDate(message.time, now)
                if (days < -6) break
                else {
                    numberList[6 - Math.abs(days)] += 1
                }
            }
        }
        return [numberList, dateList]
    }
    const addChat = (name:string) => {
        if (listenChatList.value.length > 0)
            listenChatList.value.push({id: listenChatList.value[listenChatList.value.length-1].id + 1, name: name, messages: [], currentPage: 1})
        else
            listenChatList.value.push({id: 0, name: name, messages: [], currentPage: 1})
    }
    const addMessage = (name:string, message:string, speaker:string, time:string="") => {
        let result = listenChatList.value.filter(value => value.name === name)
        result[0].messages.push({
            speaker: speaker,
            message: message,
            hidden: false,
            time: time===""?timestampToTime(Date.now()):time
        })
    }
    const userName = ref("")
    const tableActiveName = ref("")
    // const currentPage = ref(1)

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
                            addMessage(result.chatName, result.messageList[i][1], result.messageList[i][0])
                        }
                    }
                }).catch(e => {
                    listening = false
                })
            }
        }
    }()
    let listenInternal:any = null
    const listenMessage = () => {
        if (listenInternal === null)
            listenInternal = setInterval(listenOne, 4000)
    }
    const cancelListenMessage = () => {
        if (listenInternal !== null)
            clearInterval(listenInternal)
    }

    return {listenChatList, addChat, userName, addMessage, tableActiveName, listenMessage, cancelListenMessage, getNumberLineData}
    }
)