DOCKER_VERSION=$(docker -v)

if [[ "$DOCKER_VERSION" == *"Docker version"* ]]; then
	echo "๐๐๐ Cool, let's compile the cpp code to webassembly. ๐"
	rm -rf dist && sleep 1.5s
	echo "\nData from the last build has been removed ๐งน"
	echo "If you are compiling for the first time the compilation will take about โณ 10min otherwise โณ 1min"
	echo "Enjoy and take relax ๐บ ๐ธ ๐ท...\n"

	mkdir dist;
	
	if [ "$1" == "--compile" ]; then
		echo "Building the webassembly code... ๐\n"
		make dist/cbarcode.wasm
	elif [ $# -gt 0 ]; then
		echo "\nโ ๏ธ โ ๏ธ โ ๏ธ  Invalid argument: $1\n"
		exit 1;
	else
		echo "\nYou can send the parameter --compile to skip the dependencies download ๐. This step is required only on the first run.\n"
		mkdir -p zbar && make dist/all && rm -rf zbar/zbar-0.23.90.tar.gz
	fi

	if [ $? -eq 0 ]; then
		echo "\nFinished build ๐ check the compile output ๐\nIf you see any errors, fix them and try again."
		echo "If success the files were copied to the folder dist as well ๐"
		echo "Run the web project to test. The webassembly is on fire ๐ฅ๐ฅ๐ฅ "
	else
    echo "\nOh no! Something went wrong ๐ฑ. For more details check the compile output. ๐\n"
		exit 1;
	fi
else 
	echo "โ ๏ธ โ ๏ธ โ ๏ธ  Ohhh nooo ๐ฑ \nYou should have a Docker ๐ณ to run this script."
	echo "If you already have a docker, check one is running and try again.\nDocker is life ๐ค ๐ค ๐ค"
	exit 1;
fi