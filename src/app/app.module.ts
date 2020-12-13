import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthorPipe } from './pipes/author.pipe';
import { TagsPipe } from './pipes/tags.pipe';

@NgModule({
    declarations: [
        AppComponent,
        AuthorPipe,
        TagsPipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
