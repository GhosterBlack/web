import api from "../api/axios";

export const getProduct = async(key)=>{

    const response =
        await api.get(
            `/products/${key}`
        );

    return response.data;
};

export const createProduct = async(data)=>{

    const response =
        await api.post(
            "/products",
            data
        );

    return response.data;
};