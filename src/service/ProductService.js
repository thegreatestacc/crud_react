import axios from 'axios';

export class ProductService {
    baseUrl = "http://localhost:8080/prod/"
    getAll() {
        return axios.get(this.baseUrl  + "all").then(result => result.data);
    }

    save(product) {
        return axios.post(this.baseUrl + "create", product).then(result => result.data);
    }

    delete(id) {
        return axios.delete(this.baseUrl + "delete/" + id).then(result => result.data);
    }
}