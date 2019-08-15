Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======

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