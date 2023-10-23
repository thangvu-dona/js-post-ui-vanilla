import postApi from "./api/postApi";
import studentApi from "./api/studentApi";

console.log("hello js-post vite!");


async function main() {
  // const response = await axiosClient.get('/posts');
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const responsePost = await postApi.getAll(queryParams);
    const responseStudent = await studentApi.getAll(queryParams);
    console.log(responsePost, responseStudent);
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
}

main(); 