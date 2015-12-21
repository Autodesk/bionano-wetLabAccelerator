# just some helper functions
import os
from testconfig import config


def environment():
    """Return the environment"""
    try:
        env = config[os.environ['TEST_ENVIRONMENT']]
    except KeyError:
        env = config['environment']
    return env


def get_document_uri(name):
    """Get the document uri for the given environment"""
    return config['environments'][environment()]['assets'][name]
