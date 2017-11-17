'use strict';

// ----------------
//   Dependencies
// ----------------

let should = require('should');
let sentences = require('./fixtures/sentences');
let Helpers = require ('../utils/helpers')();

let Fixtures = {
    CheckCommonTypes: {
        onetype : [ 
            { 'adjective': 1 },
            { 'adjective': 1 }
        ],
        twotypes : [
            { 'adjective': 1 , 'noun': 1 },
            { 'adjective': 1 }
        ],
        equaltypes : [
            { 'noun': 1, 'adjective': 1 },
            { 'noun': 1, 'adjective': 1  }
        ],
        none : [
            { 'noun': 1 },
            { 'adjective': 1 }
        ],
    },
    BuildModel: {
        Network: {
            "chocolate": { "happy" :2 ,  "amazing" : 3, "great" :1, "nice": 5 },
            "devil" : {"bad": 3, "evil": 5 , "nice": 1 }
        }
    }
}

describe('Synset Types', function() {

    before ((done) => {
        done();
    })

    it ('>. GetSynsetTypes should return all types as an object' , (done) => {
        Helpers.GetSynsetType('happy')
            .then((res) => {      
                (typeof res).should.be.an.Object;
                Object.keys(res)[0].should.equal('adjective');
                done();
            })
    })

    it ('>. GetSynsetTypes should return multiple types' , (done) => {
        Helpers.GetSynsetType('evil')
            .then((res) => {
                Object.keys(res).length.should.equal(2);
                done();
            })
    })

    after ((done) => {
        done();
    })
})


describe('CheckCommonTypes', function() {
    before ((done) => {
        done();
    })

    it ('>.CheckCommonTypes should return common keys properly' , (done) => {
       let common = Helpers.CheckCommonTypes(Fixtures.CheckCommonTypes.onetype);
       common.indexOf('adjective').should.equal(0);

       done()
    })
    
    it ('>.CheckCommonTypes should return common keys when more than one is present' , (done) => {
        let common = Helpers.CheckCommonTypes(Fixtures.CheckCommonTypes.twotypes);
        common.indexOf('adjective').should.equal(0);
 
        done()
     })
     
    it ('>.CheckCommonTypes should return common keys properly when both are equal number' , (done) => {
        let common = Helpers.CheckCommonTypes(Fixtures.CheckCommonTypes.equaltypes);
        common.indexOf('noun').should.equal(0);
 
        done()
     })
     
    it ('>.CheckCommonTypes should return common keys properly' , (done) => {
        let common = Helpers.CheckCommonTypes(Fixtures.CheckCommonTypes.none);
        common.should.be.false;
 
        done()
     })

    after ((done) => {
        done();
    })
})

describe('Create Network', function() {
    before ((done) => {
        done();
    })
    
    it ('>.CreateNetwork should create networks properly' , (done) => {
        Helpers.CreateNetwork(sentences, 'adjective')
            .then(network => {
                network.chocolate.happy.should.equal(2);
                network.chocolate.amazing.should.equal(1);
                Object.keys(network).forEach(key => {
                    Object.keys(network[key]).length.should.be.above(0)
                })
                done()
            })     
     })
    after ((done) => {
        done();
    })
})

describe('Build Model', function() {
    before ((done) => {
        done();
    })
    
    it ('>.Build Model should work' , (done) => {
        let Options = { iterations: 2};
        let Model = Helpers.BuildModel(Fixtures.BuildModel.Network, ['happy', 'bad'], Options)
        console.log(Model)
        done()
     })
    after ((done) => {
        done();
    })
})


