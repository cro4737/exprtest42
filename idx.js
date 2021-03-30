const express = require('express');
let route = express.Router();

const fs = require('fs');
const tmpl = require(`./tmp.js`);

route.use(express.static('E:/#Dev 관련/node-v14.15.4-win-x64/pj42/src'))

route.get('/',(req,resp)=>{
    if(req.session.loginyn){
        fs.readdir(__dirname + `/src/txt`,(err,list)=>{
            if(err){throw err};
            let _li = tmpl.list_index(list);
            let create = tmpl.create();
        /* fs.readFile(__dirname + `/txt/${lit}`,(err,list)=>{

            })*/
            let tmp = tmpl.index(`Not 4 Sale <br> Just Do it 4 Fun`,_li,
                `${create}
                <img src='/icon/grid_view.png' id='grid_view_icon' alt='대충 격자뷰 아이콘' title='grid_view' onclick='view_mode("ul_grid")' >
                <img src='/icon/list_view.png' id='list_view_icon' alt='대충 리스트뷰 아이콘' title='list_view' onclick='view_mode("ul_list")' >
                `,`${req.session.loginid}`,`${req.session.auth}`)
            resp.send(tmp);
        })
    }
    else {
        resp.status(302).send(`<script>alert('로그인을 해주세요');location.href="/"</script>`)
    }
});

module.exports = route