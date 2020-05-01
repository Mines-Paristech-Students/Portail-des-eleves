    # ##########
    # # SUBMIT #
    # ##########

    # submit_course_data = {
    #     "id": 1,
    #     "ratings": [
    #         {
    #             "id": 1,
    #             "value": 2,
    #         }
    #     ],
    #     "comments": [
    #         {
    #             "id": 2,
    #             "content": "plop",
    #         },
    #     ],
    # }

    # def test_if_not_logged_in_then_cannot_submit(self):
    #     res = self.submit(pk=self.submit_course_data["id"], data=None)
    #     self.assertStatusCode(res, 401)
    
    # def test_if_logged_in_then_cannot_submit_without_required_questions(self):
    #     self.login("17simple")
    #     data = copy.deepcopy(self.submit_course_data).pop("ratings")

    #     res = self.submit(pk=self.submit_course_data["id"], data=data)
    #     self.assertStatusCode(res, 404)


    # def test_if_logged_in_cannot_submit_twice(self):
    #     self.login("17simple")
    #     res = self.submit(pk=self.submit_course_data["id"], data=None)
    #     self.assertStatusCode(res, 405)