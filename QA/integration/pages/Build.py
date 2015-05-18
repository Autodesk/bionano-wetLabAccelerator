import helpers
from pages import Page


class Build(Page):
    def __init__(self, driver):
        self.DRIVER = driver
        # self.protocolSetup = ProtocolSetup(self.DRIVER)

    def getOperationNames(self):
        operationNames = []
        operationsList = self.getOperationsList()
        for operation in operationsList:
            operationNames.append(operation.text)

        return operationNames

    def getOperationByName(self, operationName):
        return self.DRIVER.find_element_by_xpath("//a[text()='" + operationName + "']")

    def getOperationsList(self):
        return self.DRIVER.find_elements_by_class_name("operation-list-item")

    def getSidePanel(self):
        return self.DRIVER.find_element_by_class_name("sidepanel")

    def getMainColumn(self):
        return self.DRIVER.find_element_by_class_name("maincolumn")

    def getProtocolSetup(self):
        return ProtocolSetup(self.DRIVER)

    def getProtocolInstructions(self):
        return self.getMainColumn().find_element_by_class_name("protocol-instructions")




    def getClearProtocolButton(self):
        return self.getButtonByTooltip("Clear Protocol")

    def getToggleStepVisibilityButton(self):
        return self.getButtonByTooltip("Toggle step visiblity")

    def getSaveProtocolButton(self):
        return self.getButtonByTooltip("Save Protocol")

    def getSaveProtocolButton(self):
        return self.getButtonByTooltip("View Protocol Json")

    def getSaveProtocolButton(self):
        return self.getButtonByTooltip("Download Protocol")

    def getSaveProtocolButton(self):
        return self.getButtonByTooltip("Run Protocol")



    def findElementByAttributeValue(self, elementType, attribute, value):
        return self.DRIVER.find_element_by_xpath("//" + elementType + "[@" + attribute + "='" + value + "']")

    def getButtonByTooltip(self, tooltipValue):
        return self.findElementByAttributeValue("button", "tooltip", tooltipValue)



class ProtocolSetup(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getParameters(self):
        parameterElements = self.DRIVER.find_elements_by_class_name("setup-variable")
        parameters = []
        for parameterElement in parameterElements:
            if self.containsClass(parameterElement, "ng-scope"):
                setupParameter = SetupParameter(parameterElement)
                parameters.append(setupParameter)

        return parameters

    def isExpanded(self):
        return self.containsClass(self.getSetupHeaderElement().find_element_by_xpath('..'), "open")

    def collapse(self):
        print("collapse protocol setup")
        if self.isExpanded():
            self.getSetupHeaderElement().click()

    def expand(self):
        print("expand protocol setup")
        if self.isExpanded() == False:
            self.getSetupHeaderElement().click()

    def getSetupHeaderElement(self):
        return self.DRIVER.find_element_by_class_name("protocol-setup-header")

    def addParameter(self, parameterType):
        print("add parameter: " + parameterType)
        self.getAddParameterElement().click()
        self.getAddParameterElement().find_element_by_xpath("//a[text()='" + parameterType + "']").click()
        newParam = self.getParameters()[-1]
        print(newParam.getParameterType())
        return newParam

    def getAddParameterElement(self):
        return self.DRIVER.find_element_by_class_name("add-parameter")



class SetupParameter(Page):
    def __init__(self, parameterElement):
        self.parameterElement = parameterElement

    def getParameterType(self):
        return self.parameterElement.find_element_by_class_name("parameter-type").text

    def getVariableName(self):
        return self.getVariableNameInputField().get_attribute("value")

    def setVariableName(self, variableName):
        self.getVariableNameInputField().click()
        self.getVariableNameInputField().send_keys(variableName)
        self.getVariableNameInputField().send_keys(Keys.ENTER)

    def getVariableNameInputField(self):
        return self.parameterElement.find_element_by_class_name("input-styled")


class ProtocolInstructions(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getProtocolInstructionsElement(self):
        return self.DRIVER.find_element_by_class_name("protocol-instructions")