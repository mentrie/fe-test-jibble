import axios from 'axios';

const formatDataForClient = (posts, users, albums) => {
  const data = {
    posts: posts.slice(0, 10),
    users,
    albums: albums.slice(0, 10)    
  }
  return data;
}

export const fetchDataFromServer = async () => {
  try {
    const [posts, users, albums] = await axios.all([
      axios.get('https://jsonplaceholder.typicode.com/posts'),
      axios.get('https://jsonplaceholder.typicode.com/users'),
      axios.get('https://jsonplaceholder.typicode.com/albums')
    ]);

    return formatDataForClient(posts.data, users.data, albums.data);
  } catch (error) {
    throw new Error(error);
  }
}


export const deleteDataFromServer = async ({id, type}) => {
  try {
    const response = await axios.delete(`https://jsonplaceholder.typicode.com/${type}/${id}`);
    return response;
  } catch (error){
    throw new Error(error);
  }
}

export const updatePostOnServer = async ({id, data}) => {
  try {
    const response = await axios.patch(`https://jsonplaceholder.typicode.com/posts/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}