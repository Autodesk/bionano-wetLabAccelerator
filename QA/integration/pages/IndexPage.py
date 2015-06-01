import time

import helpers
from pages import Page
from selenium.webdriver.common.by import By


PROTOCOL_LINK_XPATH   = (By.XPATH, "//a[text()='PROTOCOL']")
RESULTS_LINK_XPATH    = (By.XPATH, "//a[text()='RESULTS']")
LOGO_XPATH            = (By.XPATH, "//a[@class='logo']")
SIGN_IN_LINK_XPATH    = (By.XPATH, "//a[@href='#/auth']")
LOGIN_BUTTON_XPATH    = (By.XPATH, "//button[text()='Log In']")
LOGOUT_BUTTON_XPATH   = (By.XPATH, "//button[text()='Logout']")
WELCOME_TEXT_XPATH    = (By.XPATH, "//p[@class='ng-scope']")
EMAIL_FIELD_ID        = (By.ID, "fbEmail")
PASSWORD_FIELD_ID     = (By.ID, "fbPassword")
CONTENT_MENU_XPATH    = (By.XPATH, "//label[@for='menu-trigger']")
NEW_PROTOCOL_XPATH    = (By.XPATH, "//a[@class='new-protocol-button']")
CLOSE_MENU_XPATH      = (By.XPATH, "//label[@for='menu-trigger']/span")
PROTOCOL_MENU_LIST_ITEMS_XPATH = (By.XPATH, "//a[@class='contentMenu-item ng-binding' and @ng-bind='protocol.metadata.name' and text()]")

class IndexPage(Page):
    """A page object for the index page - the main viewer"""

    def __init__(self, driver, token):
        self.DRIVER = driver
        self.TOKEN = token
        Page.__init__(self, driver)

    def open(self):
        """Load the page"""
        uri = self.BASE_URL #+ "?document=%s&accessToken=%s&env=%s" % (self.DOCUMENT, self.TOKEN, helpers.environment().capitalize())
        print("opening url: " + uri)
        self.DRIVER.get(uri)



    def clickProtocol(self):
        self.click(self.getProtocolLink(), "protocol link")

    def openDemo(self):
        self.clickProtocol()
        self.waitForElement((By.LINK_TEXT, "load a demo"))
        self.click(self.findElement((By.LINK_TEXT, "load a demo")), "load a demo link")

    def clickTest(self):
        self.click(self.getResultsLink(), "results link")

    def clickSignIn(self):
        self.click(self.getSignInLink(), "sign in link")
        self.waitForElementById("fbEmail")

    def signIn(self, email, password):
        self.clickSignIn()
        self.setEmail(email)
        self.setPassword(password)
        self.click(self.getLoginButton(), "Log In Button")
        time.sleep(5)
        return self.getLogoutButton().is_displayed()

    def clickContentMenu(self):
        # TODO implement this function
        return self.click(CONTENT_MENU_XPATH, "content menu")

    def getPageTitleText(self):
        return self.findElement(LOGO_XPATH).text

    def getWelcomeText(self):
        return self.findElement(WELCOME_TEXT_XPATH).text

    def getProtocolLink(self):
        return self.findElement(PROTOCOL_LINK_XPATH)

    def getResultsLink(self):
        return self.findElement(RESULTS_LINK_XPATH)

    def getSignInLink(self):
        return self.findElement(SIGN_IN_LINK_XPATH)

    def isSignedIn(self):
        print("signed button: " + self.getSignInLink().text)
        return self.getSignInLink().text == "Sign Out"

    def getEmailField(self):
        return self.findElement(EMAIL_FIELD_ID)

    def setEmail(self, email):
        self.setField(self.getEmailField(), email, "email")

    def getPasswordField(self):
        return self.findElement(PASSWORD_FIELD_ID)

    def setPassword(self, password):
        self.setField(self.getPasswordField(), password, "password")

    def getLoginButton(self):
        return self.findElement(LOGIN_BUTTON_XPATH)

    def getLogoutButton(self):
        return self.findElement(LOGOUT_BUTTON_XPATH)

    def getContentMenuOpenButton(self):
        return self.findElement(CONTENT_MENU_XPATH)

    def getContentMenuCloseButton(self):
        return self.findElement(CLOSE_MENU_XPATH)

    def getNewProtocolButton(self):
        return self.findElement(NEW_PROTOCOL_XPATH)


class ContentMenu(Page):

    def __init__(self, driver):
        self.DRIVER = driver

    def open(self):
        self.click(self.getContentMenuButton(), "content menu")
        self.waitForElementVisible(NEW_PROTOCOL_XPATH)

    def addProtocol(self):
        self.click(self.findElement(NEW_PROTOCOL_XPATH), "add protocol")
        self.waitForElement((By.CLASS_NAME, "sidepanel"))

    def isOpen(self):
        return self.findElement((By.ID, "menu-trigger")).get_attribute("checked") == 'true'

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


