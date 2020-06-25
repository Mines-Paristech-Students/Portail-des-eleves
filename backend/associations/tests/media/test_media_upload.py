from os.path import join, exists
import backend.settings as settings
from associations.tests.media.base_test_media import BaseMediaTestCase


class TestMediaUploadCase(BaseMediaTestCase):
    def test_file_upload_and_removal(self):
        media_id, media_file = self._test_upload_single_media()
        self._test_file_is_removed_when_media_is_deleted(media_id, media_file)

    def _test_upload_single_media(self):
        self.login("17admin_biero")
        filename = "crust.png"

        res = self.upload("biero", filename)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(exists(join(settings.MEDIA_ROOT, "associations", filename)))

        return res.data["id"], filename

    def _test_file_is_removed_when_media_is_deleted(self, media_id, media_file):
        self.login("17admin_biero")
        res = self.delete(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(exists(join(settings.MEDIA_ROOT, "associations", media_file)))

    def test_cant_upload_if_has_not_media_permission(self):
        self.login("17admin_pdm")
        filename = "crust.png"

        res = self.upload("biero", filename)
        self.assertEqual(res.status_code, 403)

    def test_cant_delete_if_has_not_media_permission(self):
        media_id, media_file = self._test_upload_single_media()

        self.login("17admin_pdm")
        res = self.delete(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 403)
