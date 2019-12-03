import InjectRating from '../svelte/InjectRating.svelte';

const app = new InjectRating({
	target: document.getElementById("unifiedPrice_feature_div"),
	props: {
		name: 'world'
	}
});

window.app = app;

export default app;