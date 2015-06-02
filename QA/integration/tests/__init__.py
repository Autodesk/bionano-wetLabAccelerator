import tests.Base as Base
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from pages.IndexPage import IndexPage
from pages.IndexPage import ContentMenu
from pages.Build import Build
from pages.Build import ProtocolSetup
from pages.Build import SetupParameter
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
        self.page = IndexPage(self.DRIVER, self.get_token())
        self.page.open()

        self.build = Build(self.DRIVER)
        self.contentMenu = ContentMenu(self.DRIVER)
        self.protocolInstructions = ProtocolInstructions(self.DRIVER)
        # self.protocolSetup = ProtocolSetup(self.DRIVER)

        try:
            print("waiting for welcome text")
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.presence_of_element_located(WELCOME_TEXT_XPATH))
        except:
            self.fail("could not find welcome text " + WELCOME_TEXT_XPATH[1])


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
        verifyString = description + " is equal to " + str(expected)
        self.verifyString(actual, expected, verifyString)
        self.assertEqual(actual, expected, verifyString)

    def verifyString(self, actual, expect, verifyString):
        passFail = "FAIL"
        if actual == expect:
            passFail = "PASS"
        print("  " + passFail + " - verify " + verifyString)
        if actual != expect:
            print("    expect: " + str(expect))
            print("    actual: " + str(actual))

        return passFail == "PASS"