module.exports = () => {

    const wordnet = require('wordnet');
    const nlp_toolkit = require('nlp-toolkit');
    const Promise = require('bluebird');
  //const wd = require("word-definition");

    const NLP_Classifier = { 
        GetSynsetType: (word) => {
            return new Promise((resolve, reject) => {
                let results = {};
                wordnet.lookup(word, (err,definitions) => {
                    definitions.forEach(def => {
                        results[def.meta.synsetType] = 1;
                    });
                    resolve(results);
                });
            });
        },

        CheckCommonTypes : (word_types) => {
            let types_enum = { }
            word_types.forEach(types => {
                Object.keys(types).forEach(type => {
                    if (types_enum [type]){
                        types_enum [type] ++;
                    }
                    else {
                        types_enum [type] = 1;
                    }
                })
            })

            Object.keys(types_enum).forEach(type => {
                if (types_enum[type] == word_types.length){
                    return type;
                }
            })

            return false;

        },

        /**
         * Create a 1-D Model to Strattify Words
         *
         * @param   {Array}       word_list         - word pair that are opposites, must be the same lexical type
         * @param   {Array}       sentences         - An array of senteces to train the model, must contain word pairs
         * @return  {obj}                           - A promise of an Office object
         */
        CreateModel: (word_list, sentences) =>{
            let Words_Network = { };

            let type_promises = [];

            word_list.forEach((word) => {
                type_promises.push(NLP_Classifier.GetSynsetType(word));
            })

            return Promise.all(type_promises)
                    .then((types) => {
                        
                    })

        

        }


    }

    return NLP_Classifier;

}