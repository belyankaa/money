import {Router} from "./router";

class App {
    readonly router: Router;

    constructor() {
        this.router = new Router()
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    private handleRouteChanging() {
        this.router.openRout();
    }
}


(new App());