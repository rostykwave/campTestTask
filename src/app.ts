abstract class Show {
  private views: number = 0;

  constructor(
    protected name: string,
    protected genre: { genresList: string },
    protected releaseDate: Date
  ) {}

  abstract getDuration(): number;

  getName(): string {
    return this.name;
  }
  getGenre(): { genresList: string } {
    return this.genre;
  }
  getReleaseDate(): Date {
    return this.releaseDate;
  }

  setViews(views: number): void {
    this.views = views;
  }
  getViews(): number {
    return this.views;
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
  protected viewsByShowNames: Map<Show, number> = new Map();

  constructor(protected name: string) {}

  addShow(show: Show): void {
    if (this.shows.includes(show)) {
      console.log(`${show.getName()} is already in library`);
      return;
    }
    this.shows.push(show);
  }

  getMostViewedShowsOfYear(year: number): Show[] {
    const allShowsFromQueriedYear = [...this.viewsByShowNames.entries()].filter(
      show => show[0].getReleaseDate().getFullYear() === year
    );

    const allSortedShows = [...allShowsFromQueriedYear]
      .sort((a, b) => b[1] - a[1])
      .map(a => {
        a[0].setViews(a[1]);
        return a[0];
      });

    if (allSortedShows.length > 10) {
      const firstTen = allSortedShows.slice(0, 10);
      console.log('StreamingService.getMostViewedShowsOfYear >10', firstTen);
      return firstTen;
    }

    console.log('StreamingService.getMostViewedShowsOfYear', allSortedShows);
    return allSortedShows;
  }

  getMostViewedShowsOfGenre(genre: string): Show[] {
    const allShowsFromQueriedGenre = [
      ...this.viewsByShowNames.entries(),
    ].filter(show => show[0].getGenre().genresList.includes(genre));

    const allSortedShows = [...allShowsFromQueriedGenre]
      .sort((a, b) => b[1] - a[1])
      .map(a => {
        a[0].setViews(a[1]);
        return a[0];
      });

    if (allSortedShows.length > 10) {
      const firstTen = allSortedShows.slice(0, 10);
      console.log('StreamingService.getMostViewedShowsOfGenre >10', firstTen);
      return firstTen;
    }

    console.log('StreamingService.getMostViewedShowsOfGenre', allSortedShows);
    return allSortedShows;
  }

  getShows(): Show[] {
    return this.shows;
  }

  addViewByShowObject(show: Show): void {
    let views = this.viewsByShowNames.get(show);
    views ? (views += 1) : (views = 1);

    this.viewsByShowNames.set(show, views);
  }

  getName() {
    return this.name;
  }
}

class Subscription {
  constructor(protected streamingService: StreamingService) {}

  watch(showName: string): void {
    const allShows = this.streamingService.getShows();
    const isShowsListEmpty = !(allShows.length > 0);
    const queriedShow = allShows.find(show => show.getName() === showName);

    if (isShowsListEmpty) return;
    if (!queriedShow) {
      console.log(`${showName} is not available in StreamingService`);
      return;
    }

    console.log(`Watching ${showName}`);
    this.streamingService.addViewByShowObject(queriedShow);
  }

  getRecommendationTrending(year: number): Show {
    const mostViewedShowsOfYear =
      this.streamingService.getMostViewedShowsOfYear(year);

    const recommendationTrending = this.randomShowSelection(
      mostViewedShowsOfYear
    );

    console.log(
      'Subscription - recommendationTrending',
      recommendationTrending
    );

    return recommendationTrending;
  }

  getRecommendationByGenre(genre: string): Show {
    console.log('genre', genre);
    const mostViewedShowsOfYear =
      this.streamingService.getMostViewedShowsOfGenre(genre);

    const recommendationByGenre = this.randomShowSelection(
      mostViewedShowsOfYear
    );

    console.log('Subscription - recommendationByGenre', recommendationByGenre);

    return recommendationByGenre;
  }

  getStreamingService() {
    return this.streamingService;
  }

  private randomShowSelection(showsArray: Show[]): Show {
    const arrayLength = showsArray.length;
    if (!(arrayLength > 0)) {
      console.log('There is no shows with this parameters to recommend');
    }
    const random = Math.floor(Math.random() * arrayLength);
    const randomSelection = showsArray[random];
    return randomSelection;
  }
}

class User {
  private subscriptions: Subscription[] = [];

  subscribe(streamingService: StreamingService): Subscription | null {
    const isAlreadySubscribed = !!this.subscriptions.find(
      sub => sub.getStreamingService() === streamingService
    );

    if (isAlreadySubscribed) {
      console.log(`User already subscribed to ${streamingService.getName()}`);
      return null;
    }

    const newSubscription = new Subscription(streamingService);

    this.subscriptions.push(newSubscription);

    console.log('newSubscription', newSubscription);
    return newSubscription;
  }
}

///////////Execution
const movieInterstellar = new Movie(
  'Interstellar',
  { genresList: 'Adventure, Drama, Science Fiction' },
  new Date('2014-11-06T00:00:00'),
  169
);
const movieMinionsTheRiseofGru = new Movie(
  'Minions: The Rise of Gru',
  { genresList: 'Animation, Adventure, Comedy, Fantasy' },
  new Date('2022-07-01T00:00:00'),
  87
);
const movieJurassicWorldDominion = new Movie(
  'Jurassic World Dominion',
  { genresList: 'Adventure, Action, Science Fiction' },
  new Date('2022-06-23T00:00:00'),
  187
);

const seriesMoneyHeistEP1 = new Episode(
  'Efectuar lo acordado',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  47
);
const seriesMoneyHeistEP2 = new Episode(
  'Imprudencias letales',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  41
);

const seriesMoneyHeist = new Series(
  'Money Heist',
  { genresList: 'Heist, Thriller, Drama, Crime' },
  new Date('2017-05-02T00:00:00'),
  [seriesMoneyHeistEP1, seriesMoneyHeistEP2]
);

// console.log(movie);
// console.log(episode1);
// console.log(series);
// console.log(series.getDuration());
/////////////////////////////////////////////

const netflix = new StreamingService('Netflix');
// console.log('netflix before', netflix);
netflix.addShow(movieInterstellar);
//dublicate
netflix.addShow(movieInterstellar);
////
netflix.addShow(movieMinionsTheRiseofGru);
netflix.addShow(movieJurassicWorldDominion);
netflix.addShow(seriesMoneyHeist);

const subscription = new Subscription(netflix);
console.log('subscription', subscription);
subscription.watch('Money Heist');
subscription.watch('Interstellar');
subscription.watch('Interstellar');
subscription.watch('Minions: The Rise of Gru');
///not added to library
subscription.watch('Spiderman');
///
subscription.watch('Jurassic World Dominion');
subscription.watch('Jurassic World Dominion');
subscription.watch('Jurassic World Dominion');
console.log('netflix', netflix);

// netflix.getMostViewedShowsOfYear(2022);
// netflix.getMostViewedShowsOfGenre('Adventure');

subscription.getRecommendationTrending(2022);
subscription.getRecommendationByGenre('Adventure');

const rostyk = new User();
rostyk.subscribe(netflix);
//not allowed to subscribe more than one time
rostyk.subscribe(netflix);
//
console.log('rostyk', rostyk);
