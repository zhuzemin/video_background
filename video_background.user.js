// ==UserScript==
// @name        video_background
// @namespace   video_background
// @supportURL  https://github.com/zhuzemin
// @description use video as page background
// @include     https://*
// @include     http://*
// @version     1.0
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
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};
var host='http://127.0.0.1/';
var videoList=[];
var usedList=[];
var dirCount=0;
// prepare UserPrefs
setUserPref(
    'urlRoot',
    host+'******',
    'Set host url',
    `Enter url from HFS.(.mp4 or folder)`,
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
    var urlRoot=GM_getValue('urlRoot')||null;
    if(urlRoot!=null){
        urlRoot=urlRoot.replace(/http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\//,host);
        if(/\.mp4$/.test(urlRoot)){
            insertVideo(urlRoot);
        }
        else {
            var obj=new ObjectRequest(urlRoot);
            request(obj,HandleHFS);
            debug(urlRoot);

        }

    }
}

function HandleHFS(responseObj){
    if(responseObj.status==200){
        debug('dirCount: '+dirCount);
        var dom = new DOMParser().parseFromString(responseObj.responseText, "text/html");
        var files = dom.querySelector('#files');
        var trList=files.querySelectorAll("tr");
        for(var tr of trList){
            if (!(tr==trList[trList.length-1]&&dirCount==1)) {
                var a=tr.querySelector('a');
                debug(a.textContent);
                var url=a.href.replace("http://",'').replace("https://",'').replace(getLocation(window.location.href).hostname+"/", responseObj.finalUrl);
                if(/\.mp4$/.test(a.textContent)){
                    videoList.push(url);
                }
                else if(a.textContent!='Name'){
                    var img=a.querySelector('img');
                    debug(img.src);
                    if(img.src.includes('/~img_folder')){
                        dirCount++;
                        //var url=dirList.push(responseObj.finalUrl+a.href);
                        var obj=new ObjectRequest(url);
                        request(obj,HandleHFS);
                    }

                }

            }
            else {
                videoShuffle();
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
            debug(responseDetails);
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
    for(var used of usedList){

        var index = videoList.indexOf(used);
        if (index > -1) {
           videoList.splice(index, 1);
        }
    }
    var randomNum = Math.floor(Math.random() * (videoList.length+1 - 0));
    var url=videoList[randomNum];
    insertVideo(url);

}
function insertVideo(url) {
            var video = document.createElement("video");
            video.style = 'width:100%';
            video.src = url;
            video.autoplay = true;
            video.muted=true;
            var div = document.createElement("div");
            div.style = "width:100%;    position: fixed;    top: 0;    left: 0;    z-index: -100;";
            div.insertBefore(video, null);
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
