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
  getGenre(): { genresList: string } {
    return this.genre;
  }
  getReleaseDate(): Date {
    return this.releaseDate;
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

  getMostViewedShowsOfYear(year: number): Map<Show, number> {
    const allShowsFromQueriedYear = [...this.viewsByShowNames.entries()].filter(
      show => show[0].getReleaseDate().getFullYear() === year
    );
    const notSortedMap = new Map(allShowsFromQueriedYear);
    const sortedMap = this.sortMapByViews(notSortedMap);
    console.log(`getMostViewedShowsOfYear: ${year}`, sortedMap);
    return sortedMap;
  }

  getMostViewedShowsOfGenre(genre: string): Map<Show, number> {
    const allShowsFromQueriedGenre = [
      ...this.viewsByShowNames.entries(),
    ].filter(show => show[0].getGenre().genresList.includes(genre));

    const notSortedMap = new Map(allShowsFromQueriedGenre);
    const sortedMap = this.sortMapByViews(notSortedMap);
    console.log(`getMostViewedShowsOfGenre: ${genre}`, sortedMap);
    return sortedMap;
  }

  getShows(): Show[] {
    return this.shows;
  }

  addViewByShowObject(show: Show): void {
    let views = this.viewsByShowNames.get(show);
    views ? (views += 1) : (views = 1);

    this.viewsByShowNames.set(show, views);
  }

  private sortMapByViews(notSortedMap: Map<Show, number>): Map<Show, number> {
    const sortedByViews = [...notSortedMap].sort((a, b) => b[1] - a[1]);

    if (sortedByViews.length > 10) {
      const firstTen = sortedByViews.slice(0, 10);
      const firstTenMap = new Map(firstTen);
      return firstTenMap;
    }

    const sortedByViewsMap = new Map(sortedByViews);

    return sortedByViewsMap;
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

    console.log('recommendationTrending', recommendationTrending);

    return recommendationTrending;
  }

  getRecommendationByGenre(genre: string): Show {
    const mostViewedShowsOfYear =
      this.streamingService.getMostViewedShowsOfGenre(genre);

    const recommendationByGenre = this.randomShowSelection(
      mostViewedShowsOfYear
    );

    console.log('recommendationByGenre', recommendationByGenre);

    return recommendationByGenre;
  }

  private randomShowSelection(showMap: Map<Show, number>): Show {
    const ArrayFromShowMap = [...showMap.entries()];

    const arrayLength = ArrayFromShowMap.length;
    const random = Math.floor(Math.random() * arrayLength);

    const randomSelection = ArrayFromShowMap[random][0];

    return randomSelection;
  }
}

class User {
  private subscriptions: Subscription[] = [];

  subscribe(streamingService: StreamingService): Subscription {
    const newSubscription = new Subscription(streamingService);

    this.subscriptions.push(newSubscription);

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
// console.log('netflix before', netflix);
netflix.addShow(movieInterstellar);
// netflix.addShow(movieInterstellar);
netflix.addShow(movieMinionsTheRiseofGru);
netflix.addShow(movieJurassicWorldDominion);
netflix.addShow(series);
// console.log('netflix after', netflix);

const subscription = new Subscription(netflix);
console.log('subscription', subscription);
subscription.watch('Money Heist');
subscription.watch('Interstellar');
subscription.watch('Interstellar');
subscription.watch('Minions: The Rise of Gru');

subscription.watch('Spiderman');
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

console.log('rostyk', rostyk);
