import time

import helpers
from pages import Page
from SetupParameter import SetupParameter
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions


SETUP_ROW = (By.CLASS_NAME, "setup-row")
PROTOCOL_SETUP_HEADER = (By.CLASS_NAME, "protocol-setup-header")
ADD_PARAMETER_BUTTON = (By.CLASS_NAME, "add-parameter")

class ProtocolSetup(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getParameters(self):
        parameterElements = self.findElements(SETUP_ROW)
        parameters = []
        for parameterElement in parameterElements:
            #print(self.getElementAttributes(parameterElement))
            if self.containsClass(parameterElement, "ng-scope") and self.containsClass(parameterElement, "setup-variable-placeholder") == False:
                setupParameter = SetupParameter(parameterElement)
                parameters.append(setupParameter)

        return parameters

    def getParameterCount(self):
        return len(self.getParameters())

    def getParameterNames(self):
        parameterNames = []
        for parameter in self.getParameters():
            parameterNames.append(parameter.getVariableName())
        return parameterNames


    def isExpanded(self):
        return self.containsClass(self.getSetupHeaderElement().find_element_by_xpath('..'), "open")

    def collapse(self):
        self.action("collapse protocol setup")
        if self.isExpanded():
            self.getSetupHeaderElement().click()

    def expand(self):
        self.action("expand protocol setup")
        if self.isExpanded() == False:
            self.getSetupHeaderElement().click()

    def getSetupHeaderElement(self):
        return self.findElement(PROTOCOL_SETUP_HEADER)


    def addParameter(self, parameterType):
        self.getAddParameterElement().click()

        self.click(self.getAddParameterElement().find_element_by_xpath(".//a[text()='" + parameterType + "']"), "add parameter " + parameterType)
        # time.sleep(2)
        newParam = self.getParameters()[-1]
        # print(newParam.getParameterType())
        return newParam

    # get list of options in Add Parameter dropdown
    def getAddParameterOptions(self):
        self.getAddParameterElement().click()
        parameters = self.getAddParameterElement().find_elements_by_xpath(".//a")
        options = []
        for parameter in parameters:
            options.append(parameter.text)

        # click on Add Parameter dropdown to close it, otherwise tests fail.
        self.getAddParameterElement().click()
        return options

    # def getAddParameterElements(self):
    #     self.getAddParameterElement().click()
    #     parameters = self.getAddParameterElement().find_elements_by_xpath(".//a")
    #     for parameter in parameters:
    #         print(parameter.text)
    #     return parameters

    def getAddParameterElement(self):
        return self.findElement(ADD_PARAMETER_BUTTON)

    def listParameters(self):
        for parameter in self.getParameters():
            print(parameter.getParameterType() + ": " + parameter.getVariableName())

