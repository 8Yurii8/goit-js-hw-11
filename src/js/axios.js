import axios from 'axios';

export const getPhotos = async (name, page) => {
  const response = await axios.get(
    `${BASE_URL}${KEY}&q=${name}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${pageQuntyty}&page=${page}`
  );

  return response.data;
};
const BASE_URL = 'https://pixabay.com/api/?key=';
const KEY = '34985167-fd9dfa45b63c3cbe9c4163666';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';
let pageQuntyty = '40';
let pageNumbers = '1';
