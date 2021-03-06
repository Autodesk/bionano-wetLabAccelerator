import time

import helpers
from pages import Page
from RunProtocolModal import RunProtocolModal
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions


#WELCOME_SPLASH_SCREEN = (By.CLASS_NAME, "welcome-overlays")
WELCOME_SPLASH_SCREEN_XPATH = (By.XPATH, "//h3[text()=\"Welcome! Let's get started.\"]")
LOGIN_DROPDOWN = (By.CLASS_NAME, "user-toggle")
LOGIN_WITH_FACEBOOK = (By.LINK_TEXT, "Log In with Facebook")
FACEBOOK_EMAIL_FIELD = (By.ID, "email")
FACEBOOK_PASSWORD_FIELD = (By.ID, "pass")
FACEBOOK_LOGIN_BUTTON = (By.NAME, "login")
FACEBOOK_CONFIRM_BUTTON = (By.NAME, "__CONFIRM__")

LOGO_XPATH            = (By.XPATH, "//a[@class='logo']")
WELCOME_TEXT_XPATH    = (By.XPATH, "//p[@class='ng-scope']")

PROTOCOL_LINK_XPATH   = (By.XPATH, "//a[text()='PROTOCOL']")
RESULTS_LINK_XPATH    = (By.XPATH, "//a[text()='RESULTS']")

PROTOCOL_NAME = (By.CLASS_NAME, "protocol-info")
CHANGE_PROTOCOL_NAME_BUTTON = (By.XPATH, "//div[@class='protocol-info']/span")
PROTOCOL_METADATA_MODAL = (By.XPATH, "//tx-modal//*[text()='Protocol Metadata']/../../..")

PROTOCOL_METADATA_MODAL_NAME_FIELD = (By.XPATH, ".//div[@class='metadata-label' and text()='Name']/..//input")
PROTOCOL_METADATA_MODAL_DESCRIPTION_FIELD = (By.XPATH, ".//div[@class='metadata-label' and text()='Description']/..//input")
PROTOCOL_METADATA_MODAL_TAGS_FIELD = (By.XPATH, ".//div[@class='metadata-label' and text()='Tags']/..//input")

SAVE_PROTOCOL = (By.LINK_TEXT, "Save")
RUN_PROTOCOL = (By.LINK_TEXT, "Run")


NOTIFY_MESSAGE = (By.XPATH, "//div[contains(@class, 'notify-message')]/div")

