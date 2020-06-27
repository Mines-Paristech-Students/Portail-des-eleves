from os.path import join, exists
import backend.settings as settings
from associations.tests.media.base_test_media import BaseMediaTestCase


class TestMediaPreviewCase(BaseMediaTestCase):
    def test_file_upload_and_removal_png(self):
        self._test_file_upload_and_removal("crust.png", "crust_preview.png")

    def test_file_upload_and_removal_pdf(self):
        self._test_file_upload_and_removal("lorem-ipsum.pdf", "lorem-ipsum_preview.png")

    def _test_file_upload_and_removal(self, media_filename, preview_filename):
        # preview is created
        self.login("17admin_biero")

        res = self.upload("biero", media_filename)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(
            exists(join(settings.MEDIA_ROOT, "associations", media_filename))
        )
        self.assertTrue(
            exists(join(settings.MEDIA_ROOT, "associations", preview_filename))
        )

        media_id = res.data["id"]

        # preview is accessible
        res = self.get(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data.get("preview_url"),
            f"http://testserver/medias/associations/{preview_filename}",
        )

        # preview is removed after model deletion
        res = self.delete(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(
            exists(join(settings.MEDIA_ROOT, "associations", media_filename))
        )
        self.assertFalse(
            exists(join(settings.MEDIA_ROOT, "associations", preview_filename))
        )
