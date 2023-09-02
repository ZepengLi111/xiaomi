import {defineStore} from 'pinia'
import {Names} from './store-name'
import {ref} from "vue";
import type {Ref} from "vue"


export const useChatStore = defineStore(Names.CHAT, () => {
    interface message {
        speaker: string
        message: string
        hidden: boolean
    }
    const listenChatList:Ref<{id:number, name:string, messages: {speaker: string, message: string, hidden: boolean}[], currentPage:number}[]> = ref([])
    // const listenChatList = ref([{id:0, name: "午夜食堂", messages: [{speaker: "lvzhipin", message: "啊哈哈哈哈哈", hidden: true}, {speaker: "lvzhipin", message: "123456", hidden: false}]}])
    const addChat = (name:string) => {
        if (listenChatList.value.length > 0)
            listenChatList.value.push({id: listenChatList.value[listenChatList.value.length-1].id + 1, name: name, messages: [], currentPage: 1})
        else
            listenChatList.value.push({id: 0, name: name, messages: [], currentPage: 1})
        // for (let i = 0; i < listenChatList.value.length; i++)
        // {
        //     console.log("id: " + listenChatList.value[i].id.toString())
        // }
        // tableActiveName.value = listenChatList.value[listenChatList.value.length - 1].id.toString()
        // console.log(tableActiveName.value)
    }
    const addMessage = (name:string, message:string, speaker:string) => {
        let result = listenChatList.value.filter(value => value.name === name)
        result[0].messages.push({
            speaker: speaker,
            message: message,
            hidden: false,
        })
    }
    const userName = ref("")
    const tableActiveName = ref("")
    // const currentPage = ref(1)

    return {listenChatList, addChat, userName, addMessage, tableActiveName}
    }
)