/*  */
const express = require('express');
let route = express.Router();

const qs = require(`querystring`)
const sanitizehtml = require(`sanitize-html`)

route.post('/',(req,resp)=>{
    let body ='';
    req.on(`data`,(data)=>{
        body += data;
    });
    req.on('end',()=>{
        let post = qs.parse(body);
        let id = sanitizehtml(post.lgn_id)
        let pw = sanitizehtml(post.lgn_pw)
        if(id==''||pw==''){
            resp.status(302).send(`<script>alert('ID/PW is NULL');location.href='/'</script>`)
        }
        else if(id=='root'){
            if(pw=='user'){
                req.session.loginid=`root-user`;
                req.session.auth='administrator';
                req.session.loginyn=true;
                req.session.save(function(){
                    resp.status(302).send(`<script>alert('Log-in as Root');location.href='./idx'</script>`)
                });
            }
            else {
                resp.status(302).send(`<script>alert('Deny');location.href='/'</script>`)
            }
        }
        else {
            req.session.loginid=`${id}`;
            req.session.auth='등록되지 않은 사용자';
            req.session.loginyn=true;
            req.session.save(function(){
                resp.status(302).send(`<script>alert('등록되지 않은 사용자 : ${id}');location.href='./idx'</script>`);
            });
        }
    })
});

module.exports = route;