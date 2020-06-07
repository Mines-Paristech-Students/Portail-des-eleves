import { toUrlParams } from "./urlParam";

test("converts scalar values to correct GET parameter", () => {
    expect(
        toUrlParams({
            foo: 3,
            bar: "bat",
            baz: false,
        })
    ).toBe("?foo=3&bar=bat&baz=false");
});

test("converts array to correct GET parameter", () => {
    expect(
        toUrlParams({
            foo: [3, "bat", false],
        })
    ).toBe("?foo=3&foo=bat&foo=false");
});

test("converts object to correct GET parameter", () => {
    expect(
        toUrlParams({
            foo: {
                in: "bar",
                gte: 3,
                correct: false,
            },
        })
    ).toBe("?foo__in=bar&foo__gte=3&foo__correct=false");
});

test("converts deeply nested object to correct GET parameter", () => {
    expect(
        toUrlParams({
            foo: {
                in: "bar",
                equal: {
                    deep: "deep",
                    shallow: {
                        first: "first",
                        second: false,
                    },
                },
            },
        })
    ).toBe(
        "?foo__in=bar&foo__equal__deep=deep&foo__equal__shallow__first=first&foo__equal__shallow__second=false"
    );
});

test("converts mixed-type parameters to correct GET parameter", () => {
    expect(
        toUrlParams({
            foo: 3,
            bar: "bat",
            baz: false,
            piche: [42, "clic", true],
            fee: {
                in: "bar",
                gte: 3,
                correct: false,
            },
        })
    ).toBe(
        "?foo=3&bar=bat&baz=false&piche=42&piche=clic&piche=true&fee__in=bar&fee__gte=3&fee__correct=false"
    );
});
