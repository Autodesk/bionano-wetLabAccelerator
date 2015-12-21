import time
import tests.Base as Base
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from pages.IndexPage import IndexPage
from pages.ContentMenu import ContentMenu
from pages.ProtocolSetup import ProtocolSetup
from pages.SetupParameter import SetupParameter
from pages.Build import Build
from pages.RunProtocolModal import RunProtocolModal
#from pages.Build import SetupParameter
from pages.Build import ProtocolInstructions
import helpers

WELCOME_TEXT_XPATH = (By.XPATH, "//a[@class='logo']/span")
WELCOME_SPLASH_SCREEN_XPATH = (By.XPATH, "//h3[text()=\"Welcome! Let's get started.\"]")

class TestBase(Base._BaseTest):
    """Base test class. Make sure you set MODEL_NAME in your model to fetch it from
    the environment.yaml file"""

    TIMEOUT = 15

    def setUp(self):
        # if not getattr(self, 'MODEL_NAME', None):
        #     err = "Please set a MODEL_NAME on your test class, for the model to test against."
        #     raise AttributeError, err
        Base._BaseTest.setUp(self, "chrome")
        self.indexPage = IndexPage(self.DRIVER, self.get_token())
        self.indexPage.open()

        self.build = Build(self.DRIVER)
        self.contentMenu = ContentMenu(self.DRIVER)
        self.protocolInstructions = ProtocolInstructions(self.DRIVER)

        # self.protocolSetup = ProtocolSetup(self.DRIVER)

    def getTimeStamp(self):
        return time.strftime("%Y-%m-%d %H:%M:%S")

    def verifyIsDisplayed(self, element, description):
        verifyString =  description + " is displayed"
        isDisplayed = element.is_displayed()
        self.verifyTrue(isDisplayed, verifyString)
        return isDisplayed

    def verifyTrue(self, actual, description):
        self.verifyString(actual, True, description)
        self.assertTrue(actual, description)

    def verifyFalse(self, actual, description):
        self.verifyString(actual, False, description)
        self.assertFalse(actual, description)

    def verifyEqual(self, actual, expected, description):
        if isinstance(expected, str):
            verifyString = description + " is equal to '" + expected + "'"
        else:
            verifyString = description + " is equal to " + str(expected)
        self.verifyString(actual, expected, verifyString)
        self.assertEqual(actual, expected, verifyString)

    def verifyString(self, actual, expect, verifyString):
        passFail = "FAIL"
        if actual == expect:
            passFail = "PASS"
        if verifyString.lower().startswith("verify") == False:
            verifyString = "verify " + verifyString
        print("  " + passFail + " - " + verifyString)
        if actual != expect:
            print("    expect: " + str(expect))
            print("    actual: " + str(actual))

        return passFail == "PASS"

