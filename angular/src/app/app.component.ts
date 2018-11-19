import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, pairwise } from "rxjs/operators";

@Component({
  selector: "app-root",
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {

    static previousUrl = "";

    constructor(router: Router) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            pairwise(),
        ).subscribe((pair: any) => {
            AppComponent.previousUrl = pair[0].url;
        });
    }
}
