#!/bin/bash
DOCKER_VERSION=$(docker -v)

if [[ "$DOCKER_VERSION" == *"Docker version"* ]]; then
	echo "👉👉👉 Cool, let's compile the cpp code to webassembly. 😎"
	rm -rf dist/barcode-reader.wasm && sleep 1.5s
	echo "Data from the last build has been removed 🧹"
	echo "If you are compiling for the first time the compilation will take about ⏳ 10min otherwise ⏳ 1min"
	echo "Enjoy and take relax 🍺 🍸 🍷..."

	if [ "$1" == "--compile" ]; then
		echo "Building the webassembly code... 👀"
		make dist/barcode-reader.wasm
	elif [ $# -gt 0 ]; then
		echo "⚠️ ⚠️ ⚠️  Invalid argument: $1"
		exit 1
	else
		echo "You can send the parameter --compile to skip the dependencies download 😉. This step is required only on the first run."
		mkdir -p zbar && make dist/all && rm -rf zbar/zbar-0.23.90.tar.gz
	fi

	if [ $? -eq 0 ]; then
		echo "Finished build 😉 check the compile output 👆If you see any errors, fix them and try again."
		echo "If success the files were copied to the folder dist as well 😌"
		echo "Run the web project to test. The webassembly is on fire 🔥🔥🔥 "
		rm -rf dist/barcode-reader.js
	else
		echo "Oh no! Something went wrong 😱. For more details check the compile output. 👆"
		exit 1
	fi
else
	echo "⚠️ ⚠️ ⚠️  Ohhh nooo 😱 You should have a Docker 🐳 to run this script."
	echo "If you already have a docker, check one is running and try again. Docker is life 🤙 🤙 🤙"
	exit 1
fi
