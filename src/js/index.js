import { getPhotos } from './axios';

// Імпорт ліби
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Імпорт ліби

let startPage = 0;
// пошук елементів
const inputHandleText = document.querySelector(
  'form#search-form input[name="searchQuery"]'
);
const handleButtonSerch = document.querySelector(
  'form#search-form button[type="submit"]'
);
const PhotoList = document.querySelector('.gallery');
const sentinal = document.querySelector('#sentinal');
// пошук елементів
// пошук картинок
async function search(query) {
  startPage += 1;
  PhotoList.innerHTML = '';
  try {
    const data = await getPhotos(query);

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.hits.length} images.`);
    const galleryMarkup = createGalleryList(data.hits);
    PhotoList.insertAdjacentHTML('beforeend', galleryMarkup);
    gallery = createGallery();
    gallery.refresh();
  } catch (error) {
    console.error(error);
  }
}
// пошук картинок
// додаємо картинки
handleButtonSerch.addEventListener('click', async event => {
  event.preventDefault();
  const query = inputHandleText.value.trim();
  if (query !== '') {
    await search(query);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
// додаємо картинки
// створюємо картинки
function createGalleryList(photos) {
  return photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__item"" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">Likes
              <b>${likes}</b>
            </p>
            <p class="info-item">Views
              <b>${views}</b>
            </p>
            <p class="info-item">Comments
              <b>${comments}</b>
            </p>
            <p class="info-item">Downloads
              <b>${downloads}</b>
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
}
// створюємо картинки

function createGallery() {
  return new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captions: true,
  });
}

let currentPage = 1;
let gallery;
// додаємо більше картинок при скролі
const onEntry = async entries => {
  entries.forEach(async entry => {
    if (startPage === 0) {
      return;
    }
    if (entry.isIntersecting) {
      currentPage += 1;
      try {
        const data = await getPhotos(inputHandleText.value.trim(), currentPage);

        // Вставте нові фотографії до списку
        PhotoList.insertAdjacentHTML('beforeend', createGalleryList(data.hits));
        // Перевіряємо, чи є об'єкт галереї (він буде визначений тільки після першого завантаження)
        if (!gallery) {
          // Якщо об'єкт галереї ще не створений, створюємо його
          gallery = createGallery();
        } else {
          // Інакше оновлюємо галерею
          if (data.hits.length !== 0) {
            Notiflix.Notify.success(
              `Hooray! We found ${data.hits.length} images.`
            );
          }
          gallery.refresh();
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const options = { rootMargin: '200px' };
const observer = new IntersectionObserver(onEntry, options);
observer.observe(sentinal, options);
// додаємо більше картинок при скролі
