export const getGenreNameFromId = (id) => {
  switch (id) {
    case 28:
      return "Action";
    case 12:
      return "Adventure";
    case 16:
      return "Animation";
    case 35:
      return "Comedy";
    case 80:
      return "Crime";
    case 99:
      return "Documentary";
    case 18:
      return "Drama";
    case 10751:
      return "Family";
    case 14:
      return "Fantasy";
    case 36:
      return "History";
    case 27:
      return "Horror";
    case 10402:
      return "Music";
    case 9648:
      return "Mystery";
    case 10749:
      return "Romance";
    case 878:
      return "Science Fiction";
    case 10770:
      return "TV Movie";
    case 53:
      return "Thriller";
    case 10752:
      return "War";
    case 37:
      return "Western";
    case 10759:
      return "Action & Adventure";
    case 10763:
      return "News";
    case 10764:
      return "Reality";
    case 10765:
      return "Sci-Fi & Fantasy";
    case 10766:
      return "Soap";
    case 10767:
      return "Talk";
    case 10768:
      return "War & Politics";
    default:
      return "Unknown";
  }
};

export const getAllGenresIds = [
  28,
  12,
  16,
  35,
  80,
  99,
  18,
  10751,
  14,
  36,
  27,
  10402,
  9648,
  10749,
  878,
  10770,
  53,
  10752,
  37,
  10759,
  10763,
  10764,
  10765,
  10766,
  10767,
  10768,
];
