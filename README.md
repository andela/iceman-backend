[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

Barefoot Nomad - Making company travel and accommodation easy and convenient.

## Vision

Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---
## Sequelize Setup
- npm install -g sequelize-cli. This CLI enables us to create migrations and in our project.
- npm install --save sequelize pg pg-hstore. These are necessary for sequelize to connect to postgres
- Set the necessary Environmental Variables
  - Environment Variables for Developement Database
    <pre>
    <code>
    USERNAME=provide_db_user
    PASSWORD=provide_db_user_password
    DB_NAME=provide_local_database_name
    HOST=provide_database_server_host
    </code>
    </pre>
  -  Environment Variable for Test Database
       <pre><code>DATABASE_URL_TEST=provide_test_database_url</code></pre>
  -  Environment Variable for Production Database
       <pre><code>DATABASE_URL=provide_production_database_url</code></pre>
- Then you run any oending migrations using sequelize db:migrate
- For more sequelize-cli commands visit https://github.com/sequelize/cli and https://sequelize.org/master/manual/migrations.html

## Installation and Usage with Docker
To install and run the app with Docker, you must have Docker installed and running on your computer. Follow this [link to guide you in installing and setting up Docker on Windows 10, MacOS or Linux](https://docs.docker.com/install/). Then clone this repo and run this command to build the Docker image.
```
docker build -t <docker-image-name> .
```
Where `<docker-image-name>` is the name you choose to give to the Docker image. For example,
```
docker build -t iceman-backend .
```
After the build process has been completed, run this command to run the app from the Docker image.
```
docker run <docker-image-name>
```
For example,
```
docker run iceman-backend
```
