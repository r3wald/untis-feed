module.exports = ((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
                _links: {
                    self: {
                        href: '/'
                    },
                    feed: {
                        href: '/feed'
                    },
                    lessons: {
                        href: '/lessons'
                    },
                    gui: {
                        href: '/view'
                    }
                }
            },
            null,
            2
        )
    );
});
