import time

import helpers
from pages import Page
from selenium.webdriver.common.by import By

MENU_TRIGGER = (By.ID, "menu-trigger")

CONTENT_MENU_XPATH    = (By.XPATH, "//label[@for='menu-trigger']")
NEW_PROTOCOL_XPATH    = (By.XPATH, "//a[@class='new-protocol-button']")
PROTOCOL_MENU_LIST_ITEMS_XPATH = (By.XPATH, "//a[@class='contentMenu-item ng-binding' and @ng-bind='protocol.metadata.name' and text()]")
SIDE_PANEL = (By.CLASS_NAME, "sidepanel")

class ContentMenu(Page):

    def __init__(self, driver):
        self.DRIVER = driver

    def open(self):
        self.click(self.getContentMenuButton(), "content menu")
        self.waitForElementVisible(NEW_PROTOCOL_XPATH)

    def addProtocol(self):
        time.sleep(2)
        self.click(self.findElement(NEW_PROTOCOL_XPATH), "add protocol")
        self.waitForElement(SIDE_PANEL)

    def isOpen(self):
        return self.findElement(MENU_TRIGGER).get_attribute("checked") == 'true'

    def openAndAddProtocol(self):
        if self.isOpen() == False:
            self.open()
        self.addProtocol()

    def getProtocolNames(self):
        elementNames = []
        elements = self.findElements(PROTOCOL_MENU_LIST_ITEMS_XPATH)
        for element in elements:
            elementNames.append(element.text)
        return elementNames

    def getContentMenuButton(self):
        return self.findElement(CONTENT_MENU_XPATH)

    def getAddProtocolButton(self):
        return self.findElement(NEW_PROTOCOL_XPATH)


