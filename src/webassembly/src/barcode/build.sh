DOCKER_VERSION=$(docker -v)

if [[ "$DOCKER_VERSION" == *"Docker version"* ]]; then
	echo "👉👉👉 Cool, let's compile the cpp code to web-assembly. 😎"
	echo "Building the web-assembly code... 👀\n"
	rm -rf dist && sleep 1.5s
	echo "\nData from the last build has been removed 🧹"
	echo "If you are compiling for the first time the compilation will take about ⏳ 10min otherwise ⏳ 1min"
	echo "Enjoy and take relax 🍺 🍸 🍷...\n"
	mkdir dist && make dist/barcode.wasm && rm -rf zbar-0.23.90.tar.gz
	echo "\nFinished build 😉 check the compile output 👆\nIf you see any errors, fix them and try again."
	echo "If success the files were copied to the folders lib/barcode and the public on concodonta-web root as well 😌"
	echo "Run the web project to test. The webassembly is on fire 🔥🔥🔥 "
else 
	echo "⚠️ ⚠️ ⚠️  Ohhh nooo 😱 \nYou should have a Docker 🐳 to run this script."
	echo "If you already have a docker, check one is running and try again.\nDocker is life 🤙 🤙 🤙"
fi