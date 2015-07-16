import time
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://wla-qa.dokku.bionano.autodesk.com")




from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import WebDriverException
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
TIMEOUT = 15

def findElement(locatorTuple):
    try:
        return driver.find_element(*locatorTuple)
    except Exception as e:
        print("could not find element by " + locatorTuple[0] + ": " + locatorTuple[1])
        raise e

def waitForElement(driver, locatorTuple, timeout = TIMEOUT, description = None ):
    try:
        # print("    waiting for element: " + str(locatorTuple))
        # time.sleep(timeout)
        #print("timeout " + str(timeout))
        WebDriverWait(driver, timeout).until(
            expected_conditions.presence_of_element_located(locatorTuple))
        return True
    except WebDriverException:
        if description != None and description != "":
            print("time out waiting for " + description + ", locator: " + str(locatorTuple))
        else:
            print("time out waiting for element: " + str(locatorTuple))
        return False

def waitForElementClickable(driver, locatorTuple, timeout = TIMEOUT, description = None):
    try:
        # print("    waiting for element: " + str(locatorTuple))
        # time.sleep(timeout)
        #print("timeout " + str(timeout))
        WebDriverWait(driver, timeout).until(
            expected_conditions.element_to_be_clickable(locatorTuple))
        return True
    except WebDriverException:
        if description != None and description != "":
            print("time out waiting for " + description + ", locator: " + str(locatorTuple))
        else:
            print("time out waiting for element: " + str(locatorTuple))
        return False


def setField(element, value, description):
    print("setting input field " + description + " to: " + value)
    element.send_keys(value)


def setProtocolMetadata(name, description = None, tags = None):
    protocolNameLocator = (By.XPATH, "//div[@class='protocol-info']/span")
    waitForElement(driver, protocolNameLocator)
    findElement(protocolNameLocator).click()
    protocolModalXpath = (By.XPATH, "//div[@class='modal-dialog']//*[contains(@class,'modal-title')]")
    waitForElement(driver, protocolModalXpath)
    #if waitForElementClickable(driver, protocolModalXpath):
    nameXpath = (By.XPATH, "//input[@ng-model='restyleCtrl.currentProtocol.metadata.name']")
    descriptionXpath = (By.XPATH, "//input[@ng-model='restyleCtrl.currentProtocol.metadata.description']")
    tagsXpath = (By.XPATH, "//input[@ng-model='restyleCtrl.currentProtocol.metadata.tags']")
    setField(findElement(nameXpath),name, "name")
    if description:
        setField(findElement(descriptionXpath), description, "description")
    if tags:
        setField(findElement(tagsXpath), tags, "tags")
    modalCloseXpath = (By.XPATH, "//div[@class='modal-heading']/*[text()='Protocol Metadata']/../../span[@class='modal-close']")
    findElement(modalCloseXpath).click()


def setModalField(modalDialogTitle, fieldName, fieldValue):
    modalDialogLocator = (By.XPATH, "//div[@class='modal-heading']/*[text()='" + modalDialogTitle + "']/../..")
    modalDialog = driver.find_element(*modalDialogLocator)

    locator = (By.XPATH, ".//td[text()='" + fieldName + "']/..//input")
    field = modalDialog.find_element(*locator)
    field.send_keys(fieldValue)

driver = webdriver.Chrome()
driver.get("http://wla-qa.dokku.bionano.autodesk.com")




WELCOME_SPLASH_SCREEN_XPATH = (By.XPATH, "//h3[text()=\"Welcome! Let's get started.\"]")
waitForElement(driver, WELCOME_SPLASH_SCREEN_XPATH)

clearSplashScreenLocator = (By.LINK_TEXT, "Thanks for the info. I'm ready to start.")

findElement(clearSplashScreenLocator).click()



setProtocolMetadata("foobar", "test description", "test tags abc, efg")
