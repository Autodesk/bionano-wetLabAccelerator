import time

import helpers
from pages import Page
from selenium.webdriver.common.by import By


PROTOCOL_LINK_XPATH   = (By.XPATH, "//a[text()='PROTOCOL']")
RESULTS_LINK_XPATH    = (By.XPATH, "//a[text()='RESULTS']")
LOGO_XPATH            = (By.XPATH, "//div[@class='logo']")
SIGN_IN_LINK_XPATH    = (By.XPATH, "//a[@href='#/auth']")
LOGIN_BUTTON_XPATH    = (By.XPATH, "//button[text()='Log In']")
LOGOUT_BUTTON_XPATH   = (By.XPATH, "//button[text()='Logout']")
WELCOME_TEXT_XPATH    = (By.XPATH, "//p[@class='ng-scope']")
EMAIL_FIELD_ID        = (By.ID, "fbEmail")
PASSWORD_FIELD_ID     = (By.ID, "fbPassword")

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
        time.sleep(10)


    def clickBuild(self):
        self.click(self.getProtocolLink(), "protocol link")

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




