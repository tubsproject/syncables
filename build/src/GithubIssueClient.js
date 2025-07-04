import { DevonianClient } from 'devonian';
export class GithubIssueClient extends DevonianClient {
    async connect() {
        //   parseWebhookData(data: GitHubWebhookObject): {
        //   type: WebhookEventType;
        //   item: FetchedItem;
        // } {
        //   // console.log("parsing in client");
        //   switch (data.action) {
        //     case "opened": {
        //       return {
        //         type: WebhookEventType.Created,
        //         item: this.translateGhItem(data.issue, "issue"),
        //       };
        //     }
        //     case "closed": {
        //       return {
        //         type: WebhookEventType.Deleted,
        //         item: this.translateGhItem(data.issue, "issue"),
        //       };
        //     }
        //     case "created": {
        //       return {
        //         type: WebhookEventType.Created,
        //         item: this.translateGhItem(data.comment!, "comment"),
        //       };
        //     }
        //     case "edited": {
        //       let item: FetchedItem;
        //       if (typeof data.comment === "undefined") {
        //         item = this.translateGhItem(data.issue, "issue");
        //       } else {
        //         item = this.translateGhItem(data.comment!, "comment");
        //       }
        //       return {
        //         type: WebhookEventType.Updated,
        //         item,
        //       };
        //     }
        //     case "deleted": {
        //       let item: FetchedItem;
        //       if (typeof data.comment === "undefined") {
        //         item = this.translateGhItem(data.issue, "issue");
        //       } else {
        //         item = this.translateGhItem(data.comment!, "comment");
        //       }
        //       return {
        //         type: WebhookEventType.Deleted,
        //         item,
        //       };
        //     }
        //     default: {
        //       throw new Error('Could not parse Webhook Body!');
        //       // return {
        //       //   type: WebhookEventType.Deleted,
        //       //   item: {} as FetchedItem,
        //       // };
        //     }
        //   }
        // }
    }
    async add(obj) {
        console.log('Add to Github', obj);
        // const headers = DEFAULT_HTTP_HEADERS;
        // headers['Authorization'] = `Bearer ${process.env.GITHUB_BEARER_TOKEN}`;
        // const fetchResult = await fetch(
        //   `${BASE_API_URL}/${process.env.GITHUB_REPO}/${REL_API_PATH_ISSUES}`,
        //   {
        //     method: 'POST',
        //     headers,
        //     body: JSON.stringify(
        //       {
        //         title: obj.title,
        //         body: obj.body,
        //       },
        //       null,
        //       2,
        //     ),
        //   },
        // );
        // console.log(await fetchResult.json());
        // return fetchResult.json();
        return Object.assign(obj, { number: 42 });
    }
}
//# sourceMappingURL=GithubIssueClient.js.map