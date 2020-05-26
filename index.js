let Aliyun = require('aliyun-apisign');
let Config = require('./config');

(async () => {
    try {
        let client = new Aliyun({
            AccessKeyId: Config.AccessKeyId,
            AccessKeySecret: Config.AccessKeySecret,
            serverUrl: "https://dm.aliyuncs.com"
        });

        let today = new Date();
        let last_week = new Date(today.getTime() - 3600 * 24 * 6 * 1000);
        let three_days_ago = new Date(today.getTime() - 3600 * 24 * 2 * 1000);

        let work = async (from, to, postfix) => {
            let res = await client.get("/", {
                Action: "SenderStatisticsByTagNameAndBatchID",
                Version: "2015-11-23",
                StartTime: from.toISOString().substring(0, 10),
                EndTime: to.toISOString().substring(0, 10)
            });
            let request = 0;
            let unavailable = 0;
            let success = 0;
            let failed = 0;
            for (let stat of res.body.data.stat) {
                request += stat.requestCount;
                unavailable += stat.unavailableCount;
                success += stat.successCount;
                failed += stat.faildCount;
            }
            console.log(`aliyun-dm-${postfix} request=${request}i,unavailable=${unavailable}i,success=${success}i,failed=${failed}i ${new Date().getTime() * 1000 * 1000}`);
        };

        await work(last_week, today, '7days');
        await work(three_days_ago, today, '3days');
        await work(today, today, '1day');
    } catch (err) {
        console.log(err);
    }
})();
