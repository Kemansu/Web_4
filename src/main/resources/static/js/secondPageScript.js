// Переменные для пагинации
let currentPage = 1;
let totalPages;
let allResults = [];
document.addEventListener("DOMContentLoaded", function () {
    updateResultsList();

    const radiusSelect = document.getElementById("radius");


    document.getElementById('prev_page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateResultsList();
            renderTable();
            updatePaginationControls();
        }
    });

    document.getElementById('next_page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateResultsList();
            renderTable();
            updatePaginationControls();
        }
    });
    const canvas = document.getElementById('plot');
    const ctx = canvas.getContext('2d');

    // Координаты центра (0, 0) будут в центре холста
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let R_canvas = 40; // Радиус области, масштабируется под размер холста

    // Функция для отрисовки осей
    function drawAxes() {
        // Ось X
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();

        // Ось Y
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
    }

    // Функция для отрисовки области
    function drawArea(r) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
        drawAxes(); // Рисуем оси

        // Прямоугольник
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fillRect(centerX, centerY, -r, -r/2);

        // Четверть круга
        ctx.beginPath();
        ctx.arc(centerX, centerY, r / 2, 0, Math.PI / 2);
        ctx.lineTo(centerX, centerY); // Соединяем дугу с центром круга
        ctx.closePath();
        ctx.fill();

        // Треугольник
        ctx.beginPath();
        ctx.moveTo(centerX - r, centerY);
        ctx.lineTo(centerX, centerY + r);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fill();
    }

    // вызов функции отрисовки области
    drawArea(R_canvas);


    function drawPoint(x, y, status) {
        const canvas = document.getElementById('plot');
        const ctx = canvas.getContext('2d');

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Преобразуем координаты в пиксели
        const scaleFactor = 40; // Например, 20 пикселей на единицу координатной плоскости
        const canvasX = centerX + x * scaleFactor;
        const canvasY = centerY - y * scaleFactor; // Y инвертирован для корректной работы


        // Рисуем точку
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI); // Радиус точки — 5 пикселей
        if (status === false) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fill();
    }


    // Функция для отображения таблицы на текущей странице с новыми результатами первыми
    function renderTable() {

        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML = "";

        allResults.forEach(result => {
            const row = document.createElement("tr");
            row.innerHTML = `
                            <td>${result.x}</td>
                            <td>${result.y}</td>
                            <td>${result.r}</td>
                            <td>${result.result ? "Да" : "Нет"}</td>
                        `;
            tableBody.appendChild(row);
        });

        // Обновляем информацию о текущей странице
        document.getElementById('page_info').innerText = `Страница ${currentPage}`;
    }

    // Обновление состояния кнопок пагинации
    function updatePaginationControls() {
        document.getElementById('prev_page').disabled = currentPage === 1;
        document.getElementById('next_page').disabled = currentPage === totalPages;
    }

    function updateResultsList() {
        fetch("/api/results?page=" + currentPage)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка загрузки данных");
                }
                return response.json();
            })
            .then(data => {
                allResults = data.content;
                totalPages = data.page.totalPages || 1;

                // Вызываем renderTable только после обновления данных
                renderTable();
                updatePaginationControls();

                // вызов функции отрисовки области
                drawArea(radiusSelect.value * 40);

                // отрисовка точек
                allResults.forEach((item) => {
                    drawPoint(item.x, item.y, item.result);
                })

                const tableBody = document.querySelector("table tbody");
                tableBody.innerHTML = ""; // Очищаем таблицу
                allResults.forEach(result => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                            <td>${result.x}</td>
                            <td>${result.y}</td>
                            <td>${result.r}</td>
                            <td>${result.result ? "Да" : "Нет"}</td>
                        `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Ошибка:", error);
                const tableBody = document.querySelector("table tbody");
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Не удалось загрузить данные</td></tr>`;
            });

    }

    // Обработчик клика на canvas
    canvas.addEventListener('click', function(event) {
        // Получаем координаты клика относительно canvas
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Преобразуем координаты в систему координат, где центр холста — это (0, 0)
        const plotX = (x - canvas.width / 2) / 40;  // 40 — масштаб
        const plotY = -(y - canvas.height / 2) / 40; // Y инвертирован
        const r = radiusSelect.value;



        // Формируем объект данных
        const data = { x: plotX, y: plotY.toString(), r: r};


        // Отправляем запрос на сервер через fetch
        fetch("/api/check-point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Преобразуем данные в JSON
        })
            .then(response => response.json())
            .then(result => {updateResultsList()})
            .catch(error => {
                // Обрабатываем ошибки
                console.error("Ошибка:", error);
                showError("Произошла ошибка при проверке точки.", 5000);
            });

    });



    document.getElementById("coordinatesForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Отключаем стандартное отправление формы

        // Получаем значения полей формы
        const x = document.getElementById("x-coordinate").value;
        const y = document.getElementById("y-coordinate").value;
        const r = document.getElementById("radius").value;

        // Проверяем корректность ввода Y (дополнительная проверка)
        if (y < -3 || y > 5 || isNaN(y)) {
            showError("Введите корректное значение Y (от -3 до 5).", 5000);
            return;
        }

        // Формируем объект данных
        const data = { x: x, y: y.toString(), r: r};


        // Отправляем запрос на сервер через fetch
        fetch("/api/check-point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Преобразуем данные в JSON
        })
            .then(response => response.json())
            .then(result => {updateResultsList()})
            .catch(error => {
                // Обрабатываем ошибки
                console.error("Ошибка:", error);
                showError("Произошла ошибка при проверке точки.", 5000);
            });
    });


    radiusSelect.addEventListener("change", function () {
            const selectedRadius = radiusSelect.value;
            // вызов функции отрисовки области
            drawArea(selectedRadius * 40);

            allResults.forEach((item) => {
                drawPoint(item.x, item.y, item.result);
            })
    });

    // Вспомогательные функции
    function showError(msg, delay) {
        document.getElementById("errorMessage").innerText = msg;

        setTimeout(function () {
            document.getElementById("errorMessage").innerText = "";
        }, delay);
    }

});