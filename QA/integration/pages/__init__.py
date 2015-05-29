import os
import socket
import sys
import tempfile
import time
from testconfig import config
from helpers import environment

from PIL import Image
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys

from selenium.webdriver import ActionChains


class Page:
    """This is a generic page class. It makes certain methods accessible
    across pages, so that they can all compare images, toggle visibility, etc.
    """

    _HOSTNAME = socket.gethostname()
    ASSETS = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', _HOSTNAME))
    ASSETS_TO_BLESS = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets.to.bless', _HOSTNAME))
    ENVIRONMENTS = config['environments'][environment()]['uri_root']

    URL_POSTFIX = config['url_postfix']
    URL_PREFIX = os.environ.get('URL_PREFIX')
    TIMEOUT = 15

    if URL_PREFIX != None:
        BASE_URL = "http://" + URL_PREFIX + "." + URL_POSTFIX
    else:
        BASE_URL = ENVIRONMENTS

    REMOTE_URL = config['remoteWebDriverURL']

    def __init__(self, driver):
        self.DRIVER = driver
        print(self.BASE_URL)

    def action(self, actionDescription):
        print("  Action - " + actionDescription)

    def findElement(self, locatorTuple):
        return self.DRIVER.find_element(*locatorTuple)

    def findElements(self, locatorTuple):
        return self.DRIVER.find_elements(*locatorTuple)

    def findElementByXpath(self, xpath):
        return self.findElement((By.XPATH, xpath))

    def findElementById(self, id):
        return self.findElement((By.ID, id))

    def findElementByAttributeValue(self, elementType, attribute, value):
        return self.DRIVER.find_element_by_xpath("//" + elementType + "[@" + attribute + "='" + value + "']")

    def click(self, element, description):
        self.action("click on " + description + " element: " + element.tag_name + " class: " + element.get_attribute("class"))
        if isinstance(element, tuple):
            element = self.findElement(element)

        element.location_once_scrolled_into_view
        element.click()

    def waitForElementByClassName(self, className):
        return self.waitForElement((By.CLASS_NAME, className))

    def waitForElementById(self, id):
        return self.waitForElement((By.ID, id))

    def waitForElementByXpath(self, xpath):
        return self.waitForElement((By.XPATH, xpath))

    def waitForElement(self, locatorTuple):
        try:
            # print("    waiting for element: " + str(locatorTuple))
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.presence_of_element_located(locatorTuple))
            return True
        except TimeoutException:
            print("time out waiting for element: " + str(locatorTuple))
            return False

    def waitForElementVisible(self, locatorTuple):
        element = self.findElement(locatorTuple)
        try:
            # print("    waiting for element: " + str(locatorTuple) + " to be visible")
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.visibility_of(element))
            return True
        except TimeoutException:
            print("time out waiting for element: " + str(locatorTuple))
            return False

    def setField(self, element, value, description = "textfield"):
        self.action("set " + description + " to " + value)
        element.send_keys(value)
        element.send_keys(Keys.ENTER)

    def dragAndDrop(self, source, target, descriptionSource, descriptionTarget):
        self.action("drag " + descriptionSource + " to " + descriptionTarget)
        actionChains = ActionChains(self.DRIVER)
        actionChains.drag_and_drop(source, target).perform()

    def toggle_visibility_by_class(self, classname):
        """Toggle the visibility of the object by a classname selector.
        This sets the CSS visbility value on the object, basically triggering a show
        and hide"""
        o = self.DRIVER.find_element_by_class_name(classname)
        if o.is_displayed():
            v = "hidden"
        else:
            v = "visible"
        script = "document.getElementsByClassName('%s')[0].style.visibility = '%s';" % (classname, v)
        self.DRIVER.execute_script(script)
        time.sleep(2)

    def hide_visibility_by_class(self, classname):
        """Actively hide the object"""
        script = "document.getElementsByClassName('%s')[0].style.visibility = 'hidden';" % classname
        self.DRIVER.execute_script(script)
        # alas, the browser can return is_displayed() prior to the hide :(
        time.sleep(2)
        
    def hide_visibility_by_id(self, id):
        """Actively hide the object"""
        script = "document.getElementsById('%s')[0].style.visibility = 'hidden';" % id
        self.DRIVER.execute_script(script)
        # alas, the browser can return is_displayed() prior to the hide :(
        time.sleep(2)


    def containsClass(self, element, className):
        return className in element.get_attribute('class').split(" ")

    def snapshot(self, dest=None):
        """Take a snapshot of the browser's viewport"""
        if dest:
            filename = dest
            if not os.path.isdir(os.path.dirname(filename)):
                os.makedirs(os.path.dirname(filename))
        else:
            filename = tempfile.mktemp()
        # no need to delete - python templib is good enough
        self.DRIVER.save_screenshot(filename)
        return filename

    def get_baseline(self, prefix=None):
        """For the specified test, find the baseline image"""
        if prefix:
            image_dir = os.path.abspath(os.path.join(self.ASSETS, prefix))
            blessed_image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, prefix))
        else:
            image_dir = os.path.abspath(os.path.join(self.ASSETS, self.DOCUMENT_NAME))
            blessed_image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, self.DOCUMENT_NAME))

        # just in case browsers break their own values - lower()
        version = self.DRIVER.capabilities['version'].lower()
        browser = self.DRIVER.capabilities['browserName'].lower()
        system = sys.platform

        base_image = 'baseline.png'
        os_version_specific_image = '%s-%s-%s.png' % (browser, version, system)
        os_specific_image = '%s-%s.png' % (browser, system)
        version_specific_image = '%s-%s.png' % (browser, version)
        os_browser_specific_image = '%s-%s.png' % (browser, system)
        browser_specific_image = '%s.png' % browser

        # first the blessed images
        if os.path.isfile(os.path.join(blessed_image_dir, os_version_specific_image)):
            return os.path.join(blessed_image_dir, os_version_specific_image)
        elif os.path.isfile(os.path.join(blessed_image_dir, version_specific_image)):
            return os.path.join(blessed_image_dir, version_specific_image)
        elif os.path.isfile(os.path.join(blessed_image_dir, os_browser_specific_image)):
            return os.path.join(blessed_image_dir, os_browser_specific_image)
        elif os.path.isfile(os.path.join(blessed_image_dir, os_specific_image)):
            return os.path.join(blessed_image_dir, os_specific_image)
        elif os.path.isfile(os.path.join(blessed_image_dir, browser_specific_image)):
            return os.path.join(blessed_image_dir, browser_specific_image)

        # fine, the unblessed
        if os.path.isfile(os.path.join(image_dir, os_version_specific_image)):
            return os.path.join(image_dir, os_version_specific_image)
        elif os.path.isfile(os.path.join(image_dir, version_specific_image)):
            return os.path.join(image_dir, version_specific_image)
        elif os.path.isfile(os.path.join(image_dir, os_browser_specific_image)):
            return os.path.join(image_dir, os_browser_specific_image)
        elif os.path.isfile(os.path.join(image_dir, os_specific_image)):
            return os.path.join(image_dir, os_specific_image)
        elif os.path.isfile(os.path.join(image_dir, browser_specific_image)):
            return os.path.join(image_dir, browser_specific_image)

        if not os.path.isfile(os.path.join(image_dir, base_image)) and not os.path.isfile(os.path.join(blessed_image_dir, base_image)):
            e = "No images (or baseline) exist for this test."
            raise AssertionError, e

        if os.path.isfile(os.path.join(blessed_image_dir, base_image)):
            return os.path.join(blessed_image_dir, base_image)
        else:
            return os.path.join(image_dir, base_image)

    def compare(self, prefix=None):
        """The money shot - take two images and compare them - returning their comparison
        value"""
        try:
            if os.environ['BASELINE']:
                version = self.DRIVER.capabilities['version'].lower()
                browser = self.DRIVER.capabilities['browserName'].lower()
                system = sys.platform
                print ""
                if prefix:
                    image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, prefix))
                else:
                    image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, self.DOCUMENT_NAME))
                os_version_specific_image = os.path.join(image_dir, '%s-%s-%s.png' % (browser, version, system))
                self.snapshot(os_version_specific_image)
                print "OS Version: " + os_version_specific_image
                return
        except KeyError:
            pass
        thisone = self.snapshot()
        baseline = self.get_baseline(prefix)
        
        this_image = Image.open(thisone)
        base_image = Image.open(baseline)
        
        d_i = this_image.getdata()
        d_i2 = base_image.getdata()
        if len(d_i) != len(d_i2):
            # the interpreter should unlink the image anyways - but safety
            try:
                os.unlink(thisone)
            except:
                pass
            raise AssertionError, "Images are not of the same size!"

        # l2 mean
        ed = sum((_d[0] - _d2[0]) ** 2 + (_d[0] - _d2[0]) ** 2 + (_d[0] - _d2[0]) ** 2 for _d, _d2 in zip(d_i, d_i2))
        comparison = ed / len(d_i)
        return comparison


