var wordnet = require('wordnet');
var nlp_toolkit = require('nlp-toolkit');
var Promise = require('bluebird');


get_synset_type = (word) => {
    
    return new Promise((resolve, reject) => {
        let results = [];
        wordnet.lookup(word, (err,definitions) => {
            definitions.forEach(def => {
                results.push(def.meta.synsetType);
            });
            resolve(results);
        });
    });

}


main = () => {

   return get_synset_type('evil')
            .then((res) => {
                console.log(res)
            })
}
