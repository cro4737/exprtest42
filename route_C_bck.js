/*****해당 파일은 사용되지 않습니다*****/
/***
    제목과 같은 파일명으로 img저장하여 read에서 정상출력까지 구현되었으나
    (CR까지 구현, UD미구현)
    delete가 구현되지 않아 img upload후 글 삭제시 img는 계속 남아있게 되어
    개인정보에 심각한 문제라고 판단하여 해당 파일은 혼자 성취감만 느끼고 사용하지 않습니다.
    
    delete에 대해서는 img클릭시 img 확대하여 볼 수 있는 modal window 생성 
    -> 해당 window에 삭제 메뉴를 구현하는 것으로 구상까지는 하였으나
    실제 구현하지는 않았습니다.

    update에 대해서도 구현 시도를 하였으나
    img를 변경한 경우와 기존 img 그대로 사용하는 경우
    req.file.filename과 req.body.filename으로 분기하여 
    rename을 처리해야 하는 것으로 확인되어 실제 구현하지는 않았습니다.
***/

const express = require('express');
const fs = require('fs');
let route = express.Router();

const tmpl = require(`./tmp.js`);
/****************************************/
const multer = require('multer');

/* 저장되는 경로/파일명 옵션 지정 */
let storage = multer.diskStorage({
    destination : (req,file,callback)=>{
        callback(null,`./src/img/`)
    },
    filename : (req,file,callback)=>{
        callback(null,file.originalname)
    }
})
/* 위 지정한 옵션으로 storage에 저장 */
const upload = multer({storage : storage})
/****************************************/

route.use(express.static(__dirname + ``));

route.get('/',(req,resp)=>{
    if(req.session.loginyn){
        fs.readdir(__dirname + `/src/txt`,(err,list)=>{
            if(err){throw err};
            /**/
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
            /**/
                let _li = tmpl.list(list);
                let tmp = tmpl.tmp_CU('새 글 작성',`
                    <p id='recmd'>추천제목 : ${recmd}  (${rest}개 중 무작위 선택)</p>
                    <!--form method='post' action='/create/processing' id='frm'>
                        <p><input type='text' placeholder='제목을 입력해주세요' name='title' id='tit'></p>
                        <p><textarea placeholder='내용을 입력해주세요' name='contents'></textarea></p>
                        <p><input type='button' value='작성완료' onclick='post_chk()'></p>
                        <!--p><input type='submit' value='작성완료'></p>
                    </form-->
                    <form method='post' action='/create/processing' id='frm' enctype="multipart/form-data">
                        <p><input type='text' placeholder='제목을 입력해주세요' name='title' id='tit'></p>
                        <p><textarea placeholder='내용을 입력해주세요' name='contents'></textarea></p>
                        <p><input type='button' value='작성완료' onclick='post_chk()' id='submt'><input type='file' name="img" id='img' accept='image/*' style="display:none;"><label for="img"><img src='/icon/img.png' id='img_icon' alt='대충 사진아이콘' title='사진첨부'></labal></p>
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
/*
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
*/

route.post('/processing',upload.single(`img`),(req,resp)=>{
    fs.writeFile(__dirname + `/src/txt/${req.body.title}`,`${req.body.contents}`,(err)=>{
        if(err){throw err};
        fs.rename(__dirname + `/src/img/${req.file.originalname}`,__dirname + `/src/img/${req.body.title}.png`,(err2)=>{
            if(err2){throw err2};
            resp.redirect(302,`/read/${req.body.title}`);
        })
    })
})

module.exports = route;