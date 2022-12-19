import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '31961663-64463d95415f4115936bb653e';
const REQUEST_PARAMETERS =
  'image_type=photo&orientation=horizontal&safesearch=true';

export class NewsApiServises {
  constructor() {
    this.request = '';
    this.page = 1;
  }
  async fetchPictures() {
    try {
      const response = await axios.get(
        `/?key=${API_KEY}&q=${this.request}&${REQUEST_PARAMETERS}&page=${this.page}&per_page=40`
      );
      this.increaseCounter();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  increaseCounter() {
    this.page += 1;
  }

  resetCounter() {
    this.page = 1;
  }

  get requests() {
    return this.request;
  }

  set requests(newRequest) {
    this.request = newRequest;
  }
}
