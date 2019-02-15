$(document).ready(function () {
    const alert = "<div class='alert alert-danger' role='alert'>";
    $("#createSecret").click(function () {
        // Получаем данные с полей и проверяем их на корректность
        let allright = true;
        $(".alert").remove();
        let data = {
            secret: $("#secret").val(),
            password: $("#password").val(),
            confirmPassword: $("#confirmPassword").val()
        };
        if (!data.secret) {
            $("#errors").append(alert + "Поле с информацией не может быть пустым" + "</div>");
            allright = false;
        }
        if (!data.password) {
            $("#errors").append(alert + "Придумайте пароль" + "</div>");
            allright = false;
        }
        if (data.password !== data.confirmPassword) {
            $("#errors").append(alert + "Введенные пароли не совпадают" + "</div>");
            allright = false;
        }

        // Если все поля были заполнены верно, то отправляем POST-запрос на сервер
        if (allright) {
            $.ajax({
                url: '/new/secret',
                type: 'POST',
                method: 'POST',
                data: {
                    secret: data.secret,
                    password: data.password
                },
                // Если запрос выполнен успешно, то блокируем поля ввода и кнопки и выдаем ссылку на информацию
                success: function (result) {
                    $("#secret").attr('disabled', 'disabled');
                    $("#password").attr('disabled', 'disabled');
                    $("#confirmPassword").attr('disabled', 'disabled');
                    $("#createSecret").attr('disabled', 'disabled');
                    let link = 'localhost:3000/' + result.id;
                    $("#complete").append("Данные успешно добавлены. Ваша ссылка: " + link);
                }
            })
        }
    });
});