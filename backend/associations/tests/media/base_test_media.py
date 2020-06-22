import ntpath
import os
import shutil
from os.path import realpath, join, dirname

import backend.settings as settings
from backend.tests_utils import WeakAuthenticationBaseTestCase


class BaseMediaTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_association.yaml"]

    def setUp(self):
        super(BaseMediaTestCase, self).setUp()

        if "tests" not in settings.MEDIA_ROOT:
            Exception("Media root should be in its own directory")

        try:
            try:
                shutil.rmtree(settings.MEDIA_ROOT)
            except FileNotFoundError:
                pass
            os.makedirs(settings.MEDIA_ROOT)
        except FileExistsError:
            pass

    def tearDown(self):
        pass
        # shutil.rmtree(settings.MEDIA_ROOT)

    def upload(self, association, file_path, media_name=None):
        """
        Emulates media upload on the server by fetching a file in the ./data folder
        :param file_path: the path of the file in the ./data folder
        :param media_name: the name of the file (only used for backend renaming)
        :param association: the association to attach the media to
        :return:
        """

        if media_name is None:
            media_name = ntpath.basename(file_path)

        dir_path = dirname(realpath(__file__))
        with open(join(dir_path, "data", file_path), "rb") as file:
            res = self.post(
                "/associations/media/",
                {"name": media_name, "association": association, "file": file},
                "multipart",
            )

            return res
