
export const PaginatedCardComment = ({ show, question, course }) => {
    const [show, setShow] = useState<boolean>(false);
    const PAGE_SIZE = 1;
    const AUTO_FETCH_DIFF = 2;

    const newToast = useContext(ToastContext);
    const [index, setIndex] = useState<number>(0);
    const [next, setNext] = useState<number | null>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [comments, setComments] = useState<string[]>([])

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        if (isFetching || !next) return;

        if (Math.abs(next % PAGE_SIZE) > 1) return;

        api.courses
            .commentsPage(course.id, question.id, next, PAGE_SIZE)
            .then((page: PaginatedResponse<Comment[]>) => {
                disectPaginatedResponse(page);
                setIsFetching(false);
            })
            .catch(err => {
                newToast({
                    message: "Could not fetch next message",
                    level: ToastLevel.Error,
                })
            })
    }, [index])

    const disectPaginatedResponse = (page: PaginatedResponse<Comment[]>) => {
        if (!page.next) setNext(null);
        else {
            const url = new URL(page.next);
            const next = url.searchParams.get("next");
            if (next) setNext(Number(next));
            else setNext(null);
        }

        let copy = comments.slice();
        copy = copy.concat(page.results.map(comment => comment.content));
        setComments(copy);
    }

    return (
        <Col md={8} key={question.id}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        {question.label}
                    </Card.Title>
                </Card.Header>
                <Card.Footer
                    as={Button}
                    onClick={(e) => setShow(!show)}
                >
                    <Card.Text>
                        Détails <i className="fe fe-arrow-down" />
                    </Card.Text>
                </Card.Footer>
                <Card.Body>
                    <Carousel
                        as={Row}
                        activeIndex={index}
                        onSelect={handleSelect}
                        interval={null}
                        nextIcon={<span aria-hidden="true" className="fe fe-right-circle" />}
                        prevIcon={<span aria-hidden="true" className="fe fe-left-circle" />}
                    >
                        {comments.map(comment =>
                            <Carousel.Item className="overflow-auto">
                                <p>{comment}</p>
                            </Carousel.Item>
                        )}
                    </Carousel>
                </Card.Body>
            </Card>
        </Col>
    )
}