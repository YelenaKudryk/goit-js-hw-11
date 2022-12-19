export class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRef(selector);
    hidden && this.hide();
  }

  getRef(selector) {
    const refs = {};
    refs.btnLoadMore = document.querySelector(selector);
    return refs;
  }

  // enable() {
  //   this.refs.btnLoadMore.disabled = false;
  // }

  // disable() {
  //   this.refs.btnLoadMore.disabled = true;
  // }

  show() {
    this.refs.btnLoadMore.classList.remove('is-hidden');
  }

  hide() {
    this.refs.btnLoadMore.classList.add('is-hidden');
  }
}
