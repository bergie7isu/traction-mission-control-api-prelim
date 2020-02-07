function makeIssuesArray() {
    return [
        {
            "id": 1,
            "issue": "First issue",
            "who": "Mark Bergstrom",
            "created": "2019-01-03",
            "status": null,
            "reviewed": "no"
        },
        {
            "id": 2,
            "issue": "Second issue",
            "who": "Paul Johnson",
            "created": "2019-01-03",
            "status": null,
            "reviewed": "no"
        },
        {
            "id": 3,
            "issue": "Third issue",
            "who": "Joel Tjepkes",
            "created": "2019-01-03",
            "status": null,
            "reviewed": "no"
        },
        {
            "id": 4,
            "issue": "Fourth issue",
            "who": "Steve Thor",
            "created": "2019-01-03",
            "status": null,
            "reviewed": "no"
        },
        {
            "id": 5,
            "issue": "Fifth issue",
            "who": "Nathan Witt",
            "created": "2019-01-03",
            "status": null,
            "reviewed": "no"
        },
    ];
};

function makeMaliciousIssue() {
    const maliciousTodo = {
        "id": "911",
        "todo": 'Naughty naughty very naughty <script>alert("xss");</script>',
        "who": "Mark Bergstrom",
        "created": "2019-01-03",
        "due": "2019-01-10",
        "status": null,
        "reviewed": "no",
        "issue": `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    };
    const expectedTodo = {
        ...maliciousTodo,
        "todo": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        "issue": `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
        maliciousTodo,
        expectedTodo
    };
};

module.exports = { makeIssuesArray, makeMaliciousIssue };