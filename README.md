#Telegram crawler

Progrem that obtain full telegram channels/groups/supergroups users and message history. Also it may refresh 
alredy recieved data.

##Installing

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

##Running swagger routes documentation

Run following commands in separate command promts from root

```
node swagger project start

node swagger project edit
```

##Start crawling

1)Set account which will crawl

```
?????????????????????????
```

2)Raise API

```
npm run api
```

3)Start crawler core

```
npm run crawler
```