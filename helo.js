const fs = require("fs");
const path = require("path");
const client = require('./es_config');

async function updateFoodField() {
    try {
        // const  body  = await client.updateByQuery({
        //     index: "student",
        //     body: {
        //         query: {
        //             exists: { field: "food" }
        //         },
        //         script: {
        //             source: 'ctx._source.food = params.newfood',
        //             params: {
        //                 newfood: "zeher"
        //             }
        //         }
        //     }
        // });
        const  body  = await client.deleteByQuery({
            index: "student",
            body: {
                query: {
                    exists: { field: "food" }
                }
            }
        });

        console.log('Documents updated:', body);
        return body;
    } catch (error) {
        console.error('Error updating documents:', error.message);
        throw error;
    }
}

updateFoodField();
