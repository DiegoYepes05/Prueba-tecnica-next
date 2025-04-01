// api.js
export const api = {
  getAllProducts: async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  
  getProductById: async (id) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting product");
    }
  }
};