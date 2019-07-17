import { Component, OnInit } from '@angular/core';
import {TMDBApiService} from '../../services/tmdb-api.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  public movies = []
  public imgUrl = 'https://image.tmdb.org/t/p/w500/'
  
  constructor(private _tmdbApiService: TMDBApiService, private route:Router) { }

  ngOnInit() {  
    if(this._tmdbApiService.searching){
      this.movies = this._tmdbApiService.searchResult;
      this._tmdbApiService.searching = false;
    }else{
      this._tmdbApiService.getPopularMovies().then(data => {this.movies = data.results;})
      .catch( _  => {
        this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["**"]));
        console.error("Error loading movies information")
      });
    }
    // setTimeout(() => {
    //   console.log('this.movies', this.movies);
    // },4000)
  }

  setSelectedMovieId(movieId: string){
    this._tmdbApiService.setSelectedMovieId(movieId);
  }

  // gotoMovie(movieId: string ){
  //   this.router.navigate(['/movie',this._tmdbApiService.selectedMovieId]) 
  // }
}
