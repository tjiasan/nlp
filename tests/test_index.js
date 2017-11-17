'use strict';

// ----------------
//   Dependencies
// ----------------

let should = require('should');
let sentences = require('./fixtures/sentences');
let NLPClassifier = require ('../index');


describe('CreateModel should return a model', function() {
    
    before(function(done){
        done();
    });

    it ('>.CreateModel it should create a model', (done) => {
       NLPClassifier.CreateModel(['happy', 'bad'], sentences)
        .then((model) => {
            model.should.be.an.object;
            done();
        });
        
    });    
  
    after(function(done){
        done();
    });

});