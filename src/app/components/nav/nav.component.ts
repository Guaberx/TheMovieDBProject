import { Component, OnInit } from '@angular/core';
import { TMDBApiService } from 'src/app/services/tmdb-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private _tmdbApiService: TMDBApiService, private route:Router) { }
  private searched: boolean = false;

  ngOnInit() {
  }

  //This function calls the "getSearchMovie(search)" function from the service wich then allows the "movies" component to
  //either load the most popular content or the searched movies.
  search(){
    let tmp  = (<HTMLInputElement>document.getElementById("search")).value;
    console.log("PUTAS",tmp);
    
    this._tmdbApiService.getSearchMovie(tmp).then(data =>{      
      this._tmdbApiService.searching = true;
      this._tmdbApiService.searchResult = data.results;
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["movies"]));
      this.searched = true;
    }).catch( data =>{
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["**"]));
    })
  }

  //When a search was made. A bug happens when clicking on "Movies" wich makes the page not to reload its content.
  //This function solves this bug
  reloadMovies(){
    if(this.searched){
      this.route.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>this.route.navigate(["movies"]));
      this.searched = false;
    }
  }

  keydown(event){
    if(event.key == "Enter")
      this.search();
  }

}
