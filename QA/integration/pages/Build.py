import helpers
from pages import Page


class Build(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getOperationNames(self):
        operationNames = []
        operationsList = self.getOperationsList()
        for operation in operationsList:
            operationNames.append(operation.text)

        return operationNames

    def getOperationByName(self, operationName):
        return self.DRIVER.find_element_by_xpath("//a[text()='" + operationName + "']")

    def getOperationsList(self):
        return self.DRIVER.find_elements_by_class_name("list-group-item")

    def getSidePanel(self):
        return self.DRIVER.find_element_by_class_name("sidepanel")

    def getMainColumn(self):
        return self.DRIVER.find_element_by_class_name("maincolumn")

    def getProtocolSetup(self):
        return self.DRIVER.find_element_by_class_name("protocol-setup-header")

    def isProtocolSetupExpanded(self):
        return self.containsClass(self.getProtocolSetup().find_element_by_xpath('..'), "open")

    def expandProtocolSetup(self):
        if self.isProtocolSetupExpanded() == False:
            self.getProtocolSetup().click()

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

    def containsClass(self, element, className):
        return className in element.get_attribute('class').split(" ")
