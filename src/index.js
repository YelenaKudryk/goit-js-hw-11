import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { NewsApiServises } from './files-js/fetchPictures';
import { templateCard } from './files-js/template';
import { LoadMoreBtn } from './files-js/load-more-btn';

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
const newsApiServises = new NewsApiServises();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const refs = {
  formEl: document.querySelector('.search-form'),
  containerForCardsEl: document.querySelector('.gallery'),
};

refs.formEl.addEventListener('submit', requestClient);
loadMoreBtn.refs.btnLoadMore.addEventListener('click', loadMoreOnClick);

async function requestClient(e) {
  e.preventDefault();
  clearCardList();
  loadMoreBtn.hide();
  newsApiServises.request = e.target.elements.searchQuery.value.trim();
  newsApiServises.resetCounter();
  await newsApiServises
    .fetchPictures()
    .then(({ hits, totalHits }) => {
      if (newsApiServises.request === '' || totalHits <= 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (totalHits < 40) {
        renderPictures(hits);
        loadMoreBtn.hide();
        return Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        renderPictures(hits);
        loadMoreBtn.show();
      }
    })
    .catch(error => console.log(error));
}

async function loadMoreOnClick() {
  await newsApiServises
    .fetchPictures()
    .then(({ hits }) => {
      renderPictures(hits);

      if (hits.length < 40) {
        loadMoreBtn.hide();
        return Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function renderCardList(hits) {
  refs.containerForCardsEl.insertAdjacentHTML('beforeend', templateCard(hits));
}

function clearCardList() {
  refs.containerForCardsEl.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderPictures(hits) {
  renderCardList(hits);
  smoothScroll();
  lightbox.refresh();
}
