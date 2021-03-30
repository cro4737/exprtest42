const express = require('express');
const fs = require('fs');
const qs = require('querystring')
let route = express.Router();

const tmpl = require(`./tmp.js`);
/***해당 부분 주석처리 이유는 route_C_bck.js에 자세히 설명해두었습니다***/
/****************************************/
// const multer = require('multer');

// /* 저장되는 경로/파일명 옵션 지정 */
// let storage = multer.diskStorage({
//     destination : (req,file,callback)=>{
//         callback(null,`./src/img/`)
//     },
//     filename : (req,file,callback)=>{
//         callback(null,file.originalname)
//     }
// })
// /* 위 지정한 옵션으로 storage에 저장 */
// const upload = multer({storage : storage})
/****************************************/

route.use(express.static(__dirname + ``));

route.get(`/:id`,(req,resp)=>{
    if(req.session.loginyn){
        let qid = req.params.id;
        fs.readdir(__dirname + `/src/txt`,(err,list)=>{ 
            if(err){throw err};
            let _li = tmpl.list(list);
            fs.readFile(__dirname + `/src/txt/${qid}`,`utf-8`,(err2,data)=>{
                if(err2){throw err};
                let tmp =   tmpl.tmp_CU('수정하기',`
                <form method='post' action='/update/processing' id='frm'>
                    <p><input type='hidden' value='${qid}' name='oid'></p>
                    <p><input type='text' value='${qid}' name='title' id='tit'></p>
                    <p><textarea name='contents'>${data}</textarea></p>
                    <p><input type='button' value='수정완료' onclick='post_chk()'></p>
                    <!--p><input type='submit' value='수정완료'></p-->
                </form>
                <!--p>
                <form method='post' action='/update/processing' id='frm' enctype="multipart/form-data">
                    <p><input type='hidden' value='${qid}' name='oid'></p>
                    <p><input type='text' value='${qid}' name='title' id='tit'></p>
                    <p><textarea name='contents'>${data}</textarea></p>
                    <p><input type='button' value='수정완료' onclick='post_chk()'  id='submt'><input type='file' name="img" id='img' accept='image/*' style="display:none;"><label for="img"><img src="/img/${qid}.png" id='img' alt="No such img : ${qid}.png" onerror="default_img('img')" title='사진첨부'></labal></p>
                    <input type='submit' value='수정완료'>
                </form></p-->
                `,_li,`<input type='button' onclick=location.href='/create' id='create'>
                <label for='create'><img src='/icon/write.png' id='create_icon' alt='대충 새 글 작성 아이콘' title='새 글 쓰기'></label>
                <script>
                        let default_img = (val) =>{
                            document.getElementById(val).src='/img/nosuchimg.png'
                        }
                    </script>
                `);
            resp.send(tmp);
            });
        });
    }
    else {
        resp.status(302).send(`<script>alert('로그인을 해주세요');location.href="/"</script>`)
    }
});

route.post('/processing',(req,resp)=>{
    let body = ``
    req.on(`data`,(data)=>{
        body += data
    })
    req.on(`end`,()=>{
        let post = qs.parse(body)
        let oid = post.oid
        let tit = post.title
        let ctt = post.contents
        fs.rename(__dirname + `/src/txt/${oid}`,__dirname + `/src/txt/${tit}`,(err)=>{
            if(err){throw err}
            fs.writeFile(__dirname + `/src/txt/${tit}`,`${ctt}`,(err2)=>{
                if(err2){throw err}
                resp.redirect(302,`/read/${tit}`)
            });
        });
    });
});

/*
route.post('/processing',upload.single(`img`),(req,resp)=>{
    if(!req.file.oid){
    fs.rename(__dirname + `/src/img/${req.file.oid}.png`,__dirname + `/src/img/${req.body.title}.png`,(err3)=>{
        if(err3){throw err3};
    })
}
        fs.rename(__dirname + `/src/txt/${req.body.oid}`,__dirname + `/src/txt/${req.body.title}`,(err)=>{
            if(err){throw err}
            fs.writeFile(__dirname + `/src/txt/${req.body.title}`,`${req.body.contents}`,(err2)=>{
                if(err2){throw err2}
                resp.redirect(302,`/read/${req.body.title}`)
            });
        });
    
})*/

module.exports = route;