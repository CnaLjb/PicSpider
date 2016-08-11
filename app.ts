///<reference path='./DefinitelyTyped/app.d.ts' />

import linkq  = require("./linkQueue")
import LinkQueue = linkq.LinkQueue;
import QNode = linkq.QNode;
// var jsdom = require("jsdom");
var fs = require("fs");
// var jquery = fs.readFileSync("./jquery.js", "utf-8");
var cheerio = require('cheerio');
var request = require('sync-request');

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
    public visitedUrl;

    // 初始化
    constructor() {
        this.urlQueue = new LinkQueue();
        this.visitedUrl = {};
    }

    /**种子url */
    rootUrl = "http://www.meizitu.com/";

    /**
     * 扫描Page 获取页面中的<a>标签
     */
    public scanRootPage(url:string){
        let html = request('GET', url).getBody().toString();
        let $ = this.getMainContent(html);
        if($ == null){
            console.log("无法获取 id 为【maincontent】的 div...");
            return;
        }
        //a标签数组
        let aTagArr:Array<any> = $('a');
        for(let i=0;i<aTagArr.length;i++){
            let aTag = aTagArr[i];
            let url = aTag.attr('href');
            this.urlQueue.push(url);
        }
        
    }

    /**爬虫入口 */
    public spiderEntry(){
        this.scanRootPage(this.rootUrl);
        
    }

    /**
     * 获取页面主图片所在的Div
     */
    public getMainContent(html:string):any{
        var $ = cheerio.load(html);
        var mainContentNode = $('#maincontent');
        if(mainContentNode){
            return mainContentNode.html();
        }
        return null;
    }     

    /**修正匹配只拿html某个区域下的路径 */

}


var finder = new PicSpider();
finder.scanRootPage(finder.rootUrl);
