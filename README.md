Compatibility:
Firefox/Chrome,
Greasemonkey/Tampermonkey

This script play video as background in web page.
but because browser security restrictions, userscript can not directly play video from local, 
so need a tiny soft: HFS, it's use to run a Http Server in you system,
don't worry, unless you open Port(80) in your Router, otherwise this Http Server are totally private.
and HFS is very easy to use, you can download from official site: https://www.rejetto.com/hfs/?f=dl

and don't worry about slow down you compute, the video will pause when you switch Tab or Minimize Window,
performance cause just like playing youtube.

My personal opinion: the effect are unexpected, my screen shot may not look like so, because it's not moving.


Usage:
1: Open HFS, drop your video folder into,
2: copy the Url show in HFS, 
3: Paste it to this userscript setting: "Set root url", 
4: refresh page.
5: if the background video makes text unrecognizable, there have a Button on the top, will give all Text white BG-color.

*script will loop through all sub folder, randomly play, so just need set root folder.
*you may set HFS start with windows.
*for best performance, script will store searched file list,
if you want refresh file list: click Button "Clear file list", then refresh page.

![01](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-1.jpg)

![02](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-1(2).jpg)

![03](https://github.com/zhuzemin/video_background/raw/master/2020-02-01_060303.jpg)

![04](https://github.com/zhuzemin/video_background/raw/master/2020-02-01_062904.jpg)

![05](https://github.com/zhuzemin/video_background/raw/master/Screenshot-2020-2-2.jpg)
