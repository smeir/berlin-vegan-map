import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { VeganCategory } from "./vegan-category";

@Injectable()
export class ConfigurationService {

    readonly locationsUrl = (environment.production ? "/app/data/" : "assets/") + "GastroLocations.json";
    readonly mapCenter = { lat: 52.5200070, lng: 13.4049540 };
    readonly geoLocationTimeoutMillis = environment.production ? 15000 : 5000;
    readonly geoLocationFirefoxWorkaroundTimeoutMillis = environment.production ? 16000 : 8000;

    getColor (veganCategory: VeganCategory): string {
        switch (veganCategory) {
            case "omnivorous":
                return "red";
            case "vegetarian":
                return "orange";
            case "vegan":
                return "green";
            default:
                throw new Error("Unexpected value for veganCategory: " + veganCategory);
        }
    }
}
