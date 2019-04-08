export default class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.description = data[`film_info`][`description`];
    this.director = data[`film_info`][`director`];
    this.genre = data[`film_info`][`genre`];
    this.poster = data[`film_info`][`poster`];
    this.release = data[`film_info`][`release`];
    this.actors = data[`film_info`][`actors`];
    this.totalRating = data[`film_info`][`total_rating`];
    this.personalRating = data[`user_details`][`personal_rating`];
    this.ageRating = data[`film_info`][`age_rating`];
    this.duration = data[`film_info`][`runtime`];
    this.writers = data[`film_info`][`writers`] || [];
    this.comments = data[`comments`] || [];
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.isWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.watchingDate = data[`user_details`][`watching_date`];
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'description': this.description,
        'director': this.director,
        'genre': this.genre,
        'poster': this.poster,
        'release': this.release,
        'actors': this.actors,
        'total_rating': this.totalRating,
        'age_rating': this.ageRating,
        'runtime': this.duration,
        'writers': this.writers,
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'favorite': this.isFavorite,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate,
        'watchlist': this.isWatchList,
      }
    };
  }

  static parseTask(data) {
    return new ModelFilm(data);
  }

  static parseTasks(data) {
    return data.map(ModelFilm.parseTask);
  }
}
