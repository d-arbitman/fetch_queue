const storage = {
  getApiUrls() {
    return JSON.parse(localStorage.getItem('urls') || '[]');
  },

  setApiUrl(url) {
    const urls = this.getApiUrls();

    if (url && !urls.includes(url)) {
      urls.push(url);
      localStorage.setItem('urls', JSON.stringify(urls));
    }
  },
};

export default storage;
