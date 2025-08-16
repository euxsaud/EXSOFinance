import path from 'path';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import * as esbuild from 'esbuild';

// Set directories to monitor and backup
const $dirs = {
	source: path.resolve('./src.gas/.dev/'),
	target: path.resolve('./src.gas/'),
	tailwind: {
		input: 'css/tailwind.css',
		output: 'styles.css.html',
	},
	js: {
		input: 'js/index.js',
		output: 'scripts.js.html',
	},
};

/**
 * Compiles Tailwind CSS.
 * @returns void
 */
function compileTailwind(mode) {
	const { source, target, tailwind } = $dirs;

	if (!tailwind || !tailwind.input || !tailwind.output) {
		return Promise.reject(new Error('[tailwind] Tailwind CSS configuration is missing.'));
	}

	const input = path.join(source, tailwind.input);
	const output = path.join(target, tailwind.output);

	const args = ['tailwindcss', '-i', input, '-o', output, '--minify'];

	if (mode === 'dev') {
		args.push('--watch');
	}

	console.log(`[tailwind] Compiling CSS (${mode}) from ${input} to ${output}`);

	const tailwindProcess = spawn('npx', args, {
		stdio: 'inherit',
		shell: process.platform === 'win32', // Use shell to allow for cross-platform compatibility
	});

	return new Promise((resolve, reject) => {
		tailwindProcess.on('error', (error) => {
			console.error(`Error starting Tailwind CSS process: ${error.message}`);
			reject(error);
		});
		tailwindProcess.on('close', (code) => {
			if (code !== 0) {
				console.error(`[tailwind] CSS process exited with code ${code}`);
				reject(new Error(`[tailwind] CSS compilation failed with exit code ${code}`));
			} else {
				console.log('[tailwind] CSS compilation completed successfully.');
				resolve();
			}
		});
	});
}

/**
 * Compiles JavaScript bundle using esbuild.
 * @returns void
 */
const HandleJS = {
	Wrapper(jsContent, outFile) {
		const wrappedContent = `<script>\n${jsContent}\n</script>`;

		writeFile(outFile, wrappedContent, 'utf8');

		const bytes = Buffer.byteLength(wrappedContent);

		console.log(`[esbuild] Wrapped JavaScript file (${outFile}) with ${bytes} bytes.`);
	},

	async Compile(mode) {
		const { source, target, js } = $dirs;

		if (!js || !js.input || !js.output) {
			return Promise.reject(new Error('JavaScript bundle configuration is missing.'));
		}

		const input = path.join(source, js.input);
		const output = path.join(target, js.output);

		const args = {
			entryPoints: [input],
			bundle: true,
			platform: 'browser',
			format: 'iife',
			sourcemap: mode === 'dev',
			minify: mode === 'build',
			write: false,
		};

		if (mode === 'dev') {
			const wrapScriptPlugin = {
				name: 'wrap-script',
				setup(build) {
					build.onEnd((result) => {
						if (result.errors?.length) return;
						const outputFile = result.outputFiles?.[0];
						if (outputFile) {
							HandleJS.Wrapper(outputFile.text, output);
							console.log(`[esbuild] JavaScript bundle compiled OK ✅`);
						} else {
							console.error(`[esbuild] No output files found after build.`);
						}
					});
				},
			};

			const ctx = await esbuild.context({ ...args, plugins: [wrapScriptPlugin] });

			// Initial rebuild to generate the first output
			await ctx.rebuild();

			// Start watching for changes
			await ctx.watch();

			console.log(`[esbuild] Watch mode enabled. Watching for changes...`);

			return;
		}

		// Build mode
		const Result = await esbuild.build(args);
		HandleJS.Wrapper(Result.outputFiles[0].text, output);
		console.log(`[esbuild] JavaScript bundle compiled successfully`);
	},
};

(async () => {
	const MODE = process.argv[2] || 'dev';

	if (!['dev', 'build'].includes(MODE)) {
		console.error(`[tasker.gas.js] Invalid mode: ${MODE}. Use 'dev' or 'build'.`);
		process.exit(1);
	}

	// Run processes in parallel
	console.log(`[tasker.gas.js] Starting build in ${MODE} mode...`);

	const twProcess = compileTailwind(MODE);
	const jsProcess = HandleJS.Compile(MODE);

	if (MODE === 'build') {
		await Promise.all([twProcess, jsProcess]);
		console.log(`✅[tasker.gas.js] Build completed successfully.`);
	} else {
		console.log(`🔄[tasker.gas.js] Development mode is running. Watching for changes...`);
	}
})().catch((error) => {
	console.error(`❌[tasker.gas.js] Error during build: ${error.message}`);
	process.exit(1);
});
