function makeTodosArray() {
    return [
        {
            "id": 1,
            "todo": "First todo",
            "who": "Mark Bergstrom",
            "created": "2019-01-03",
            "due": "2019-01-10",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no",
            "issue": null
        },
        {
            "id": 2,
            "todo": "Second todo",
            "who": "Paul Johnson",
            "created": "2019-02-03",
            "due": "2019-02-10",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no",
            "issue": null
        },
        {
            "id": 3,
            "todo": "Third todo",
            "who": "Joel Tjepkes",
            "created": "2019-03-03",
            "due": "2019-03-10",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no",
            "issue": null
        },
        {
            "id": 4,
            "todo": "Fourth todo",
            "who": "Steve Thor",
            "created": "2019-04-03",
            "due": "2019-04-10",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no",
            "issue": null
        },
        {
            "id": 5,
            "todo": "Fifth todo",
            "who": "Nathan Witt",
            "created": "2019-05-03",
            "due": "2019-05-10",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no",
            "issue": null
        }
    ];
};

function makeMaliciousTodo() {
    const maliciousTodo = {
        "id": 1,
        "todo": 'Naughty naughty very naughty <script>alert("xss");</script>',
        "who": `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        "created": "2019-01-03",
        "due": "2019-01-10",
        "status": null,
        "reviewed": "no",
        "issue": null
    };
    const expectedTodo = {
        ...maliciousTodo,
        "todo": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        "who": `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
        maliciousTodo,
        expectedTodo
    };
};

module.exports = { makeTodosArray, makeMaliciousTodo };