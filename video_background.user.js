// ==UserScript==
// @name        video_background
// @namespace   video_background
// @supportURL  https://github.com/zhuzemin
// @description use video as page background
// @include     https://*
// @include     http://*
// @exclude     https://www.google.*/*
// @exclude     https://www.baidu.com/*
// @exclude     https://anime1.me/*
// @exclude     https://*.jpg
// @exclude     https://*.gif
// @exclude     https://*.png
// @exclude     http://*.jpg
// @exclude     http://*.gif
// @exclude     http://*.png
// @exclude     http://*.mp4
// @exclude     https://*.mp4
// @exclude     http://*.swf
// @exclude     https://*.swf
// @exclude     http://*.pdf
// @exclude     https://*.pdf
// @version     1.4
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src 127.0.0.1
// ==/UserScript==
var config = {
    'debug':false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};
var host='http://127.0.0.1/';
var videoList;
var dirList;
var urlRoot;
var usedList=[];
var dirCount=0;
var hostname;
var textColorList;
// prepare UserPrefs
setUserPref(
    'urlRoot',
    host+'******',
    'Set root url',
    `Url from HFS.(.mp4 or dir)`,
    ','
);

class ObjectRequest{
    constructor(url) {
        this.method = 'GET';
        this.url = url;
        this.data=null,
            this.headers = {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                //'Accept': 'application/atom+xml,application/xml,text/xml',
                //'Referer': window.location.href,
            };
        this.charset = 'text/plain;charset=utf8';
        this.other=null;
    }
}

