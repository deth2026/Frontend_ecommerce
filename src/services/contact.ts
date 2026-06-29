import api from "./api";

export const sendContact = (data) => {
    return api.post("/contact", data);
};

