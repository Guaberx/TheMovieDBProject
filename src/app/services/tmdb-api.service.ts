import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TMDBApiService {
  private baseURL = 'https://api.themoviedb.org/3'
  private key = '29af288d1a3b0f19df5bc022987e2984'
  private language = 'en-US'
  
  private selectedMovieId: string = "429617"
  private selectedActor: string = ""
  public searching: boolean = false;
  public searchResult: any;

  selectedMovieIdChange: Subject<string> = new Subject<string>();


  constructor(private _http: HttpClient) { }

// Main Functions.
  
  //This function is used to make request to the api-rest.
  private getFromTMDB(search: string): Promise<any>{
    let url = `${this.baseURL}/${search}?api_key=${this.key}&language=${this.language}`;
    return this._http.get(url).toPromise();
  }

  public getSearchMovie(search: string): Promise<any>{
    let url = `${this.baseURL}/search/movie?api_key=${this.key}&language=${this.language}&query=${search}&page=1&include_adult=false`;
    console.log("URL: " , url);
    
    return this._http.get(url).toPromise();
  }

// Movies Functions. Get methods make requests using getFromTMDB(search) function.

  //Gets all information of most popular movies.
  getPopularMovies(): Promise<any>{ 
    return this.getFromTMDB('movie/popular');
  }

  //Gets the information of an specific moviee.
  getSelectedMovieById(movieId: string): Promise<any>{
    return this.getFromTMDB('movie/' + movieId);
  }

  //Gets the information of the last movie selected. Its id is saved in "selectedMovieId"
  //This one is use for the big posters in a movie page.
  getSelectedMovie(): Promise<any>{
    return this.getSelectedMovieById(this.selectedMovieId);
  }

  //Gets the cast and other information about an specific movie.
  //This one is use to get actors that worked on a movie.
  getCredits(id: string):Promise<any>{
    return this.getFromTMDB(`movie/${id}/credits`)
  }

  //Gets information about similar movies of an specific movie.
  getSimilarMovies(id: string):Promise<any>{
    return this.getFromTMDB(`movie/${id}/similar`)
  }

  //Changes the selected movie.
  setSelectedMovieId(movieId: string){
     this.selectedMovieIdChange.next(movieId);
     this.selectedMovieId = movieId;    
  }



  // Actors Functions.
  
  //Gets information about popular actors.
  getPopularActors(): Promise<any>{ 
    return this.getFromTMDB('person/popular');
  }
  
  //Gets information about an specific actor.
  getSelectedActorById(actorId: string): Promise<any>{
    return this.getFromTMDB(`person/${actorId}`);
  }

  //Gets the information of the selected actor. Its id is saved in "selectedActor".
  getSelectedActor(): Promise<any>{
    return this.getSelectedActorById(this.selectedActor);
  }

  //Gets information about an specific actor.
  //It is used to show movies where the actor has worked.
  getActorCredits(actorId: string): Promise<any>{
    return this.getFromTMDB(`person/${actorId}/movie_credits`)
  }

  //Changes "selectedActor" to save its id.
  setSelectedActorId(actorId: string){
    this.selectedActor = actorId;    
  }
}
