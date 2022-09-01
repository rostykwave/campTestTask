abstract class Show {
  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date
  ) {}

  abstract getDuration(): number;
}

class Movie extends Show {
  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date,
    protected duration: number
  ) {
    super(name, genre, releaseDate);
  }
  getDuration() {
    return this.duration;
  }
}
class Episode extends Show {
  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date,
    protected duration: number
  ) {
    super(name, genre, releaseDate);
  }

  getDuration() {
    return this.duration;
  }
}

class Series extends Show {
  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date,
    protected episodes: Episode[]
  ) {
    super(name, genre, releaseDate);
    this.episodes = episodes;
  }

  getDuration() {
    return this.episodes.reduce((sum, episode) => {
      return sum + episode.getDuration();
    }, 0);
  }
}

///////////Execution
const movie = new Movie(
  'Interstellar',
  { genresList: 'Adventure, Drama, Science Fiction' },
  new Date('2014-11-06T00:00:00'),
  169
);

const episode1 = new Episode(
  'Efectuar lo acordado',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  47
);
const episode2 = new Episode(
  'Imprudencias letales',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  41
);

const series = new Series(
  'Money Heist',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  [episode1, episode2]
);

console.log(movie);
console.log(episode1);
console.log(series);
console.log(series.getDuration());

// class StreamingService(){
//   private name: string;
//   private shows: name: [];
//   //viewsByShowNames:

//   addShow(show:string): void {
//     shows.push(show);
//   }

//   getMostViewedShowsOfYear(year): [] {
//     //     повертає до десяти найбільш
//     // переглянутих шоу, які вийшли в заданому році (менше десяти, якщо загальна
//     // кількість шоу менша за 10).
//     return []
//   }

//     getMostViewedShowsOfGenre(genre): void {
//      //
//     }

// //     повертає до десяти найбільш
// // переглянутих шоу, які належать до заданого жарну(менше десяти, якщо загальна
// // кількість шоу менша за 10).

// }

// class Subscription {
//   private streamingService: {};

//   watch(showName: string): void {
//     console.log(`Watching ${showName}`);
//   }

//   getRecommendationTrending(): void {
//     this.streamingService.getMostViewedShowsOfYear();
//     //рандомно вибирає елемент масиву, сортує по тривалості.
//   }
//   getRecommendationByGenre(genre: string): void {
//     this.streamingService.getMostViewedShowsOfGenre();
//     //рандомно вибирає елемент масиву, сортує по тривалості.
//   }
// }

// class User {
//   private subscriptions: [];
//   constructor() {}

//   subscribe(streamingService: {}): {} {
//     this.subscriptions.push(streamingService);
//     return this.subscriptions;
//   }
// }
