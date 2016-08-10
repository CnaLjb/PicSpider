///<reference path='./DefinitelyTyped/app.d.ts' />

import linkq  = require("./linkQueue")
import LinkQueue = linkq.LinkQueue;
import QNode = linkq.QNode;
var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./jquery.js", "utf-8");



/**
 * 
 * 图片爬虫类
 */
class PicSpider {


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
     * 扫描Page 获取页面中的<a>
     * */
    public scanRootPage(url:string){

        jsdom.env({
            url: url,
            src: [jquery],
            done: function (err, window) {
                console.log("there have been", window.$("a").length - 4, "io.js releases!");
            }
        });
    }

    /**递归扫描 */
    public recursionScan(){
        
    }
}


var finder = new PicSpider();
finder.scanRootPage(finder.rootUrl);
