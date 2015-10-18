# DimeShift - easiest way to manage your finances. Online
* node.js
* npm
* Front-end: jQuery, Bootstrap, Backbone.js with JSmart template engine.
* Back-end: Sequelize, SQLite database by default, easy to switch to MySQL or Postgree for production.

Installation:
----
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Note that default storage in DimeShift is SQLite, which is [a bad fit for running on Heroku](https://devcenter.heroku.com/articles/sqlite3). But this is the easiest and fastest way for you to check it out in action. Switch to MySQL or Postgree for production.

```bash
mkdir dimeshift
cd dimeshift
git clone https://github.com/jeka-kiselyov/dimeshift.git .
npm install
bower install
```
* [Install npm](https://docs.npmjs.com/getting-started/installing-node) if you don't have it.
* [Install bower](http://bower.io/#install-bower) if you don't have it.

Run:
----

```bash
npm start
```
Open [localhost:8080](http://localhost:8080) in your browser.

Screenshots:
----
![Dimeshift transactions](https://raw.githubusercontent.com/jeka-kiselyov/dimeshift/master/public/images/homepage/screenshots/transactions.jpg)

![Dimeshift wallets](https://raw.githubusercontent.com/jeka-kiselyov/dimeshift/master/public/images/homepage/screenshots/wallets.jpg)

![Dimeshift i18n](https://raw.githubusercontent.com/jeka-kiselyov/dimeshift/master/public/images/homepage/screenshots/i18n.jpg)

License
----
GNU Affero GPL

**Free Software, Hell Yeah!**

From Slavyansk, Ukraine. With Love