import random
import time

from django.http import JsonResponse
from rest_framework.decorators import api_view


def choice(tab, n=1):
    random.shuffle(tab)
    return tab[0:min(n, len(tab))]


@api_view(["GET"])
def get_rer_timetable(request):
    # @gl-mr you can add you magic here !
    # The structure of the answer is defined in res

    stations = [
        "Aéroport Ch. de Gaulle 2 TGV",
        "Aéroport Ch. de Gaulle 1",
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
        "stops": [{
            "name": s,
            "timetable": [{
                "time": (time.time() + 60 * (10 * i + j)) * 1000,
                "train_id": t
            } for (j, t) in enumerate(choice(trains, 2))]
        } for (i, s) in enumerate(stations)]
    }, {
        "direction": "Châtelet–Les Halles",
        "stops": [{
            "name": s,
            "timetable": [{
                "time": (time.time() + 60 * (10 * i + j)) * 1000,
                "train_id": t
            } for (j, t) in enumerate(choice(trains, 2))]
        } for (i, s) in enumerate(reversed(stations))]
    }]

    return JsonResponse({"trains": res})
