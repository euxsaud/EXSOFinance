export const notyf = new Notyf({
	ripple: true,
	duration: 10000,
	dismissible: true,
	position: { x: 'left', y: 'bottom' },
	types: [
		{
			type: 'warm',
			background: 'linear-gradient(45deg, rgb(239, 253, 33), rgb(255, 0, 0))',
		},
	],
});
export const notyfWarm = (message) => notyf.open({ type: 'warm', message });
