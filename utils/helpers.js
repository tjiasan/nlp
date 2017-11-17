module.exports = () => {
    const wordnet = require('wordnet');
    const nlp_toolkit = require('nlp-toolkit');

    const Helpers = {
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
                            return Helpers.GetSynsetType(word)
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
    
        BuildModel: (Network, word_list, options) => {
            //create reverse keys;
            let Reverse = { };         
            let Model = { };
            let positive_iterators = [word_list[0]];
            let negative_iterators = [word_list[1]];
            Model.word_list[0] = { score: 1 };
            Model.word_list[1] = { score: 0 };
    
            Object.keys(Network).forEach(val => {
                Object.keys(Network[val]).forEach(word => {
                    if (!Reverse[word]){
                        Reverse[word] = {}
                    }
                    Model[word] = { score: 0.5 };                    
                    reverse[word][val] = 1;
                })
            })
    
            let iterations = Options.iterations;
    
            for (let i = 0; i < iterations; i++){
                let tmp_pos = { };
                let tmp_neg = { };
                let strength = 1/i;
    
                positive_iterators.forEach(positive => { 
                    let process_list = Object.keys(reverse[positive]);
                    
                    process_list.forEach(list => {
                        let stems = Object.keys(Network[list]);
                        
                        stems.forEach(stem => {
                            tmp_pos[stem] = 1;
                            if (!Model[stem][pos]) {
                                Model[stem][pos] = strength*Network[list][stem]
                            } 
                            else { 
                                Model[stem][pos] += strength*Network[list][stem]
                            }
                        })
                    })
                })
    
                //do the same for negative iterators
                negative_iterators.forEach(negative=> { 
                    let process_list = Object.keys(reverse[negative]);
                    
                    process_list.forEach(list => {
                        let stems = Object.keys(Network[list]);
                        
                        stems.forEach(stem => {
                            tmp_pos[neg] = 1;
                            if (!Model[stem][pos]) {
                                Model[stem][pos] = strength*Network[list][stem]
                            } 
                            else { 
                                Model[stem][pos] += strength*Network[list][stem]
                            }
                        })
                    })
                })
    
    
                positive_iterators = Object.keys(tmp_pos);
                negative_iterators = Object.keys(tmp_neg);
            }
    
            return Model;
            
    
        }
    
    }
    
    return Helpers;


}