import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MoviesComponent } from './components/movies/movies.component';
import { ActorsComponent } from './components/actors/actors.component';
import { MoviePageComponent } from './components/movie-page/movie-page.component';
import { ActorPageComponent } from './components/actor-page/actor-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'movies', component: MoviesComponent},
  { path: 'movie', component: MoviePageComponent},
  { path: 'actors', component: ActorsComponent},
  { path: 'actor', component: ActorPageComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'tutorial', component: TutorialComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
