'use strict';

/**
 * @ngdoc function
 * @name berlinVeganMapApp.controller:MainController
 * @description
 * # MainController
 * Controller of the berlinVeganMapApp
 */
app.controller('MainController', function (
    $scope,
    $http,
    $timeout,
    $window,
    ConfigurationService,
    LocationLogicService,
    InfoWindowViewService,
    ResourcesService,
    I18nService,
    SearchService
) {
    var jsCommon = new JsCommon();

    $scope.locationsLength = null;
    $scope.query = null;
    $scope.tags = null;
    $scope.veganCategories = null;
    $scope.geolocation = { show: false, supported: navigator.geolocation ? true : false };
    $scope.orderSelection = "name";
    $scope.language = I18nService.getLanguage();;
    $scope.i18n = I18nService.getI18n();
    $scope.setLanguage = function(event, language) {
        event.preventDefault();
        I18nService.setLanguage(language);
    }
    $scope.fullMapView = false;
    $scope.enableFullMapView = function() {
        $scope.fullMapView = true;
        $timeout(function() { google.maps.event.trigger($scope.map, "resize"); });
    }
    $scope.disableFullMapView = function() {
        $scope.fullMapView = false;
    }
    $scope.scrollSearchIntoView = function() {
        if ($scope.fullMapView)
        {
            $scope.disableFullMapView();
        }
        $timeout(function() { $window.document.getElementById("pre-search-div").scrollIntoView(); });
    }

    $scope.getColor = ConfigurationService.getColor;
    $scope.getMarkerImageUrl = getMarkerImageUrl;
    $scope.showLocationMarkers = showLocationMarkers;
    $scope.updateGeolocationMarker = updateGeolocationMarker;
    $scope.updateOrder = updateOrder;

    var infoWindow = new google.maps.InfoWindow();

    $http({ method: 'GET', url: ConfigurationService.locationsUrl })
        .success(function(locations) {
            LocationLogicService.enhanceLocations(locations);
            initMap(locations);
            $scope.locationsLength = locations.length;
            $scope.query = SearchService.getInitialQuery();
            $scope.tags = LocationLogicService.getSortedTags();
            $scope.veganCategories = LocationLogicService.getSortedVeganCategories();
            showLocationMarkers();
        });

    function getMarkerImageUrl(location) {
        return ResourcesService.getDotImageUrl(ConfigurationService.getColor(location.getVeganCategory()));
    }

    function initMap(locations) {
        var center = ConfigurationService.mapCenter;
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(center.lat, center.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.markers = [];

        for (var i = 0; i < locations.length; i++){
            createMarker(locations[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            if (!window.matchMedia("(min-width: 568px)").matches) {
                $scope.enableFullMapView();
            }
            $timeout(function() { google.maps.event.trigger(selectedMarker, 'click'); });
        };
    }

    function createMarker(location){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(location.latCoord, location.longCoord),
            title: location.name,
            location: location,
            icon: getMarkerImage(location)
        });

        google.maps.event.addListener(marker, 'click', function() {

            var content = InfoWindowViewService.getContent(
                marker.location,
                $scope.geolocation.marker ? $scope.geolocation.marker.position : undefined
            );

            infoWindow.setContent(content);
            infoWindow.open($scope.map, marker);

            var locationElement = $window.document.getElementById(marker.location.id);

            if (!jsCommon.domUtil.isElementVisible(locationElement)) {
                locationElement.scrollIntoView();
            }
        });

        $scope.markers.push(marker);
    }

    function getMarkerImage(location) {
        return new google.maps.MarkerImage(
            getMarkerImageUrl(location),
            new google.maps.Size(50, 50),
            new google.maps.Point(0,0),
            new google.maps.Point(15, 34)
        );
    }

    function showLocationMarkers() {

        $scope.filteredLocationMarkers = getFilteredLocationMarkers();
        var locationMarkers = getLocationMarkers();

        for (var i = 0; i < locationMarkers.length; i++) {

            var marker = locationMarkers[i];

            if ($scope.filteredLocationMarkers.indexOf(marker) >= 0) {
                marker.setMap($scope.map);
            } else {
                marker.setMap(null);
            }
        }
    }

    function getFilteredLocationMarkers() {
        var sortFunction;

        switch ($scope.orderSelection) {
            case "name":
                sortFunction = function(markerA, markerB) {
                    return markerA.location.name.localeCompare(markerB.location.name, global_language);
                };
                break;
            case "distance":
                sortFunction = function(markerA, markerB) {
                    return getDistanceToGeolocation(markerA) - getDistanceToGeolocation(markerB);
                };
                break;
            default:
              console.log("Unexpected value for orderSelection: " + $scope.orderSelection); // TODO
        }

        return getLocationMarkers()
            .workaroundFilter(function(marker) { return SearchService.isResult(marker.location, $scope.query); })
            .sort(sortFunction);

        function getDistanceToGeolocation(marker) {
            if ($scope.geolocation.marker && $scope.geolocation.marker.map) {
                return marker.location.getDistanceToPositionInKm($scope.geolocation.marker.position);
            } else {
                return 1;
            }
        }
    }

    function getLocationMarkers() {
        return $scope.markers.workaroundFilter(function(marker) { return !!marker.location; })
    }

    function updateOrder() {
        $scope.filteredLocationMarkers = getFilteredLocationMarkers();
    }

    function updateGeolocationMarker() {

        if ($scope.geolocation.show) {

            if (!navigator.geolocation) {
                alert("Unerwartete Bedingung");
            }

            // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=675533
            $timeout(
                function() {
                    if ($scope.geolocation.info === $scope.i18n.geolocation.detecting) {
                        $scope.geolocation.error = $scope.i18n.geolocation.theError;
                        $scope.geolocation.info = "";
                    }
                },
                ConfigurationService.geoLocationFirefoxWorkaroundTimeoutMillis
            );

            $scope.geolocation.info = $scope.i18n.geolocation.detecting;
            $scope.geolocation.error = "";

            var options = {
                enableHighAccuracy: true,
                timeout: ConfigurationService.geoLocationTimeoutMillis
                //maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    $scope.$apply(function() {
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                            title: $scope.i18n.geolocation.currentLocation,
                            icon: ResourcesService.getDotImageUrl("blue")
                        });

                        google.maps.event.addListener(marker, 'click', function(){
                            $scope.map.setCenter(marker.getPosition());
                            infoWindow.setContent('<h2>' + marker.title + '</h2>');
                            infoWindow.open($scope.map, marker);
                        });

                        $scope.markers.push(marker);
                        $scope.geolocation.marker = marker;
                        $scope.geolocation.info = "";
                        $scope.geolocation.error = "";
                        $scope.query.distance.position = marker.position;

                        google.maps.event.trigger(marker, 'click');
                    });
                },
                function(positionError) {

                    $scope.$apply(function() {

                        var reason;

                        switch (positionError.code)
                        {
                            case 1://PositionError.PERMISSION_DENIED:
                                reason = i18n.geolocation.PERMISSION_DENIED;
                                break;
                            case 2: //PositionError.POSITION_UNAVAILABLE:
                                reason = i18n.geolocation.POSITION_UNAVAILABLE;
                                break;
                            case 3: //PositionError.TIMEOUT:
                                reason = i18n.geolocation.TIMEOUT;
                                break;
                        }

                        $scope.geolocation.info = "";
                        $scope.geolocation.error = i18n.geolocation.theError + ": " + reason;
                    });
                },
                options
            );
        } else {
            $scope.geolocation.info = "";
            $scope.geolocation.error = "";
            $scope.geolocation.marker.setMap(null);
            // TODO: This is a potential memory leak. Better delete the marker.

            if ($scope.query.distance.enabled) {
                $scope.query.distance.enabled = false;
                $scope.showLocationMarkers();
            }

            $scope.query.distance.position = null;
        }
    }
});
