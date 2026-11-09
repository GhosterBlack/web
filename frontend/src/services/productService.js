import api from "../api/axios";

export const getProduct = async(key)=>{

    const response =
        await api.get(
            `/product/${key}`
        );

    return response.data;
};

export const getAllProducts = async()=> {
    const response = 
        await api.get("/products/all");
       
    return response.data;
}

export const createProduct = async(data)=>{

    const response =
        await api.post(
            "/products",
            data
        );
         if (!response.success) {
            throw response.message;
        }
    return response.data;
};