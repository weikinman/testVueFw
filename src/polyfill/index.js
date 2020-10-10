
    if (typeof Array.prototype.unique === "undefined") {//数组去重
        Array.prototype.unique = function () {
            var res = [];
            var json = {};
            for (var i = 0; i < this.length; i++) {
                if (!json[this[i]]) {
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }
        Array.prototype.uniqueByKey = function (key) {
            var res = [];
            var innserkey = []
            for (var i = 0; i < this.length; i++) {
                if (innserkey.indexOf(this[i][key]) == -1) {
                    innserkey.push(this[i][key]);
                    res.push(this[i]);
                }
            }
            return res;
        }
    }
    if (typeof Date.prototype.format === "undefined") {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }

            if (/(y+)/.test(format)) {
                // console.log(this)
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
    }
    if (typeof Date.prototype.DateAdd === "undefined") {
        //+---------------------------------------------------

        //| 日期计算

        //+---------------------------------------------------
        Date.prototype.DateAdd = function (strInterval, Number) {
            var dtTmp = this;

            switch (strInterval) {
                case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));

                case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));

                case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));

                case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));

                case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));

                case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());

                case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());

                case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }
        }
    }
    if (typeof Date.prototype.DateDiff === "undefined") {
        //+---------------------------------------------------

        //| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串

        //+---------------------------------------------------

        Date.prototype.DateDiff = function (strInterval, dtEnd) {
            var dtStart = this;

            if (typeof dtEnd == 'string')//如果是字符串转换为日期型

            {
                dtEnd = StringToDate(dtEnd);
            }

            switch (strInterval) {
                case 's': return parseInt((dtEnd - dtStart) / 1000);

                case 'n': return parseInt((dtEnd - dtStart) / 60000);

                case 'h': return parseInt((dtEnd - dtStart) / 3600000);

                case 'd': return parseInt((dtEnd - dtStart) / 86400000);

                case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));

                case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);

                case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
            }
        }
    }
