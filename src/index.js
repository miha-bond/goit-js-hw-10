import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
//
// ========================================================
refs.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
// ========================================================
function searchCountry(event) {
  event.preventDefault();
  const searchQuery = event.target.value.trim();

  if (searchQuery) {
    fetchCountries(searchQuery)
      .then(response => procesResponse(response))
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  } else {
    cleanMarkup();
  }
}

// --------------------------------------------------------
function procesResponse(response) {
  response.length < 2 && createCartInfo(response);
  response.length < 11 && response.length > 1 && createList(response);
  response.length > 10 &&
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function createList(response) {
  cleanMarkup();
  let markup = response.map(({ name, flags: { svg } }) => {
    return `
      <li class="country-list__item">
        <img class="country-list__flag" src="${svg}" alt="Flag of mp${name}"/>
        <p class="country-list__name">${name}</p>
      </li>`;
  });
  refs.countryList.insertAdjacentHTML('beforeend', markup.join(''));
}

function createCartInfo(response) {
  cleanMarkup();
  let markup = response.map(
    ({ name, capital, population, flags: { svg }, languages }) => {
      return `
        <ul class="country-info__list">
          <li class="country-info__item">
            <img class="country-info__flag" src='${svg}' alt='flag' />
            <span class="country-info__name">${name}</span>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Capital:</h2><p class="country-info__text">${capital}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Population:</h2><p class="country-info__text">${population}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Languages:</h2><p class="country-info__text">${languages.map(
              language => {
                return language.name;
              }
            )}</p>
          </li>
        </ul>`;
    }
  );
  refs.countryInfo.innerHTML = markup;
}

function cleanMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
// --------------------------------------------------------
// ========================================================
//todo Завдання - пошук країн
//? Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. Подивися демо-відео роботи програми.

//! HTTP-запит
//? Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.

// ?Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.

//! Фільтрація полів
//? У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів. Ознайомся з документацією синтаксису фільтрів.

//! Тобі потрібні тільки наступні властивості:

//* name.official - повна назва країни
//* capital - столиця
//* population - населення
//* flags.svg - посилання на зображення прапора
//* languages - масив мов
//! Поле пошуку
//? Назву країни для пошуку користувач вводить у текстове поле input#search-box. HTTP-запити виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.

//? Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст. Використовуй пакет lodash.debounce.

//? Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.

//? Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

//! Інтерфейс
//? Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою. Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".

//* Too many matches alert

//? Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.

//* Country list UI

//? Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.

//* Country info UI

//! УВАГА
//? Достатньо, щоб застосунок працював для більшості країн. Деякі країни, як-от Sudan, можуть створювати проблеми, оскільки назва країни є частиною назви іншої країни - South Sudan. Не потрібно турбуватися про ці винятки.

//! Обробка помилки
//? Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено. Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів. Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.

// Error alert

//! УВАГА
//? Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.
