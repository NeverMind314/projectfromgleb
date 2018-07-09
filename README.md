# Telegram crawler

Progrem that obtain full telegram channels/groups/supergroups users and message history. Also it may refresh 
alredy recieved data.

## Installing

1) Clone repository.

2) Install dependecies.

```
npm install
```

3) Create PostgreSQL databse with max connections not less than 100

4) Type your DB crendetails in /config/dbCrendetails.json

5) Run following command to create necessary tables

```
npm run create-tables
```

6) To see swagger documentation of project: global swagger installation

```
npm install -g swagger
```

## Running swagger routes documentation

Run following commands in separate command promts from root

```
swagger project start

swagger project edit
```

## Start crawling

1)Call process that will add account which will crawl

```
npm run add-account
```

2)Raise API

```
npm run api
```

3)Start crawler core

```
npm run crawler
```