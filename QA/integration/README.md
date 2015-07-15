# Understanding the Test Runner

Browser based testing for WLA uses the combination of [selenium](http://selenium-python.readthedocs.org/en/latest/) and python's standard [unittest](https://docs.python.org/2/library/unittest.html) library, and is wrapped by the [nose test runner](http://nose.readthedocs.org).

## How It Works

The test framework runs individual tests in the specified browser or the default browser set in environment.yaml

The following high-level targets have been exposed through make:

* tests - Run the tests

the make targets below are legacy from Large Model Viewer, not used in WLA
* assets - Fetch the binary assets (images) used in comparison, from s3
* push_assets - When generating assets, place the newly created assets in s3. This target will even update the local configuration file, and commit it to the repository.
* snapshots - Create snapshots of the underlying tests, for comparison
* bless - Copy all of the images from the images to be blessed folder - into the assets tree.

### Installing Components

Component installation is controlled by the requirements.txt file in this directory.  To create an isolated environment (a [virtualenv](http://virtualenv.readthedocs.org/), and activate it, run the commands below:

* Install virtualenv if you do not have it:

    ```sudo pip install virtualenv```

* Install all other required packages:

    ```make venv```

### Running Tests

With the _Makefile_ in place the full test suite can be orchestrated from Make.

* Run all tests using default settings from the Makefile

    ```make tests```

* Run all tests using specific browser (firefox) and test environment qa. The test environment is defined in the environment.yaml

    ```make tests TEST_BROWSER=firefox TEST_ENVIRONMENT=qa```

* Run tests from a specific test file

    ```make tests TEST=tests/test_basic.py```

* Run tests from a specific test file, specific browser and test environment

    ```make tests TEST=tests/test_basic.py TEST_BROWSER=firefox TEST_ENVIRONMENT=qa```

* Run specific test method test_transfer() from class TestOperations in test_operations.py

    ```make tests TEST=tests/test_operations.py:TestOperations.test_transfer```

* Run tests within test_basic.py, using the basicTests target defined in the Makefile

    ```make basicTests```

* Run tests within test_operations.py using the opTests target defined in the Makefile

    ```make opTests```

you can see additional documentation in the Makefile itself.

## Writing Tests

The unit test framework instantiates the browser set in the environment.yaml or the browser as specified by the TEST_BROWSER variable.
Below is an example of a TestCase with multiple tests, notice that it inherits from TestBase.

all methods defined within the class that start with test_ are considered tests and will be run.

```
  import tests.Base as Base
  import datetime

  class TestBasic(TestBase):

    def test_loading_google(self):
        self.driver.get('http://www.google.com')

    def test_random_page_load(self):
        start = datetime.datetime.now()
        self.driver.get('http://www.autodesk.com')
        end = datetime.datetime.now()
        self.assertTrue((end-start).seconds < 2)```



#### Running Tests using Nose

As nose runs all tests, the following is quick documentation around limiting tests - i.e running tests only against the targetted use case.

* Run chrome specific tests:

    ```nosetests -v -a browser='chrome'```

* Run firefox specific tests:

    ```nosetests -v -a browser='firefox'```

* Run all tests that should be in firefox (i.e. firefox specific tests, and cross browser tests):

    ```nosetests -v -a browser='firefox' -a '!browser'```

* Testing no-op, list tests that would be run:

    ```nosetests -v --collect-only```

#### Running Specific Tests with Nose

* To run all tests in a class - run the 'pythonic (Python Importable)' path to the class.

    eg: ```nosetests --tc-format=yaml --tc-file=environment.yaml --nocapture tests.test_toolbar_and_friends

* To run a specific test in a class do the above, inserting a colon (:) as the class.method separator.

    eg: ```nosetests --tc-format=yaml --tc-file=environment.yaml --nocapture tests.test_toolbar_and_friends:TestToolBarAndFriends.test_toolbar_exists

* Alternatively, you can do either of the above, by passing the last element in as the TEST variable to a make call:

   eg: make tests TEST=tests.test_toolbar_and_friends:TestToolBarAndFriends.test_toolbar_exists

   eg: make snapshots TEST=tests.test_toolbar_and_friends:TestToolBarAndFriends.test_toolbar_exists
