abstract class Show {
  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date
  ) {}

  abstract getDuration(): number;

  getName(): string {
    return this.name;
  }
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
  }

  getDuration() {
    return this.episodes.reduce((sum, episode) => {
      return sum + episode.getDuration();
    }, 0);
  }
}

class StreamingService {
  private shows: Show[] = [];
  protected viewsByShowNames: Map<Show['name'], number> = new Map();
  //change string of name to full object of film

  constructor(protected name: string) {}

  addShow(show: Show): void {
    if (this.shows.includes(show)) {
      console.log(`${show.getName()} is already in library`);
      return;
    }
    this.shows.push(show);
  }

  getShows(): Show[] {
    return this.shows;
  }

  addViewByShowNames(showName: string): void {
    let views = this.viewsByShowNames.get(showName);
    views ? (views += 1) : (views = 1);

    this.viewsByShowNames.set(showName, views);
  }

  getMostViewedShowsOfYear(year: number): [] {
    //find all films from that yeart
    //release date
    //sort them from most viewed to less (values)
    console.log(year);
    this.viewsByShowNames.forEach((value, key) => {
      console.log(key, value);
    });

    //     повертає до десяти найбільш
    // переглянутих шоу, які вийшли в заданому році (менше десяти, якщо загальна
    // кількість шоу менша за 10).
    return [];
  }
  //   getMostViewedShowsOfGenre(genre): void {

  //    //
  //   }
}

class Subscription {
  constructor(protected streamingService: StreamingService) {}

  watch(showName: string): void {
    const isShowsListEmpty = !(this.streamingService.getShows().length > 0);
    const isQueriedShowAddedToService = !this.streamingService
      .getShows()
      .find(show => show.getName() === showName);

    if (isShowsListEmpty) return;
    if (isQueriedShowAddedToService) {
      console.log(`${showName} is not available in StreamingService`);
      return;
    }

    console.log(`Watching ${showName}`);
    this.streamingService.addViewByShowNames(showName);
  }

  // getRecommendationTrending(): void {
  //   this.streamingService.getMostViewedShowsOfYear();
  //   //рандомно вибирає елемент масиву, сортує по тривалості.
  // }
  // getRecommendationByGenre(genre: string): void {
  //   this.streamingService.getMostViewedShowsOfGenre();
  //   //рандомно вибирає елемент масиву, сортує по тривалості.
  // }
}

// class User {
//   private subscriptions: [];
//   constructor() {}

//   subscribe(streamingService: {}): {} {
//     this.subscriptions.push(streamingService);
//     return this.subscriptions;
//   }
// }

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

// console.log(movie);
// console.log(episode1);
// console.log(series);
// console.log(series.getDuration());
/////////////////////////////////////////////

const netflix = new StreamingService('Netflix');
console.log(netflix);
netflix.addShow(movie);
netflix.addShow(movie);
netflix.addShow(series);
console.log(netflix);

const subscription = new Subscription(netflix);
console.log('subscription', subscription);
subscription.watch('Money Heist');
subscription.watch('Interstellar');
subscription.watch('Interstellar');
subscription.watch('Spiderman');
console.log('netflix', netflix);

netflix.getMostViewedShowsOfYear(2017);
