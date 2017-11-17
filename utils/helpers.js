module.exports = () => {

    const wordnet = require('wordnet');
    const nlp_toolkit = require('nlp-toolkit');
    const Promise = require('bluebird');


    const Helpers = {
        GetSynsetType : (word) => {
            return new Promise((resolve, reject) => {
                let results = {};
                wordnet.lookup(word, (err, definitions) => {
                    if (definitions){
                        definitions.forEach(def => {
                            if (def.meta.synsetType == 'adjective satellite'){
                                def.meta.synsetType = 'adjective';
                            }

                            results[def.meta.synsetType] = 1;
                        });                        
                    }
                    resolve(results);
                });
            });
        },
    
        CheckCommonTypes : (word_types) => {
            let types_enum = { };
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
       
            let types = Object.keys(types_enum);
            for (let i = 0; i < types.length; i ++){
                let type = types[i];               
                if (types_enum[type] == word_types.length){
                    return type;
                }
            }
            return false;    
        },
    
        CreateNetwork : (sentences, commonality) => {
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
                                        if (types){
                                            Object.keys(types).forEach(type => {
                                                if (type == linker){
                                                    links.push(word);
                                                } else if (type == commonality){
                                                    stems.push(word);
                                                }
                                            });
                                        }     
                                    });
                            })                           
                            .then(()=> {
                                links.forEach(link => {                            
                                    stems.forEach(stem => { 
                                        if (link != stem){
                                            if (!Network[link]){
                                                Network[link] = {};
                                            }  
                                            if (!Network[link][stem]){
                                                Network[link][stem] = 1;
                                            }
                                            else {
                                                Network[link][stem] ++;
                                            }
                                            }
                                    });
        
                                });
                        });
                    });
                  
                }).then(() => {
                    return Network;
                });
    
        },
    
        BuildModel : (Network, word_list, Options) => {
            let iterations = Options.iterations;
            let loop_limit = Options.iteration_limit;
            //create reverse keys;
            let Reverse = { };         
            let Model = { };
            let Limit  = { };
            let positive_iterators = [word_list[0]];
            let negative_iterators = [word_list[1]];
            Model[word_list[0]] = { score: 1 };
            Model[word_list[1]] = { score: 0 };
    
            Object.keys(Network).forEach(val => {
                Object.keys(Network[val]).forEach(word => {
                    if (!Reverse[word]){
                        Reverse[word] = {};
                    }
                    if (word_list.indexOf(word) == -1) {
                        Model[word] = { score: 0.5 };    
                    }                     
                    Reverse[word][val] = 1;
                });
            });      

    
            for (let i = 0; i < iterations; i++){
                let tmp_pos = { };
                let tmp_neg = { };
                let tmp_limit = { };
                //modify for functions
                let strength = 1 / (Math.log(i + 1) + 1 );
    
                positive_iterators.forEach(positive => { 
                    let process_list = Object.keys(Reverse[positive]);
                    
                    process_list.forEach(list => {
                        let stems = Object.keys(Network[list]);
                        tmp_limit[list] = 1;
                        let cont = true;
                        if (loop_limit && Limit[list] && Limit[list] > loop_limit) {
                            cont = false;
                        }

                        if (cont) {
                        stems.forEach(stem => {
                            tmp_pos[stem] = 1;
                            if (!Model[stem]['pos']) {
                                Model[stem]['pos'] = strength * Network[list][stem];
                            } 
                            else { 
                                Model[stem]['pos'] += strength * Network[list][stem];
                            }
                        });
                       }
                    });
                });
    
                //do the same for negative iterators
                negative_iterators.forEach(negative=> { 
                    let process_list = Object.keys(Reverse[negative]);
                    
                    process_list.forEach(list => {
                        let stems = Object.keys(Network[list]);
                        tmp_limit[list] = 1;
                        let cont = true;
                        if (loop_limit && Limit[list] && Limit[list] > loop_limit) {
                            cont = false;
                        }

                        if (cont) {
                            stems.forEach(stem => {
                                tmp_neg[stem] = 1;
                                if (!Model[stem]['neg']) {
                                    Model[stem]['neg'] = strength * Network[list][stem];
                                } 
                                else { 
                                    Model[stem]['neg'] += strength * Network[list][stem];
                                }
                            });

                        }
                    });
                });
                
                Object.keys(tmp_limit).forEach(list => {
                    if (Limit[list]){
                        Limit[list] ++;
                    } else {
                        Limit[list] = 1;
                    }
                 
                });
                
                positive_iterators = Object.keys(tmp_pos);
                negative_iterators = Object.keys(tmp_neg);
            }
            Object.keys(Model).forEach(word => {
                if (word_list.indexOf(word) == -1){
                    if (Model[word].pos && Model[word].neg){
                        Model[word].score = Model[word].pos / (Model[word].pos + Model[word].neg);
                        Model[word].score = Model[word].score.toFixed(5);
                    }
                    else if (Model[word].pos){
                        Model[word].score = 1;
                    }  
                    else if (Model[word].neg){
                        Model[word].score = 0;
                    }    

                }
                delete Model[word].pos;
                delete Model[word].neg;
            });

    
            return Model;
            
    
        }
    
    };
    
    return Helpers;


};