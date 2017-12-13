import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";


import { AppComponent } from './app.component';
import { UberComponent } from './uber/uber.component';
import {UberService} from "./uber.service";


@NgModule({
  declarations: [
    AppComponent,
    UberComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [UberService],
  bootstrap: [AppComponent]
})
export class AppModule { }
