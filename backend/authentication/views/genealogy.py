from rest_framework import views
from rest_framework.response import Response

from authentication.models import User

class GenealogyView(views.APIView):
    @staticmethod
    def chemin_links(chemin):
        """
            For a given chemin of n students, returns list of size n-1 of links between each students
        """
        chemin_links = []
        for i in range(len(chemin) - 1):
            chemin_links.append(chemin[i].relation_with(chemin[i + 1]) + ' de ')
        return chemin_links

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
        if result is None:
            return Response({'linkFound': False, 'result': [], 'resultLinks': []})
        result_links = self.chemin_links(result)
        result = [user.id for user in result]
        return Response({'linkFound': True, 'result': result, 'resultLinks': result_links})
