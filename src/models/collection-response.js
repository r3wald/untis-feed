class CollectionResponse {

    constructor(
        items,
        total,
        limit,
        page
    ) {
        this.items = items;
        this.total = total;
        this.limit = limit;
        this.page = page;
    }

    getData() {
        return {
            total: this.total,
            limit: this.limit,
            page: this.page,
            items: this.items
        };
    }
}

module.exports = CollectionResponse;
