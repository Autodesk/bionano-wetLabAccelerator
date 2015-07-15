import helpers
import time
from selenium.webdriver.common.by import By

from pages import Page
from ProtocolSetup import ProtocolSetup


DESCRIPTION_FIELD = (By.XPATH, ".//tx-protocol-field[@ng-model='opCtrl.op.description']//div[@class='field-value']//input")
OPERATION = (By.XPATH, ".//span[contains(@class, 'operation-name')]")
PROTOCOL_FIELD = (By.TAG_NAME, "tx-protocol-field")

OPERATION_FIELD_LABEL = (By.CLASS_NAME, "field-label")
OPERATION_FIELD_VALUE = (By.CLASS_NAME, "field-value")
OPERATION_INNER_FIELD = (By.TAG_NAME, "tx-protocol-field-inner")
DROPDOWN = (By.XPATH, ".//*[contains(@class, 'option-button') or @dropdown]")
INPUT_FIELD = (By.XPATH, ".//input[@type='text' or @type='number']")
TRUE_FALSE_BUTTON = (By.CLASS_NAME, "true-false-button")

class OperationInstruction(Page):
    def __init__(self, element):
        self.elemString = "<" + element.tag_name + " class='" + element.get_attribute('class') + "'>"
        self.element = element
        self.DRIVER = element.parent

    def getDescription(self):
        return self.findElement(DESCRIPTION_FIELD, self.element).get_attribute("value")

    def setDescription(self, descriptionString):
        self.setField(self.findElement(DESCRIPTION_FIELD, self.element), descriptionString, "operation description")

    def getName(self):
        return self.getOperationElement().text

    def expand(self):
        self.action("expand '" + self.getName() + "' operation")
        if self.isExpanded():
            print("operation '" + self.getName() + "' is already expanded")
        else:
            self.clickOperation()
        time.sleep(1)

    def collapse(self):
        self.action("collapse '" + self.getName() + "' operation")
        if self.isExpanded():
            self.clickOperation()
        else:
            print("operation '" + self.getName() + "' is already collapsed")


    def isExpanded(self):
        return self.containsClass(self.element, "open")

    def is_displayed(self):
        return self.element.is_displayed()

    def clickOperation(self):
        self.getOperationElement().click()

    def getOperationElement(self):
        return self.findElement(OPERATION, self.element)

    def getOperationFields(self):
        fieldElements = self.findElements(PROTOCOL_FIELD, self.element)
        operationFields = []
        for fieldElement in fieldElements:
            if fieldElement.is_displayed():
                operationFields.append(OperationField(fieldElement))
        return operationFields

    def getOperationField(self, fieldName):
        return OperationField(self.getOperationFieldElement(fieldName))

    def getOperationFieldElement(self, fieldName):
        locator = (By.XPATH, ".//tx-protocol-field/div[contains(@class, 'field-label') and text()='" + fieldName + "']/..")
        return self.findElement(locator, self.element)

    def setOperationFieldInputField(self, fieldName, value):
        #self.getOperationField(fieldName).find_element(By.TAG_NAME, "input").send_keys(value)
        self.getOperationField(fieldName).setInputField(value)

    def getOperationFieldInputFieldValue(self, fieldName):
        return self.getOperationField(fieldName).getValue()
        #return self.getOperationField(fieldName).find_element(By.TAG_NAME, "input").get_attribute("value")

    def setOperationField(self, fieldName, value, optionalValue = None):
        self.getOperationField(fieldName).set(value, optionalValue)

    def setVolumeValue(self, value, unit = None):
        self.getOperationField("volume").setInputField(value)
        self.setVolumeUnit(unit)

    def setVolumeUnit(self, unit):
        if unit != None:
          self.getOperationField('volume').setDropdown(unit)

    # returns the volume value and unit
    def getVolumeValue(self):
        return self.getOperationField("volume").getValue()

    def setFromContainerType(self, type):
        self.setContainerType("from", type)

    def getFromContainerType(self):
        return self.getContainerType("from")

    def setToContainerType(self, type):
        self.setContainerType("to", type)

    def getToContainerType(self):
        return self.getContainerType("to")

    def setContainerType(self, fromTo, type):
        self.getOperationField(fromTo).setDropdown(type)

    def getContainerType(self, fromTo):
        return self.getOperationField(fromTo).getDropdownSelectedValue()

    def setDispenseSpeed(self, speed):
        self.getOperationField("dispense speed").setInputField(speed)

    def getDispenseSpeed(self):
        return self.getOperationField("dispense speed").getValue()

    def setAspirateSpeed(self, speed):
        self.getOperationField("aspirate speed").setInputField(speed)

    def getAspirateSpeed(self):
        return self.getOperationField("aspirate speed").getValue()



    def setModalField(self, modalDialog, fieldName, fieldValue):
        locator = (By.XPATH, ".//td[text()='" + fieldName + "']/..//input")
        field = self.findElement(locator, modalDialog)
        self.setField(field, fieldValue, fieldName)


    def setMixBeforeAfterValues(self, modalTitle, repetitions, speed, volume):
        editLocator = (By.XPATH, "//tx-protocol-field//*[text()='" + modalTitle + "']/..//tx-protocol-field-inner/a")
        self.click(editLocator, "click 'edit...' in " + modalTitle + " field")
        mixModalLocator = (By.XPATH, "//div[@class='modal-heading']/*[text()='" + modalTitle + "']/../..")
        modalDialog = self.findElement(mixModalLocator)
        self.setModalField(modalDialog, "volume", volume)
        self.setModalField(modalDialog, "speed", speed)
        self.setModalField(modalDialog, "repetitions", repetitions)
        self.click(modalDialog.find_element(By.CLASS_NAME, "modal-close"),
                   "click on modal dialog's " + modalTitle + " close button")

    def setMixBefore(self, volume, volumeUnit, speed, speedUnit, repetitions):
        modalTitle = "mix before"
        self.setMixBeforeAfterValues(modalTitle, repetitions, speed, volume)


    def setMixAfter(self, volume, volumeUnit, speed, speedUnit, repetitions):
        modalTitle = "mix after"
        self.setMixBeforeAfterValues(modalTitle, repetitions, speed, volume)

    def getModalValues(self, modalTitle):
        editLocator = (By.XPATH, "//tx-protocol-field//*[text()='" + modalTitle + "']/..//tx-protocol-field-inner/a")
        self.click(editLocator, None)
        mixModalLocator = (By.XPATH, "//div[@class='modal-heading']/*[text()='" + modalTitle + "']/../..")
        modalDialog = self.findElement(mixModalLocator)
        modalFields = modalDialog.find_elements(By.TAG_NAME, "tx-protocol-field-inner")
        values = []
        for modalField in modalFields:
            value = ""
            if self.elementExists(INPUT_FIELD, modalField):
                inputField = self.findElement(INPUT_FIELD, modalField)
                value = inputField.get_attribute("value")
            value += " " + modalField.text
            values.append(value)
        self.click(modalDialog.find_element(By.CLASS_NAME, "modal-close"), None)
        return values

    def getMixBeforeValues(self):
        return self.getModalValues("mix before")

    def getMixAfterValues(self):
        return self.getModalValues("mix after")




    def getOperationFieldValue(self, fieldName):
        return self.getOperationField(fieldName).getValue()

    def getOperationFieldsAsJson(self):
        fieldsJson = []
        fields = self.getOperationFields()
        for field in fields:
            fieldsJson.append(field.asHash())
        return fieldsJson



