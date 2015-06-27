import os
import logging
import sys
from unittest import TestCase
from nose.plugins.attrib import attr
from testconfig import config
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class _BaseTest(TestCase):
    """Base test class that all tests descend from.
    Basically, it's used to set down the browser driver"""
    
    def setUp(self, driver):
        env = self.environment()
       #print("os.environ['TEST_BROWSER']: " + os.environ['TEST_BROWSER'])
        browser = config['browser']
        if browser == "chrome":
            self.setUpChrome()
        if browser == "firefox":
            self.setupFF()
        if browser == "ie":
            self.setupIE()
        if browser == "remote":
            self.setupRemote()
        print("\nbrowser: " + browser)

    def environment(self):
        """Return the environment for this test. This allows us to specify
        from outside the test engine, the test environment (production, staging, etc)"""
        try:
            env = os.environ['TEST_ENVIRONMENT']
        except KeyError:
            print("environ except")
            env = config['environment']

        return env

    def assertSameImage(self, page, prefix=None):
        """Assert that the images are the same by performing an l2 mean. Worst case
        raise the same exceptions you'd expect from anything in unittest"""
        compared_value = page.compare(prefix)

        # just in case browsers break their own values - lower()
        version = self.DRIVER.capabilities['version'].lower()
        browser = self.DRIVER.capabilities['browserName'].lower()
        system = sys.platform

        browser_os_version_specific_key = '%s-%s-%s' % (browser, version, system)
        browser_os_specific_key = '%s-%s' % (browser, system)
        browser_version_specific_key = '%s-%s' % (browser, version)
        browser_specific_key = '%s' % browser

        # find the appropriate override for tolerance value (on a per image basis)
        # if specified overrides don't exist, then we use the stock tolerance
        tolerance = config['default_tolerance']
        try:
            tolerance = config[page.DOCUMENT_NAME]['tolerance'][browser_os_version_specific_key]
        except KeyError:
            pass

        try:
            tolerance = config[page.DOCUMENT_NAME]['tolerance'][browser_version_specific_key]
        except KeyError:
            pass

        try:
            tolerance = config[page.DOCUMENT_NAME]['tolerance'][browser_os_specific_key]
        except KeyError:
            pass

        try:
            tolerance = config[page.DOCUMENT_NAME]['tolerance'][browser_specific_key]
        except KeyError:
            pass

        if compared_value > tolerance:
            err = "These images are not the same! (comparison value %d - tolerance %d)" % (compared_value, tolerance)
            raise AssertionError, err

    def assertNotSameImage(self, page, prefix=None):
        """Logically, testing that images are not the same involves a negation on testing
        that images are the same"""
        try:
            self.assertSameImage(page, prefix)
            raise AssertionError("The images are the same!")
        except AssertionError:
            pass

    def assertExists(self, o):
        """Ensure the specific webdriver object exists"""
        self.assertNotEquals(o.__dict__['_id'], None)

    def get_token(self):
        """Use the token API to fetch a token for use in our tests"""
        if getattr(self, 'token', None):
            return self.token

        try:
            try:
                self.token = config['environments'][self.environment()]['token']
            except:
                self.token = config['token']
            return self.token
        except:
            pass

        # for the future, to generate tokens
        env = config['environment'].capitalize()
        ckey = config['environments'][self.environment()]['consumerkey']
        csec = config['environments'][self.environment()]['consumersecret']
        login = config['environments'][self.environment()]['login']
        password = config['environments'][self.environment()]['password']

        tokenjar = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Selenium_Tests', 'TestHelpers', 'CreateToken-1.0.jar'))

        cmd = "java -jar %s -consumerkey=%s -consumersecret=%s -login=%s -password=%s -environment=%s" % (tokenjar, ckey, csec, login, password, env)
        _token = os.popen(cmd).read().strip().split("\n")
        token = _token[0].split('=')[1] + "="

        self.token = token
        return self.token

    def tearDown(self):
        self.DRIVER.quit()

    def setupFF(self):
        self.DRIVER = webdriver.Firefox()
        self.setWindowSize()
        selenium_logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
        selenium_logger.setLevel(logging.WARNING)
        
    def setupIE(self):
        """Bring in the Internet Explorer driver"""
        self.DRIVER = webdriver.Ie()
        
    def __init_(self):
        _BaseTest.__init__(self)

    def setUpChrome(self):
        chromedriver = config['chromedriver']
        os.environ["webdriver.chrome.driver"] = chromedriver
        #self.DRIVER = webdriver.Chrome(chromedriver)
        self.DRIVER = webdriver.Chrome()

        self.setWindowSize()

        # shut off the massive debug logging
        # TODO find a way to keep this DRY across browsers
        selenium_logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
        selenium_logger.setLevel(logging.WARNING)

    def setupRemote(self):
        self.DRIVER = webdriver.Remote(
            command_executor=config['remoteWebDriverURL'] + ':4444/wd/hub',
            desired_capabilities=DesiredCapabilities.CHROME
        )
        self.setWindowSize()

    def setWindowSize(self):
        width = config['viewport']['width']
        height = config['viewport']['height']
       # print("setting browser window size to: " + str(width) + "," + str(height))
       #  self.DRIVER.maximize_window()
        self.DRIVER.set_window_size(width, height)

class _BaseFirefoxTest(_BaseTest):
    """For firefox tests, the driver"""

    def __init_(self):
        _BaseTest.__init__(self)

    def setUp(self):
        self.DRIVER = webdriver.Firefox()

        width = config['viewport']['width']
        height = config['viewport']['height']
        self.DRIVER.set_window_size(width, height)

        # shut off the massive debug logging
        # TODO find a way to keep this DRY across browsers
        selenium_logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
        selenium_logger.setLevel(logging.WARNING)

class _BaseChromeTest(_BaseTest):
    """For firefox tests, the driver"""

    def __init_(self):
        _BaseTest.__init__(self)
        print('using chrome driver')

    def setUp(self):
        chromedriver = config['chromedriver']
        os.environ["webdriver.chrome.driver"] = chromedriver
        self.DRIVER = webdriver.Chrome(chromedriver)

        width = config['viewport']['width']
        height = config['viewport']['height']
        self.DRIVER.set_window_size(width, height)

        # shut off the massive debug logging
        # TODO find a way to keep this DRY across browsers
        selenium_logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
        selenium_logger.setLevel(logging.WARNING)

class _BaseIETest(_BaseTest):
    """Bring in the Internet Explorer driver"""

    def __init__(self):
        _BaseTest.__init__(self)

    def setUp(self):
        self.DRIVER = webdriver.Ie()


class _BaseRemoteTest(_BaseTest):
    def __init__(self):
        _BaseTest.__init__(self)

    def setup(self):
        self.DRIVER = webdriver.Remote(
            command_executor='http://192.168.137.1:4444/wd/hub',
            desired_capabilities=DesiredCapabilities.CHROME
        )

