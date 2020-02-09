Compatibility:
Firefox/Chrome,
Greasemonkey/Tampermonkey

This script play video as background in web page.
don't worry about slow down you computer, video will pause when you switch Tab or Minimize Window,
performance cause just like playing youtube.



it has 2 video source can be choice:
1: local folder
2: youtube playlist

if use case 1 local folder:
because browser security restrictions, browser can not directly play video from local, 
so need a tiny soft: HFS, it's use to run a Http Server in your system,
don't worry, unless you open Port(80) in your Router, otherwise this Http Server are totally private.
and HFS is very easy to use, you can download from official site: https://www.rejetto.com/hfs/?f=dl
then:
1: Open HFS, drop your video folder into,
2: copy the Url show in HFS, 
3: Paste it to this userscript setting: "Set root url", 
4: refresh page.



in case 2 youtube playlist:
1: Paste youtube playlist url to this userscript setting: "Set youtube playlist", 
(url look like: "https://www.youtube.com/playlist?list=PLmlTcWwPyp188O1lK2fyYA_WFckZNrb0b")
2: refresh page.



Notice:
*if the background video makes text unrecognizable, there have a Button on bottom, will give all Text BG-color.
*script will loop through all sub folder, play randomly , so just need set root folder.
*for best performance, after first use, script will store file list(or youtube url),
if you want refresh file list: click Button "Clear file list", then refresh page.
*if you are using firefox, need set Cache to 1024(max), otherwise after while use, will not play video anymore(need restart firefox)

![01](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-1.jpg)

![02](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-1(2).jpg)

![03](https://github.com/zhuzemin/video_background/raw/master/2020-02-01_060303.jpg)

![04](https://github.com/zhuzemin/video_background/raw/master/2020-02-01_062904.jpg)

![05](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-2.jpg)
