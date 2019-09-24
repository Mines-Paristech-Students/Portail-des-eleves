from backend.tests_utils import BaseTestCase

from authentication.models.questions import ProfileQuestion, ProfileAnswer


class TestListProfileQuestions(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_questions.yaml']

    ALL_USERS = ['17admin', '17simple']
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self, pk):
        return f'/users/questions/{pk}/'

    def list(self, pk):
        return self.get(self.endpoint_list(pk))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list('17simple')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_list(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.list('17simple')
            self.assertStatusCode(res, 200)

            self.assertEqual(
                len(ProfileQuestion.objects.all()),
                len(res.data['questions'])
            )

            for question in res.data['questions']:
                q = ProfileAnswer.objects.filter(question=question['id'], user='17simple')

                if q.exists():
                    db_answer = q[0]
                    res_answer = question['answer']

                    self.assertEqual(db_answer.text, res_answer['text'])
                    self.assertEqual(db_answer.user.id, res_answer['user'])
                    self.assertEqual(db_answer.question.id, res_answer['question'])
                else:
                    self.assertEqual(question['answer'], {})
