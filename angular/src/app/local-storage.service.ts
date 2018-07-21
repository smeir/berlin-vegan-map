import { Injectable } from "@angular/core";

import { GastroQuery } from "./model/gastro-query";
import { Settings } from "./model/settings";
import { ShoppingQuery } from "./model/shopping-query";
import * as localStorageWrapper from "./local-storage-wrapper";

// ----------------------------------------
// TODO: Move to external utils library.

String.prototype.trimX = function (this: string, x: string) {
    let trimmed = this;
    while (trimmed.startsWith(x)) {
        trimmed = trimmed.substring(x.length);
    }
    while (trimmed.endsWith(x)) {
        trimmed = trimmed.substring(0, trimmed.length - x.length);
    }
    return trimmed;
};

declare global {
    interface String {
        trimX: (x: string) => string;
    }
}

function getRelativeBasePath() {
    return document.baseURI ?
        document.baseURI.substring(document.location.origin.trimX("/").length).trimX("/")
        :
        "";
}

// ----------------------------------------

const keys = (function () {
    const path = getRelativeBasePath();
    const keyPrefix = (path ? path + ":" : "") + "berlin-vegan-map.";
    return {
        settings: keyPrefix + "settings",
        gastroQuery: keyPrefix + "gastroQuery",
        shoppingQuery: keyPrefix + "shoppingQuery",
    };
})();

@Injectable()
export class LocalStorageService {

    private _settings: Settings | null = null;
    private _gastroQuery: GastroQuery | null = null;
    private _shoppingQuery: ShoppingQuery | null = null;

    get settings(): Settings {
        if (!this._settings) {
            this._settings = this.loadSettings();
        }
        return this._settings;
    }

    private loadSettings(): Settings {
        return new Settings(localStorageWrapper.getObject(keys.settings));
    }

    saveSettings() {
        localStorageWrapper.setObject(keys.settings, this.settings);
    }

    get gastroQuery(): GastroQuery {
        if (!this._gastroQuery) {
            this._gastroQuery = this.loadGastroQuery();
        }
        return this._gastroQuery;
    }

    private loadGastroQuery(): GastroQuery {
        return new GastroQuery(localStorageWrapper.getObject(keys.gastroQuery));
    }

    saveGastroQuery() {
        localStorageWrapper.setObject(keys.gastroQuery, this.gastroQuery);
    }

    get shoppingQuery(): ShoppingQuery {
        if (!this._shoppingQuery) {
            this._shoppingQuery = this.loadShoppingQuery();
        }
        return this._shoppingQuery;
    }

    private loadShoppingQuery(): ShoppingQuery {
        return new ShoppingQuery(localStorageWrapper.getObject(keys.shoppingQuery));
    }

    saveShoppingQuery() {
        localStorageWrapper.setObject(keys.shoppingQuery, this.shoppingQuery);
    }

    deleteQueries() {
        this._gastroQuery = null;
        this._shoppingQuery = null;
        localStorageWrapper.removeItem(keys.gastroQuery);
        localStorageWrapper.removeItem(keys.shoppingQuery);
    }
}
