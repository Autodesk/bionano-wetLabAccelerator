ifndef TEST_ENVIRONMENT
    TEST_ENVIRONMENT=qa
endif

ifndef TEST_BROWSER
    TEST_BROWSER=chrome
endif

ifndef URL_PREFIX
    URL_PREFIX=
endif

VENVDIR := venv
ASSET_DIR := assets
AWS_ACCESS_KEY := $(strip $(shell grep aws_access_key environment.yaml|cut -d ':' -f 2))
AWS_SECRET_KEY := $(strip $(shell grep aws_secret_key environment.yaml|cut -d ':' -f 2))
ASSET_TAG := $(strip $(shell grep asset_tag environment.yaml|cut -d ':' -f 2))

.PHONY: all tests snapshots push_assets assets
DEFAULT: tests

# run the tests
${VENVDIR}: requirements.txt
	virtualenv --no-site-packages venv
	${VENVDIR}/bin/pip install -r requirements.txt

all: tests

# from command line: 'make allTests' which will run all tests
# or: 'make allTests TEST_BROWSER=chrome TEST_ENVIRONMENT=qa' which tells sets the TEST_BROWSER and TEST_ENVIRONMENT variables
# or: 'make allTests TEST=tests/test_basic.py' which tells make to run only the tests in tests/test_basic.py
tests: ${VENVDIR}
	${VENVDIR}/bin/nosetests -s --tc-format=yaml --tc-file=environment.yaml --tc=environment:${TEST_ENVIRONMENT} --tc=browser:${TEST_BROWSER} --nocapture ${TEST}

# from command line: 'make tests'
# or: 'make tests TEST=.test_basic' note the period after the equal sign, which will run the test_basic method within the TestBasicInteractions class
basicTests: ${VENVDIR}
	${VENVDIR}/bin/nosetests -s --tc-format=yaml --tc-file=environment.yaml --tc=environment:${TEST_ENVIRONMENT} --tc=browser:${TEST_BROWSER} --nocapture tests/test_basic.py:TestBasicInteractions${TEST}

# from command line: 'make opTests'
# or: 'make tests TEST=.test_transfer' note the period after the equal sign, which will run the test_transfer method within the TestOperations class
opTests: ${VENVDIR}
    # from command line: make opTests
	${VENVDIR}/bin/nosetests -s --tc-format=yaml --tc-file=environment.yaml --tc=environment:${TEST_ENVIRONMENT} --tc=browser:${TEST_BROWSER} --nocapture tests/test_operations.py:TestOperations${TEST}


# FOR NOW ONLY - to automatically promote images to be blessed
bless:
	rsync -avH ${ASSET_DIR}.to.bless/* ${ASSET_DIR}

snapshots: ${VENVDIR}
	BASELINE=1 ${VENVDIR}/bin/nosetests --tc-format=yaml --tc-file=environment.yaml --tc=environment:${TEST_ENVIRONMENT} --nocapture ${TEST}

# fetch the assets from s3
assets: ${VENVDIR}
	@mkdir -p ${ASSET_DIR}
	${VENVDIR}/bin/s3cmd --access_key=$(AWS_ACCESS_KEY) --secret_key=${AWS_SECRET_KEY} get --recursive --force s3://integrationassets/${ASSET_TAG}/ ${ASSET_DIR}

# push the assets to s3
RUNDATE:=$(strip $(shell date +%Y%m%d.%H%M))
push_assets: ${VENVDIR}
	@echo "Pushing assets to tag ${RUNDATE}"
	@${VENVDIR}/bin/s3cmd --access_key=$(AWS_ACCESS_KEY) --secret_key=${AWS_SECRET_KEY} put -q --recursive ${ASSET_DIR}/* s3://integrationassets/${RUNDATE}/
	@echo "Updating asset_tag in environment.yaml"
	sed -i 's/${ASSET_TAG}/${RUNDATE}/g' environment.yaml
	@echo "Checking environment.yaml into the repo"
	@git add environment.yaml
	@git commit -m 'Integration tests - updating asset tag in environment.yaml'
	@echo "Please test, and push your repository upstream"

clean:
	rm -rf ${VENVDIR}
	rm -rf nosetests.xml

distclean: clean
	rm -rf ${ASSET_DIR}
	rm -rf ${ASSET_DIR}.to.bless

lint:
	@${VENVDIR}/bin/flake8 --exclude='${VENVDIR}/**' --ignore=E501
