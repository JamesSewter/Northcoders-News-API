# Northcoders News API

Hello, and welcome to my first project - Northcoders-News-API! It is the back-end for a news website - the front-end repo can be found here: https://github.com/JamesSewter/nc-news.

## Description
This project is a RESTful API designed to provide access to a database containing news articles, topics, user information, and comments. It includes features for interacting with the data, such as adding new comments and upvoting or downvoting articles. Comprehensive error handling has been implemented to ensure robust functionality. The development process was driven by TDD and integrated testing, ensuring reliability and precision in all features. Detailed examples of request methods for each endpoint are documented in the endpoints.json file.

## Hosted API
Check out my hosted API: https://northcoders-news-api-7cgk.onrender.com/api (Please allow up to 1 minute of loading time!)
Try adding these endpoints to the end of the url:  

  1) `/api/articles` (this will show all articles in reverse chronological order)
  2) `/api/topics` (all topics)
  3) `/api/articles/1` (this will show the article with an id of 1)
                                                                                       
All endpoints can be found in the original link: https://northcoders-news-api-7cgk.onrender.com/api
Happy reading!!!     

## Instructions to clone the repo on your own machine:
### Please follow these steps: 

### 1) Please ensure that you have Node.js and PostgreSQL downloaded.
You can do this here: [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [PostgreSQL](https://www.postgresql.org/download/). Note you will need at least Node 10.9.1
and 
### 2) Clone this repo locally and install dependencies.
Use git clone in your terminal to access this repo locally. Then, run npm install to install the following dependencies: **Express, pg, pg-format, and dotenv. supertest and jest**, along with  **jest-sorted and jest-extended** which are necessary for integrated testing.

### 3) Add .env.test and .env.development to the root of this repo.
To connect to the dev and test databases please add .ev.test and .env.development files to the root of the repo. In each file please add `PGDATABASE=nc_news_test` and `PGDATABASE=nc_news` respectively to be able to run this project locally.

### 4) Setting up and seeding
To setup the test and devlopment databases run the command npm run setup-dbs.
To seed the databases run npm seed.

### 5) Tests and Server
View tests in __tests__ for both app.js and utilts. To run tests run the command run `npm run test`.
To run the server use `npm run start`.

### 6) Front-end
View my front-end repo here: https://github.com/JamesSewter/nc-news

--- 
## Feedback
Please feel free to give feedback via LinkedIn [here](https://www.linkedin.com/in/james-sewter/).
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
