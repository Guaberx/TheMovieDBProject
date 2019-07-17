import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesComponent } from './components/movies/movies.component';

import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ActorsComponent } from './components/actors/actors.component';
import { MoviePageComponent } from './components/movie-page/movie-page.component';
import { ActorPageComponent } from './components/actor-page/actor-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    NavComponent,
    FooterComponent,
    ActorsComponent,
    MoviePageComponent,
    ActorPageComponent,
    NotFoundComponent,
    AboutComponent,
    ContactComponent,
    WelcomeComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
