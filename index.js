module.exports = {  

    NLPClassifier : { 
    
        /**
         * Create a 1-D Model to Strattify Words
         *
         * @param   {Array}       word_list         - word pair that are opposites, must be the same lexical type
         * @param   {Array}       sentences         - An array of senteces to train the model, must contain word pairs
         * @return  {obj}                           - A promise of an Office object
         */
        CreateModel : (word_list, sentences, options) =>{
            const Promise = require('bluebird');
            const Helpers = require('./utils/helpers')();
            let type_promises = [];
            
            if (!options) {
                options = {
                    iterations: 50,
                    iteration_limit: 3 
                }
            }

            word_list.forEach((word) => {
                word = nlp_toolkit.stemmer(word);
                type_promises.push(Helpers.GetSynsetType(word));
            });

            return Promise.all(type_promises)
                    .then((types) => {
                        return Helpers.CheckCommonTypes(types);
                    })
                    .then((commonality) => {
                        if (!commonality){
                            throw new Error ('No common word types');
                        } 
                        return Helpers.CreateNetwork(sentences, commonality);
                    })
                    .then(Network => {
                        return Helpers.BuildModel(Network, word_list, options);
                    });                
    
        }
    }

};