// Модуль с функциями шифровки и дешифровки данных

const crypto = require('crypto');

module.exports = {};

const algorithm = 'aes-192-cbc';
const password = 'qWeRtYa';



module.exports.encrypted = function(value) {
    const iv = Buffer.alloc(16, 0);
    const key = crypto.scryptSync(password, 'salt', 24);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let result = cipher.update(value, 'utf8', 'hex');
    result += cipher.final('hex');
    return result
};

module.exports.decrypted = function(value) {
    const iv = Buffer.alloc(16, 0);
    const key = crypto.scryptSync(password, 'salt', 24);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let result = decipher.update(value, 'hex', 'utf8');
    result += decipher.final('utf8');
    return result
};