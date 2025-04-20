const axios = require("axios");

const getEventsFromAPI = () => {
  return axios.get("https://api.example.com/events")
    .then(res => res.data);
};

const createEventInAPI = (eventData) => {
  return axios.post("https://api.example.com/events", eventData)
    .then(res => res.data);
};

module.exports = {
  getEventsFromAPI,
  createEventInAPI
};