var init = function () {
    if (window.self === window.top){
        urlRoot=GM_getValue('urlRoot')||null;
        videoList=GM_getValue('videoList');
        if(videoList!=undefined){
            videoList=JSON.parse(videoList);
        }
        else {
            videoList=[];
        }
        dirList=GM_getValue('dirList');
        if(dirList!=undefined){
            dirList=JSON.parse(dirList);
        }
        else {
            dirList=[];
        }
        debug(dirList);
        var blackList=GM_getValue('blackList');
        if(blackList!=undefined){
            blackList=JSON.parse(blackList);
        }
        else {
            blackList=[];
        }
        debug(blackList);
        textColorList=GM_getValue('textColorList');
        if(textColorList!=undefined){
            textColorList=JSON.parse(textColorList);
        }
        else {
            textColorList=[];
        }
        debug(textColorList);

        /*var lastTime=GM_getValue('lastTime')||0;
        var present=parseInt(new Date(). getTime()/1000);
        debug(present-parseInt(lastTime));
        if(present-parseInt(lastTime)>86400){
            videoList=[];
            dirList=[];
            GM_setValue('lastTime',present);
            GM_setValue('videoList',JSON.stringify(videoList));
            GM_setValue('dirList',JSON.stringify(dirList));
        }*/
        if(urlRoot!=null){
            hostname=getLocation(window.location.href).hostname;
            var status=false;
            CreateButton('Text BG-color',function () {
                var index = textColorList.indexOf(hostname);
                var aList=document.querySelectorAll('a');
                if(!status){

                    for (var a of aList){
                        a.style.backgroundColor='#ffffff';
                    }
                    status=true;
                    if (!index > -1) {
                        textColorList.push(hostname);
                    }
                }
                else{
                    for (var a of aList){
                        a.style.backgroundColor='';
                    }
                    status=false;
                    if (index > -1) {

                        textColorList.splice(index, 1);
                    }

                }
                GM_setValue('textColorList',JSON.stringify(textColorList));

            },0);
            CreateButton('Clear file list',function () {
                dirList=[];
                videoList=[];
                GM_setValue('videoList',JSON.stringify(videoList));
                GM_setValue('dirList',JSON.stringify(dirList));
            },36);

            CreateButton('Add/Del Black List',function (e) {
                var msg;
                   var index = blackList.indexOf(hostname);
                   if (index > -1) {
                       blackList.splice(index, 1);
                       msg='Del Success';
                   }
                   else {
                       blackList.push(hostname);
                       msg='Add Success';
                   }
                   GM_setValue('blackList',JSON.stringify(blackList));
                e.target.innerHTML=msg;
                   setTimeout(function () {
                       e.target.innerHTML='Add/Del Black List';
                   },1000);
            },72);
            if(!blackList.includes(hostname)) {
                urlRoot = urlRoot.replace(/http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\//, host);
                if (/\.mp4$/.test(urlRoot)) {
                    insertVideo(urlRoot);
                }
                else {
                    var obj = new ObjectRequest(urlRoot);
                    request(obj, HandleHFS);
                    debug(urlRoot);

                }
            }
        }

    }
}

function CreateButton(text,func,positionTop){
    var btn=document.createElement("button");
    btn.type="button";
    btn.onclick="";
    btn.innerHTML=text;
    btn.style=`
  position: fixed;
  left: 0px;
  top: `+positionTop+`px;
  z-index: 1000;
  opacity:0.1;
  `;
    btn.addEventListener('click',func);
    btn.addEventListener('mouseout',function () {
        btn.style.opacity=0.1;

    });
    btn.addEventListener('mouseover',function () {
        btn.style.opacity=1;
    });
    document.body.insertBefore(btn,document.body.firstChild);
}


function HandleHFS(responseObj){
    if(responseObj.status==200){
        if(dirCount!=0){

            dirCount--;
        }
        debug('dirCount: '+dirCount);
        var dom = new DOMParser().parseFromString(responseObj.responseText, "text/html");
        var files = dom.querySelector('#files');
        var trList=files.querySelectorAll("tr");
        for(var tr of trList){
                var a=tr.querySelector('a');
                debug('a.href: '+a.href);
                var url=a.href.replace(/https?:\/\/.*\/([^\/]*((\.mp4)|\/)$)/, function(match, $1, $2, offset, original){ return responseObj.finalUrl+$1;})
            debug('url: '+url);
                if(/\.mp4$/.test(a.textContent)&&!videoList.includes(url)){
                    videoList.push(url);
                    GM_setValue('videoList',JSON.stringify(videoList));
                }
                else if(a.textContent!='Name'){
                    var img=a.querySelector('img');
                    debug(img.src);
                    if(img.src.includes('/~img_folder')){
                        if(dirList.length!=0){
                            debug(dirList)
                            for(var existUrl of dirList){
                                if(existUrl.includes(url)){
                                    break;
                                }
                                else if(existUrl==dirList[dirList.length-1]){
                                    debug('existUrl: '+existUrl+' & '+'url: '+url);
                                    dirCount++;
                                    var obj=new ObjectRequest(url);
                                    dirList.push(url);
                                    GM_setValue('dirList',JSON.stringify(dirList));
                                    request(obj,HandleHFS);



                                }
                            }

                        }
                        else {
                            dirCount++;
                            dirList.push(url);
                            GM_setValue('dirList',JSON.stringify(dirList));
                            var obj=new ObjectRequest(url);
                            request(obj,HandleHFS);

                        }

                    }

                }


            if (tr==trList[trList.length-1]&&dirCount==0) {
                    videoShuffle();
                if (textColorList.includes(hostname)) {
                    var aList=document.querySelectorAll('a');
                    for (var a of aList){
                        a.style.backgroundColor='#ffffff';
                    }
                }
                else {
                    for (var a of aList){
                        a.style.backgroundColor='';
                    }
                }
            }
        }
        dirCount--;
    }
}

window.addEventListener('DOMContentLoaded', init);
function request(object,func) {

    var retries = 3;
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        data: object.data,
        headers: object.headers,
        overrideMimeType: object.charset,
        timeout:120000,
        //synchronous: true
        onload: function (responseDetails) {
            //debug(responseDetails);
            if (responseDetails.status != 200&&responseDetails.status != 302) {
                // retry
                if (retries--) {          // *** Recurse if we still have retries
                    setTimeout(request,2000);
                    return;
                }
            }
            //Dowork
            func(responseDetails,object.other);
        },
        ontimeout: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);

        },
        ononerror: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);

        }
    })
}
function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
        var val = prompt(promtText, GM_getValue(varName, defaultVal));
        if (val === null)  { return; }  // end execution if clicked CANCEL
        // prepare string of variables separated by the separator
        if (sep && val){
            var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
            var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
            //val = val.replace(pat1, sep).replace(pat2, '');
        }
        //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
        GM_setValue(varName, val);
        // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
        //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
        //else location.reload();
    });
}
function videoShuffle() {
    debug('videoList: '+videoList);
    for(var used of usedList){

        var index = videoList.indexOf(used);
        if (index > -1) {
           videoList.splice(index, 1);
        }
    }
    var randomNum = Math.floor(Math.random() * (videoList.length - 0));
    var url=videoList[randomNum];
    insertVideo(url);

}
function insertVideo(url) {
    debug('insertVideo');
            var video = document.createElement("video");
            video.style = 'width:100%';
            video.src = url;
            video.autoplay = true;
            video.muted=true;
            var div = document.createElement("div");
            div.style = "width:100%;    position: fixed;    top: 0;    left: 0;    z-index: -100;";
            div.insertBefore(video, null);
            debug(url);
            document.body.insertBefore(div, null);

            window.addEventListener("focus", function () {
                video.play();
            });
            window.addEventListener("blur", function () {
                video.pause();
            });
            video.addEventListener('ended',function () {
                videoShuffle();
            });
}
function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}
