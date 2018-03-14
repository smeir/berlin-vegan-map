import { Component,  OnInit, ViewChild } from "@angular/core";

import { GastroLocation } from "./model/gastro-location";
import { GastroQuery } from "./model/gastro-query";
import { ShoppingLocation } from "./model/shopping-location";
import { ShoppingQuery } from "./model/shopping-query";
import { GoogleMapComponent } from "./google-map/google-map.component";
import { I18nService } from "./i18n.service";
import { Location } from "./model/location";
import { LocationService } from "./location.service";
import { ResultsListComponent } from "./results-list/results-list.component";
import { SearchComponent } from "./search/search.component";
import { SearchService } from "./search.service";
import { SortOrder } from "./sort/sort-order";

declare var google: any; // Maybe TODO
declare var JsCommon: () => void; // TODO
const jsCommon = new JsCommon();

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: [ "./app.component.scss" ],
})
export class AppComponent implements OnInit {

    constructor(
        private readonly i18nService: I18nService,
        private readonly locationService: LocationService,
        private readonly searchService: SearchService,
    ) {}

    @ViewChild(SearchComponent) searchComponent: SearchComponent;
    @ViewChild(ResultsListComponent) resultsListComponent: ResultsListComponent;
    @ViewChild(GoogleMapComponent) googleMapComponent: GoogleMapComponent;

    readonly i18n = this.i18nService.getI18n();
    allLocations: (GastroLocation | ShoppingLocation)[] = [];
    filteredLocations: (GastroLocation | ShoppingLocation)[] = [];
    query: GastroQuery | ShoppingQuery;
    isGastro: boolean | undefined;
    sortOrder: SortOrder = "name";
    fullMapView = false;
    geoPosition = null; // TODO

    ngOnInit() {
        this.initGastro();
    }

    initGastro() {
        this.query = new GastroQuery();
        this.searchComponent.init(this.query);
        this.isGastro = true;
        this.locationService.getGastroLocations()
            .then(locations => {
                this.allLocations = locations;
                this.filteredLocations = locations;
                this.googleMapComponent.init(locations);
            });
    }

    initShopping() {
        this.query = new ShoppingQuery();
        this.searchComponent.init(this.query);
        this.isGastro = false;
        this.locationService.getShoppingLocations()
            .then(locations => {
                this.allLocations = locations;
                this.filteredLocations = locations;
                this.googleMapComponent.init(locations);
            });
    }

    onQueryChange(query: GastroQuery | ShoppingQuery) {
        this.query = query;
        this.updateFilteredLocations();
    }

    onSortOrderChange(sortOrder: SortOrder) {
        this.sortOrder = sortOrder;
        this.updateFilteredLocations();
    }

    updateFilteredLocations() {
        this.filteredLocations =
            this.allLocations
                .filter(it => this.searchService.isResult(it, this.query))
                .sort(this.getSortFunction());
    }

    onLocationSelectInResultsList(location: Location) {
        if (!window.matchMedia("(min-width: 568px)").matches) {
            this.enableFullMapView();
        }
        this.googleMapComponent.selectLocation(location);
    }

    onLocationSelectInGoogleMap(location: GastroLocation) {
        this.resultsListComponent.makeVisible(location);
    }

    scrollSearchIntoView() {
        if (this.fullMapView) {
            this.fullMapView = false;
        }
        setTimeout(function() { document.getElementById("pre-search-div").scrollIntoView(); }, 0); // TODO
    }

    enableFullMapView() {
        this.fullMapView = true;
        this.googleMapComponent.resize();
    }

    private getSortFunction(): (a: any, b: any) => number {
        switch (this.sortOrder) {
            case "name":
                return (locationA, locationB) =>
                    locationA.name.localeCompare(locationB.name, this.i18nService.getLanguage());
            case "distance":
                return (locationA, locationB) =>
                    this.getDistanceToGeolocation(locationA) - this.getDistanceToGeolocation(locationB);
            default:
              console.log("Unexpected value for SortOrder: " + this.sortOrder);
        }
    }

    private getDistanceToGeolocation(location: Location) {
        return this.geoPosition ? location.getDistanceToPositionInKm(this.geoPosition) : 1;
    }

    onGeopositionChange(geoposition) {
        this.geoPosition = geoposition;
    }

    onGeopositionHighlightRequest() {
        this.googleMapComponent.selectGeoPosition();
    }
}
