import { Server } from 'socket.io';
import { msgModel } from '../DAO/models/msgs.model.js';
import ProductManager from '../DAO/productManager.js';
import { productService } from '../services/product.service.js';

const productManager = new ProductManager('db/products.json');

export function connectSocketServer(httpServer) {
  // CONFIG DE SOCKET.IO
  const socketServer = new Server(httpServer);

  socketServer.on('connection', async socket => {
    console.log(`New client: ${socket.id}`);

    socket.on('new-product', async newProd => {
      try {
        if (
          !newProd.title ||
          !newProd.description ||
          !newProd.category ||
          !newProd.price ||
          !newProd.code ||
          !newProd.stock
        ) {
          console.log('Todos los campos son obligatorios');
          return;
        }

        // Validar el tipo de dato de los campos
        if (typeof newProd.title !== 'string') {
          console.log("El campo 'title' debe ser una cadena de caracteres");
          return;
        }

        if (typeof newProd.description !== 'string') {
          console.log("El campo 'description' debe ser una cadena de caracteres");
          return;
        }

        if (typeof newProd.category !== 'string') {
          console.log("El campo 'category' debe ser una cadena de caracteres");
          return;
        }

        if (typeof newProd.price !== 'number') {
          console.log("El campo 'price' debe ser un número");
          return;
        }

        if (typeof newProd.code !== 'string') {
          console.log("El campo 'code' debe ser una cadena de caracteres");
          return;
        }

        if (typeof newProd.stock !== 'number') {
          console.log("El campo 'stock' debe ser un número");
          return;
        }

        // Validar que no se repita el código
        const currentProducts = await productService.getAllProducts();
        const codeAlreadyExists = currentProducts.some(prod => prod.code === newProd.code);

        if (codeAlreadyExists) {
          console.log(`Ya existe un producto con el código ${newProd.code}`);
          return;
        }

        // Validar y establecer el valor por defecto para el campo status
        const status = typeof newProd.status === 'boolean' ? newProd.status : true;

        // Agregar el producto al arreglo con un id autoincrementable
        const newProduct = {
          ...newProd,
          status,
        };
        await productService.createProduct(newProduct);

        const productsList = await productService.getAllProducts();
        socketServer.emit('products', productsList);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('delete-product', async productId => {
      try {
        await productService.deleteProduct(productId);

        const productsList = await productService.getAllProducts();
        socketServer.emit('products', productsList);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('msg_front_to_back', async msg => {
      try {
        await msgModel.create(msg);
      } catch (e) {
        console.log(e);
      }

      try {
        const msgs = await msgModel.find({}).exec();
        socketServer.emit('listado_de_msgs', msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
}
