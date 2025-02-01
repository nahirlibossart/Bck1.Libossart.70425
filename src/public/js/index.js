let spanIdCart = document.getElementById('idCart');
let idCart = spanIdCart.textContent;

const add = async (idProduct) => {
	console.log(idProduct, idCart);

	let answer = await fetch(`/api/carts/${idCart}/product/${idProduct}`, {
		method: 'post',
	});
	if (answer.status >= 400) {
		alert(`Error! Consulte con el administrador`);
		return;
	}
	let data = await answer.json();
	console.log(data);
	window.location.reload();
};
