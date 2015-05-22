import time

import helpers
from pages import Page


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

    def signIn(self, email, password):
        self.clickSignIn()
        self.setEmail(email)
        self.setPassword(password)
        self.click(self.getLoginButton(), "Log In Button")
        if self.getLogoutButton().is_displayed():
            print("successfully logged in")

    def getPageTitleText(self):
        return self.DRIVER.find_element_by_xpath("//div[@class='logo']").text

    def getWelcomeText(self):
        return self.DRIVER.find_element_by_xpath("//p[@class='ng-scope']").text

    def getProtocolLink(self):
        return self.DRIVER.find_element_by_xpath("//a[text()='PROTOCOL']")

    def getResultsLink(self):
        return self.DRIVER.find_element_by_xpath("//a[text()='RESULTS']")

    def getSignInLink(self):
        return self.DRIVER.find_element_by_xpath("//a[@href='#/auth']")

    def getEmailField(self):
        return self.DRIVER.find_element_by_id("fbEmail")

    def setEmail(self, email):
        self.action("set email field to: " + email)
        self.getEmailField().send_keys(email)
        self.getEmailField().send_keys(Keys.ENTER)

    def getPasswordField(self):
        return self.DRIVER.find_element_by_id("fbPassword")

    def setPassword(self, password):
        self.action("set password")
        self.getPasswordField().send_keys(password)
        self.getPasswordField().send_keys(Keys.ENTER)

    def getLoginButton(self):
        return self.DRIVER.find_element_by_xpath("//button[text()='Log In']")

    def getLogoutButton(self):
        return self.DRIVER.find_element_by_xpath("//button(text()='Logout']")




