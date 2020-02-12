function makeIssuesArray() {
    return [
        {
            "id": 1,
            "issue": "First issue",
            "who": "Mark Bergstrom",
            "created": "2019-01-03",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no"
        },
        {
            "id": 2,
            "issue": "Second issue",
            "who": "Paul Johnson",
            "created": "2019-01-03",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no"
        },
        {
            "id": 3,
            "issue": "Third issue",
            "who": "Joel Tjepkes",
            "created": "2019-01-03",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no"
        },
        {
            "id": 4,
            "issue": "Fourth issue",
            "who": "Steve Thor",
            "created": "2019-01-03",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no"
        },
        {
            "id": 5,
            "issue": "Fifth issue",
            "who": "Nathan Witt",
            "created": "2019-01-03",
            "status": null,
            "status_date": "2020-02-12",
            "reviewed": "no"
        },
    ];
};

function makeMaliciousIssue() {
    const maliciousIssue = {
        "id": 1,
        "issue": 'Naughty naughty very naughty <script>alert("xss");</script>',
        "who": `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        "created": "2019-01-03",
        "status": null,
        "status_date": "2020-02-12",
        "reviewed": "no"
    };
    const expectedIssue = {
        ...maliciousIssue,
        "issue": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        "who": `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
        maliciousIssue,
        expectedIssue
    };
};

module.exports = { makeIssuesArray, makeMaliciousIssue };