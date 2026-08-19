import { __decorate } from "tslib";
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
let App = class App {
    title = signal('frontend');
};
App = __decorate([
    Component({
        selector: 'app-root',
        imports: [RouterOutlet],
        templateUrl: './app.html',
        changeDetection: ChangeDetectionStrategy.Eager,
        styleUrl: './app.scss',
    })
], App);
export { App };
