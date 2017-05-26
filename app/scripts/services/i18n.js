"use strict";

app.factory('I18nService', function() {
    var i18n = {
        enums: {
            veganCategory: {
                concise: {
                    vegan: {
                        en: "vegan",
                        de: "vegan",
                    },
                    vegetarian: {
                        en: "vegetarian",
                        de: "vegetarisch",
                    },
                    omnivorous: {
                        en: "omnivorous",
                        de: "omnivor",
                    },
                },
                verbose: {
                    vegan: {
                        en: "100% vegan",
                        de: "100% vegan",
                    },
                    vegetarian: {
                        en: "vegetarian, vegan declared",
                        de: "vegetarisch, vegan deklariert",
                    },
                    omnivorous: {
                        en: "omnivorous, vegan declared",
                        de: "omnivor, vegan deklariert",
                    },
                },
            },
            tag: {
                // Capitalized values because they are capitalized in the data source.
                Cafe: {
                    en: "Cafe",
                    de: "Café",
                },
                Eiscafe: {
                    en: "Ice cream shop",
                    de: "Eiscafé",
                },
                Imbiss: {
                    en: "Snack bar",
                    de: "Imbiss",
                },
                Restaurant: {
                    en: "Restaurant",
                    de: "Restaurant",
                },
            },
            weekday: {
                all: {
                    en: "All days",
                    de: "Alle Wochentage",
                },
                today: {
                    en: "Today",
                    de: "Heute",
                },
                "0": {
                    en: "Sunday",
                    de: "Sonntag",
                },
                "1": {
                    en: "Monday",
                    de: "Montag",
                },
                "2": {
                    en: "Tuesday",
                    de: "Dienstag",
                },
                "3": {
                    en: "Wednesday",
                    de: "Mittwoch",
                },
                "4": {
                    en: "Thursday",
                    de: "Donnerstag",
                },
                "5": {
                    en: "Friday",
                    de: "Freitag",
                },
                "6": {
                    en: "Saturday",
                    de: "Samstag",
                },
            },
        },
        search: {
            text: {
                placeholder: {
                    en: "Search text",
                    de: "Suchtext",
                },
                namesOnly: {
                    en: "Search names only",
                    de: "Nur Namen durchsuchen",
                },
            },
        },
        category: {
            header: {
                en: "Category",
                de: "Kategorie",
            },
        },
        tag: {
            header: {
                en: "Type",
                de: "Art",
            },
        },
        features: {
            organic: {
                en: "Organic",
                de: "Bioware",
            },
            glutenFree: {
                en: "Gluten-free food",
                de: "glutenfreie Speisen",
            },
            dog: {
                en: "Dogs allowed",
                de: "Hunde erlaubt",
            },
            childChair: {
                en: "Child chair",
                de: "Kinderstuhl",
            },
            handicappedAccessible: {
                en: "Suitable for wheelchairs",
                de: "Rollstuhlgeeignet",
            },
            handicappedAccessibleWc: {
                en: "Toilet suitable for wheelchairs",
                de: "Rollstuhlgeeignetes WC",
            },
            delivery: {
                en: "Delivery service",
                de: "Lieferdienst",
            },
            catering: {
                en: "Catering",
                de: "Catering",
            },
            wlan: {
                en: "Wi-Fi",
                de: "WLAN",
            },
            review: {
                en: "With Review (German)",
                de: "Mit Rezension",
            },
        },
        openingTimes: {
            header: {
                en: "Open",
                de: "Geöffnet",
            },
            timePlaceholder: {
                openNow: {
                    en: "- Now -",
                    de: "- Jetzt -",
                },
                notOpenNow: {
                    en: "hh:mm (Time)",
                    de: "hh:mm (Uhrzeit)",
                },
            },
            invalidTime: {
                en: "Invalid time (ignored); Format: hh:mm",
                de: "Ungültige Zeit (wird ignoriert); Format: hh:mm",
            },
            nowCheckbox: {
                en: "Now",
                de: "Jetzt",
            },
        },
        geolocation: {
            header: {
                en: "Geolocation",
                de: "Standorterkennung",
            },
            currentLocation: {
                en: "Current location",
                de: "Aktueller Standort",
            },
            distance: {
                en: "Distance",
                de: "Entfernung",
            },
            detecting: {
                en: "Geolocating...",
                de: "Ermittle Standort...",
            },
            error: {
                en: "Geolocation impossible",
                de: "Standortzugriff nicht möglich",
            },
        },
        sortBy: {
            header: {
                en: "Sort by",
                de: "Sortierung",
            },
            name: {
                en: "Name",
                de: "Name",
            },
            distance: {
                en: "Distance",
                de: "Entfernung",
            },
            distanceRequiresGeolocation: {
                en: "Geolocation required",
                de: "Standorterkennung erforderlich",
            },
        },
        resultsLength: {
            en: " results of ",
            de: " Treffer von ",
        },
        infoWindow: {
            distance: {
                en: "Distance",
                de: "Entfernung",
            },
            openingTimes: {
                en: "Opening times",
                de: "Öffnungszeiten",
            },
            review: {
                en: "Review (German)",
                de: "Rezension",
            },
        },
        footer: {
            infoPrefix: {
                en: "The map contains ",
                de: "Die Karte umfasst insgesamt ",
            },
            infoPostfix: {
                en: " locations altogether. Vegan food is declared.",
                de: " Restaurants/Cafés usw. Die veganen Speisen sind deklariert.",
            },
            feedback: {
                en: "Problems and suggestions to",
                de: "Probleme und Verbesserungsvorschläge bitte an",
            },
            language: {
                // A bit dirty, but we want to display the language in its language.
                en: {
                    en: "English",
                    de: "English",
                },
                de: {
                    en: "Deutsch",
                    de: "Deutsch",
                },
            },
        },
    };

    var transformedI18n = getTransformedI18n(global_language);

    function getTransformedI18n(language) {
        return {
            // This kinda sucks. TODO.
            enums: {
                veganCategory: {
                    concise: {
                        vegan: i18n.enums.veganCategory.concise.vegan[language],
                        vegetarian: i18n.enums.veganCategory.concise.vegetarian[language],
                        omnivorous: i18n.enums.veganCategory.concise.omnivorous[language],
                    },
                    verbose: {
                        vegan: i18n.enums.veganCategory.verbose.vegan[language],
                        vegetarian: i18n.enums.veganCategory.verbose.vegetarian[language],
                        omnivorous: i18n.enums.veganCategory.verbose.omnivorous[language],
                    },
                },
                tag: {
                    Cafe: i18n.enums.tag.Cafe[language],
                    Eiscafe: i18n.enums.tag.Eiscafe[language],
                    Imbiss: i18n.enums.tag.Imbiss[language],
                    Restaurant: i18n.enums.tag.Restaurant[language],
                },
                weekday: {
                    all: i18n.enums.weekday.all[language],
                    today: i18n.enums.weekday.today[language],
                    "0": i18n.enums.weekday["0"][language],
                    "1": i18n.enums.weekday["1"][language],
                    "2": i18n.enums.weekday["2"][language],
                    "3": i18n.enums.weekday["3"][language],
                    "4": i18n.enums.weekday["4"][language],
                    "5": i18n.enums.weekday["5"][language],
                    "6": i18n.enums.weekday["6"][language],
                },
            },
            search: {
                text: {
                    placeholder: i18n.search.text.placeholder[language],
                    namesOnly: i18n.search.text.namesOnly[language],
                },
            },
            category: {
                header: i18n.category.header[language],
            },
            tag: {
                header: i18n.tag.header[language],
            },
            features: {
                organic: i18n.features.organic[language],
                glutenFree: i18n.features.glutenFree[language],
                dog: i18n.features.dog[language],
                childChair: i18n.features.childChair[language],
                handicappedAccessible: i18n.features.handicappedAccessible[language],
                handicappedAccessibleWc: i18n.features.handicappedAccessibleWc[language],
                delivery: i18n.features.delivery[language],
                catering: i18n.features.catering[language],
                wlan: i18n.features.wlan[language],
                review: i18n.features.review[language],
            },
            openingTimes: {
                header: i18n.openingTimes.header[language],
                timePlaceholder: {
                    openNow: i18n.openingTimes.timePlaceholder.openNow[language],
                    notOpenNow: i18n.openingTimes.timePlaceholder.notOpenNow[language],
                },
                invalidTime: i18n.openingTimes.invalidTime[language],
                nowCheckbox: i18n.openingTimes.nowCheckbox[language],
            },
            geolocation: {
                header: i18n.geolocation.header[language],
                currentLocation: i18n.geolocation.currentLocation[language],
                distance: i18n.geolocation.distance[language],
                detecting: i18n.geolocation.detecting[language],
                error: i18n.geolocation.error[language],
            },
            sortBy: {
                header: i18n.sortBy.header[language],
                name: i18n.sortBy.name[language],
                distance: i18n.sortBy.distance[language],
                distanceRequiresGeolocation: i18n.sortBy.distanceRequiresGeolocation[language],
            },
            resultsLength: i18n.resultsLength[language],
            infoWindow: {
                distance: i18n.infoWindow.distance[language],
                openingTimes: i18n.infoWindow.openingTimes[language],
                review: i18n.infoWindow.review[language],
            },
            footer: {
                infoPrefix: i18n.footer.infoPrefix[language],
                infoPostfix: i18n.footer.infoPostfix[language],
                feedback: i18n.footer.feedback[language],
                language: {
                    en: i18n.footer.language.en[language],
                    de: i18n.footer.language.de[language],
                }
            },
        };
    }

    return { 
        setLanguage(language) {
            global_language = language;
            if (localStorage) {
                localStorage.setItem("language", global_language);
            }
            transformedI18n = getTransformedI18n(global_language);
        },
        getLanguage() {
            return global_language;
        },
        getI18n() {
            return transformedI18n;
        },
        abbreviateWeekDay(weekday) {
            var charCount = global_language === "en" ? 3 : 2;
            return weekday.substring(0, charCount);
        }
    };
});
