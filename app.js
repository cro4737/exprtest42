const express = require('express');
const fs = require('fs');
const qs = require('querystring')
const sanitizehtml = require(`sanitize-html`)
const tmpl = require(`./tmp.js`);

/* declare route */
let route_lgn = require('./login.js')
let route_idx = require('./idx.js')
let route_chk = require('./chk_wau.js')
let route_create = require('./route_C.js')
let route_update = require('./route_U.js')
let p_n = require('./patchnote.js')
let tmi = require('./tmi.js')
let logout = require('./logout.js')
/**/

let app = express();
//let port = 4201;
let port = process.env.PORT||4201;

app.use(express.static(__dirname + `/src/`));

app.use('/',route_lgn)
app.use('/idx',route_idx)
app.use('/chk_wau',route_chk)
app.use('/create/',route_create)
app.use('/update/',route_update)
app.use('/patchnote/',p_n)
app.use('/TMI',tmi)
app.use('/logout',logout)

app.get('/read/:id',(req,resp)=>{
    if(req.session.loginyn){
        fs.readdir(__dirname + `/src/txt`,(err,list)=>{
            if(err){throw err};
            let _li = tmpl.list(list);
            let qid = sanitizehtml(req.params.id);
            fs.readFile(__dirname + `/src/txt/${qid}`,`utf-8`,(err1,data)=>{
                let sani_data = sanitizehtml(data)
                let tmp = tmpl.read(`${qid}`,`${sani_data}`,`${_li}`,`
                    <script>
                    let del_chk = () => {
                        if(confirm('정말 삭제하시겠습니까?')){
                            //getElementsByName을 사용하면 배열을 받으므로 [0] 배열에서 값 꺼내오기 필요
                            let form = document.getElementById('del_form')
                            form.action = '/deleting' ;
                            form.submit();
                        }
                    }
                    </script>
                    <form method='post' id='del_form'>
                        <input type='hidden' name='oid' value='${qid}'>
                    </form>
                    <input type='button' id='del' onclick='del_chk()'>
                    <label for='del'><img src='/icon/trash_bin.png' id='delete_icon' alt='대충 삭제아이콘' title='삭제'></label>
                `);
                resp.send(tmp);
            });
        });
    }
    else {
        resp.status(302).send(`<script>alert('로그인을 해주세요');location.href="/"</script>`)
    }
});


app.post('/deleting',(req,resp)=>{
    let body = ``
    req.on(`data`,(data)=>{
        body += data
    });
    req.on(`end`,()=>{
        let post = qs.parse(body)
        let tit = post.oid        
        fs.unlink(__dirname + `/src/txt/${tit}`,(err)=>{
            if(err){throw err}
            resp.redirect(302,`/idx`)
        });
    });
});

app.listen(port, () => {
    console.log(`Join us at http://localhost:${port}`);
  });