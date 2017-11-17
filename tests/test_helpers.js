'use strict';

// ----------------
//   Dependencies
// ----------------

let should = require('should');
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
