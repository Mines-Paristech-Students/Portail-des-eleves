import json
from django.shortcuts import render
from rest_framework import viewsets, views, generics
from random import shuffle

from rest_framework import permissions, status
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from repartitions.models import Repartition, Proposition, Voeux
from repartitions.serializers import RepartitionSerializer
from authentication.authentication import JWTCookieAuthentication
from authentication.models import User
from backend import settings
from django.http import JsonResponse
import numpy as np
from scipy.optimize import linear_sum_assignment

def serializeProposition(n):
	return {"name": n.nom, "num": n.num, "min": n.min_eleves, "max": n.max_eleves}

def serializeRepartition(n, user):
	queryset = Proposition.objects.all().filter(campagne = n).order_by("num")
	voeux = []
	resultat = None
	try:
		if user is not None:
			v = Voeux.objects.get(campagne=n, user=user)
			voeux = json.loads(v.voeux)
			resultat = v.outcome
			if resultat == -1: resultat = None
	except Voeux.DoesNotExist:
		pass
	progress = None
	if user is not None and n.status == 1 and user.is_admin:
		progress = {"haveRep":[], "haventRep":[]}
		for x in Voeux.objects.filter(campagne=n):
			name = x.user.first_name + " " + x.user.last_name
			if x.isNew:
				progress["haventRep"].append(name)
			else:
				progress["haveRep"].append(name)
	return {"id": n.id, "progress": progress, "title": n.title, "voeux": voeux, "promotion": n.promotion, "status": n.status, "equirepartition": n.equirepartition, "propositions": [serializeProposition(p) for p in queryset], "resultat": resultat}