class OperationField(Page):
    def __init__(self, fieldElement):
        self.fieldElement = fieldElement
        self.DRIVER = self.fieldElement.parent
        self.innerField = self.findElement(OPERATION_INNER_FIELD, self.fieldElement)

    def getName(self):
        return self.findElement(OPERATION_FIELD_LABEL, self.fieldElement).text

    def set(self, value, optionalValue = None):
        if self.hasInputField() and self.hasDropdown() == False:
            self.setInputField(value)
        elif self.hasDropdown() and self.hasInputField() == False:
            self.setDropdown(value)
        elif self.hasInputField() and self.hasDropdown():
            self.setInputField(value)
            if optionalValue != None:
                self.setDropdown(optionalValue)
        elif self.hasTrueFalseButton():
            self.setTrueFalseButton(value)


    def getValue(self):
        values = []
        if self.hasInputField():
            values.append(self.getInputFieldValue())
        if self.hasDropdown():
            values.append(self.getDropdownSelectedValue())

        if self.hasTrueFalseButton():
            values.append(self.getTrueFalseState())
        if len(values) == 0:
            values.append(self.findElement(OPERATION_FIELD_VALUE, self.fieldElement).text)
        return " ".join(values)

    def asHash(self):
        hash = {}
        hash["fieldName"] = self.getName()
        settings = []
        if self.hasInputField():
            inputFieldHash = {}
            inputFieldHash["inputType"] = "inputField"
            inputFieldHash["value"] = self.getInputFieldValue()
            inputFieldHash["placeholderValue"] = self.getInputFieldPlaceholderValue()
            settings.append(inputFieldHash)
        if self.hasDropdown():
            dropdownHash = {}
            dropdownHash["inputType"] = "dropdown"
            dropdownHash["selectedValue"] = self.getDropdownSelectedValue()
            dropdownHash["options"] = self.getDropdownOptions()
            settings.append(dropdownHash)
        if self.hasTrueFalseButton():
            settings.append({"inputType": "trueFalse", "trueFalse": self.getTrueFalseState()})
        hash["settings"] = settings
        return hash

    def toString(self):
        return self.getName() + ": " + self.getValue()

    def hasDropdown(self):
        return self.elementExists(DROPDOWN, self.innerField)

    def getDropdown(self):
        return self.findElement(DROPDOWN, self.innerField)

    def setDropdown(self, value):
        dropdown = self.getDropdown()
        dropdown.click()
        optionLocator = (By.XPATH, ".//*[text()='" + value + "']")
        self.click(self.findElement(optionLocator, self.getDropdown()), "set '" + self.getName() + "' dropdown to: " + value)

    def getDropdownOptions(self):
        dropdown = self.getDropdown()
        ##dropdown.click()
        optionsElements = self.findElements((By.XPATH, ".//li/a"), dropdown)
        options = []
        for optionElement in optionsElements:
            options.append(optionElement.text)
        ##dropdown.click()
        return options

    def getDropdownSelectedValue(self):
        if self.hasDropdown():
            self.dropdown = self.findElement(DROPDOWN, self.innerField)
            return self.dropdown.text
        else:
            return None


    def hasInputField(self):
        return self.elementExists(INPUT_FIELD, self.innerField)

    def getInputField(self):
        return self.findElement(INPUT_FIELD, self.innerField)

    def setInputField(self, value):
        # print(self.getElementAttributes(self.getInputField()))
        self.setField(self.getInputField(), value, self.getName() + " input field")

    def getInputFieldValue(self):

        if self.hasInputField():
            return self.getInputField().get_attribute("value")
        else:
            return ""

    def getInputFieldPlaceholderValue(self):
        if self.hasInputField():
            self.findElement(INPUT_FIELD, self.innerField).get_attribute("placeholder")
        else:
            return ""

    def hasTrueFalseButton(self):
        return self.elementExists(TRUE_FALSE_BUTTON, self.innerField)

    def getTrueFalseButton(self):
        return self.findElement(TRUE_FALSE_BUTTON, self.innerField)

    def setTrueFalseButton(self, boolean):
        if self.getTrueFalseState() != boolean:
            self.click(self.getTrueFalseButton(), self.getName() +  " to " + str(boolean))

    def getTrueFalseState(self):
        if self.hasTrueFalseButton():
            return self.getTrueFalseButton().find_element(By.TAG_NAME, "input").get_attribute("aria-checked") == "true"


