import shutil
from os import makedirs
from os.path import join, dirname
from shutil import copyfile

from backend.settings import MEDIA_ROOT
from backend.tests_utils import WeakAuthenticationBaseTestCase


class TagsBaseTestCase(WeakAuthenticationBaseTestCase):
    api_base = "/api/v1"

    @classmethod
    def setUpClass(cls):
        """Adds the lorem-ipsum.pdf file in the test MEDIA_ROOT folder so the fixtures
        can be loaded"""
        try:
            makedirs(join(MEDIA_ROOT, "associations"))
        except FileExistsError:
            pass

        copyfile(
            join(dirname(__file__), "data", "lorem-ipsum.pdf"),
            join(MEDIA_ROOT, "associations", "lorem-ipsum.pdf"),
        )

        super(TagsBaseTestCase, cls).setUpClass()

    @classmethod
    def tearDownClass(cls) -> None:
        """Clears the test MEDIA_ROOT folder"""
        super(TagsBaseTestCase, cls).tearDownClass()
        shutil.rmtree(MEDIA_ROOT)
