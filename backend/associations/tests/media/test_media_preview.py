from os.path import join, exists
import backend.settings as settings
from associations.tests.media.base_test_media import BaseMediaTestCase


class TestMediaPreviewImageCase(BaseMediaTestCase):
    def test_file_upload_and_removal(self):
        media_id, media_file, preview_file = self.preview_created()
        self.preview_is_accessible(media_id)
        self.preview_removed_after_model_deletion(media_id, media_file, preview_file)

    def preview_created(self):
        self.login("17admin_biero")
        filename = "crust.png"
        preview_filename = "crust_preview.png"

        res = self.upload("biero", filename)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(exists(join(settings.MEDIA_ROOT, "associations", filename)))
        self.assertTrue(
            exists(join(settings.MEDIA_ROOT, "associations", preview_filename))
        )

        return res.data["id"], filename, preview_filename

    def preview_is_accessible(self, media_id):
        res = self.get(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data.get("preview_url"),
            "http://testserver/medias/associations/crust_preview.png",
        )

    def preview_removed_after_model_deletion(self, media_id, media_file, preview_file):
        self.login("17admin_biero")
        res = self.delete(f"/associations/media/{media_id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(exists(join(settings.MEDIA_ROOT, "associations", media_file)))
        self.assertFalse(
            exists(join(settings.MEDIA_ROOT, "associations", preview_file))
        )
