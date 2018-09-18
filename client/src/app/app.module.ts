import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { FrozenTableComponent } from './frozen-table/frozen-table.component';
import { FilterTableComponent } from './filter-table/filter-table.component';
import { PaginatedTableComponent } from './paginated-table/paginated-table.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';


library.add(faTimes);
library.add(faSearch);
library.add(faSync);

@NgModule({
    declarations: [
        AppComponent,
        SimpleTableComponent,
        FrozenTableComponent,
        FilterTableComponent,
        PaginatedTableComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ButtonModule,
        HttpClientModule,
        TableModule,
        FormsModule,
        SliderModule,
        FontAwesomeModule,
        InputTextModule,
        DropdownModule,
        SidebarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
