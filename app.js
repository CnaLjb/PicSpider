"use strict";
var linkq = require("./linkQueue");
var LinkQueue = linkq.LinkQueue;
var fs = require("fs");
var cheerio = require('cheerio');
var request = require('sync-request');
var $ = null;
var PicSpider = (function () {
    function PicSpider() {
        this.globalImgUrlSet = {};
        this.rootUrl = "http://www.meizitu.com";
        this.urlQueue = new LinkQueue();
        this.globalVisitedUrl = {};
    }
    PicSpider.prototype.scanRootPage = function (url) {
        var html = request('GET', url).getBody().toString();
        var divContent = this.getMainContent(html);
        if (divContent == null) {
            console.log("无法获取 id 为【maincontent】的 div...");
            return;
        }
        var aTagArr = divContent.find('a');
        for (var i = 0; i < aTagArr.length; i++) {
            var aTag = aTagArr[i];
            var path = $(aTag).attr('href');
            if (path.indexOf("/") == 0) {
                path = url + path;
            }
            this.urlQueue.push(path);
        }
    };
    PicSpider.prototype.enterNextPage = function () {
    };
    PicSpider.prototype.spiderEntry = function () {
        this.scanRootPage(this.rootUrl);
        while (this.urlQueue.getSize() > 0) {
            var url = this.urlQueue.popup().data;
            console.log("访问url\t:" + url);
            if (url in this.globalVisitedUrl) {
                console.log("该url已访问过，跳过");
                continue;
            }
            var html = request('GET', url).getBody().toString();
            var divContent = this.getMainContent(html);
            if (divContent) {
                var imgTags = divContent.find('img');
                for (var i = 0; i < imgTags.length; i++) {
                    var imgTag = $(imgTags[i]);
                    var imgSrc = imgTags.attr('src');
                    if (!(imgSrc in this.globalImgUrlSet)) {
                        this.globalImgUrlSet[imgSrc] = true;
                    }
                }
                this.globalVisitedUrl[url] = true;
            }
        }
        console.log("***********ImageUrl**************");
        console.log(this.globalImgUrlSet);
        console.log("***********ImageUrl**************");
    };
    PicSpider.prototype.getMainContent = function (html) {
        $ = cheerio.load(html);
        var mainContentNode = $('#maincontent');
        if (mainContentNode) {
            return mainContentNode;
        }
        return null;
    };
    return PicSpider;
}());
var finder = new PicSpider();
finder.spiderEntry();
//# sourceMappingURL=app.js.map