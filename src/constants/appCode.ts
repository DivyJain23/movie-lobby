/* eslint-disable no-unused-vars */
export enum AppError {
    UNAUTHORIZED = 'Unauthorized, use the provided token',
    DB_URL_NOT_FOUND = 'Db url not found',
    DB_NAME_NOT_FOUND = 'Db name not found',
    MOVIE_ALREADY_EXIST = 'Movie already exist with this title',
    URL_NOT_FOUND = 'Url not found',
    KEYWORD_NOT_FOUND = 'Keyword not found',
    TITLE_NOT_FOUND = 'Title not found',
    GENRE_NOT_FOUND = 'Genre not found',
    RATING_NOT_FOUND = 'Rating not found',
    STREAMING_LINK_NOT_FOUND = 'Streaming link not found',
    MOVIE_NOT_FOUND = 'Movie not found',
    INVALID_MOVIE_ID = 'Invalid movie id',
    ADMIN_ROLE_REQUIRED= 'You must have admin privileges to access this resource.'
}

export enum ErrorCode {
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 400
}

export enum AppSuccess {
    SUCCESS = 'success',
    MESSAGE = 'API Operation successful'
}