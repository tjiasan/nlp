module.exports = () => {

    const wordnet = require('wordnet');
    const nlp_toolkit = require('nlp-toolkit');
    const Promise = require('bluebird');
  //const wd = require("word-definition");
  
    const NLP_Classifier = { 
        GetSynsetType: (word) => {
            return new Promise((resolve, reject) => {
                let results = [];
                wordnet.lookup(word, (err,definitions) => {
                    definitions.forEach(def => {
                        results.push(def.meta.synsetType);
                    });
                    resolve(results);
                });
            });
        },

        /**
         * Create a 1D to classify words
         *
         * @param   {Array}       word_list         - word pair that are opposites, must be the same lexical type
         * @param   {Array}       sentences         - An array of senteces to train the model, must contain word pairs
         * @return  {obj}                           - A promise of an Office object
         */
        CreateModel: (word_list, sentences) =>{
             
        }


    }

    return NLP_Classifier;

}