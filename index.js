const http = require("http");

const PORT = 3000;

const server = http.createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/') {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.writeHead(200);

        response.end(`<form action="/save" method="POST">
                <input name="username" placeholder="Ваше имя" />
                <button type="submit">Отправить</button>
            </form>`)
    } else if (request.method === "POST" && request.url === '/save') {
        const body = [];

        request.on('data', (chunk) => {
            body.push(chunk)
        });

        request.on('end', () => {
            const parsedBody = Buffer.concat(body).toString('utf-8');
            const decodedString = decodeURIComponent(parsedBody);

            console.log(`Полное тело запроса:${decodedString}`);

            response.setHeader('Content-Type', 'text/plain; charset=utf-8')
            response.statusCode = 200;
            response.end(`Данные получены! Вы прислали: ${decodedString}`)
        });
    } else if (request.method === "GET" &&
        (request.url === '/servers' || request.url === '/users')) {

        const data = await fetch('https://gusic.xyz/stats')
        const jsonData = await data.json();

        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
        response.statusCode = 200;

        console.log(jsonData)

        if (request.url === "/servers") {
            response.end(`Количество серверов на данный момент: ${jsonData.servers}`);
        } else if (request.url === "/users") {
            response.end(`Количество пользователей на данный момент: ${jsonData.users}`);
        }
    } else if (request.method === "GET" &&
        (request.url === '/weather' || request.url === '/wind')) {
        const weather = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true")
        const weatherData = await newFunction(weather);
        // console.log(weatherData)

        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
        response.statusCode = 200;

        if (request.url === "/wind") {
            response.end(`Текущая Погода В Берлине Сопровождается Температурой:${weatherData.current_weather.temperature}°C и Скоростью Ветра:${weatherData.current_weather.windspeed} м/c`);
        } else if (request.url === "/weather") {
            response.end(`Текущая Погода В Берлине Сопровождается Температурой:${weatherData.current_weather.temperature}°C и Скоростью Ветра:${weatherData.current_weather.windspeed} м/c`);
        }
    } else {
        response.statusCode = 404;
        response.end("Страница не найдена");
    }

    async function newFunction(weather) {
        return await weather.json();
    }
});

server.listen(PORT);
console.log(`Сервер был запущен по адресу: http://localhost:${PORT}`)