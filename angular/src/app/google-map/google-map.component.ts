import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from "@angular/core";
import {} from "@types/googlemaps";

import { ConfigurationService } from "../configuration.service";
import { I18nService } from "../i18n.service";
import { InfoWindowViewService } from "../info-window-view.service";
import { Location } from "../model/location";
import { SettingsService } from "../settings.service";

@Component({
    selector: "app-google-map",
    template: `<div #mapDiv></div>`,
    styles: [ `div { width: 100%; height: 100%; }` ],
})
export class GoogleMapComponent {

    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly i18nService: I18nService,
        private readonly infoWindowViewService: InfoWindowViewService,
        private readonly settingsService: SettingsService,
        private readonly ngZone: NgZone,
    ) {}

    @Input() set locations(locations: Location[]) {
        this._locations = locations;

        for (const [marker, location] of this.markersToLocations.entries()) {
            const map = locations.includes(location) ? this.map : null;
            if (marker.getMap() !== map) {
                marker.setMap(map);
            }
        }
    }

    get locations(): Location[] {
        return this._locations;
    }

    private _locations: Location[];

    @Input() set coordinates(coordinates: Coordinates | null) {
        this._coordinates = coordinates;

        if (coordinates) {
            const position = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

            if (this.coordinatesMarker) {
                this.coordinatesMarker.setPosition(position);
            } else {
                this.coordinatesMarker = new google.maps.Marker({
                    map: this.map,
                    position: position,
                    title: this.i18n.geolocation.currentPosition,
                    icon: this.configurationService.getIconUrlForCoordinates()
                });

                google.maps.event.addListener(this.coordinatesMarker, "click", () => {
                    this.map.setCenter(this.coordinatesMarker.getPosition());
                    this.infoWindow.setContent("<h2>" + this.coordinatesMarker.getTitle() + "</h2>");
                    this.infoWindow.open(this.map, this.coordinatesMarker);
                });
            }
        } else if (this.coordinatesMarker) {
            this.coordinatesMarker.setMap(null);
            delete this.coordinatesMarker;
        }
    }

    get coordinates(): Coordinates | null {
        return this._coordinates;
    }

    private _coordinates: Coordinates | null;

    @Output() readonly locationSelect = new EventEmitter<Location | null>();

    @ViewChild("mapDiv") mapDiv: ElementRef;

    private map: google.maps.Map;
    private coordinatesMarker: google.maps.Marker;
    private readonly markersToLocations = new Map<google.maps.Marker, Location>();
    private readonly locationsToMarkers = new Map<Location, google.maps.Marker>();
    private readonly infoWindow = new google.maps.InfoWindow();
    private readonly i18n = this.i18nService.getI18n();

    init(locations: Location[]) {
        const center = this.configurationService.mapCenter;
        const mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(center.lat, center.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapDiv.nativeElement, mapOptions);

        for (const location of locations) {
            this.createMarker(location);
        }
    }

    private createMarker(location: Location) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(location.latCoord, location.longCoord),
            title: location.name,
            icon: this.getIcon(location)
        });

        google.maps.event.addListener(marker, "click", () => {
            const mode = this.settingsService.settings.infoMode === "popUp" ? "full" : "minimal";
            const content = this.infoWindowViewService.getContent(location, this.coordinates, mode);
            this.infoWindow.setContent(content);
            this.infoWindow.open(this.map, marker);
            this.ngZone.run(() => this.locationSelect.emit(location));
        });

        google.maps.event.addListener(this.infoWindow, "closeclick", () => {
            this.ngZone.run(() => this.locationSelect.emit(null));
        });

        this.markersToLocations.set(marker, location);
        this.locationsToMarkers.set(location, marker);
    }

    private getIcon(location: Location): google.maps.Icon {
        return {
            url: this.configurationService.getIconUrl(location.veganCategory),
            size: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34)
        };
    }

    selectLocation(location: Location | null) {
        if (location) {
            setTimeout(() => { google.maps.event.trigger(this.locationsToMarkers.get(location), "click"); }, 0);
        } else {
            this.infoWindow.close();
        }
    }

    selectCoordinates() {
        setTimeout(() => { google.maps.event.trigger(this.coordinatesMarker, "click"); }, 0);
    }

    resize() {
        setTimeout(() => { google.maps.event.trigger(this.map, "resize"); }, 0);
    }
}