class IndexPage(Page):
    def __init__(self, driver, token):
        self.DRIVER = driver
        self.TOKEN = token
        Page.__init__(self, driver)


    ### page actions such as clicks and filling in fields

    def open(self):
        """Load the page"""
        uri = self.BASE_URL #+ "?document=%s&accessToken=%s&env=%s" % (self.DOCUMENT, self.TOKEN, helpers.environment().capitalize())
        self.action("opening url: " + uri)
        self.DRIVER.get(uri)
        # time.sleep(2)
        # self.waitForElement(WELCOME_SPLASH_SCREEN_XPATH, 15, description = "splash screen")

    def dismissWelcomeSplashScreen(self):
        if self.elementExists(WELCOME_SPLASH_SCREEN_XPATH):
            self.click(WELCOME_SPLASH_SCREEN_XPATH, "Welcome splash screen")
            time.sleep(1)

    def clickLoginDropdown(self):
        self.click(LOGIN_DROPDOWN, "Login dropdown")

    def clickLoginWithFacebookButton(self):
        self.click(LOGIN_WITH_FACEBOOK, "Login with Facebook")

    def facebookLogin(self, email, password):
        self.setField(FACEBOOK_EMAIL_FIELD, email, "facebook email")
        self.setField(FACEBOOK_PASSWORD_FIELD, password, "facebook password")
        self.click(FACEBOOK_LOGIN_BUTTON, "login button")
        time.sleep(1)
        if self.elementExists(FACEBOOK_CONFIRM_BUTTON):
            self.click(FACEBOOK_CONFIRM_BUTTON, "okay")
        time.sleep(1)

    def signInWithFacebook(self, email, password):
        self.dismissWelcomeSplashScreen()
        self.clickLoginDropdown()
        self.clickLoginWithFacebookButton()
        self.facebookLogin(email, password)

    def clickProtocol(self):
        self.click(self.getProtocolLink(), "protocol link")

    def clickResults(self):
        self.click(self.getResultsLink(), "results link")

    def saveProtocol(self):
        self.click(self.findElement(SAVE_PROTOCOL), "Save protocol button")

    def isProtocolSaved(self):
        return self.findElement((By.XPATH, "//div[contains(text(),'Protocol Saved')]")).is_displayed()

    def runProtocol(self):
        self.click(self.findElement(RUN_PROTOCOL), "Run protocol button")
        return RunProtocolModal(self.DRIVER)

    ### get text values for elements
    def getPageTitleText(self):
        return self.findElement(LOGO_XPATH).text.replace("\n", " ")

    def getWelcomeText(self):
        return self.getWelcomeSplashScreen().text.replace("\n", " ")

    def getProtocolName(self):
        return self.findElement(PROTOCOL_NAME).text

    def getNotifyMessage(self):
        return self.findElement(NOTIFY_MESSAGE).text

    def getVerificationMessage(self):
        locator = (By.XPATH, "//span[@ng-bind='opCtrl.verification.message']")
        return self.findElement(locator).text


    ### getters for elements on page

    def getWelcomeSplashScreen(self):
        return self.findElement(WELCOME_SPLASH_SCREEN_XPATH)

    def getProtocolLink(self):
        return self.findElement(PROTOCOL_LINK_XPATH)

    def getResultsLink(self):
        return self.findElement(RESULTS_LINK_XPATH)

    def getProtocolMetadataModal(self):
        return self.findElement(PROTOCOL_METADATA_MODAL)

    def getProtocolMetadataNameField(self):
        return self.findElement(PROTOCOL_METADATA_MODAL_NAME_FIELD, self.getProtocolMetadataModal())

    def getProtocolMetadataDescriptionField(self):
        return self.findElement(PROTOCOL_METADATA_MODAL_DESCRIPTION_FIELD, self.getProtocolMetadataModal())

    def getProtocolMetadataTagsField(self):
        return self.findElement(PROTOCOL_METADATA_MODAL_TAGS_FIELD, self.getProtocolMetadataModal())

    ## get element states

    def isWelcomeDisplayed(self):
        return self.isDisplayed(WELCOME_SPLASH_SCREEN_XPATH)

    def setProtocolMetadata(self, protocolName, protocolDescription = None, protocolTags = None):
        self.click(CHANGE_PROTOCOL_NAME_BUTTON, "click on the protocol title")

        self.waitForElementVisible(PROTOCOL_METADATA_MODAL)
        self.setField(self.getProtocolMetadataNameField(), protocolName, "protocol name")
        if protocolDescription:
            self.setField(self.getProtocolMetadataDescriptionField(), protocolDescription, "protocol description")
        if protocolTags:
            self.setField(self.getProtocolMetadataTagsField(), protocolTags, "protocol tags")

        self.closeModal(self.getProtocolMetadataModal())

    def getProtocolMetadata(self):
        self.findElement(CHANGE_PROTOCOL_NAME_BUTTON).click()

        return [self.getProtocolMetadataNameField().get_attribute("value"),
                self.getProtocolMetadataDescriptionField().get_attribute("value"),
                self.getProtocolMetadataTagsField().get_attribute("value")]
        self.closeModal(self.getProtocolMetadataModal())

