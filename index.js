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
                });
            });

            Object.keys(types_enum).forEach(type => {
                if (types_enum[type] == word_types.length){
                    return type;
                }
            })
            ;
            return false;

        },

        CreateNetwork: (sentences, commonality) => {
            let linker;
            let Network = { };
            if (commonality == 'noun' ){
                linker = 'adjective';
            } else if (commonality == 'adjective') {
               linker = 'noun';
           } else {
                throw new Error ('No linkable commonalities');
           }
           
           return Promise.resolve()
                // create network
                .then(() => {

                    return Promise.map(sentences, (sentence) => {

                        let tokenized_sentence = nlp_toolkit.tokenizer(sentence);  
                        let links = [];
                        let stems = [];

                        return Promise.map(tokenized_sentence, (word) => {
                            return NLP_Classifier.GetSynsetType(word)
                            .then((types) => {
                                types.forEach(type => {
                                    if (type == linker){
                                        links.push(word)
                                    } else if (type == commonality){
                                        stems.push(word);
                                    }
                                });
                            })
                        })
                        .then(()=> {
                            links.forEach(link => { 
                                if (!Network[link]){
                                    Network[link] = {}
                                }
                                
                                stems.forEach(stem => { 
                                    if (!Network[link][stem]){
                                        Network[link][stem] = 1;
                                    }
                                    else {
                                        Network[link][stem] ++;
                                    }
                                })

                            })
                        })
                    })
                  
                }).then(() => {
                    return Network;
                })

        },

        BuildModel: (Network) => {
            //create reverse keys;
            let Reverse = { };

            Object.keys(Network).forEach(key => {
                
            })




        },

        /**
         * Create a 1-D Model to Strattify Words
         *
         * @param   {Array}       word_list         - word pair that are opposites, must be the same lexical type
         * @param   {Array}       sentences         - An array of senteces to train the model, must contain word pairs
         * @return  {obj}                           - A promise of an Office object
         */
        CreateModel: (word_list, sentences) =>{

            let type_promises = [];

            word_list.forEach((word) => {
                word = nlp_toolkit.stemmer(word)
                type_promises.push(NLP_Classifier.GetSynsetType(word));
            })

            return Promise.all(type_promises)
                    .then((types) => {
                        return NLP_Classifier.CheckCommonTypes(types);
                    })
                    .then((commonality) => {
                        if(!commonality){
                            throw new Error ('No common word types');
                        } 
                        return NLP_Classifier.CreateNetwork(sentences, commonality);
                    })
                    .then(Network => {
                        return NLP_Classifier.BuildModel(Network);
                    })                
    
        }


    }

    return NLP_Classifier;

}