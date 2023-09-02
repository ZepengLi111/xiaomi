import axios from "axios";

axios.get("http://localhost:5031/func", {
    params: {
        funcNum: 100,
    }
}).then(r => {
    console.log(r.data)
}).catch(e => {
    console.log(e)
})

