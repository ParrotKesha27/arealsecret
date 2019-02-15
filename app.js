const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const sqlite = require('sqlite3');
const cipher = require(__dirname + '/public/cipher.js');

const app = express();
const urlencodedParser = bodyParser.urlencoded( {extended: false} );
const db = new sqlite.Database(__dirname + '/db/secrets.db');

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/new/secret', function (req, res) {
    res.sendFile(__dirname + '/public/create.html');
});

app.post('/new/secret', urlencodedParser, function (req, res) {
    // Получаем данные с полей
    let secret = {
        id: crypto.randomBytes(3).toString('hex'),
        data: cipher.encrypted(req.body.secret),
        password: cipher.encrypted(req.body.password)
    };
    // Записываем данные в базу данных
    db.run(
        'INSERT INTO secrets VALUES ($id, $data, $password)',
        {
            $id: secret.id,
            $data: secret.data,
            $password: secret.password
        },
        // Callback-функция
        (err) => {
            if (err)
                console.log(err);
            res.send({id: secret.id})
        }
    );
});

app.get('/:id', function (req, res) {
    // Ищем данные с заданым id
    db.all("SELECT id FROM secrets WHERE id=$id",
        {
            $id: req.params.id
        },
        (err, rows) => {
            // Если данные нашлись, то спрашиваем пароль
            if (rows[0] !== undefined) {
                res.sendFile(__dirname + '/public/validation.html')
            }
            // Иначе говорим что таких данных нет
            else {
                res.sendFile(__dirname + '/public/404.html');
            }
        }
    );

});

app.post('/:id', urlencodedParser, function (req, res) {
    // Получаем пароль по заданному id
    db.all("SELECT password FROM secrets WHERE id=$id",
        {
            $id: req.params.id
        },
        (err, rows) => {
            // Если пароль введен верно, то загружаем из бд нужную информацию
            if (cipher.encrypted(req.body.password) === rows[0].password) {
                db.all("SELECT data FROM secrets WHERE id=$id",
                    {
                        $id: req.params.id
                    },
                    (err, rows) => {
                        let locals = {
                            id: req.params.id,
                            data: cipher.decrypted(rows[0].data)
                        };
                        res.render('data', locals)
                    });
            }
            else {
                res.send("Вы ввели неверный пароль");
            }
        });
});

app.get('/:id/delete', function (req, res) {
    // Удаляем данные из базы данных
    db.run("DELETE FROM secrets WHERE id=$id",
        {
            $id: req.params.id
        },
        (err) => {
            if(err)
                console.log(err);
        });
    // И переходим на главную страницу
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});