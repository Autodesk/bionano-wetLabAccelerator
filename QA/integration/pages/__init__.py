import os
import socket
import sys
import tempfile
import time
from testconfig import config
from helpers import environment

from PIL import Image
from selenium.common.exceptions import WebDriverException
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import InvalidElementStateException
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

    if URL_PREFIX != None and URL_PREFIX != "":
        BASE_URL = "https://" + URL_PREFIX + "." + URL_POSTFIX
    else:
        BASE_URL = ENVIRONMENTS

    REMOTE_URL = config['remoteWebDriverURL']

    def __init__(self, driver):
        self.DRIVER = driver

    def action(self, actionDescription):
        if actionDescription != None:
            print("  Action - " + actionDescription)

    def error(self, message):
        print("  ERROR - " + message)

    def raiseException(self, message):
        print("  EXCEPTION - " + message)
        raise Exception(message)


    ## finds element using the locator tuple in the form of (By.XPATH, "//div[@class='foo']")
    ## optionally takes parent element which is a webElement
    ## returns a WebElement or exception occurs if not found
    def findElement(self, locatorTuple, parentElement = None):
        message = "could not locate element by " + locatorTuple[0] + ": " + locatorTuple[1]
        try:
            self.waitForElement(locatorTuple, 15)
            #time.sleep(2)
            if parentElement.__class__.__name__ == "WebElement":
                message = "could not locate child element of " + self.getElementAttributes(parentElement) + " by: " + locatorTuple[0] + ": " + locatorTuple[1]
                element = parentElement.find_element(*locatorTuple)
            else:
                element = self.DRIVER.find_element(*locatorTuple)


            #print(self.getElementAttributes(element))
            return element
        except WebDriverException as e:
            self.raiseException(message + e.message)

    # def findBNElement(self, locatorTuple, description = None):
    #     return BNWebElement(self.findElement(locatorTuple), description)

    def findElements(self, locatorTuple, parentElement = None):
        message = "could not locate elements by " + locatorTuple[0] + ": " + locatorTuple[1]
        try:
            if parentElement.__class__.__name__ == "WebElement":
                message = "could not locate child elements of " + self.getElementAttributes(parentElement) + " by " + locatorTuple[0] + ": " + locatorTuple[1]
                elements = parentElement.find_elements(*locatorTuple)
            else:
                elements = self.DRIVER.find_elements(*locatorTuple)
            return elements
        except WebDriverException as e:
            self.raiseException(message + e.message)


    def findElementByAttributeValue(self, elementType, attribute, value):
        return self.DRIVER.find_element_by_xpath("//" + elementType + "[@" + attribute + "='" + value + "']")


    ## takes a WebElement or locator tuple in the form of((By.XPATH, "//div[@class='fii']"))
    ## if tuple then uses findElement(locatorTuple) to return a WebElement
    ## otherwise returns element WebElement
    def elementOrLocatorTupleToElement(self, elementOrLocatorTuple):
        if isinstance(elementOrLocatorTuple, tuple):
            element = self.findElement(elementOrLocatorTuple)
        elif elementOrLocatorTuple.__class__.__name__ == "WebElement":
            element = elementOrLocatorTuple
        return element

    def findChildElement(self, element, locatorTuple):
        return element.find_element(locatorTuple)

    def elementExists(self, locatorTuple, parentElement = None):
        try:
            if parentElement.__class__.__name__ == "WebElement":
                element = parentElement.find_element(*locatorTuple)
            else:
                element = self.DRIVER.find_element(*locatorTuple)
        except NoSuchElementException:
            return False

        return element.is_displayed()

    def click(self, elementOrLocatorTuple, description):
        # if elementOrLocatorTuple variable is a locator tuple, ie (By.ID, "foobar") convert it to a WebElement
        element = self.elementOrLocatorTupleToElement(elementOrLocatorTuple)
        attributes = self.getElementAttributes(element)
        actionDescription = None
        if description != None:
            actionDescription = "click on '" + description + "'"
            if description.lower().startswith("click") or description.lower().startswith("set "):
                actionDescription = description

        self.action(actionDescription)
        self.executeScript("window.scrollTo(0," + str(element.location['y']) + ")")
        element.click()


    def getElementAttributes(self, element):
        try:
            self.DRIVER = element.parent

            attributes = self.DRIVER.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', element)
            strAttributes = "<" + element.tag_name
            for key, value in attributes.iteritems():
                strAttributes = strAttributes + " " + key + "='" + value + "'"

            strAttributes = strAttributes + ">"
            return strAttributes
        except Exception  as e:
            print("error " + e.message + "\ngetting attributes for <" + element.tag_name + ">" + element.text + "</" + element.tag_name + ">")
            # self.error("could not get element attributes")
            return ""

    def executeScript(self, script):
        #self.action("executing script: '" + script + "'")
        self.DRIVER.execute_script(script)

    def waitForElementByClassName(self, className):
        return self.waitForElement((By.CLASS_NAME, className))

    def waitForElementById(self, id):
        return self.waitForElement((By.ID, id))

    def waitForElementByXpath(self, xpath):
        return self.waitForElement((By.XPATH, xpath))

    def waitForElement(self, locatorTuple, timeout = TIMEOUT, description = None ):
        try:
            WebDriverWait(self.DRIVER, timeout).until(
                expected_conditions.presence_of_element_located(locatorTuple))
            return True
        except WebDriverException:
            if description != None and description != "":
                print("time out waiting for " + description + ", locator: " + str(locatorTuple))
            else:
                print("time out waiting for element: " + str(locatorTuple))
            return False

    def waitForElementVisible(self, locatorTuple):
        element = self.findElement(locatorTuple)
        try:
            # print("    waiting for element: " + str(locatorTuple) + " to be visible")
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.visibility_of(element))
            return True
        except WebDriverException:
            print("time out waiting for element: " + str(locatorTuple))
            return False

    def waitForElementClickable(self, locatorTuple):
        try:
            # print("    waiting for element: " + str(locatorTuple) + " to be visible")
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.element_to_be_clickable(locatorTuple))
            return True
        except WebDriverException:
            print("time out waiting for element: " + str(locatorTuple))
            return False

    def setField(self, elementOrLocatorTuple, value, description = "textfield"):
        element = self.elementOrLocatorTupleToElement(elementOrLocatorTuple)
        #self.waitForElementClickable(element)
        self.action("set " + description + " to '" + str(value) + "'")
        element.clear()
        element.send_keys(value)
        element.send_keys(Keys.TAB)


    def dragAndDrop(self, source, target, descriptionSource, descriptionTarget):
        self.action("drag " + descriptionSource + " to " + descriptionTarget)
        actionChains = ActionChains(self.DRIVER)
        actionChains.drag_and_drop(source, target).perform()

    def closeModal(self, modalDialogElement):
        modalDialogElement.find_element(By.CLASS_NAME, "modal-close").click()

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

    def isDisplayed(self, elementOrLocatorTuple):
        return self.elementOrLocatorTupleToElement(elementOrLocatorTuple).is_displayed()

    def snapshot(self, dest = None):
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
            raise (AssertionError, e)

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
                if prefix:
                    image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, prefix))
                else:
                    image_dir = os.path.abspath(os.path.join(self.ASSETS_TO_BLESS, self.DOCUMENT_NAME))
                os_version_specific_image = os.path.join(image_dir, '%s-%s-%s.png' % (browser, version, system))
                self.snapshot(os_version_specific_image)
                print("OS Version: " + os_version_specific_image)
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
            raise(AssertionError, "Images are not of the same size!")

        # l2 mean
        ed = sum((_d[0] - _d2[0]) ** 2 + (_d[0] - _d2[0]) ** 2 + (_d[0] - _d2[0]) ** 2 for _d, _d2 in zip(d_i, d_i2))
        comparison = ed / len(d_i)
        return comparison

