# Understanding the Test Runner

Browser based testing for firefly.js uses the combination of [selenium](http://selenium-python.readthedocs.org/en/latest/) and python's standard [unittest](https://docs.python.org/2/library/unittest.html) library, and is wrapped by the [nose test runner](http://nose.readthedocs.org).

## How It Works

The test framework runs individual tests in their target browsers. Tests themselves can compare images, interact with the browser, and generally assert values.  The framework is based on python's [unittest framework](https://docs.python.org/2/library/unittest.html), combined with [webdriver](http://selenium-python.readthedocs.org/en/latest/api.html).

The following high-level targets have been exposed through make:

* assets - Fetch the binary assets (images) used in comparison, from s3
* push_assets - When generating assets, place the newly created assets in s3. This target will even update the local configuration file, and commit it to the repository.
* snapshots - Create snapshots of the underlying tests, for comparison
* tests - Run the tests
* bless - Copy all of the images from the images to be blessed folder - into the assets tree.

### Installing Components

Component installation is controlled by the requirements.txt file in this directory.  To create an isolated environment (a [virtualenv](http://virtualenv.readthedocs.org/), and activate it, run the commands below:

* Install virtualenv if you do not have it:

    ```sudo pip install virtualenv```

* Install all other required packages:

    ```make venv```

### Running Tests

With the _Makefile_ in place the full test suite can be orchestrated from Make. When you run the tests for the first time, you will need to
fetch all baseline images for comparison. In order to do it type:

 ```make assets```

That will copy images from aws S3 storage to your local machine.

Then, you can run the tests by typing:

 ```make tests```

## Writing Tests

The unit test framework instantiates the appropriate browser, based on the the target platform. In other words, tests that inherit from the *_BaseFirefoxTest* class will run in Firefox, whereas tests classes that inherit from *_BaseTest* will run in all browsers.

Below is an example of a TestCase with multiple tests, that limits to Firefox. Notice the reliance on *_BaseFirefoxTest_.

```
  import tests.Base as Base
  import datetime

  class TestHomeFF(Base._BaseFirefoxTest):

    def test_loading_google(self):
        self.driver.get('http://www.google.com')

    def test_random_page_load(self):
        start = datetime.datetime.now()
        self.driver.get('http://www.autodesk.com')
        end = datetime.datetime.now()
        self.assertTrue((end-start).seconds < 2)```

## Managing Assets

Ultimately the test framework compares assets against a set of known good assets. As a result the frequent need arises to generate new assets (images) for comparison.  The _compare_ function, part of the _assertSameImage_ assertion handles creating snapshots of the associated images. Images, once compared need to be **blessed**, placed in the assets tree, and sent upstream for sharing.

When pushed to S3, assets are 'tagged' using the date and time of the push. That 'tag' is inserted by Make into the environment.yaml file. The file is added to get, and needs to be pushed upstream.

 * _make push-assets_ - Running this command will tag the assets, and push them upstream to S3
 * _make assets_ - This allows anyone to fetch the newly pushed assets to S3.f


#### Running tests using make

You can use make from the command line to run various tests.

* Run all tests using default settings from the Makefile
    ```make allTests```

* Run all tests using specific browser (firefox) and test environment qa. The test environment is defined in the environment.yaml
    ```make allTests TEST_BROWSER=firefox TEST_ENVIRONMENT=qa```

* Run tests from a specific test file
    ```make allTests TEST=tests/test_basic.py```

* Run tests from a specific test file, specific browser and test environment
    ```make allTests TEST=tests/test_basic.py TEST_BROWSER=firefox TEST_ENVIRONMENT=qa```

* Run specific test method test_transfer() from class TestOperations in test_operations.py
    ```make allTests TEST=tests/test_operations.py:TestOperations.test_transfer```

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
