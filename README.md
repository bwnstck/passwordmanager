# --== Password Safe 2000 ==--

![pwSafe Intro](./assets/passwordSafe2000.gif)

## Features

- using `node.js` + `inquierer` for running and displaying input/outpu
- storing everyting encrypted (`CryptoJS`) in `MongoDB`
- you are able to use `Docker` for running your local instance of `mongoDB` with persistent data

## Usage

### 🗃 .env (required)

- put a `.env`-File in the aplication root with following content:

```
DB_URL=mongodb://localhost:27017/PwData
CRYPTO_PWD=yourCryptoPW
MASTER_PWD=yourLoginPassword
```

where

- `DB_URL` points to your local or cloud-based mongoDB
- `CRYPTO_PW` is used to encrypt Data
- `MASTER_PW` ist used to login to the app

### 🐳 with local mongoDB Docker-Container

- with docker installed just run and make use of the `DB_URL` above:

```Shell
    $ docker pull mongo

    $ docker run --name pwdatabase -d -p 27017:27017 mongo --noauth --bind_ip=0.0.0.0`
```
