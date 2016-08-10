var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./jquery.js", "utf-8");
var QNode = (function () {
    function QNode(data, next) {
        this.data = data;
        this.next = next;
    }
    return QNode;
}());
var LinkQueue = (function () {
    function LinkQueue() {
        this.size = 0;
    }
    return LinkQueue;
}());
var PictureFinder = (function () {
    function PictureFinder() {
        this.rootUrl = "http://cl.tarinx.com/thread0806.php?fid=16";
        this.visitedUrl = {};
    }
    PictureFinder.prototype.scanPage = function (url) {
        jsdom.env({
            url: url,
            src: [jquery],
            done: function (err, window) {
                console.log("there have been", window.$("a").length - 4, "io.js releases!");
            }
        });
    };
    return PictureFinder;
}());
var finder = new PictureFinder();
finder.scanPage(finder.rootUrl);
