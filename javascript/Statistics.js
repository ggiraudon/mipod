"use strict";
var Statistics = /** @class */ (function () {
    function Statistics(library, onTaggedClbk) {
        this.library = library;
        this.onTaggedClbk = onTaggedClbk;
        this.lastPlayed = "";
        this.idleLoop();
    }
    //    private idleOnce(): q.Promise<void> {
    //        var that = this;
    //        return MpdClient.idle()
    //            .then(MpdClient.current)
    //            .then(MpdEntries.readEntries)
    //            .then(function(entries: MpdEntry[]) {
    //                if (entries.length > 0 && entries[0].song) {
    //                    return entries[0].song.file;
    //                }
    //                return null;
    //            })
    //            .then(function(file) {
    //                if (that.lastPlayed != file) {
    //                    that.nowPlaying(file);
    //                }
    //            });
    //    }
    Statistics.prototype.idleLoop = function () {
        //        var that = this;
        //        this.idleOnce().then(function() {
        //            that.idleLoop();
        //        });
    };
    Statistics.prototype.nowPlaying = function (file) {
        var tagTimes = "times";
        var tagLast = "last";
        var targets = [];
        targets.push({
            targetType: "song",
            target: file
        });
        var that = this;
        // Note: when tag doesn't exist, readTags returns it as "null"
        // "null + 1" = 1... [sic]
        this.library.readTag(tagTimes, targets).then(function (tag) {
            if (tag.hasOwnProperty("song")
                && tag["song"].hasOwnProperty(file)
                && tag["song"][file].hasOwnProperty(tagTimes)) {
                try {
                    var times = +tag["song"][file][tagTimes];
                    that.library.writeTag(tagTimes, String(times + 1), targets)
                        .then(function (writtenTag) {
                        that.onTaggedClbk(writtenTag);
                    });
                }
                catch (err) {
                    console.log("Could not write tag " + tagTimes + " on " + file);
                    console.log(err);
                }
            }
        });
        this.library.writeTag(tagLast, String(new Date()), targets)
            .then(function (writtenTag) {
            that.onTaggedClbk(writtenTag);
        });
    };
    return Statistics;
}());
module.exports = Statistics;
