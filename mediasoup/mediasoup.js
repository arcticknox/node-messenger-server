const config = require('../config/mediasoup');
const mediasoup = require('mediasoup');


const removeItems = (items, socket, type) => {
  items.forEach(item => {
    if (item.socketId === socket.id) {
      item[type].close();
    }
  });
  items = items.filter(item => item.socketId !== socket.id);

  return items;
};

const createWorker = async () => {
  const worker = await mediasoup.createWorker({
    rtcMinPort: config.mediasoup.rtcMinPort,
    rtcMaxPort: config.mediasoup.rtcMaxPort,
  });
  console.log(`worker pid ${worker.pid}`);

  worker.on('died', error => {
    // This implies something serious happened, so kill the application
    console.error('mediasoup worker has died', error);
    setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
  });

  return worker;
};

const createRoom = async (roomName, socketId, rooms, worker) => {
  let router;
  let peers = [];
  const mediaCodecs = config.mediasoup.router.mediaCodecs;
  if (rooms[roomName]) {
    router = rooms[roomName].router;
    peers = rooms[roomName].peers || [];
  } else {
    router = await worker.createRouter({ mediaCodecs, });
  }
  
  console.log(`Router ID: ${router.id}`, peers.length);

  rooms[roomName] = {
    router,
    peers: [...peers, socketId],
  };
  console.log('ROOM------', JSON.stringify(rooms, null, 2));

  return { router, rooms };
};

const createWebRtcTransport = async (router) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
      const webRtcTransport_options = {
        listenIps: config.mediasoup.webRtcTransport.listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      };

      // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
      let transport = await router.createWebRtcTransport(webRtcTransport_options);
      console.log(`transport id: ${transport.id}`);

      transport.on('dtlsstatechange', dtlsState => {
        if (dtlsState === 'closed') {
          transport.close();
        }
      });

      transport.on('close', () => {
        console.log('transport closed');
      });

      resolve(transport);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createWorker,
  removeItems,
  createRoom,
  createWebRtcTransport
};