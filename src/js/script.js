/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filtersForm: '.filters',
    }
  };

  const templates = {
     bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor() {
      this.favoriteBooks = [];
      this.filters = [];

      this.initData();
      this.getElements();
      this.render();
      this.initActions();

      console.log('new BooksList', this);
    }

    render() {
      // Przechodzimy po wszystkich książkach z dataSource.books
      for (const book of this.data) {
        book.ratingBgc = this.determineRatingBgc(book.rating);
        book.ratingWidth = (book.rating / 10) * 100;
        // Generujemy HTML na podstawie szablonu i danych o książce
        const generatedHTML = templates.bookTemplate(Object.assign({}, book, {
          ratingWidth: book.ratingWidth,
          ratingBgc: book.ratingBgc,

        }));
        // Tworzymy element DOM z wygenerowanego HTML
        const bookElement = utils.createDOMFromHTML(generatedHTML);

        // Dodajemy element do listy książek
        this.dom.booksList.appendChild(bookElement);
      }
    }

    initData() {
      this.data = dataSource.books;  
    }

    getElements() {
  
      this.dom = {
        booksList: document.querySelector(select.containerOf.booksList),
        filters: document.querySelector(select.containerOf.filtersForm),
      };
    }

    initActions() {
      const thisBooksList = this;
      // Dodajemy jeden nasłuchiwacz do całej listy
      this.dom.booksList.addEventListener('dblclick', function (event) {
        // Sprawdzamy, czy kliknięty element ma odpowiednią klasę .book__image
        const bookImage = event.target.offsetParent;

        // Jeśli kliknięty element to obrazek książki, jego rodzic ma klasę .book__image
        if (bookImage && bookImage.classList.contains('book__image')) {
          // Pobieramy id książki z data-id
          const bookId = bookImage.dataset.id;

          // Sprawdzamy, czy książka jest już w ulubionych
          const index = thisBooksList.favoriteBooks.indexOf(bookId);

          // Jeśli książka już jest w ulubionych, usuwamy ją z tablicy
          if (index !== -1) {
            thisBooksList.favoriteBooks.splice(index, 1);
            bookImage.classList.remove('favorite');  // Usuwamy klasę 'favorite'
          } else {
            // Jeśli książka nie jest w ulubionych, dodajemy ją do tablicy
            thisBooksList.favoriteBooks.push(bookId);
            bookImage.classList.add('favorite');  // Dodajemy klasę 'favorite'
          }

          // Zaloguj aktualną tablicę ulubionych książek
          console.log(thisBooksList.favoriteBooks);
        }
      });
      this.dom.filters.addEventListener('click', function (event) {
        // Sprawdzamy, czy kliknięty element to checkbox, którego tagName to INPUT, type to checkbox, a name to filter
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          const filterValue = event.target.value; // Pobieramy wartość klikniętego checkboxa
          if (event.target.checked) {
            // Jeśli checkbox jest zaznaczony, dodajemy jego wartość do tablicy filters
            if (!thisBooksList.filters.includes(filterValue)) {
              thisBooksList.filters.push(filterValue);
            }
          } else {
            // Jeśli checkbox jest odznaczony, usuwamy jego wartość z tablicy filters
            const index = thisBooksList.filters.indexOf(filterValue);
            if (index !== -1) {
              thisBooksList.filters.splice(index, 1);
            }
          }
          console.log(thisBooksList.filters); // Wyświetlamy aktualny stan filtrów w konsoli
          thisBooksList.filterBooks();
        }
      });
    }

    filterBooks() {
      // Przechodzimy po wszystkich książkach
    for (const book of this.data) {
      let shouldBeHidden = false; // Na początku zakładamy, że książka nie będzie ukryta

      // Sprawdzamy każdy filtr
      for (const filter of this.filters) {
        // Jeśli książka nie spełnia warunku dla danego filtra, ukrywamy ją
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break; // Jeśli jeden filtr nie pasuje, nie ma sensu sprawdzać kolejnych
        }
      }

      // Znajdujemy element książki na podstawie jej id
      const bookImage = this.dom.booksList.querySelector('.book__image[data-id="' + book.id + '"]');

      // Dodajemy lub usuwamy klasę 'hidden' w zależności od wartości shouldBeHidden
      if (shouldBeHidden) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
    }

    determineRatingBgc(rating) {
      if (rating < 6) {
      return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)'; // Żółty gradient
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)'; // Zielony gradient
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'; // Ciemnozielony gradient
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)'; // Różowy gradient
    }
    }
  }

  const app = new BooksList();
}