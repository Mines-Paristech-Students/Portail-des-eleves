from rest_framework import views
from rest_framework.response import Response

from authentication.models import User

class GenealogyView(views.APIView):
    @staticmethod
    def chemin_to_html(chemin):
        """
            Effectue un rendu en code HTML d'une liste d'élèves en précisant les
            relations entre deux élèves successifs.
        """
        if chemin:
            chemin_string = '<a href = "' + chemin[0].get_absolute_url() + '">' + chemin[0].first_name + ' ' + chemin[
                0].last_name + '</a>'
            for i in range(len(chemin) - 1):
                chemin_string = chemin_string + ', ' + chemin[i].relation_with(chemin[i + 1]) + ' de ' + '<a href = "' + \
                                chemin[i + 1].get_absolute_url() + '">' + chemin[i + 1].first_name + ' ' + chemin[
                                    i + 1].last_name + '</a>'
        else:
            chemin_string = "Aucun chemin existant"
        return chemin_string

    def get(self, request):
        eleves = User.objects.all()
        result = []
        recherche = False
        result_string = ""
        return Response({'eleves': eleves, 'result': result, 'result_string': result_string, 'recherche': recherche})

    def post(self, request):
        """Le plus court chemin séparant deux élèves"""
        start = User.objects.get(id=request.data['start_username']['value'])
        end = User.objects.get(id=request.data['end_username']['value'])
        result = User.BFS(start, end)
        result_string: str = self.chemin_to_html(result)
        return Response({'result_string': result_string})
