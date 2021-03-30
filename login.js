const express = require('express');
let route = express.Router();

/* session 추가 */
let session = require('express-session');
//var FileStore = require('session-file-store')(session);
//파일 시스템은 필요하면 다시 추가

route.use(session({
     secret: '9sGVRFnVHF2VWZFVXBnVNdlRtZ1caFjY3hXbWRlWwIVaktm==',
     resave: false,  
     saveUninitialized: true,
     cookie:{secure:false}
     //  store: new FileStore,
   }))
/* session 추가 끝*/


route.use(express.static(__dirname + ``));

route.get('/',(req,resp)=>{
    let tmp = `
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Login</title>
                <link rel='stylesheet' type='text/css' href='./common.css'>
                <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css">
            </head>
                <script>
                    let lgn_logic = () => {
                        document.getElementById('lgn_frm').action = './chk_wau';
                        document.getElementById('lgn_frm').submit();
                    }
                </script>
            <body id="lgn_body">
                <form method='post' id='lgn_frm'>
                    <p><input type="text" placeholder="ID" id="lgn_id" name="lgn_id" onkeydown="javascript:if (event.keyCode == 13) { lgn_logic(); }"></p>
                    <p><input type="password" placeholder="PASSWORD" id="lgn_pw" name="lgn_pw" onkeydown="javascript:if (event.keyCode == 13) { lgn_logic(); }"></p>
                    <p><input type="button" value="LOGIN" id="lgn_btn" onclick="lgn_logic()"></p>
                    <p id="reveal">아무 ID/PW를 입력해도<br>다음 페이지로 넘어갈 수 있습니다</p>
                    <p id="hidden">아무 일도 일어나지 않지만<br>관리자계정은 root/user </p>
                </form>
            </body>
        </html>
        `
    resp.send(tmp);
});

module.exports = route



