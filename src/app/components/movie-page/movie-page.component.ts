import { Component, OnInit } from '@angular/core';
import { TMDBApiService } from 'src/app/services/tmdb-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {
  public imgUrl = 'https://image.tmdb.org/t/p/w500/'
  public movie;
  public cast;
  public movies;//Similar movies

  constructor(private _tmdbApiService: TMDBApiService, private route:Router) { }

  // Load necesary data.
  ngOnInit() {
    this._tmdbApiService.getSelectedMovie().then(data => {      
      this.movie = data;
      this._tmdbApiService.getCredits(this.movie.id).then(data => this.cast=data).catch( () => console.error("Credits Not found"));
      this._tmdbApiService.getSimilarMovies(this.movie.id).then(data => this.movies=data.results).catch( () => console.error("Similar Not found"));    
    }).catch(_ =>{
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["**"]));
      console.error("Error Loading Movie Information"); 
    });

  }
  
  //Calls the service's function that changes the selected actor.
  setSelectedActorId(actorId: string){
    this._tmdbApiService.setSelectedActorId(actorId);
  }
  
  //Calls the service's function that changes the selected movie. Also refreshes the page so all new content can be displayed
  setSelectedMovieId(movieId: string){
    this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["movie"])); 
    this._tmdbApiService.setSelectedMovieId(movieId);
  }
}
