const Ice = require('ice').Ice;
const Murmur = require('./Generated/Murmur.js').Murmur;

function ice() {
    return Ice.Promise.try(() => {
        const host = process.env.MURMUR_HOST;
        const port = process.env.MURMUR_PORT;
        const secret = process.env.MURMUR_SECRET;

        console.log('Connecting to murmur on ' + host + ':' + port);

        const iceOptions = new Ice.InitializationData();
        iceOptions.properties = Ice.createProperties([], iceOptions.properties);
        iceOptions.properties.setProperty('Ice.Default.EncodingVersion', '1.0');
        iceOptions.properties.setProperty('Ice.ImplicitContext', 'Shared');

        const communicator = Ice.initialize(iceOptions);

        if (secret) {
            communicator.getImplicitContext().put('secret', secret);
        }

        const proxy = communicator.stringToProxy('Meta:tcp -h ' + host + ' -p ' + port);
        return Murmur.MetaPrx.checkedCast(proxy);
    })
}

async function getUsers(serverId) {
    const meta = await ice();
    if (!meta) {
        throw new Error('Could not get meta');
    }

    const server = await meta.getServer(serverId);
    if(!server) {
        throw new Error('Could not get server');
    }

    const users = await server.getUsers();
    return Array.from(users.values()).map(c => ({
        id: c.userid,
        name: c.name,
        channel: c.channel,
    }));
}

async function getChannels(serverId) {
    const meta = await ice();
    if (!meta) {
        throw new Error('Could not get meta');
    }

    const server = await meta.getServer(serverId);
    if(!server) {
        throw new Error('Could not get server');
    }

    const channels = await server.getChannels();
    return Array.from(channels.values()).map(c => ({
        id: c.id,
        name: c.name,
        parent: c.parent,
        position: c.position,
    }));
}

module.exports = {
    getUsers,
    getChannels
};
