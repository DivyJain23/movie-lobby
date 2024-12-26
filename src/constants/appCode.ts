export enum AppError {
    UNAUTHORIZED = "Unauthorized",
    DB_URL_NOT_FOUND = "Db url not found",
    DB_NAME_NOT_FOUND = "Db name not found",
    MOVIE_ALREADY_EXIST = "Movie already exist with this title",
    URL_NOT_FOUND = "Url not found",
    KEYWORD_NOT_FOUND = "Keyword not found",
    TITLE_NOT_FOUND = "Title not found", // Added error for missing title
    GENRE_NOT_FOUND = "Genre not found", // Added error for missing genre
    RATING_NOT_FOUND = "Rating not found", // Added error for missing rating
    STREAMING_LINK_NOT_FOUND = "Streaming link not found", // Added error for missing streaming link
}

export enum ErrorCode {
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 400
}

export enum AppSuccess {
    SUCCESS = "success",
    MESSAGE = "API Operation successful"
}