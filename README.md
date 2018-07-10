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

## Start crawling

1)Call process that will add account which will crawl

```
npm run add-account
```


2)Raise API

```
npm run api
```

Optional: running swagger routes documentation

```
npm run doc
```

Then you may see documentation by adress "your_server":45000

3)Start crawler core

```
npm run crawler
```