# class IndexPageOld(Page):
#     """A page object for the index page - the main viewer"""
#
#     def __init__(self, driver, token):
#         self.DRIVER = driver
#         self.TOKEN = token
#         Page.__init__(self, driver)
#
#     def open(self):
#         """Load the page"""
#         uri = self.BASE_URL #+ "?document=%s&accessToken=%s&env=%s" % (self.DOCUMENT, self.TOKEN, helpers.environment().capitalize())
#         print("opening url: " + uri)
#         self.DRIVER.get(uri)
#
#     def dismissWelcome(self):
#         self.click(WELCOME_SPLASH_SCREEN_XPATH, "welcome splash screen")
#
#     def clickWelcome(self):
#         self.click(self.getWelcomeSplashScreen(), "welcome splash screen")
#
#     def getWelcomeSplashScreen(self):
#         return self.findElement(WELCOME_SPLASH_SCREEN_XPATH)
#
#     def clickReadyToStartLink(self):
#         self.click(self.getReadyToStartLink(), "ready to start link")
#
#     def getReadyToStartLink(self):
#         return self.findElement(READY_TO_START_XPATH)
#
#     def clickProtocol(self):
#         self.click(self.getProtocolLink(), "protocol link")
#
#     def clickResults(self):
#         self.click(self.getResultsLink(), "results link")
#
#     def clickSignIn(self):
#         try:
#             time.sleep(2)
#             if self.getReadyToStartLink().is_displayed():
#                 self.clickReadyToStartLink()
#         except:
#             self.action("splash screen not present, continuing into sign in")
#
#         self.click(self.findElement(SIGN_IN_BUTTON_XPATH), "sign in button")
#
#         time.sleep(5)
#         self.click(self.getSignInLink(), "sign in link")
#         self.waitForElementById("fbEmail")
#
#     def signIn2(self, email, password):
#         try:
#             self.waitForElement(READY_TO_START_XPATH)
#             if self.getReadyToStartLink().is_displayed():
#                 self.clickReadyToStartLink()
#         except:
#             self.action("splash screen not present, continuing into sign in")
#
#
#         self.click((By.CLASS_NAME, "user-toggle"), "user dropdown")
#         self.click((By.LINK_TEXT, "Sign In"), "sign in button in user dropdown")
#         self.setEmail(email)
#         time.sleep(2)
#         return self.getLogoutButton().is_displayed()
#
#
#     def signIn(self, email, password):
#         self.clickSignIn()
#         self.setEmail(email)
#         # self.setPassword(password)
#         self.click(self.getLoginButton(), "Authenticate Button")
#         time.sleep(5)
#         return self.getLogoutButton().is_displayed()
#
#     def clickContentMenu(self):
#         # TODO implement this function
#         return self.click(CONTENT_MENU_XPATH, "content menu")
#
#     def getPageTitleText(self):
#         return self.findElement(LOGO_XPATH).text.replace("\n", " ")
#
#     def getWelcomeText(self):
#         return self.findElement(WELCOME_TEXT_XPATH).text.replace("\n", " ")
#
#     def getProtocolLink(self):
#         return self.findElement(PROTOCOL_LINK_XPATH)
#
#     def getResultsLink(self):
#         return self.findElement(RESULTS_LINK_XPATH)
#
#     def getSignInLink(self):
#         return self.findElement(SIGN_IN_LINK_XPATH)
#
#     def isSignedIn(self):
#         print("signed button: " + self.getSignInLink().text)
#         return self.getSignInLink().text == "Sign Out"
#
#     def getEmailField(self):
#         return self.findElement(EMAIL_FIELD)
#
#     def setEmail(self, email):
#         self.setField(self.getEmailField(), email, "email")
#
#     def getPasswordField(self):
#         return self.findElement(PASSWORD_FIELD_ID)
#
#     def setPassword(self, password):
#         self.setField(self.getPasswordField(), password, "password")
#
#     def getLoginButton(self):
#         return self.findElement(LOGIN_BUTTON_XPATH)
#
#     def getLogoutButton(self):
#         return self.findElement(LOGOUT_BUTTON_XPATH)
#
#     def getContentMenuOpenButton(self):
#         return self.findElement(CONTENT_MENU_XPATH)
#
#     def getContentMenuCloseButton(self):
#         return self.findElement(CLOSE_MENU_XPATH)
#
#     def getNewProtocolButton(self):
#         return self.findElement(NEW_PROTOCOL_XPATH)
#
#
