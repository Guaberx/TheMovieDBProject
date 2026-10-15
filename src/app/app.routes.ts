import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { ActorDetail } from './pages/actor-detail/actor-detail';
import { Actors } from './pages/actors/actors';
import { Contact } from './pages/contact/contact';
import { MovieDetail } from './pages/movie-detail/movie-detail';
import { Movies } from './pages/movies/movies';
import { NotFound } from './pages/not-found/not-found';
import { Tutorial } from './pages/tutorial/tutorial';
import { Welcome } from './pages/welcome/welcome';

// Detail routes take an "id-slug" segment (e.g. /movies/429617-spider-man-far-from-home).
// Only the id is used for lookups; search lives in a query param (/movies?q=batman).
export const routes: Routes = [
  { path: '', component: Welcome, title: 'MoviesApp' },
  { path: 'movies', component: Movies, title: 'Movies · MoviesApp' },
  { path: 'movies/:id', component: MovieDetail, title: 'Movie · MoviesApp' },
  { path: 'actors', component: Actors, title: 'Actors · MoviesApp' },
  { path: 'actors/:id', component: ActorDetail, title: 'Actor · MoviesApp' },
  { path: 'about', component: About, title: 'About · MoviesApp' },
  { path: 'contact', component: Contact, title: 'Contact · MoviesApp' },
  { path: 'tutorial', component: Tutorial, title: 'Tutorial · MoviesApp' },
  { path: '**', component: NotFound, title: 'Not found · MoviesApp' },
];
