/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
const xhr = new XMLHttpRequest();
const formData = new FormData();
let url = options.url;    

if (options.data) {
        if(options.method === 'GET') {
            url += '?' + Object.entries(options.data).map(
                ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        } else {
            Object.entries(options.data).forEach(value => formData.append(...value));
        };
    };

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let err = null;
            let response = null;

            if(xhr.status === 200) {
                if (xhr.response && xhr.response.success) {
                    response = xhr.response;
                } else {
                    err = xhr.response;
                }
            } else {
                err = new Error('Ошибка в ответе сервера.'); 
            }
            options.callback(err, response);
        }
    }
    xhr.responseType = 'json';
    xhr.open (options.method, url);
    xhr.send(formData);

};

