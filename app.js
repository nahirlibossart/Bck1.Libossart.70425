class ProductManager {
    constructor() {
        this.products= []
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Los campos son obligatorios, por favor complete lo que falta")
            return
        }

         let exist= this.products.find(p => p.code === code)
        if(exist) {
            console.log(`El producto con el código ${code} ya se encuentra en la BD, por favor indique un code nuevo`)
            return
        } 

        let id= 1
        if (this.products.length > 0) {
            id= this.products[this.products.length - 1].id + 1
        }

        let newProduct= {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products.push(newProduct)
        return newProduct

    }

     getProducts() {

    return this.products

     }

     getProductsById(id) {
        let product= this.products.find(p => p.id === id)
        if(!product) {
           console.error("Not found")
           return
        }

        return product

     }
}

const productManager= new ProductManager()

