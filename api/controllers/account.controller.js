// 'use strict';

// const account = require('../models/account.model');
// const sendStatus = require('../services/sendStatus')

// module.exports = {
//     addAccount(req, res) {
//         try {
//             account.findOrCreate({
//                 where: {
//                     login: req.query.login
//                 },
//                 defaults: {
//                     name: req.query.name,
//                     login: req.query.login,
//                     phone: req.query.phone
//                 }
//             })
            
//             res.json(sendStatus.responseOk());
//         } catch (e) {
//             res.json(sendStatus.responseErr('error occured at inserting account into DB. ' + e));
//         }
//     }
// }