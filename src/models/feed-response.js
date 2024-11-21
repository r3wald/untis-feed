class FeedResponse {

    constructor(
        pendingItems,
        items,
        nextLink,
    ) {
        this.items = items;
        this.pendingItems = pendingItems;
        this.nextLink = nextLink;
    }

    getData() {
        let links = {};
        if (!!this.nextLink) {
            links.next = {
                href: this.nextLink
            };
        }
        return {
            pending: this.pendingItems,
            _links: links,
            items: this.items,
        };
    }
}

module.exports = FeedResponse;
