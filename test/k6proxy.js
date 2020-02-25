import http from "k6/http";
import { sleep } from "k6";

export default function() {
  http.get(`http://localhost:3000/api/graphs/properties/${Math.ceil(Math.random() * 10000000)}`);
  sleep(.01);
};

export let options = {
  vus: 10,
  duration: '10s',
};
