import axiosClient from "./axiosClient";

const postApi = {
  getAll(params) {
    const url = '/posts';
    // const url = '/private/posts';  // example when error occur - Error 401
    return axiosClient.get(url, {params});
    // return axiosClient.get(url, {params, baseUrl: 'https://abc.com'}); // config here will override default
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },

  addFormData(data) {
    const url = '/with-thumbnail/posts';
    return axiosClient.post(url, data, {
      headers: {'Content-Type' : 'multipart/form-data'}
    });
  },

  updateFormData(data) {
    const url = `/with-thumbnail/posts/${data.get('id')}`;
    return axiosClient.patch(url, data, {
      headers: {'Content-Type' : 'multipart/form-data'}
    });
  }
}

export default postApi;