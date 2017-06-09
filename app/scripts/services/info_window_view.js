"use strict";

/**
 * There have been great technical diffculties when trying to define the google.maps.InfoWindow content HTML 
 * with a proper AngularJS template. So, to at least have it in a dedicated file, we use this service.
 */
app.factory("InfoWindowViewService", function(kilometerFilter) {

    var extraLongHyphen = "–"; // Your editor may display this as a regular hyphen.
    var linkSymbol = "🔗"; // Your editor may not have this.
    
    var service = {};
    
    service.getContent = function(i18n, language, location, currentPosition) {
        return "<h1>" 
            + location.name 
            + (location.website ? 
                " <a target='_blank' href='" + location.website + "' title='" + location.website + "'>" + linkSymbol + "</a>" 
                : 
                ""
            ) 
            + "</h1>" 
            + "<hr/>"
            + "<div class='infoWindowContent'>" 
            + "<p>" + formatTags(i18n, location.tags) + " (" + i18n.enums.veganCategory.verbose[location.getVeganCategory()] + ")</p>"
            + "<p>" + location.street + " " + location.cityCode + " " + location.district + "</p>"
            + (currentPosition ? "<p>" + i18n.infoWindow.distance + ": " + kilometerFilter(location.getDistanceToPositionInKm(currentPosition)) + "</p>" : "")
            + "<h2>" + i18n.infoWindow.openingTimes + "</h2>"
            + "<p>" + getOpeningTimesInnerHtml(location) + "</p>"
            + getOpenCommentInnerHtml(language, location)
            + "<p>" + getCommentAndReviewInnerHtml(i18n, language, location) + "</p>"
            + "</div>";
    };

    // Redundantly defined elewhere. TODO
    function formatTags(i18n, tags) {
        return tags.map(function(it) { return i18n.enums.tag[it]; }).join(", ");
    }
    
    function getOpeningTimesInnerHtml(location) {
    
        var html = "";
        var compressedOts = location.getOpeningTimesCompressed();
        
        for (var i = 0; i < compressedOts.length; i++) {
        
            var group = compressedOts[i];
            var firstOt = group[0];
            var lastOt = group[group.length - 1];
            var days;
            var interval;
            
            if (firstOt === lastOt) {
                days = firstOt.friendlyDayShort;
                interval = firstOt.interval.friendly;
            } else {
                days = firstOt.friendlyDayShort + extraLongHyphen + lastOt.friendlyDayShort;
                interval = firstOt.interval.friendly;
            }
            
            var groupContainsToday = group.map(function(ot) { return ot.dayIndex; }).indexOf(new Date().getDay()) >= 0;
            html += "<b>" + days + ":</b> " + (groupContainsToday ? "<b>" + interval + "</b>" : interval);
            
            if (i < compressedOts.length - 1) {
                html += "<br/>";
            }
        }
        
        return html;
    }

    function getOpenCommentInnerHtml(language, location) {
        var openComment = location.getOpenComment(language);
        return openComment ? "<p>" + openComment + "</p>" : "";
    }
    
    function getCommentAndReviewInnerHtml(i18n, language, location) {
        return language === "en" ?
            location.commentEnglish + "<br/>" + (location.reviewURL ? getReviewAnchor() : "")
            :
            (location.reviewURL ? getReviewAnchor() : location.comment);

        function getReviewAnchor() {
            return "<a target='_blank' href='" + location.reviewURL + "'>" + i18n.infoWindow.review + "</a>";
        }
    }

    return {
        getContent: function(i18n, language, location, currentPosition) {
            return service.getContent(i18n, language, location, currentPosition);
        }
    };
});