class RepartitionsViewSet(views.APIView):
	authentication_classes = [JWTCookieAuthentication]

	def get(self, request, rid=None, **kwargs):
		queryset = Repartition.objects.all()

		user = self.request.user
		if not user.is_admin:
			queryset = queryset.filter(status__gt = 0) #si l'utilisateur n'est pas admin, on prend que les repartitions commencées
		queryset = queryset.filter(promotion = "P"+str(user.promo))
		if rid is not None:
			queryset = queryset.filter(pk=rid)
			ans = [serializeRepartition(r, user) for r in queryset]
			if ans:
				return JsonResponse(ans[0] , safe=False)
			else:
				return JsonResponse({"status": "error", "message": "Not found"}, status="404")
		queryset = queryset.order_by("-id")
		return JsonResponse([serializeRepartition(r, user) for r in queryset] , safe=False)

	def put(self, request, rid=None, **kwargs):
		if rid is not None:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")

		body = json.loads(request.body)
		errors = []
		user = self.request.user
		
		if not True: #TODO canCreateNewRepartition():
			return JsonResponse({"status": "error", "message": "You're not allowed to create a new repartition campaign"}, status="401")
		promo = "P"+str(user.promo)
		if not user.is_admin and "promotion" in body and body["promotion"] != promo:
			return JsonResponse({"status": "error", "message": "You're not allowed to set promotion in the new repartition campaign"}, status="400")

		if "title" not in body or not isinstance(body["title"], str):
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
		if body["title"] == "":
			return JsonResponse({"status": "error", "message": "Le titre ne peut pas être vide"}, status="400")
		n = Repartition()
		n.title = body["title"]
		n.status = 0
		n.promotion = body["promotion"] if ("promotion" in body and isinstance(body["promotion"], str)) else promo
		n.equirepartition = body["equirepartition"] if ("equirepartition" in body and body["equirepartition"] in [True, False]) else True
		n.save()

		if "propositions" in body:
			for p in body["propositions"]:
				if "name" not in p or not isinstance(p["name"],str):
					continue
				np = Proposition()
				np.campagne = n
				np.nom = p["name"]
				np.num = 0
				np.min_eleves = p["min"] if "min" in p and isinstance(p["min"], int) else 0
				np.max_eleves = p["max"] if "max" in p and isinstance(p["max"], int) else 1000
				if np.min_eleves <= np.max_eleves:
					np.save()
		return JsonResponse(serializeRepartition(n, user), safe=False)

	def patch(self, request, rid=None, **kwargs):
		if rid is None:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")

		body = json.loads(request.body)
		errors = []
		user = self.request.user
		
		if not True: #TODO canCreateNewRepartition():
			return JsonResponse({"status": "error", "message": "You're not allowed to edit a repartition campaign"}, status="401")
		promo = "P"+str(user.promo)
		if not user.is_admin and "promotion" in body and body["promotion"] != promo:
			return JsonResponse({"status": "error", "message": "You're not allowed to set promotion in a repartition campaign"}, status="400")

		try:
			n = Repartition.objects.get(pk=rid)
			if n.status > 0:
				raise BadRequest
			if "title" in body:
				assert(isinstance(body["title"], str))
				if body["title"] == "":
					return JsonResponse({"status": "error", "message": "Le titre ne peut pas être vide"}, status="400")
				n.title = body["title"]
			if "promotion" in body:
				assert(isinstance(body["promotion"], str))
				n.promotion = body["promotion"]
			if "equirepartition" in body:
				assert(body["equirepartition"] in [True, False])
				n.equirepartition = body["equirepartition"]
			n.save()

			if "propositions" in body:
				for x in Proposition.objects.all().filter(campagne=n):
					x.delete()

				for p in body["propositions"]:
					g = Proposition()
					g.num = 0
					g.campagne = n
					assert("min" in p and "max" in p and "name" in p)
					assert(isinstance(p["min"], int))
					assert(isinstance(p["max"], int))
					assert(isinstance(p["name"], str))
					g.nom = p["name"]
					g.min_eleves = p["min"]
					g.max_eleves = p["max"]
					if g.min_eleves <= g.max_eleves:
						g.save()
			return JsonResponse(serializeRepartition(n, user), safe=False)
		except AssertionError:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
		except Repartition.DoesNotExist:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400") #claquage
	def delete(self, request, rid=None, **kwargs):
		if rid is None:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
		if not True: #TODO canCreateNewRepartition():
			return JsonResponse({"status": "error", "message": "You're not allowed to edit a repartition campaign"}, status="401")

		try:
			n = Repartition.objects.get(pk=rid)
			n.delete()
		except DoesNotExist:
			return JsonResponse({"status": "error", "message": "No such campaign"}, status="404")
		return JsonResponse("", safe=False, status=204)

class RepartitionsCanEdit(generics.GenericAPIView):
	is_prod_mode = settings.is_prod_mode()
	authentication_classes = [JWTCookieAuthentication]
	
	def get(self, request, *args, **kwargs):
		return JsonResponse({"canEdit": True, "restriction": ["P18","P17","P16"]}, status="200")

class RepartitionsChangeVoeux(views.APIView):
	authentication_classes = [JWTCookieAuthentication]

	def post(self, request, **kwargs):
		body = json.loads(request.body)
		user = self.request.user

		try:
			c = Repartition.objects.get(pk=body['id'])
			v = Voeux.objects.get(campagne=c, user=user)
			voeuxU = json.loads(v.voeux)
			v.isNew = False
			pos = body["voeux"]
			if body["direction"] == "down":
				voeuxU[pos], voeuxU[pos+1] = voeuxU[pos+1], voeuxU[pos]		
			else:
				voeuxU[pos], voeuxU[pos-1] = voeuxU[pos-1], voeuxU[pos]
			v.voeux = json.JSONEncoder().encode(voeuxU)
			v.save()
			return JsonResponse(voeuxU, status="200", safe=False)
		except IndexError:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
		except Repartition.DoesNotExist:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
		except Voeux.DoesNotExist:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")

