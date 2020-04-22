#!bash -c "python3 manage.py shell"

from courses.serializers import *

from rest_framework.serializers import ModelSerializer

ID = 45

data = {
    "questions": [
        {
            "id": ID,
            "label": "4+3",
            # "required": True,
            # "category": 'C',
        }
    ]
}

serializer = FormSerializer(data=data)

instance = serializer.create(data)

print(Question.objects.filter(id=ID)[0])

print(instance)
data = {
    "questions": [
        {
            "id": ID,
            "label": "Licorne",
            # "required": True,
            # "category": 'C',
        }
    ]
}

serializer.update(instance, data)

print(Question.objects.filter(id=ID)[0])
