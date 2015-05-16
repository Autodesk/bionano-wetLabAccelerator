import tests.Base as Base
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from pages.IndexPage import IndexPage
from pages.Build import Build
from pages.Build import ProtocolSetup
from pages.Build import SetupParameter
from pages.Build import ProtocolInstructions
import helpers


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
        # self.protocolSetup = ProtocolSetup(self.DRIVER)

        try:
            WebDriverWait(self.DRIVER, self.TIMEOUT).until(
                expected_conditions.presence_of_element_located((By.XPATH, "//p[text()='Welcome to CX1']")))
        except:
            self.fail("Error rendering page")


