// Exporting the contrastColors function for use in other modules
// Importing the necessary library ( <script src="https://cdn.jsdelivr.net/npm/culori"></script> )
export function contrastColors(Selector) {
	const Element = document.querySelector(Selector || 'body') || document.body;
	let baseBgColor = getComputedStyle(Element).backgroundColor || '#ffffff';
	let baseTextColor = getComputedStyle(Element).color || '#000000';

	if (/oklch/.test(baseBgColor)) {
		baseBgColor = culori.oklch(baseBgColor);
		baseBgColor = culori.formatHex(baseBgColor);
	}
	if (/oklch/.test(baseTextColor)) {
		baseTextColor = culori.oklch(baseTextColor);
		baseTextColor = culori.formatHex(baseTextColor);
	}

	return { baseBgColor, baseTextColor };
}
