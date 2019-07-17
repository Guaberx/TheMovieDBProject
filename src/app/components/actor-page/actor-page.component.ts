import { Component, OnInit } from '@angular/core';
import { TMDBApiService } from 'src/app/services/tmdb-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-actor-page',
  templateUrl: './actor-page.component.html',
  styleUrls: ['./actor-page.component.scss']
})
export class ActorPageComponent implements OnInit {
  public imgUrl = 'https://image.tmdb.org/t/p/w500/'
  public actor;
  public movies;

  constructor(private _tmdbApiService: TMDBApiService, private route:Router) { }

  //Loads the data as promises
  ngOnInit() {
    this._tmdbApiService.getSelectedActor().then(data => {
      this.actor = data;
      this._tmdbApiService.getActorCredits(this.actor.id).then(data2 => {
        this.movies = data2.cast;        
      })  
    }).catch(data => {
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["**"]));
      console.error("Error loading actor information")});
  }
  //Calls the same function from the service.
  setSelectedMovieId(movieId: string){
    this._tmdbApiService.setSelectedMovieId(movieId);
  }

}
