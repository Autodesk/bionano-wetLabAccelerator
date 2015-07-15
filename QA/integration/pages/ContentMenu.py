import time

import helpers
from pages import Page
from selenium.webdriver.common.by import By

MENU_TRIGGER = (By.ID, "menu-trigger")

CONTENT_MENU_XPATH    = (By.XPATH, "//label[@for='menu-trigger']")
NEW_PROTOCOL_XPATH    = (By.XPATH, "//a[@class='new-protocol-button']")
PROTOCOL_MENU_LIST_ITEMS = (By.XPATH, "//a[contains(@class, 'contentMenu-item') and contains(@ng-bind, 'protocol')]")
RUN_MENU_LIST_ITEMS = (By.XPATH, "//a[contains(@class, 'contentMenu-item') and contains(@ng-bind, 'run')]")

SIDE_PANEL = (By.CLASS_NAME, "sidepanel")

class ContentMenu(Page):

    def __init__(self, driver):
        self.DRIVER = driver

    def open(self):
        self.click(self.getContentMenuButton(), "Content Menu")
        self.waitForElementVisible(NEW_PROTOCOL_XPATH)

    def addProtocol(self):
        time.sleep(2)
        self.click(self.findElement(NEW_PROTOCOL_XPATH), "New Protocol")
        self.waitForElement(SIDE_PANEL)

    def isOpen(self):
        return self.findElement(MENU_TRIGGER).get_attribute("checked") == 'true'

    def close(self):
        if self.isOpen():
            self.click(self.getContentMenuButton(), "close content menu")

    def openAndAddProtocol(self):
        if self.isOpen() == False:
            self.open()
        self.addProtocol()

    def getProtocolNames(self):
        if self.isOpen() == False:
            self.open()
        time.sleep(1)
        elementNames = []
        elements = self.findElements(PROTOCOL_MENU_LIST_ITEMS)
        #elements = self.findElements((By.CLASS_NAME, "contentMenu-item"))
        for element in elements:
            elementNames.append(element.text)
        return elementNames

    def getRunNames(self):
        if self.isOpen() == False:
            self.open()
        time.sleep(1)
        runNames = []
        elements = self.findElements(RUN_MENU_LIST_ITEMS)
        #elements = self.findElements((By.CLASS_NAME, "contentMenu-item"))
        for element in elements:
            runNames.append(element.text)
        return runNames

    def getContentMenuButton(self):
        return self.findElement(CONTENT_MENU_XPATH)

    def getAddProtocolButton(self):
        return self.findElement(NEW_PROTOCOL_XPATH)

    def containsProtocol(self, protocolName):
        return protocolName in self.getProtocolNames()

    def openProtocol(self, protocolName, retryCount = 10):
        self.DRIVER.refresh()
        attempt = 1
        while attempt != retryCount:
            if self.isOpen() == False:
                self.open()
            locator = (By.XPATH, "//a[contains(@class, 'contentMenu-item') and contains(@ng-bind, 'protocol') and text()='" + protocolName + "']")
            if self.elementExists(locator):
                print(protocolName + " found in content menu")
                self.click(self.findElement(locator), "click on protocol '" + protocolName + "' in content menu")
                protocolNameLocator = (By.XPATH, "//div[@class='protocol-info']/span[text()='" + protocolName + "']")
                time.sleep(1)
                self.waitForElement(protocolNameLocator)
                attempt = retryCount
            else:
                self.DRIVER.refresh()
                print(protocolName + " not found in content menu, retry # " + str(attempt))
                attempt += 1
                time.sleep(1)
                self.close()

    def containsRun(self, runName):
        return runName in self.getRunNames()

    def openRun(self, runName, retryCount = 3):
        attempt = 1
        while attempt != retryCount:
            if self.isOpen() == False:
                self.open()
            locator = (By.XPATH, "//a[contains(@class, 'contentMenu-item') and contains(@ng-bind, 'run') and text()='" + runName + "']")
            if self.elementExists(locator):
                #self.waitForElement(locator)
                self.click(self.findElement(locator), "click on run '" + runName + "' in content menu")
                attempt = retryCount
            else:
                attempt += 1
                time.sleep(1)
                self.close()


