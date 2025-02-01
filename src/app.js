import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';

import { router as vistasRouter } from './routes/views.router.js';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', vistasRouter);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => {
	console.log(`Server escuchando en puerto ${PORT}`);
});

try {
	await mongoose.connect(
		'mongodb+srv://nahirlibossart:Backend1@cluster0.j62ah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
		{
			dbName: 'ecommerce',
		}
	);
	console.log(`DB online!`);
} catch (error) {
	console.log(`Error al conectar a db: ${error.message}`);
}
