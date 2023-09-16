const { Kafka, logLevel } = require("kafkajs");

// Singleton Class<KAFKA>
class KafkaWrapper {
  get kafka() {
    if (!this._kafka) throw new Error("Cannot access KAFKA before connecting");
    return this._kafka;
  }

  init(clientId, brokers) {
    this._kafka = new Kafka({
      logLevel: logLevel.ERROR,
      clientId: clientId,
      brokers: brokers,
      connectionTimeout: 10000,
      enforceRequestTimeout: false,
    });
  }
}

module.exports = new KafkaWrapper();