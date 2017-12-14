"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsCommon = /** @class */ (function () {
    function JsCommon() {
        this.dateUtil = new /** @class */ (function () {
            function DateUtil() {
            }
            // TODO: Check whether this can be better replaced with a lib like moment.js.
            DateUtil.prototype.parseTime = function (time) {
                var parts = time.split(":");
                if (parts.length > 2) {
                    throw new Error("Not implemented support for time string: " + time);
                }
                var hours = parts[0] === "24" ? "0" : parts[0];
                var minutes = parts.length > 1 ? parts[1] : "0";
                return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
            };
            // TODO: Check whether this can be better replaced with a lib like moment.js.
            DateUtil.prototype.getDateAtTime = function (date, time) {
                var result = new Date();
                result.setFullYear(date.getFullYear());
                result.setMonth(date.getMonth());
                result.setDate(date.getDate());
                result.setHours(time.getHours());
                result.setMinutes(time.getMinutes());
                result.setSeconds(time.getSeconds());
                result.setMilliseconds(time.getMilliseconds());
                return result;
            };
            return DateUtil;
        }());
        this.geoUtil = new /** @class */ (function () {
            function GeoUtil() {
            }
            /**
             * Adapted from http://stackoverflow.com/q/18883601/443836
             */
            GeoUtil.prototype.getDistanceInKm = function (pos1, pos2) {
                var earthRadiusInKm = 6371;
                var dLat = degToRad(pos2.lat() - pos1.lat());
                var dLng = degToRad(pos2.lng() - pos1.lng());
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                    + Math.cos(degToRad(pos1.lat())) * Math.cos(degToRad(pos2.lat()))
                        * Math.sin(dLng / 2) * Math.sin(dLng / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return earthRadiusInKm * c;
                function degToRad(deg) {
                    return deg * (Math.PI / 180);
                }
            };
            return GeoUtil;
        }());
        this.i18nUtil = new /** @class */ (function () {
            function I18nUtil() {
            }
            I18nUtil.prototype.transform = function (node, language) {
                var newNode = {};
                try {
                    for (var _a = __values(Object.getOwnPropertyNames(node)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var childName = _b.value;
                        var child = node[childName];
                        if (typeof child === "string") {
                            return node[language];
                        }
                        else {
                            newNode[childName] = this.transform(child, language);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return newNode;
                var e_1, _c;
            };
            // TODO: Check whether this can be better replaced with a lib like moment.js.
            I18nUtil.prototype.formatTimeInterval = function (beginDate, endDate, language) {
                var extraLongHyphen = "–"; // Your editor may display this as a regular hyphen.
                var separator = " " + extraLongHyphen + " ";
                var postfix = language === "en" ? "" : " Uhr";
                return formatTime(beginDate) + separator + formatTime(endDate) + postfix;
                function formatTime(date) {
                    var h = date.getHours();
                    var m = date.getMinutes();
                    if (language === "en") {
                        if (m === 0) {
                            if (h === 0) {
                                return "12 midnight";
                            }
                            else if (h < 12) {
                                return h + " am";
                            }
                            else if (h === 12) {
                                return "12 noon";
                            }
                            else {
                                return (h - 12) + " pm";
                            }
                        }
                        else {
                            if (h < 12) {
                                return h + ":" + pad(m) + " am";
                            }
                            else if (h === 12) {
                                return h + ":" + pad(m) + " pm";
                            }
                            else {
                                return (h - 12) + ":" + pad(m) + " pm";
                            }
                        }
                    }
                    else {
                        if (m === 0) {
                            return h;
                        }
                        else {
                            return h + ":" + pad(m);
                        }
                    }
                    function pad(n) {
                        return n < 10 ? "0" + n : n;
                    }
                }
            };
            // TODO: Check whether this can be better replaced with a I18n lib.
            I18nUtil.prototype.abbreviateWeekDay = function (weekday, language) {
                var charCount = language === "en" ? 3 : 2;
                return weekday.substring(0, charCount);
            };
            // TODO: Check whether this can be better replaced with a I18n lib.
            I18nUtil.prototype.formatNumberString = function (numberString, language) {
                return language === "en" ?
                    numberString.replace(/\,/, ".")
                    :
                        numberString.replace(/\./, ",");
            };
            return I18nUtil;
        }());
        this.domUtil = new /** @class */ (function () {
            function DomUtil() {
            }
            // Adapted from https://stackoverflow.com/a/15203639 (also see comments)
            DomUtil.prototype.isElementVisible = function (element) {
                var rect = element.getBoundingClientRect();
                var vWidth = window.innerWidth || document.documentElement.clientWidth;
                var vHeight = window.innerHeight || document.documentElement.clientHeight;
                // Return false if it's not in the viewport
                if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
                    return false;
                }
                // Return true if any of its four corners are visible
                return (element.contains(document.elementFromPoint(rect.left, rect.top))
                    || element.contains(document.elementFromPoint(rect.right, rect.top))
                    || element.contains(document.elementFromPoint(rect.right, rect.bottom))
                    || element.contains(document.elementFromPoint(rect.left, rect.bottom)));
            };
            return DomUtil;
        }());
        this.openingTimesUtil = new /** @class */ (function () {
            function OpeningTimesUtil() {
            }
            OpeningTimesUtil.prototype.isOpen = function (openingTimeIntervals, dayOfWeek, time) {
                var getDateAtTime = new JsCommon().dateUtil.getDateAtTime;
                var currentInterval = openingTimeIntervals[dayOfWeek];
                if (!time) {
                    return !!currentInterval;
                }
                var date = new Date(0);
                var dayTime = getDateAtTime(date, time);
                if (currentInterval) {
                    // Is it open due to today's opening times?
                    var dayBegin = getDateAtTime(date, currentInterval.begin);
                    var dayEnd = getDateAtTime(date, currentInterval.end);
                    if (dayBegin.getTime() === dayEnd.getTime()) {
                        // Special case: Always open
                        return true;
                    }
                    if (dayBegin > dayEnd) {
                        // The day has special opening times, so adjust the end time.
                        var nextDate = new Date(0);
                        nextDate.setDate(nextDate.getDate() + 1);
                        dayEnd = getDateAtTime(nextDate, currentInterval.end);
                    }
                    if (dayBegin <= dayTime && dayTime < dayEnd) {
                        return true;
                    }
                }
                // Seems to be closed so far, but maybe it is open due to
                // special opening times on the previous day.
                var previousDayOfWeek = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                var previousInterval = openingTimeIntervals[previousDayOfWeek];
                if (previousInterval) {
                    var previousDate = new Date(0);
                    previousDate.setDate(previousDate.getDate() - 1);
                    var previousDayBegin = getDateAtTime(previousDate, previousInterval.begin);
                    var previousDayEnd = getDateAtTime(previousDate, previousInterval.end);
                    if (previousDayBegin > previousDayEnd) {
                        // Previous day indeed has special opening times, so adjust the end time.
                        previousDayEnd = getDateAtTime(date, previousInterval.end);
                        return dayTime < previousDayEnd;
                    }
                }
                return false;
            };
            return OpeningTimesUtil;
        }());
    }
    return JsCommon;
}());
exports.JsCommon = JsCommon;
//# sourceMappingURL=index.js.map