class RepartitionsStartCampaignView(views.APIView):
	authentication_classes = [JWTCookieAuthentication]

	def post(self, request, **kwargs):
		i = json.loads(request.body)["id"]
		user = self.request.user
		body = json.loads(request.body)

		if not user.is_admin:
			return JsonResponse({"status": "error", "message": "Unauthorized"}, status="403")

		try:
			c = Repartition.objects.get(pk=body['id'])
			assert(c.status == 0)
			assert(c.promotion[0]=='P')
			prom = int(c.promotion[1:])
			us = User.objects.filter(promo=prom)
			ps = Proposition.objects.filter(campagne=c)
			if not c.equirepartition and (sum([x.min for x in ps]) > len(us) or sum([x.max for x in ps]) < len(us)):
				return JsonResponse({"status": "error", "message": "Pas bon"}, status="424")
			for i in range(len(ps)):
				ps[i].num = i
				ps[i].save()
			for u in us:
				l = list(range(len(ps)))
				shuffle(l)
				v = Voeux()
				v.campagne = c
				v.user = u
				v.voeux = json.JSONEncoder().encode(l)
				v.isNew = True
				v.save()
			c.status = 1
			c.save()
			return JsonResponse(serializeRepartition(c, user), status="200", safe=False)
		except AssertionError:
			return JsonResponse({"status": "error", "message": "Internal Server Error"}, status="500")
		except Repartition.DoesNotExist:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")

class RepartitionsStopCampaignView(views.APIView):
	authentication_classes = [JWTCookieAuthentication]

	def post(self, request, **kwargs):
		i = json.loads(request.body)["id"]
		user = self.request.user
		body = json.loads(request.body)

		if not user.is_admin:
			return JsonResponse({"status": "error", "message": "Unauthorized"}, status="403")

		try:
			c = Repartition.objects.get(pk=body['id'])
			assert(c.status == 1)
			vs = Voeux.objects.all().filter(campagne=c).order_by("id")
			vs_voeux_unpack = [json.loads(x.voeux) for x in vs]
			ps = Proposition.objects.all().filter(campagne=c).order_by("num")
			n_propositions = len(ps)
			n_users = len(vs)
			rejets_propositions = [0 for x in ps]
			for v in vs_voeux_unpack:
				for i,l in enumerate(v):
					rejets_propositions[l]+=i
			meilleures_props = list(range(n_propositions))
			meilleures_props.sort(key = lambda x: rejets_propositions[x])
			nombre_de_places_par_prop = [x.min if not c.equirepartition else n_users // n_propositions for x in ps]
			j = 0
			while sum(nombre_de_places_par_prop) < n_users:
				if c.equirepartition:
					nombre_de_places_par_prop[meilleures_props[j]] += 1
				else:
					nombre_de_places_par_prop[meilleures_props[j]] += (n_users - sum(nombre_de_places_par_prop))
					if nombre_de_places_par_prop[meilleures_props[j]] > ps[meilleures_props[j]].max:
						nombre_de_places_par_prop[meilleures_props[j]] = ps[meilleures_props[j]].max
				j+=1
			proposition_par_j = []
			a = np.zeros(shape=(n_users,n_users),dtype=np.float)
			for i,n in enumerate(nombre_de_places_par_prop):
				proposition_par_j = proposition_par_j+[i]*n
			for i,lv in enumerate(vs_voeux_unpack):
				for j in range(n_users):
					a[i,j] = lv.index(proposition_par_j[j]) #poids de l'assignation de i à la tache du tableau des taches j
			b = linear_sum_assignment(a)
			outcomes = [-1]*n_users
			for i in range(n_users):
				outcomes[b[0][i]] = int(proposition_par_j[b[1][i]])
			for x in vs:
				x.outcome = outcomes[0]
				outcomes = outcomes[1:]
				x.save()
			c.status = 2
			c.save() # TODO cette partie
			return JsonResponse(serializeRepartition(c, user), status="200", safe=False)
		except AssertionError:
			return JsonResponse({"status": "error", "message": "Internal Server Error"}, status="500")
		except Repartition.DoesNotExist:
			return JsonResponse({"status": "error", "message": "Bad Request"}, status="400")
