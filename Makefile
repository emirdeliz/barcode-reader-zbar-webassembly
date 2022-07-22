ZBAR_SOURCE_PATH = zbar
ZBAR_VERSION = 0.23.90
ZBAR_SOURCE = $(ZBAR_SOURCE_PATH)-$(ZBAR_VERSION)

EM_VERSION = 3.0.0
EM_DOCKER = docker run --rm -u $(shell id -u):$(shell id -g) -w /src -v $$PWD:/src emscripten/emsdk:$(EM_VERSION)
EMCC = $(EM_DOCKER) emcc
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_DEPS = $(ZBAR_SOURCE)/make.done
ZBAR_OBJS = $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE)/zbar/*/*.o

ZBAR_INC = -I $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE)/include/ -I $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE)/
EMCC_FLAGS = -Os -Wall -Werror --no-entry -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="[\
		'_malloc',\
		'_free',\
		'_c_zbar_image_scanner_scan_and_maybe_apply_check_digit',\
		'_c_get_mod',\
		'_c_calc_check_digit',\
		'_c_zbar_image_create',\
		'_c_check_if_barcode_is_from_insurance'\
	]" \
	-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
	-s EXPORT_NAME="czbar"
	-s MINIMAL_RUNTIME=1
CZBAR_WASM_DEPS = dist/cbarcode.wasm
CZBAR_BUILD_OUTPUT = dist
CZBAR_BARCODE_READER_ENTRY = node_modules/barcode-reader-zbar-c/src/c_barcode_scanner.c

dist/all: $(ZBAR_DEPS) $(CZBAR_WASM_DEPS)

$(CZBAR_WASM_DEPS):
	$(EMCC) $(EMCC_FLAGS) -o dist/cbarcode.js $(CZBAR_BARCODE_READER_ENTRY) $(ZBAR_INC) $(ZBAR_OBJS)

$(ZBAR_DEPS): $(ZBAR_SOURCE)/Makefile
	cd $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE)/configure
	cd $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE) && $(EMCONFIG) ./configure --without-x --without-xshm \
		--without-xv --without-jpeg --without-libiconv-prefix \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread --disable-assert

$(ZBAR_SOURCE)/configure: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE).tar.gz -C $(ZBAR_SOURCE_PATH)
	touch -m $(ZBAR_SOURCE_PATH)/configure

$(ZBAR_SOURCE).tar.gz:
	curl -L -o $(ZBAR_SOURCE_PATH)/$(ZBAR_SOURCE).tar.gz https://linuxtv.org/downloads/zbar/zbar-$(ZBAR_VERSION).tar.gz
