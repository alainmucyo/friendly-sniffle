# File handler

File handler API received HTTP requests Excel file which contains dummy user data, extracts data from it and saves them.
It also has user authentication and registration. This project was built as a coding test. 

---

## Getting Started
The project contains two folders(services) both built with Nestjs. Make sure you have both folders.
1. git clone this repository & cd to the project directory

## Pre-requisites

* Nodejs v14 or greater
* Git
* VSCode, Webstorm or even any other code editor of your preferred choice.
* PostgreSQL
* Redis

## Installing

* Install [Nodejs](https://nodejs.org/en/) if you don't have it installed.

* Install [git](https://www.digitalocean.com/community/tutorials/how-to-contribute-to-open-source-getting-started-with-git)
  , (optional) if you dont have it installed.

* Install [PostgreSQL](https://www.postgresql.org)

## Run the project

#### Using VSCode
The instructions below work on both services.
1. Launch VSCode editor,
2. Make copy of `.env.example` to `.env`,
3. Set up `REDIS_URL` in `.env` file,
4. Setup your PostgreSQL database credentials in .env,
5. You can set the `PORT` you want to use in the `.env` file, if you don't set it, it will run on `3000` by default.
6. Congratulations! You have successfully launched file handler app!
7. You can register and use `demo.xlsx` file provided to test file uploading

### Launch with Docker

> For this, you need to have [Docker](https://www.docker.com/) installed in your system.

1. Make copy of `.env.example` to `.env`,
2. Set up `REDIS_URL` in `.env` file,
3. Setup your PostgreSQL database credentials in .env,
4. Run `docker build -t <image-name> .` to build the docker image
5. Run `docker run -p 3000:3000 <image-name>` to run the image. This will expose port `3000`


### To check if the API is up and running.

Just call this endpoint: `http://localhost:3000/` using a GET method It will show a `hello world` response.

#### Find `SWAGGER` the API docs on account service `/api-docs` to get all API available

## Testing

Run `npm test`

## Built With

* [Nestjs](https://nestjs.com/)
* [Typeorm](https://typeorm.io)


## Authors

* **Alain MUCYO** (https://github.com/alainmucyo)

## Licence

This software is published under the [MIT licence](http://opensource.org/licenses/MIT).

