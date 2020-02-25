import http from "k6/http";
import { sleep } from "k6";

export default function() {
  http.get(`http://localhost:3003/api/graphs/properties/${Math.ceil(Math.random() * 10000000)}`);
  sleep(.05);
};

export let options = {
  vus: 50,
  duration: '30s',
};
