const fs = require('fs')
const sanitizehtml = require(`sanitize-html`)

module.exports = {
    read : (tit,ctt,lit,ctl)=>{
        return `        
            <!DOCTYPE HTML>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>${tit}</title>
                    <link rel="shortcut icon" href="/icon/favi.ico" type="image/x-icon" />
                    <link rel="icon" href="/icon/favi.ico" type="image/x-icon" />
                    <link rel="stylesheet" type="text/css" href='/common.css'>
                    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css">
                    <script>
                        let default_img = (val) =>{
                            document.getElementById(val).src='/img/nosuchimg.png'
                        }
                    </script>
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
                        <input type='button' onclick="location.href='/update/${tit}'" id='update'>
                        <label for='update'><img src='/icon/update.png' id='update_icon' alt='대충 수정하기 아이콘' title='수정하기'></label>
                        ${ctl}
                    </ctl>
                    <br>
                    <tit>
                        <img src="/img/${tit}.png" id='img' alt="No such img : ${tit}.png" onerror="default_img('img')"><h1>${tit}</h1>
                    </tit>
                    <ctt>${ctt}</ctt>
                </body>
                <footer>
                    <ref>IMG출처 : <a href="https://pixabay.com" title="https://pixabay.com">https://pixabay.com</a><br>ICON출처 : <a href="https://findicons.com/pack/3" title="https://findicons.com/pack/3">https://findicons.com/pack/3</a></ref>
                </footer>
            </html>
        `
    },
    list : (list) =>{
        let li = `<ul>`
        for(let i=0;i<list.length;i++){
            li = li + `<li><a href='/read/${list[i]}'>${list[i]}</a></li>`
        }
        li = li + `</ul>`
        return li;
    },
    
    index : (tit,lit,ctl,loginid,loginauth) =>{
        return `<!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="utf-8">
                <link rel="shortcut icon" href="/icon/favi.ico" type="image/x-icon" />
                <link rel="icon" href="/icon/favi.ico" type="image/x-icon" />
                <link rel='stylesheet' type='text/css' href='/index.css'>
                <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css">
                <title>Not 4 Sale, Just Do it 4 Fun</title>
                <script>
                    let view_mode = (val) => {
                        document.getElementsByTagName('ul')[0].id = val
                    }
                    let default_img = (val) =>{
                        document.getElementById(val).src='/img/nosuchimg.png'
                    }
                </script>
            </head>
            <body>
                <tit id='idx_tit'><h1>${tit}</h1></tit>
                <profile>
                    <img src='../img/돌고래.png' alt="대충 돌고래가 바라보는 그림" onclick="alert('돌고래가 당신을 환영하는 듯하다')">
                    <auth onclick='alert("권한 : ${loginauth}")'>ID : ${loginid}</auth><br>
                </profile>
                    
                    <input type="button" onclick="location.href='./logout'" value='LOGOUT' id='logout'>
                    <input type="button" onclick="location.href='https://rtc-42.herokuapp.com/'" value='실시간채팅' id='rtc'>
                <ctl>
                    ${ctl}
                </ctl>
                <br>
                ${lit}
            </body>
            <footer>
                    <ref>IMG출처 : <a href="https://pixabay.com" title="https://pixabay.com">https://pixabay.com</a><br>ICON출처 : <a href="https://findicons.com/pack/3" title="https://findicons.com/pack/3">https://findicons.com/pack/3</a></ref>
                    <pn id="p_n"><a href='/TMI/' title="TMI" >TMI</a>       <a href='/patchnote' title="패치노트" >패치노트</a></pn>
            </footer>
        </html>`
    },
    list_index : (list) =>{
        let li = `<ul id='ul_grid'>`    
        for(let i=0;i<list.length;i++){
            /* readFile은 비동기처리되기 때문에 scope를 벗어나면 값을 쓰지 못함 */
            //let ctt = fs.readFileSync(__dirname + `/src/txt/${list[i]}`,`utf-8`)     /**idx page에서 list_view인 경우 제목이 아닌 내용이 표시되도록 구현했던 부분입니다.**/ 
            //let sani_ctt = sanitizehtml(ctt)                                         /**내용에 XSS가 있는 경우를 방어하기 위한 sanitize 적용입니다.**/ 
            li = li + `<li><a href='/read/${list[i]}'><img title='${list[i]}' src='/img/${list[i]}.png' alt="No such img :${list[i]}.png" id='list${i}' onerror="default_img('list${i}')"></a><ctt id='ctt'>${list[i]}</ctt></li>`
        }
        li = li + `</ul>`
        return li;
    },
    
    create : () =>{
        return `<input type='button' onclick=location.href='/create' id='create'>
        <label for='create'><img src='/icon/write.png' id='create_icon' alt='대충 새 글 작성 아이콘' title='새 글 쓰기'></label>`
    },
    tmp_CU : (tit,ctt,lit,ctl)=>{
        return `        
            <!DOCTYPE HTML>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>${tit}</title>
                    <link rel="shortcut icon" href="/icon/favi.ico" type="image/x-icon" />
                    <link rel="icon" href="/icon/favi.ico" type="image/x-icon" />
                    <link rel="stylesheet" type="text/css" href='/creatupdt.css'>
                    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css">
                </head>
                <script>
                    let post_chk = () =>{
                        let tit = document.getElementById('tit').value
                        /*******제목이 공백으로 끝나는 것을 비허용*********/
                        let p = /\\s+$/
                        document.getElementById('tit').value=tit.replace(p,'')
                        tit = document.getElementById('tit').value
                        /***********************************************/
                        if (tit==''){
                            alert('!!! 제목은 필수입력 항목입니다.');
                            return false;
                        }
                        else {
                            document.getElementById('frm').submit()
                        }
                    }
                </script>
                <body>
                    <ctl>
                        <input type='button' onclick=location.href='/idx' id='home'>
                        <label for='home'><img src='/icon/home.png' alt='대충 메인페이지로 돌아가기 아이콘' id='home_icon' title='메인페이지로 돌아가기'></label>
                        ${ctl}
                    </ctl>
                    <br>
                    <tit>
                        <h1>${tit}</h1>
                    </tit>
                    <ctt>${ctt}</ctt>
                </body>
                <footer>
                    <ref>ICON출처 : <a href="https://findicons.com/pack/3" title="https://findicons.com/pack/3">https://findicons.com/pack/3</a></ref>
                </footer>
            </html>
        `
    }
}