import * as chai from "chai";
const chaiHttp = require("chai-http");
import { describe, before, it } from "mocha";
import { app } from "../../../src/server";
import { MovieModel } from "../../../src/models/movies";

chai.use(chaiHttp);
const { expect, request } = chai;

describe("Get movie api test cases", () => {
  before((done) => {
    app.on("serverStarted", async () => {
      done();
    });
  });
  it("It should return success", async () => {
    const response = await request(app).get("/api/v1/movie/movies");
    expect(response).to.have.status(200);
    response.body.data.movies.forEach((movie: any) => {
      expect(movie).to.have.property("_id");
      expect(movie).to.have.property("title");
    });
    return true;
  });

  it("should return 404 for an invalid endpoint", async () => {
	const response = await request(app).get("/api/v1/movie/invalid-endpoint");
	expect(response).to.have.status(404);
  });
});


describe("Search Movie API Test Cases", () => {
  before((done) => {
    if (!app.listen) {
      app.on("serverStarted", done); // Wait for the server to start
    } else {
      done();
    }
  });

  describe("GET /api/v1/movie/search", () => {
    it("should return movies matching the search query (by title)", async () => {
      const response = await request(app).get("/api/v1/movie/search?q=Inception");
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("success", true);
      expect(response.body.data).to.have.property("movies").that.is.an("array");

      response.body.data.movies.forEach((movie: any) => {
        expect(movie).to.have.property("_id").that.is.a("string");
        expect(movie).to.have.property("title").that.includes("Inception");
        expect(movie).to.have.property("genre").that.is.a("string");
      });
    });

    it("should return movies matching the search query (by genre)", async () => {
      const response = await request(app).get("/api/v1/movie/search?q=Action");
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("success", true);
      expect(response.body.data).to.have.property("movies").that.is.an("array");

      response.body.data.movies.forEach((movie: any) => {
        expect(movie).to.have.property("_id").that.is.a("string");
        expect(movie).to.have.property("genre").that.includes("Action");
      });
    });

    it("should return an empty list for a query with no matches", async () => {
      const response = await request(app).get("/api/v1/movie/search?q=NonExistentMovie");
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("success", true);
      expect(response.body.data).to.have.property("movies").that.is.an("array").that.is.empty;
    });
    it("should return a 400 error when the query parameter is missing", async () => {
      const response = await request(app).get("/api/v1/movie/search");
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("success", false);
      expect(response.body).to.have.property("code", 400);
      expect(response.body).to.have.property("msg").that.is.a("string");
      expect(response.body.msg).to.equal("Query parameter 'q' is required");
    });    
  });
});

describe("Create Movie API Test Cases", () => {
  before((done) => {
    if (!app.listen) {
      app.on("serverStarted", done); // Wait for the server to start
    } else {
      done();
    }
  });

  it("should return an unauthorized when required role is not admin", async () => {
    const incompletePayload = {
      title: "Interstellar",
    };

    const response = await request(app)
      .post("/api/v1/movie/movies")
      .send(incompletePayload);

    expect(response).to.have.status(401);
  });

  it("should return an error when required fields are missing", async () => {
    const incompletePayload = {
      title: "Interstellar", // Missing other required fields
    };
  
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzUyMTg1ODF9.LulRBHXDhAmrbKXqCec2J3p8iaUM_75tSa5u9vASOeQ"
  
    const response = await request(app)
      .post("/api/v1/movie/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(incompletePayload);
  
    // Check for 400 status code
    expect(response).to.have.status(404);
  
    // Check the response structure
    expect(response.body).to.have.property("success", false);
    expect(response.body).to.have.property("msg").that.is.a("string");
    expect(response.body.msg).to.equal("Genre not found"); // Or the specific missing field message
  });  
  
});

describe("Update Movie API Test Cases", () => {
  before((done) => {
    if (!app.listen) {
      app.on("serverStarted", done); // Wait for the server to start
    } else {
      done();
    }
  });

  beforeEach(async () => {
    // Clear the movies collection before each test
    await MovieModel.deleteMany({});
  });

  it("should update an existing movie successfully", async () => {
    const createPayload = {
      title: "Inception test 1111",
      genre: "Sci-Fi",
      rating: 9,
      streaming_link: "https://example.com/inception",
    };

    const updatePayload = {
      title: "Inception Updates test 1111",
      genre: "Thriller", // Updating the genre
      rating: 10, // Updating the rating
      streaming_link: "https://example.com/inception",
    };

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzUyMTg1ODF9.LulRBHXDhAmrbKXqCec2J3p8iaUM_75tSa5u9vASOeQ"

    // Create the movie first
    const createResponse = await request(app)
      .post("/api/v1/movie/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(createPayload);

    expect(createResponse).to.have.status(200);
    const movieId = createResponse.body.data.savedMovie._id;

    // Update the movie
    const updateResponse = await request(app)
      .put(`/api/v1/movie/movies/${movieId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatePayload);

    expect(updateResponse).to.have.status(200);

    // Check the updated response
    expect(updateResponse.body).to.have.property("success", true);
  });
});

describe("Delete Movie API Test Cases", () => {
  before((done) => {
    if (!app.listen) {
      app.on("serverStarted", done); // Wait for the server to start
    } else {
      done();
    }
  });

  beforeEach(async () => {
    // Clear the movies collection before each test
    await MovieModel.deleteMany({});
  });

  it("should delete an existing movie successfully", async () => {
    const createPayload = {
      title: "Movie to Delete",
      genre: "Action",
      rating: 8,
      streaming_link: "https://example.com/movie-to-delete",
    };

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzUyMTg1ODF9.LulRBHXDhAmrbKXqCec2J3p8iaUM_75tSa5u9vASOeQ";

    // Create the movie first
    const createResponse = await request(app)
      .post("/api/v1/movie/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(createPayload);

    expect(createResponse).to.have.status(200);
    const movieId = createResponse.body.data.savedMovie._id;

    // Delete the movie
    const deleteResponse = await request(app)
      .delete(`/api/v1/movie/movies/${movieId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse).to.have.status(200);

    // Verify the response structure
    expect(deleteResponse.body).to.have.property("success", true);
    expect(deleteResponse.body).to.have.property("msg").that.is.a("string");

    // Verify the movie no longer exists in the database
    const deletedMovie = await MovieModel.findById(movieId);
    expect(deletedMovie).to.be.null;
  });
});
