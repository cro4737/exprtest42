const express = require('express');
const fs = require('fs');
let route = express.Router();

const tmpl = require(`./tmp.js`);


let tmpl_pn = (tit,ctt,lit,ctl)=>{
    return `        
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="utf-8">
                <title>${tit}</title>
                <link rel="shortcut icon" href="/icon/favi.ico" type="image/x-icon" />
                <link rel="icon" href="/icon/favi.ico" type="image/x-icon" />
                <link rel="stylesheet" type="text/css" href='/patchnote.css'>
                <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css">
            </head>
            <body>
                <ctl>

                    <!-- 0319 추가적용 -->
                    <input type='checkbox'  id='menuicon'>
                    <label for='menuicon'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <div class='sidebar'>${lit}</div>
                    <!-- 0319 추가적용 끝 -->

                    <input type='button' onclick=location.href='/idx' id='home'>
                    <label for='home'><img src='/icon/home.png' alt='대충 메인페이지로 돌아가기 아이콘' id='home_icon' title='메인페이지로 돌아가기'></label>
                    <input type='button' onclick=location.href='/create' id='create'>
                    <label for='create'><img src='/icon/write.png' id='create_icon' alt='대충 새 글 작성 아이콘' title='새 글 쓰기'></label>
                    ${ctl}
                </ctl>
                <br>
                <tit>
                    <img src="/img/${tit}.png" alt="No such img : ${tit}.png"><h1>${tit}</h1>
                </tit>
                <ctt>${ctt}</ctt>
            </body>
            <footer>
                
            </footer>
        </html>
    `
}


route.use(express.static(__dirname + ``));

route.get('/',(req,resp)=>{
    fs.readdir(__dirname + `/src/txt`,(err,list)=>{
        if(err){throw err};
        let _li = tmpl.list(list);
        fs.readFile(__dirname + `/src/패치노트`,`utf-8`,(err1,data)=>{
            let tmp = tmpl_pn(`패치노트`,`${data}`,`${_li}`,``);
            resp.send(tmp);
        });
    });
});

module.exports = route;