import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { SparePartsDistributorSharedModule } from 'app/shared/shared.module';
import { SparePartsDistributorCoreModule } from 'app/core/core.module';
import { SparePartsDistributorAppRoutingModule } from './app-routing.module';
import { SparePartsDistributorHomeModule } from './home/home.module';
import { SparePartsDistributorEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    SparePartsDistributorSharedModule,
    SparePartsDistributorCoreModule,
    SparePartsDistributorHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    SparePartsDistributorEntityModule,
    SparePartsDistributorAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent],
})
export class SparePartsDistributorAppModule {}
