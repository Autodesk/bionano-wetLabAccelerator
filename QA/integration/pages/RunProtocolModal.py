
import time
from selenium.webdriver.common.by import By

from pages import Page

MODAL_ROOT = (By.XPATH, "//tx-modal[@title='Run protocol']")
MODAL_TITLE = (By.XPATH, "//h4[@class='modal-title' and text()='Run protocol']")

RUN_TITLE_FIELD = (By.XPATH, "//input[@placeholder='Run Title...']")

VERIFY_BUTTON = (By.XPATH, "//button[contains(text(), 'Verify')]")
RUN_BUTTON = (By.XPATH, "//button[contains(text(), 'Run']")



EMAIL_FIELD = (By.ID, "inputEmail")
KEY_FIELD = (By.ID, "inputKey")
ORGANIZATION_FIELD = (By.ID, "inputOrg")
VALIDATE_BUTTON = (By.XPATH, "//button[contains(text(), 'Validate']")

FORGET_TRANSCRIPTIC_ACCOUNT = (By.LINK_TEXT, "Forget my Transcriptic account information")
class RunProtocolModal(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def isVisible(self):
        return self.getModal().is_displayed()

    def setRunName(self, runName):
        self.setField(RUN_TITLE_FIELD, runName, "run name")

    def setProjectName(self, projectName, createIfNotExist = False):
        dropdownLocator = (By.LINK_TEXT, "select...")
        dropdown = self.findElement(dropdownLocator, self.getModal())
        self.click(dropdown, "project dropdown")
        projectLinkLocator = (By.XPATH, "//a[@ng-bind='proj.name' and text()='" + projectName + "]")
        if self.elementExists(projectLinkLocator):
            self.click(self.getModal().find_element(projectLinkLocator), "project: " + projectName)
        elif createIfNotExist:
            createProjectLocator = (By.LINK_TEXT, "Create new project...")
            self.click(self.findElement(createProjectLocator), "create new project")
            createProjectInputLocator = (By.XPATH, "//input[@placeholder='Project Name...']")
            self.waitForElementClickable(createProjectInputLocator)
            self.setField(createProjectInputLocator, projectName, "create project")

    def setEmail(self, email):
        self.setField(EMAIL_FIELD, email, "email")

    def setKey(self, key):
        self.setField(KEY_FIELD, key, "transcriptic key")

    def setOrganization(self, org):
        self.setField(ORGANIZATION_FIELD, org, "organization")

    def setTranscripticCredentials(self, email, key, organization, force = True):
        if force and self.elementExists(FORGET_TRANSCRIPTIC_ACCOUNT):
            self.click(FORGET_TRANSCRIPTIC_ACCOUNT, "forget transcriptic account")
        if (self.elementExists(FORGET_TRANSCRIPTIC_ACCOUNT)) == False:
            self.setEmail(email)
            self.setKey(key)
            self.setOrganization(organization)
            #time.sleep(5)
            #self.click(VALIDATE_BUTTON, "validate")
        else:
            print("  Transcript credentials already set")

    def verify(self):
        self.click(VERIFY_BUTTON, "verify button")

    def getModal(self):
        return self.findElement(MODAL_ROOT)

