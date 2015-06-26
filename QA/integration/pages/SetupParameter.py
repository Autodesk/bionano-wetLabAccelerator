import helpers
import time
from selenium.webdriver.common.by import By

from pages import Page

PARAMETER_TYPE = (By.CLASS_NAME, "parameter-type")
PARAM_NAME = (By.XPATH, ".//input[@ng-model='param.name']")

class SetupParameter(Page):
    def __init__(self, parameterElement):
        self.parameterElement = parameterElement

    def getParameterType(self):
        return self.parameterElement.find_element(*PARAMETER_TYPE).text

    def getVariableName(self):
        return self.getVariableNameInputField().get_attribute("value")

    def setVariableName(self, variableName):
        self.getVariableNameInputField().click()
        self.setField(self.getVariableNameInputField(), variableName, "parameter name")
        # self.getVariableNameInputField().send_keys(variableName)
        # self.getVariableNameInputField().send_keys(Keys.ENTER)

    def getVariableNameInputField(self):
        return self.parameterElement.find_element(*PARAM_NAME)

