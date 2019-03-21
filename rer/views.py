from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_rer_timetable(request):
    stations = [
        "Aéroport Ch. de Gaulle 2 TGV",
        "Mitry–Claye",
        "Aéroport Ch. de Gaulle 1",
        "Villeparisis Mitry-le-Neuf",
        "Parc des Expositions",
        "Vert-Galant Sevran–Livry",
        "Villepinte",
        "Sevran Beaudottes",
        "Aulnay-sous-Bois",
        "Le Blanc-Mesnil",
        "Drancy",
        "Le Bourget",
        "La Courneuve–Aubervilliers",
        "La Plaine–Stade de France",
        "Gare du Nord",
        "Châtelet–Les Halles",
        "Saint-Michel–Notre-Dame",
        "Luxembourg",
        "Port-Royal",
        "Denfert-Rochereau",
        "Cité Universitaire",
        "Gentilly Laplace"
    ]

    trains = [
        "CPA",
        "YOLO",
        "SPE",
        "RAP"
    ]

    res = [{
        "direction": "Cité universitaire",
        "stops": [{s: [{t: "12:" + str(10 * i + j)} for (j, t) in enumerate(trains)]} for (i, s) in
                  enumerate(stations)]
    }, {
        "direction": "Châtelet–Les Halles",
        "stops": [{s: [{t: "12:" + str(10 * i + j)} for (j, t) in enumerate(trains)]} for (i, s) in
                  enumerate(reversed(stations))]
    }]

    return JsonResponse({"trains": res})
