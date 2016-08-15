///<reference path='./DefinitelyTyped/app.d.ts' />

import linkq  = require("./linkQueue")
import LinkQueue = linkq.LinkQueue;
import QNode = linkq.QNode;
// var jsdom = require("jsdom");
var fs = require("fs");
// var jquery = fs.readFileSync("./jquery.js", "utf-8");
var cheerio = require('cheerio');
var request = require('sync-request');
var $ = null;
/**
 * 
 * 妹纸图网站爬虫
 */
class PicSpider {

    /**匹配规则
     * 
     * 主内容在pagecontent下
     * 
     *   主图 div id：#maincontent 
     *  
        *   右侧菜单栏 div id： #sidebar  
        * 
        *   翻页 div id：wp_page_numbers
     */        

    /**未访问过的url队列 */
    public urlQueue:LinkQueue

    /**已访问过的url的Map */
    public globalVisitedUrl;

    /**
     * 传给子进程的ImgUrl集合
     * 主进程负责获取url，子进程负责下载img并保存
     * 
     */ 
    public globalImgUrlSet = {};


    // 初始化
    constructor() {
        this.urlQueue = new LinkQueue();
        this.globalVisitedUrl = {};
    }

    /**种子url */
    rootUrl = "http://www.meizitu.com";

    /**
     * 扫描Page 获取页面中的<a>标签
     */
    public scanRootPage(url:string){
        let html = request('GET', url).getBody().toString();
        let divContent = this.getMainContent(html);
        if(divContent == null){
            console.log("无法获取 id 为【maincontent】的 div...");
            return;
        }
        //a标签数组
        let aTagArr:Array<any> = divContent.find('a');
        for(let i=0;i<aTagArr.length;i++){
            let aTag = aTagArr[i];
            let path = $(aTag).attr('href');
            if(path.indexOf("/") == 0){
                path = url + path; 
            }
            this.urlQueue.push(path);
        }
    }

    /**进入下一页 */
    public enterNextPage(){

    }

    /**爬虫入口 */
    public spiderEntry(){
        this.scanRootPage(this.rootUrl);
        while(this.urlQueue.getSize() > 0){
            let url = this.urlQueue.popup().data;
            console.log("访问url\t:"+url);
            if(url in this.globalVisitedUrl){
                console.log("该url已访问过，跳过");
                continue;
            }
            let html = request('GET', url).getBody().toString();
            var divContent = this.getMainContent(html);
            if(divContent){
                let imgTags = divContent.find('img');
                for(let i=0;i<imgTags.length;i++){
                    let imgTag = $(imgTags[i]);
                    let imgSrc = imgTags.attr('src');
                    if(!(imgSrc in this.globalImgUrlSet)){
                        this.globalImgUrlSet[imgSrc] = true;   
                    }                 
                }
                /**设置为访问过 */
                this.globalVisitedUrl[url] = true;
            }
        }

        console.log("***********ImageUrl**************");
        console.log(this.globalImgUrlSet);
        console.log("***********ImageUrl**************");                        
    }

    /**
     * 获取页面主图片所在的Div
     */
    public getMainContent(html:string):any{
        $ = cheerio.load(html);
        var mainContentNode = $('#maincontent');
        if(mainContentNode){
            return mainContentNode;
        }
        return null;
    }     


}


var finder = new PicSpider();
finder.spiderEntry();
