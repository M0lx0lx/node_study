const sendMail = require('./main.js')
const getHTML = require('./request.js')
var html= `
    <div>
        <p>do you know? I'm very love you </p>
        <img src="http://www.chuzhaobiao.com/kof/UploadFiles_7873/201208/2012080215563629.jpg" width="80" height="80" />
    </div>
`
var attachments=[
    {
        filename : 'package.json',
        path: './package.json'
    },
    {
        filename : 'content',
        content : '发送内容'
    }
]

//在这里测试
getHTML()
//     .then(v=>{
//     sendMail('1474208733@qq.com','测试',v)
// })

