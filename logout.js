const express = require('express');
let route = express.Router();

route.get('/',(req,resp)=>{
    req.session.destroy((err)=>{
        if(err){throw err};
        resp.status(200).send(`<script>alert('See U Again!');location.href="/"</script>`);
    });
});

module.exports = route;