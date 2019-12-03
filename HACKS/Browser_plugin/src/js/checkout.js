import App from '../svelte/Popup.svelte';
const app = new App({
	target: document.body,
	props: {
		name: 'Kai',
		currentproductco2eq: '505',
		currentproductsustainabilityrating: '4.2',
		city = 'Los Angeles',
		currentproductoffsetcost = '123',
	}
});

window.app = app;

export default app;