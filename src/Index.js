const ice = require('./Ice');

async function Index(req, res) {
    const serverId = 1;

    const users = await ice.getUsers(serverId);

    const channels = await ice.getChannels(serverId);
    const channelsWithUsers = channels.map(c => {
        c.users = users.filter(u => u.channel === c.id).length;
        return c;
    });

    const channelsById = channelsWithUsers.reduce((channels, c) => {
        channels[c.id] = c;
        return channels;
    }, {});

    const tree = channelsWithUsers.reduce((tree, c) => {
        if (!tree[c.parent]) {
            tree[c.parent] = []
        }

        tree[c.parent].push(c.id);
        return tree;
    }, {});

    res.render('index', {
        channels: channelsById,
        tree: tree,
    });
}

module.exports = Index;
