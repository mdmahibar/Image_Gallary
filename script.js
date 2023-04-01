//Variables
const imageWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchImg = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeLightBox = lightBox.querySelector('.close');
const downloadBtn = lightBox.querySelector('.download');
console.log(downloadBtn);

//Api key , paginations, searchTerm variables
const apiKey = '1iUyryLn5shmtfDyZNDUAZowhNVA9sDcGklVOAc8XFF25mPbPQoH78JE';
const perPage = 15;
let currentPage = 1;
let searchVal = null;

const downloadImg = (imgUrl) => {
    //Converting recived img to blob, creating its download link, & download it
    fetch(imgUrl).then(res => res.blob())
                 .then(file => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(file);
                    console.log(a);
                    a.download = new Date().getTime();
                    a.click();
                 })
                 .catch((err) => console.log(err));
}

const showLightbox = (img, name) => {
    //Showing lightbox and setting img source , name
    lightBox.querySelector('img').src = img;
    lightBox.querySelector('.span').innerText = name;
    downloadBtn.setAttribute('date-img', img);
    lightBox.classList.add('show');
    document.body.style.overflow = 'hidden';
}
  
  const hideLightBox = () => {
    lightBox.classList.remove('show');
    document.body.style.overflow = 'auto';
}

const generateHTML = (images) => {
    //Making li pf all fetchd images and adding them to the exiting image wrapper
    imageWrapper.innerHTML += images
      .map(
        (img) =>
          `<li class="card" onclick = "showLightbox('${img.src.large}','${img.photographer}')">
            <img src="${img.src.large}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i><span class="material-symbols-outlined">photo_camera</span></i>
                    <span class="span">${img.photographer}</span>
                </div>
                <button onclick ="downloadImg('${img.src.large}');event.stopPropagation();">
                    <i><span class="material-symbols-outlined">download</span></i>
                </button>
            </div>
            </li>`
            ).join("");
};
          

const getImages = (apiURL) => {
    loadMoreBtn.innerText = 'Loading...';
    loadMoreBtn.classList.add('disabled');
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = 'Load More';
        loadMoreBtn.classList.remove('disabled');
    }).catch(() => alert('Failed to Load Images!'));
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

const loadMoreImages = () => {
    currentPage++;
    //if searchTerm has some value then call api with search term else call default api
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchVal ? `https://api.pexels.com/v1/search?query=${searchVal}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const searchImgFunc = (e) => {
    //if the search input is empty , set the searchinput value to null and return it
    if(e.target.value === '') return searchVal = null;
    //if pressed key is enter, update the current page , search term & call the getimages
    if(e.key === 'Enter'){
      // console.log('Enter key pressed');
      currentPage = 1;
      searchVal = e.target.value;
      imageWrapper.innerHTML = '';
      getImages(`https://api.pexels.com/v1/search?query=${searchVal}&page=${currentPage}&per_page=${perPage}`);

    }
}

loadMoreBtn.addEventListener('click', loadMoreImages);
searchImg.addEventListener('keyup', searchImgFunc);
closeLightBox.addEventListener('click', hideLightBox);
downloadBtn.addEventListener('click', (e) => {
    downloadImg(e.target.dataset.img); 
});
