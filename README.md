# Nested Comments

**Note: This repository will not work locally without the necessary configuration. You need a `.env` file in the server folder containing database credentials, and another `.env` file in the client folder, which will contain the API endpoint (SLIM PHP API, in this case).**

#

React setup

```bash
cd client
npm install
npm start
```

#

Server setup

```bash
cd server
composer update
composer install
```
Next, run an Apache server on the "server/public" folder. Don't forget to modify the dbConfig file to connect to your own MySQL server.

#
#

Create this `.env` for client folder
```
REACT_APP_API="ADD PHP API HERE"
```

Create this `.env` for server folder
```
SECRET_KEY=
HOST=
DATABASE=
USER=
PASS=
```
