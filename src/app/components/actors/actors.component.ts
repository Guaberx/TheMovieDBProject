import { Component, OnInit } from '@angular/core';
import { TMDBApiService } from 'src/app/services/tmdb-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit {
  public actors = []
  public imgUrl = 'https://image.tmdb.org/t/p/w500/'

  constructor(private _tmdbApiService: TMDBApiService, private route:Router) { }

  ngOnInit() {
    this._tmdbApiService.getPopularActors().then(data => {
      this.actors = data.results;
      console.log(this.actors);
      
    }).catch( _ => {
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["**"]));
      console.error("Error Loading Actors Information");
      
    });
  }

  setSelectedActorId(actorId: string){
    this._tmdbApiService.setSelectedActorId(actorId);
  }
}
