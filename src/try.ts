// import axios from "axios";
//
// axios.get("http://localhost:5031/func", {
//     params: {
//         funcNum: 100,
//     }
// }).then(r => {
//     console.log(r.data)
// }).catch(e => {
//     console.log(e)
// })

// function timestampToTime(timestamp:number) {
//     const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
//     const Y = date.getFullYear() + '-';
//     const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
//     const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
//     const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
//     const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
//     const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
//     return Y+M+D+h+m+s;
// }


// let a = new Date()
// console.log(timestampToTime(Date.now()))

// console.log(new Date().getDate() - 7)
// console.log(new Date().getMonth())


// let currentDay = new Date();
// const dateList = []
// for (let i = 0; i < 7; i++)
// {
//     let Day = new Date();
//     Day.setDate(currentDay.getDate() - i)
//     dateList.push(Day.toJSON().slice(5, 10))
// }
// console.log(dateList)

// let a = "2023-05-01"
// let b = "2023-04-27"
//
// let date1 = new Date(a)
// let date2 = new Date(b)
//
// console.log(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24)

// console.log(timestampToTime(new Date().getTime()))

let a = [0, 1, 2, 3, 4]
console.log(a.filter(i => i <= 3).reverse())
console.log(a)

