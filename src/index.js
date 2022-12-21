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
  try {
    e.preventDefault();
    loadMoreBtn.hide();
    newsApiServises.request = e.target.elements.searchQuery.value.trim();
    newsApiServises.resetCounter();
    clearCardList();

    if (!newsApiServises.request) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    const getPictures = await newsApiServises.fetchPictures();
    await checkAndDisplay(getPictures);
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function loadMoreOnClick() {
  try {
    const getPictures = await newsApiServises.fetchPictures();
    await checkAndDisplayLoadMore(getPictures);
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function checkAndDisplay({ hits, totalHits }) {
  if (totalHits <= 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderPictures(hits);
    loadMoreBtn.show();
    return;
  }
}

function checkAndDisplayLoadMore({ hits, totalHits }) {
  const totalPage = Math.ceil(totalHits / newsApiServises.per_page);
  if (newsApiServises.page >= totalPage) {
    loadMoreBtn.hide();
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    renderPictures(hits);
    return;
  }
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
