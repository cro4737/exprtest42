const express = require('express');
const fs = require('fs');
const qs = require('querystring')
let route = express.Router();

const tmpl = require(`./tmp.js`);

route.use(express.static(__dirname + ``));

route.get('/',(req,resp)=>{
    if(req.session.loginyn){
        fs.readdir(__dirname + `/src/txt`,(err,list)=>{
            if(err){throw err};
            /**제목추천**/
            fs.readdir(__dirname + `/src/img`,(err2,list2)=>{
                if(err2){throw err};
                let recmd= list2.map(i=>i.replace(/\.png/,'')).filter(i=>list.indexOf(i)==-1)
                recmd.splice(recmd.indexOf('패치노트'),1)
                recmd.splice(recmd.indexOf('Node_logo'),1)
                recmd.splice(recmd.indexOf('nosuchimg'),1)
                let rest = recmd.length
                let choose = Math.floor(Math.random()*rest)
                if(rest==0){
                    recmd='없음'
                }
                recmd = recmd[choose]
            /**제목추천 끝**/
                let _li = tmpl.list(list);
                let tmp = tmpl.tmp_CU('새 글 작성',`
                    <p id='recmd'>추천제목 : ${recmd}  (${rest}개 중 무작위 선택)</p>
                    <form method='post' action='/create/processing' id='frm'>
                        <p><input type='text' placeholder='제목을 입력해주세요' name='title' id='tit'></p>
                        <p><textarea placeholder='내용을 입력해주세요' name='contents'></textarea></p>
                        <p><input type='button' value='작성완료' onclick='post_chk()'></p>
                        <!--p><input type='submit' value='작성완료'></p-->
                    </form>
                    
                `,_li,'');
                resp.send(tmp);
            });
        });
    }
    else {
        resp.status(302).send(`<script>alert('로그인을 해주세요');location.href="/"</script>`)
    }
});

route.post('/processing',(req,resp)=>{
    let body = ``;
    req.on(`data`,(data)=>{
        body += data;
    })
    req.on(`end`,()=>{
        let post = qs.parse(body);
        let tit = post.title;
        let ctt = post.contents;
        fs.writeFile(__dirname + `/src/txt/${tit}`,`${ctt}`,(err)=>{
            if(err){throw err};
            resp.redirect(302,`/read/${tit}`);
        });
    });
});

module.exports = route;