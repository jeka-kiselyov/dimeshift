var hippie = require('hippie');
var expect = require('chai').expect;

describe('Server', function () {
  describe('/api/users endpoint for wallets', function () {

    it('register demo account and allow to get wallets list', function (done) {

      var email = 'demo@demo.com';
      var login = 'login'+Math.random();
      var password = 'password'+Math.random();

      var auth_code = false;

      hippie()
        .json()
        .base('http://localhost:8080')
        .timeout(5000)
        .post('/api/users')
        .send({ login: login, email: email, password: password })
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) throw err;
          var cookieHeader = res.headers['set-cookie'];
          res.cookies = {};
          cookieHeader && cookieHeader.forEach(function( cookie ) {
            var parts = cookie.split('=');
            res.cookies[parts.shift().trim()] = decodeURI(parts.join('=').split('; ')[0]);
          });

          auth_code = res.cookies.logged_in_user;
          var created_id = body.id;

          //// and try to get some wallets
          hippie()
            .json()
            .base('http://localhost:8080')
            .get('/api/users/'+created_id+'/wallets')
            .header('Cookie', 'is_logged_in_user=1; logged_in_user='+auth_code)
            .expectStatus(200)
            .end(function(err, res, body) {
              expect(body).to.be.an('array'); /// array of wallets
              expect(body.length).to.be.equal(2);

              hippie()
                .json()
                .base('http://localhost:8080')
                .post('/api/wallets/')
                .send({ name: 'Test name', currency: 'USD' })
                .header('Cookie', 'is_logged_in_user=1; logged_in_user='+auth_code)
                .expectStatus(200)
                .end(function(err, res, body) {
                  expect(body).to.be.an('object'); /// new wallet

                  //// and try to get updated list of wallets. Use different api method
                  hippie()
                    .json()
                    .base('http://localhost:8080')
                    .get('/api/wallets/')
                    .header('Cookie', 'is_logged_in_user=1; logged_in_user='+auth_code)
                    .expectStatus(200)
                    .end(function(err, res, body) {
                      expect(body).to.be.an('array'); /// array of wallets
                      expect(body.length).to.be.equal(3);
                      done(); 
                    });
                });

            });

        });

    });


  });
});