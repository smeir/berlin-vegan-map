import { Component, EventEmitter, Output } from "@angular/core";

import { ConfigurationService } from "../configuration.service";
import { I18nService } from "../i18n.service";

@Component({
    selector: "app-geolocation",
    templateUrl: "./geolocation.component.html",
})
export class GeolocationComponent {

    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly i18nService: I18nService,
    ) { }

    @Output() readonly coordinatesChange = new EventEmitter<Coordinates | null>();
    @Output() readonly highlightRequest = new EventEmitter<void>();
    private readonly options = {
        enableHighAccuracy: true,
        timeout: this.configurationService.geoLocationTimeoutMillis
    };
    readonly i18n = this.i18nService.getI18n();
    readonly isGeolocationSupported = !!navigator.geolocation;
    isChecked = false;
    coordinates: Coordinates | null = null;
    info = "";
    error = "";

    onChange() {
        if (this.isChecked) {
            this.detectCoordinates();
        } else {
            this.clearCoordinates();
        }
    }

    private detectCoordinates() {
        assert(navigator.geolocation);
        assert(this.coordinates === null);
        assert(this.info === "");
        assert(this.error === "");

        this.info = this.i18n.geolocation.detecting;

        navigator.geolocation.getCurrentPosition(
            position => {
                if (this.isChecked) {
                    this.info = "";
                    this.coordinates = position.coords;
                    this.coordinatesChange.emit(this.coordinates);
                }
            },
            positionError => {
                if (this.isChecked) {
                    this.info = "";
                    this.error = this.getErrorMessage(positionError);
                }
            },
            this.options
        );
    }

    private getErrorMessage(positionError: PositionError): string {
        let reason;
        switch (positionError.code) {
            case positionError.PERMISSION_DENIED:
                reason = this.i18n.geolocation.PERMISSION_DENIED;
                break;
            case positionError.POSITION_UNAVAILABLE:
                reason = this.i18n.geolocation.POSITION_UNAVAILABLE;
                break;
            case positionError.TIMEOUT:
                reason = this.i18n.geolocation.TIMEOUT;
                break;
        }
        return this.i18n.geolocation.theError + ": " + reason;
    }

    private clearCoordinates() {
        this.info = "";
        this.error = "";
        if (this.coordinates !== null) {
            this.coordinates = null;
            this.coordinatesChange.emit(null);
        }
    }
}

function assert(expression: any) {
    if (!expression) {
        alert("Unexpected condition");
    }
}
