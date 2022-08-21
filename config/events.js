/**
 * Events
 * Naming convention: <component>:<eventName>
 */

const messengerEvents = {
  sendMessage: 'messenger:send',
  createChannel: 'messenger:create-channel',
  joinFromInviteLink: 'messenger:join-from-invite-link'
};

const commonEvents = {
  initRooms: 'common:init-rooms'
};

const mediasoupEvents = {
  joinRoom: 'mediasoup:join-room',
  exitRoom: 'mediasoup:exit-room',
  connectionSuccess: 'mediasoup:connection-success',
  newProducer: 'mediasoup:new-producer',
  producerClosed: 'mediasoup:producer-closed',
  getProducers: 'mediasoup:get-producers',
  consumerResume: 'mediasoup:consumer-resume',
  createWebRTCTransport: 'mediasoup:create-webrtc-transport',
  transportConnect: 'mediasoup:transport-connect',
  transportProduce: 'mediasoup:transport-produce',
  transportRecvConnect: 'mediasoup:transport-recv-connect',
  consume: 'mediasoup:consume'
};

module.exports = {
  messengerEvents,
  mediasoupEvents,
  commonEvents
};