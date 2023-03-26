const AppVersion = "100";
const ApiUrl = "http://localhost:8000/api";

export default class Api {

    static ApiUrl() {
        return ApiUrl;
    }

    static AppVersion() {
        return AppVersion;
    }

    static getBancos() {
        return bancos;
    }

    static getHeaders(token, contentType) {
        return {
            "Access-Control-Allow-Origin": "*",
            "Content-type": contentType ? contentType : 'application/json',
            'Accept': 'application/json',
            'Authorization': token !== undefined ? 'Bearer ' + token : 'Bearer teste',
        }
    }

    static async get(url,token) {
        const request = await fetch(ApiUrl + "/" + url, {
            method: 'GET',
            headers: this.getHeaders(token)
        })
            .then(resultado => resultado.json())
            .then(res => {
                if (res.erro || (res.valido !== undefined && !res.valido)  || res.vazio || res.errors || res.message || res.mensagem || res.status) {
                    if (res.status === "Token is Invalid" || res.status === "Token is Expired" || res.status === "Authorization Token not found" || res.status === "Unauthorized") {
                        throw { sessaoExpirada: true, mensagem: "O tempo da sua sessão expirou, faça um novo login para continuar!" };
                    } else {
                        throw res
                    }
                } else {
                    return res
                }
            })
        return request;
    }

    static async post(url, data, token) {
        const request = await fetch(ApiUrl + "/" + url, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(data)
        })
            .then(resultado => resultado.json())
            .then(res => {
                if (res.erro || (res.valido !== undefined && !res.valido)  || res.vazio || res.errors || res.message || res.mensagem || res.status) {
                    if (res.status === "Token is Invalid" || res.status === "Token is Expired" || res.status === "Authorization Token not found" || res.status === "Unauthorized") {
                        throw { sessaoExpirada: true, mensagem: "O tempo da sua sessão expirou, faça um novo login para continuar!" };
                    } else {
                        throw res
                    }
                } else {
                    return res
                }
            })
        return request;
    }

    static async put(url, data, token) {
        const request = await fetch(ApiUrl +"/" +  url, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data)
        })
            .then(resultado => resultado.json())
            .then(res => {
                if (res.erro || (res.valido !== undefined && !res.valido)  || res.vazio || res.errors || res.message || res.mensagem || res.status) {
                    if (res.status === "Token is Invalid" || res.status === "Token is Expired" || res.status === "Authorization Token not found" || res.status === "Unauthorized") {
                        throw { sessaoExpirada: true, mensagem: "O tempo da sua sessão expirou, faça um novo login para continuar!" };
                    } else {
                        throw res
                    }
                } else {
                    return res
                }
            })
        return request;
    }

    static async customRequest(url, metodo, data, token, contentType) {
        const request = await fetch(ApiUrl + "/" + url, {
            method: metodo,
            headers: this.getHeaders(token, contentType),
            body: JSON.stringify(data)
        })
            .then(resultado => resultado.json())
            .then(res => {
                if (res.erro || (res.valido !== undefined && !res.valido)  || res.vazio || res.errors || res.message || res.mensagem || res.status) {
                    if (res.status === "Token is Invalid" || res.status === "Token is Expired" || res.status === "Authorization Token not found" || res.status === "Unauthorized") {
                        throw { sessaoExpirada: true, mensagem: "O tempo da sua sessão expirou, faça um novo login para continuar!" };
                    } else {
                        throw res
                    }
                } else {
                    return res
                }
            })
        return request;
    }
}