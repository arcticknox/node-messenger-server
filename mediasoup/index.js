const logger = require('../config/logger');
const { 
  createWorker, 
  removeItems, 
  createRoom, 
  createWebRtcTransport 
} = require('./mediasoup');

const { mediasoupEvents } = require('../config/events');

module.exports.connectMediasoup = async (io) => {
  logger.info('Mediasoup enabled.');

  /**
 * Worker
 * |-> Router(s)
 *     |-> Producer Transport(s)
 *         |-> Producer
 *     |-> Consumer Transport(s)
 *         |-> Consumer 
 **/
  let worker;
  let rooms = {}; // { roomName1: { Router, rooms: [ sicketId1, ... ] }, ...}
  let peers = {}; // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
  let transports = []; // [ { socketId1, roomName1, transport, consumer }, ... ]
  let producers = []; // [ { socketId1, roomName1, producer, }, ... ]
  let consumers = []; // [ { socketId1, roomName1, consumer, }, ... ]

  // Create worker
  // TODO: Create worker by the num of cores
  worker = await createWorker();

  io.on('connection', async socket => {
    console.log(`${socket.id} has connected to mediasoup socket!`);
    socket.emit(mediasoupEvents.connectionSuccess, {
      socketId: socket.id,
    });

    const exitRoomAndCleanup = () => {
      if (!peers[socket.id]) {
        console.log('peer already disconnected');
        return;
      }
      console.log('peer disconnected');
      // Cleanup
      consumers = removeItems(consumers, socket, 'consumer');
      producers = removeItems(producers, socket, 'producer');
      transports = removeItems(transports, socket, 'transport');
     
      const { roomName } = peers[socket.id];
      delete peers[socket.id];

      // remove socket from room
      rooms[roomName] = {
        router: rooms[roomName].router,
        peers: rooms[roomName].peers.filter(socketId => socketId !== socket.id)
      };
    };

    socket.on('disconnect', () => {
      exitRoomAndCleanup();
    });

    socket.on(mediasoupEvents.exitRoom, (callback) => {
      exitRoomAndCleanup();
      callback({
        success: true,
        socketId: socket.id
      });
    });

    /**
     * Join Room
     * Create room/router if it does not exist or join the router
     * Router : Room
     */
    socket.on(mediasoupEvents.joinRoom, async ({ roomName }, callback) => {
      try {
        if (peers[socket.id]) {
          console.log('Peer already joined...');
          return;
        }
        let router;
        ({ router, rooms } = await createRoom(roomName, socket.id, rooms, worker));
    
        peers[socket.id] = {
          socket,
          roomName, // Name for the Router this Peer joined
          transports: [],
          producers: [],
          consumers: [],
          peerDetails: {
            name: '',
            isAdmin: false, // Is this Peer the Admin?
          }
        };
    
        // get Router RTP Capabilities
        const rtpCapabilities = router.rtpCapabilities;
    
        // call callback from the client and send back the rtpCapabilities
        callback({ rtpCapabilities });

      } catch (error) {
        console.log(error.message);
        callback({
          params: {
            error
          }
        });
      }
    });

    // Client emits a request to create server side Transport
    // We need to differentiate between the producer and consumer transports
    socket.on(mediasoupEvents.createWebRTCTransport, async ({ consumer }, callback) => {
    // get Room Name from Peer's properties
      const roomName = peers[socket.id].roomName;

      // get Router (Room) object this peer is in based on RoomName
      const router = rooms[roomName].router;


      createWebRtcTransport(router).then(
        transport => {
          callback({
            params: {
              id: transport.id,
              iceParameters: transport.iceParameters,
              iceCandidates: transport.iceCandidates,
              dtlsParameters: transport.dtlsParameters,
            }
          });

          // add transport to Peer's properties
          addTransport(transport, roomName, consumer);
        },
        error => {
          console.log(error);
        });
    });

    const addTransport = (transport, roomName, consumer) => {

      transports = [
        ...transports,
        { socketId: socket.id, transport, roomName, consumer, }
      ];

      peers[socket.id] = {
        ...peers[socket.id],
        transports: [
          ...peers[socket.id].transports,
          transport.id,
        ]
      };
    };

    const addProducer = (producer, roomName) => {
      producers = [
        ...producers,
        { socketId: socket.id, producer, roomName, }
      ];

      peers[socket.id] = {
        ...peers[socket.id],
        producers: [
          ...peers[socket.id].producers,
          producer.id,
        ]
      };
    };

    const addConsumer = (consumer, roomName) => {
    // add the consumer to the consumers list
      consumers = [
        ...consumers,
        { socketId: socket.id, consumer, roomName, }
      ];

      // add the consumer id to the peers list
      peers[socket.id] = {
        ...peers[socket.id],
        consumers: [
          ...peers[socket.id].consumers,
          consumer.id,
        ]
      };
    };

    socket.on(mediasoupEvents.getProducers, callback => {
    //return all producer transports
      const { roomName } = peers[socket.id];

      let producerList = [];
      producers.forEach(producerData => {
        if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
          producerList = [...producerList, producerData.producer.id];
        }
      });

      // return the producer list back to the client
      callback(producerList);
    });

    const informConsumers = (roomName, socketId, id) => {
      console.log(`just joined, id ${id} ${roomName}, ${socketId}`);
      // A new producer just joined
      // let all consumers to consume this producer
      producers.forEach(producerData => {
        if (producerData.socketId !== socketId && producerData.roomName === roomName) {
          const producerSocket = peers[producerData.socketId].socket;
          // use socket to send producer id to producer
          producerSocket.emit(mediasoupEvents.newProducer, { producerId: id });
        }
      });
    };

    const getTransport = (socketId) => {
      const [producerTransport] = transports.filter(transport => transport.socketId === socketId && !transport.consumer);
      return producerTransport.transport;
    };

    socket.on(mediasoupEvents.transportConnect, ({ dtlsParameters }) => {
      console.log('DTLS PARAMS... ', { dtlsParameters });
    
      getTransport(socket.id).connect({ dtlsParameters });
    });

    // eslint-disable-next-line no-unused-vars
    socket.on(mediasoupEvents.transportProduce, async ({ kind, rtpParameters, appData }, callback) => {
    // call produce based on the prameters from the client
      const producer = await getTransport(socket.id).produce({
        kind,
        rtpParameters,
      });

      // add producer to the producers array
      const { roomName } = peers[socket.id];

      addProducer(producer, roomName);

      informConsumers(roomName, socket.id, producer.id);

      console.log('Producer ID: ', producer.id, producer.kind);

      producer.on('transportclose', () => {
        console.log('transport for this producer closed ');
        producer.close();
      });

      // Send back to the client the Producer's id
      callback({
        id: producer.id,
        producersExist: producers.length>1 ? true : false
      });
    });

    socket.on(mediasoupEvents.transportRecvConnect, async ({ dtlsParameters, serverConsumerTransportId }) => {
      console.log(`DTLS PARAMS: ${dtlsParameters}`);
      const consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id == serverConsumerTransportId
      )).transport;
      await consumerTransport.connect({ dtlsParameters });
    });

    socket.on(mediasoupEvents.consume, async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
      try {

        const { roomName } = peers[socket.id];
        const router = rooms[roomName].router;
        let consumerTransport = transports.find(transportData => (
          transportData.consumer && transportData.transport.id == serverConsumerTransportId
        )).transport;

        // check if the router can consume the specified producer
        if (router.canConsume({
          producerId: remoteProducerId,
          rtpCapabilities
        })) {
        // transport can now consume and return a consumer
          const consumer = await consumerTransport.consume({
            producerId: remoteProducerId,
            rtpCapabilities,
            paused: true,
          });

          consumer.on('transportclose', () => {
            console.log('transport close from consumer');
          });

          consumer.on('producerclose', () => {
            console.log('producer of consumer closed');
            socket.emit(mediasoupEvents.producerClosed, { remoteProducerId });

            consumerTransport.close([]);
            transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.id);
            consumer.close();
            consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id);
          });

          addConsumer(consumer, roomName);

          // from the consumer extract the following params
          // to send back to the Client
          const params = {
            id: consumer.id,
            producerId: remoteProducerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            serverConsumerId: consumer.id,
          };

          // send the parameters to the client
          callback({ params });
        }
      } catch (error) {
        console.log(error.message);
        callback({
          params: {
            error: error
          }
        });
      }
    });

    socket.on(mediasoupEvents.consumerResume, async ({ serverConsumerId }) => {
      console.log('consumer resume');
      const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
      await consumer.resume();
    });
  });

};
