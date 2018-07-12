# Telegram crawler

Progrem that obtain full telegram channels/groups/supergroups users and message history. Also it may refresh 
alredy recieved data.

## Installing

For the program to work properly server must have installed postgres server 
and nodeJS version not less than v.8.9.4

1) Clone repository.

2) Install dependecies.

```
npm install
```

3) Run following command to create necessary tables

```
npm run create-tables
```

4) You should have chrome browser version not less than 66.0.3359.0 installed.
You may see instruction for installation of this version of browser for CentOs 7 on:

```
https://www.tecmint.com/install-google-chrome-on-redhat-centos-fedora-linux/
```

## Configuration

Create PostgreSQL databse with max connections not less than 100

Type your DB crendetails in ./config/dbCrendetails.json

Example:

```
{
    "database": "postgres",
    "username": "postgres",
    "password": "root",
    "host": "localhost",
    "port": "5432"
}
```

You may set number of simultaneous instances of crawler in ./config/config.json field "queue"
Each instance may take average 350Mb of operating memory.

## Start crawling

1) Call process that will add account which will crawl

```
npm run add-account
```


2) Raise API

```
npm run api
```

Optional: running swagger routes documentation(only on linux system)

```
npm run doc
```

Then you may see documentation by adress "your_server_domain":45000

3) Start crawler core

```
npm run crawler
```