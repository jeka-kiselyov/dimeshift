var hippie = require('hippie');
var expect = require('chai').expect;

describe('Server', function() {
  describe('/api/users endpoint', function() {

    it('GET returns a user based on the id', function(done) {
      hippie()
        .json()
        .base('http://localhost:8080')
        .get('/api/users')
        .expectStatus(500) /// auth code is empty == invalid
        .end(function(err, res, body) {
          // expect(body).to.equal(false);
          done();
        });
    });


    it('POST registers user', function(done) {

      var email = 'email' + Math.random() + '@example.com';
      var login = 'login' + Math.random();
      var password = 'password' + Math.random();

      var auth_code = false;

      hippie()
        .json()
        .base('http://localhost:8080')
        .post('/api/users')
        .send({
          login: login,
          email: email,
          password: password
        })
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) throw err;
          var cookieHeader = res.headers['set-cookie'];
          res.cookies = {};
          cookieHeader && cookieHeader.forEach(function(cookie) {
            var parts = cookie.split('=');
            res.cookies[parts.shift().trim()] = decodeURI(parts.join('=').split('; ')[0]);
          });

          expect(body).to.be.an('object');
          expect(body.id).to.be.a('number');
          expect(body.email).to.be.a('string');
          expect(body.email).to.equal(email);
          expect(body.login).to.be.a('string');
          expect(body.login).to.equal(login);

          expect(body.auth_code).to.be.a('string');
          expect(res.cookies.is_logged_in_user).to.equal('1');
          expect(res.cookies.logged_in_user).to.equal(body.auth_code);

          auth_code = res.cookies.logged_in_user;
          var created_id = body.id;

          //// and try to get some data with auth code 
          hippie()
            .json()
            .base('http://localhost:8080')
            .get('/api/users')
            .header('Cookie', 'is_logged_in_user=1; logged_in_user=' + auth_code)
            .expectStatus(200)
            .end(function(err, res, body) {

              expect(body).to.be.an('object');
              expect(body.id).to.be.a('number');
              expect(body.login).to.equal(login);
              expect(body.email).to.equal(email);
              expect(body.id).to.equal(created_id);

              //// and try to sign in with login and password
              hippie()
                .json()
                .base('http://localhost:8080')
                .post('/api/users/signin')
                .send({
                  username: login,
                  password: password
                })
                .expectStatus(200)
                .end(function(err, res, body) {
                  var cookieHeader = res.headers['set-cookie'];
                  res.cookies = {};
                  cookieHeader && cookieHeader.forEach(function(cookie) {
                    var parts = cookie.split('=');
                    res.cookies[parts.shift().trim()] = decodeURI(parts.join('=').split('; ')[0]);
                  });

                  expect(body).to.be.an('object');
                  expect(body.id).to.be.a('number');
                  expect(body.login).to.equal(login);
                  expect(body.email).to.equal(email);
                  expect(body.id).to.equal(created_id);

                  expect(res.cookies.is_logged_in_user).to.equal('1');
                  expect(res.cookies.logged_in_user).to.equal(body.auth_code);

                  done();
                });
            });

        });

    });


  });
});