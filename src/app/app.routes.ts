import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { ActorDetail } from './pages/actor-detail/actor-detail';
import { Actors } from './pages/actors/actors';
import { Contact } from './pages/contact/contact';
import { MovieDetail } from './pages/movie-detail/movie-detail';
import { Movies } from './pages/movies/movies';
import { NotFound } from './pages/not-found/not-found';
import { Welcome } from './pages/welcome/welcome';

// Detail routes take an "id-slug" segment (e.g. /movies/429617-spider-man-far-from-home).
// Only the id is used for lookups; search lives in a query param (/movies?q=batman).
// Pages without a title here set it themselves from the data they load.
export const routes: Routes = [
  { path: '', component: Welcome, title: 'MoviesApp' },
  { path: 'movies', component: Movies },
  { path: 'movies/:id', component: MovieDetail },
  { path: 'actors', component: Actors },
  { path: 'actors/:id', component: ActorDetail },
  { path: 'about', component: About, title: 'About · MoviesApp' },
  { path: 'contact', component: Contact, title: 'Contact · MoviesApp' },
  { path: '**', component: NotFound, title: 'Not found · MoviesApp' },
];
