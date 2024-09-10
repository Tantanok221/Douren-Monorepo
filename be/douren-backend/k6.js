import http from 'k6/http';


export const options = {
  // Key configurations for avg load test in this section
  stages: [
    { duration: '20s', target: 25 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
  ],
};

export default function () {
  http.get('http://127.0.0.1:2000/artist?sort=Author_Main(Author),asc&page=1&searchtable=Author_Main.Author');

}