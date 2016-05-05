'use strict';

/**
 * @ngdoc function
 * @name berlinVeganMapApp.controller:MainController
 * @description
 * # MainController
 * Controller of the berlinVeganMapApp
 */
app.controller('MainController', function ($scope, $http, $timeout, LocationLogicService, filterFilter) {
  
    var allDistricts = "Alle Bezirke";
    var allWeekDays = "Alle Wochentage";
    $scope.search = { text: "", district: allDistricts, openAtWeekDay: allWeekDays };
    $scope.locations = null;
    $scope.districts = null;
    $scope.geolocation = { show: false, supported: navigator.geolocation ? true : false };
    
    $http({method: 'GET', url: 'assets/Locations.json'})
        .success(function(data, status, headers, config) {
            $scope.locations = data;
            LocationLogicService.enhanceLocations($scope.locations);
            initMap();
            initDistricts();
            updateMarkers();
        })
        .error(function(data, status, headers, config) {
        });

    $scope.updateMarkers = updateMarkers;
    $scope.updateGeolocationMarker = updateGeolocationMarker;
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (location){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(location.latCoord, location.longCoord),
            title: location.name,
            location: location
        });

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + getContent(marker.location));
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);
    }
    
    function initMap() {
    
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(52.5200070,13.4049540),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.markers = [];

        for (var i = 0; i < $scope.locations.length; i++){
            createMarker($scope.locations[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };
    }
    
    function updateMarkers() {
    
        $scope.filteredMarkers = getFilteredMarkers();
        
        for (var i = 0; i < $scope.markers.length; i++) {
        
            var marker = $scope.markers[i];
            
            if (marker !== $scope.geolocation.marker){
                if ($scope.filteredMarkers.indexOf(marker) >= 0) {
                    marker.setMap($scope.map);
                } else {
                    marker.setMap(null);
                }
            }
        }
    }
    
    function getFilteredMarkers() {

        var locationPattern = {};
   
        if ($scope.search.textAppliesToAllFields) {
            locationPattern.$ = $scope.search.text;
        } else {
            locationPattern.name = $scope.search.text;
        }
        
        if ($scope.search.district !== allDistricts) {
            locationPattern.district = $scope.search.district;
        }
        
        if ($scope.search.completelyVegan) {
            locationPattern.vegan = "5"; // TODO: Check if equivalent to legacy app's "not 2 and not 4".
        }
        
        if ($scope.search.organic) {
            locationPattern.organic = "1";
        }
        
        if ($scope.search.glutenFree) {
            locationPattern.glutenFree = "1";
        }
        
        if ($scope.search.handicappedAccessible) {
            locationPattern.handicappedAccessible = "1";
        }
        
        if ($scope.search.handicappedAccessibleWc) {
            locationPattern.handicappedAccessibleWc = "1";
        }
        
        if ($scope.search.organic) {
            locationPattern.organic = "1";
        }
        
        if ($scope.search.organic) {
            locationPattern.organic = "1";
        }
        
        if ($scope.search.dog) {
            locationPattern.dog = "1";
        }
        
        if ($scope.search.wlan) {
            locationPattern.wlan = "1";
        }
        
        if ($scope.search.catering) {
            locationPattern.catering = "1";
        }
        
        if ($scope.search.delivery) {
            locationPattern.delivery = "1";
        }
        
        var filterFunction = function(marker, index, array) {

            if ($scope.search.openAtWeekDay && $scope.search.openAtWeekDay !== allWeekDays) {
                return marker.location.isOpen(parseInt($scope.search.openAtWeekDay), $scope.search.openAtTime);
            } else {
                return true;
            }
        }
        
        var filteredMarkers = filterFilter($scope.markers, { location: locationPattern });
        return filterFilter(filteredMarkers, filterFunction);
    }
    
    function initDistricts() {
    
        $scope.districts = [];
        var districtSet = {};
        
        for (var i = 0; i < $scope.locations.length; i++) {
            districtSet[$scope.locations[i].district] = "";
        }
        
        for (var district in districtSet) {
            $scope.districts.push(district);
        }
        
        $scope.districts.sort();
        $scope.districts.unshift(allDistricts);
    }
    
    function getContent(location) {
        return '<div class="infoWindowContent">' + location.comment + '</div>';
    }
    
    function updateGeolocationMarker() {

        if ($scope.geolocation.show) {
        
            if (!navigator.geolocation) {
                alert("Unerwartete Bedingung");
            }
            
            // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=675533
            $timeout(
                function() {
                    if ($scope.geolocation.info === "Ermittle Standort...") {
                        $scope.geolocation.error = "Standortzugriff nicht möglich";
                        $scope.geolocation.info = "";
                    }
                }, 
                8000
            );
            
            $scope.geolocation.info = "Ermittle Standort...";
            $scope.geolocation.error = "";
            
            var options = {
                enableHighAccuracy: true,
                timeout: 5000
                //maximumAge: 0
            };
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    $scope.$apply(function() {
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                            title: "Aktueller Standort", 
                            label: "X" // TODO: Another image
                        });
                        
                        google.maps.event.addListener(marker, 'click', function(){
                            infoWindow.setContent('<h2>' + marker.title + '</h2>');
                            infoWindow.open($scope.map, marker);
                        });

                        $scope.markers.push(marker);
                        $scope.geolocation.marker = marker;
                        $scope.geolocation.info = "";
                        $scope.geolocation.error = "";
                    });
                }, 
                function(positionError) {
                    
                    $scope.$apply(function() {
                    
                        var reason;
                        
                        switch (positionError.code)
                        {
                            case 1://PositionError.PERMISSION_DENIED:
                                reason = "Zugriff verweigert";
                                break;
                            case 2: //PositionError.POSITION_UNAVAILABLE:
                                reason = "Standort nicht verfügbar";
                                break;
                            case 3: //PositionError.TIMEOUT:
                                reason = "Zeitüberschreitung";
                                break;
                        }
                        
                        $scope.geolocation.info = "";
                        $scope.geolocation.error = "Standortzugriff nicht möglich: " + reason;
                    });
                },
                options
            );
        } else {
            $scope.geolocation.info = "";
            $scope.geolocation.error = "";
            $scope.geolocation.marker.setMap(null);
            // TODO: This is a potential memory leak. Better delete the marker.
        }
    }
});
