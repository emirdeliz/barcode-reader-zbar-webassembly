ZBAR_VERSION = 0.23.90
ZBAR_SOURCE = zbar-$(ZBAR_VERSION)

EM_VERSION = 3.0.0
EM_DOCKER = docker run --rm -u $(shell id -u):$(shell id -g) -w /src -v $$PWD:/src emscripten/emsdk:$(EM_VERSION)
EMCC = $(EM_DOCKER) emcc
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_DEPS = $(ZBAR_SOURCE)/make.done
ZBAR_OBJS = $(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o
ZBAR_INC = -I $(ZBAR_SOURCE)/include/ -I $(ZBAR_SOURCE)/
EMCC_FLAGS = -Os -Wall -Werror --no-entry -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="['_malloc','_free']" \
	-s ERROR_ON_UNDEFINED_SYMBOLS=0 -s WASM=1 \
	-s EXPORT_NAME="cczbar"
	-s MINIMAL_RUNTIME=1 
CCZBAR_WASM_DEPS = dist/ccbarcode.wasm
CCZBAR_BUILD_OUTPUT = ../../lib/barcode

all:$(CCZBAR_WASM_DEPS)

dist/ccbarcode.wasm: 
	$(EMCC) $(EMCC_FLAGS) -o dist/ccbarcode.js src/c/cc_barcode_scanner.c $(ZBAR_INC) $(ZBAR_OBJS)
	cp dist/ccbarcode.wasm $(CCZBAR_BUILD_OUTPUT)
	cp dist/ccbarcode.wasm ../../../../public/ccbarcode.wasm

$(ZBAR_DEPS): $(ZBAR_SOURCE)/Makefile
	cd $(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os \ DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"
	touch -m $(ZBAR_DEPS)

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE)/configure
	cd $(ZBAR_SOURCE) && $(EMCONFIG) ./configure --without-x --without-xshm \
		--without-xv --without-jpeg --without-libiconv-prefix \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread --disable-assert

$(ZBAR_SOURCE)/configure: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE).tar.gz
	touch -m $(ZBAR_SOURCE)/configure

$(ZBAR_SOURCE).tar.gz:
	curl -L -o $(ZBAR_SOURCE).tar.gz https://linuxtv.org/downloads/zbar/zbar-$(ZBAR_VERSION).tar.gz
