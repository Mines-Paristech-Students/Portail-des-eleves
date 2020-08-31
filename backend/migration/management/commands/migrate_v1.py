from django.core.management import BaseCommand

from migration.importers.ProfileImporter import ProfileImporter


class Command(BaseCommand):
    help = "Migrates the old portal to the new one"

    importers = [ProfileImporter]

    def __init__(self):
        super().__init__()
        self.importers = [importer(self.stdout) for importer in self.importers]

    def handle(self, *args, **options):
        for importer in self.importers:
            importer.migrate()
