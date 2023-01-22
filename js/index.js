// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const minWeight = document.querySelector('.minweight__input'); // поле с минимальным весом
const maxWeight = document.querySelector('.maxweight__input'); // поле с максимальным весом
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let classes = {
    "фиолетовый": "fruit_violet",
    "зеленый": "fruit_green",
    "розово-красный": "fruit_carmazin",
    "желтый": "fruit_yellow",
    "светло-коричневый": "fruit_lightbrown"

};

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
// let colorFruits = JSON.parse(classes);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
    // TODO: очищаем fruitsList от вложенных элементов,
    // чтобы заполнить актуальными данными из fruits
    while (fruitsList.firstChild) {
        fruitsList.removeChild(fruitsList.firstChild);
    }

    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    for (let i = 0; i < fruits.length; i++) {
        const li = document.createElement('li');
        const div = document.createElement('div');
        li.classList.add('fruit__item', classes[fruits[i].color]);
        div.classList.add('fruit__info');
        fruitsList.appendChild(li);
        li.appendChild(div);
        fruits[i] = { index: i + 1, ...fruits[i] };
        Object.entries(fruits[i]).forEach(([k, v]) => {
            const divArr = document.createElement('div');
            divArr.innerText = k == 'weight' ? `${k} (кг): ${v}` : `${k}: ${v}`;
            div.appendChild(divArr);
        });
    }
};

//отрисовка выпадающего меню выбора цвета добавляемого фрукта
Object.entries(classes).forEach(([k, v]) => {
    let option = document.createElement('option');
    option.classList.add(v);
    option.value = k;
    option.innerText = k;
    colorInput.appendChild(option);
});
colorInput.childNodes[1].selected;

// первая отрисовка карточек
display();
let copyFruits = fruits.slice();
/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//функция перемешивания массива
const shuffleFruits = () => {
    let resultFruits = [];

    while (fruits.length > 0) {
        let randomNumber = getRandomInt(0, fruits.length - 1);
        resultFruits.push(fruits.splice(randomNumber, 1)[0]);
    }

    //Проверяем массивы идентичность
    if (compareArrays(copyFruits, resultFruits)) {
        alert('Неудачное перемешивание');
    }
    fruits = resultFruits.slice();
};

//функция сравнения массивов
const compareArrays = (a, b) =>
    a.every((element, index) => element === b[index]);

//перемешивание массива по клику на кнопку
shuffleButton.addEventListener('click', () => {
    shuffleFruits();
    display();
    // copyFruits = fruits.slice();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    let arr = [];
    fruits.filter((item) => {
       
        if (isNaN(minWeight.value) || minWeight.value == '' ) {
            minWeight.classList.add('not_value');
            minWeight.value = 'Введите число';
        }
        if (isNaN(maxWeight.value) || maxWeight.value == '') {
            maxWeight.classList.add('not_value');
            maxWeight.value = 'Введите число';
        }
        if (
            (!isNaN(minWeight.value) || minWeight.value == '') &&
            (!isNaN(maxWeight.value) || maxWeight.value == '')
        ) {
            if (
                item.weight <= maxWeight.value &&
                item.weight >= minWeight.value
            ) {
                arr.push(item);
                fruits = arr.slice();
            }
        }
    });
};

minWeight.addEventListener('click', () => {
    if (minWeight.classList.contains('not_value')) {
        minWeight.classList.remove('not_value');
        minWeight.value = 0;
    }
});

maxWeight.addEventListener('click', () => {
    if (maxWeight.classList.contains('not_value')) {
        maxWeight.classList.remove('not_value');
        maxWeight.value = 100;
    }
});

filterButton.addEventListener('click', () => {
    filterFruits();
    display();
    fruits = copyFruits.slice();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
    let arr;
    [a, b].sort((a, b) => {
        arr = a.color < b.color; //.toLowerCase()
    });
    return arr;
};

const sortAPI = {
    bubbleSort(arr, comparation) {
        const n = arr.length;
        // внешняя итерация по элементам
        for (let i = 0; i < n - 1; i++) {
            // внутренняя итерация для перестановки элемента в конец массива
            for (let j = 0; j < n - 1 - i; j++) {
                // сравниваем элементы
                if (comparation(arr[j], arr[j + 1])) {
                    // делаем обмен элементов
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    },

    quickSort(arr, comparation, left = 0, right = arr.length - 1) {
        if (arr.length > 1) {
            left = typeof left != 'number' ? 0 : left;
            right = typeof right != 'number' ? arr.length - 1 : right;
            let pivot = arr[Math.floor((right + left) / 2)],
                i = left,
                j = right;
            while (i <= j) {
                while (comparation(pivot, arr[i])) {
                    i++;
                }
                while (comparation(arr[j], pivot)) {
                    j--;
                }
                if (i <= j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    i++;
                    j--;
                }
            }
            if (left < i - 1) {
                quickSort(arr, comparation, left, i - 1);
            }
            if (i < right) {
                quickSort(arr, comparation, i, right);
            }
        }
    },

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparation) {
        const start = new Date().getTime();
        sort(arr, comparation);
        const end = new Date().getTime();
        sortTime = `${end - start} ms`;
    },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

//переключатель значение sortKind между 'bubbleSort' / 'quickSort'
sortChangeButton.addEventListener('click', () => {
    sortKindLabel.textContent =
        sortKind == 'bubbleSort'
            ? (sortKind = 'quickSort')
            : (sortKind = 'bubbleSort');
});

sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor); //fruits [15,1,3,6,5,4,21,15,10]
    display();
    sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

colorInput.classList.add(colorInput[0].classList);
colorInput.addEventListener('change', (event) => {
    colorInput.classList.remove(colorInput.classList[1]);
    colorInput.classList.add(classes[event.target.value]);
});

addActionButton.addEventListener('click', () => {
    // TODO: создание и добавление нового фрукта в массив fruits
    // необходимые значения берем из kindInput, colorInput, weightInput
    if (kindInput.value == '' || kindInput.value == 'Введите название') {
        kindInput.classList.add('not_value');
        kindInput.value = 'Введите название';
    } else if (isNaN(weightInput.value)) {
        weightInput.classList.add('not_value');
        weightInput.value = 'Введите число';
    } else {
        let arr = {
            index: `${fruits.length + 1}`,
            kind: `${kindInput.value}`,
            color: `${colorInput.value}`,
            weight: `${weightInput.value}`,
        };
        console.log(colorInput.innerHTML);
        fruits = [...fruits, arr];
        copyFruits = fruits.slice();
        display();
    }
});

kindInput.addEventListener('click', () => {
    if (kindInput.classList.contains('not_value')) {
        kindInput.classList.remove('not_value');
    }
});

weightInput.addEventListener('click', () => {
    if (weightInput.classList.contains('not_value')) {
        weightInput.classList.remove('not_value');
        weightInput.value = 0;
    }
});

function quickSort(arr, comparation, left = 0, right = arr.length - 1) {
    if (arr.length > 1) {
        left = typeof left != 'number' ? 0 : left;
        right = typeof right != 'number' ? arr.length - 1 : right;
        let pivot = arr[Math.floor((right + left) / 2)],
            i = left,
            j = right;
        while (i <= j) {
            while (comparation(pivot, arr[i])) {
                i++;
            }
            while (comparation(arr[j], pivot)) {
                j--;
            }
            if (i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                j--;
            }
        }
        if (left < i - 1) {
            quickSort(arr, comparation, left, i - 1);
        }
        if (i < right) {
            quickSort(arr, comparation, i, right);
        }
    }
}