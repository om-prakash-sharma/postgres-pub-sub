'use strict';

const { PgPubSub } = require('@imqueue/pg-pubsub')

/**
 * To create a pub sub system between multiple instances using postgres
 */
class PubSub {
  constructor() {
    const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = process.env;

    // define channels 
    this.CHANNEL = {
      NOTIFY: 'notification'
    }

    // create pub/sub instance
    this.pubSub = new PgPubSub({
      connectionString: `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      singleListener: false
    })

    // bind the connection and listen for event
    this.bindPubSubListener()

    // bind emit events function with globle to access anywhere in the project. 
    global.emitEvents = (payload) => this.pubSub?.notify(this.CHANNEL.NOTIFY, payload)
  }

  bindPubSubListener() {
    if (this.pubSub) {
      this.pubSub.on('connect', async () => {
        console.info('Connection for Pub/Sub with Database has been established successfully.')
        Object.values(this.CHANNEL).forEach(chnl => {
          this.pubSub.listen(chnl)
        })
      })

      /**
       * uncomment for debugging
       * this.pubSub.on('listen', channel => console.info(`Listening to ${channel}...`))
       * this.pubSub.on('notify', channel => console.log(`${channel} notified`))
       */
      this.pubSub.on('end', () => {
        console.warn('PSQL Pub/Sub connection closed!')
      })

      Object.values(this.CHANNEL).forEach(channel => {
        this.pubSub.channels.on(channel, (payload) => {
          const { msg } = payload;
          console.log(`${new Date()} : ${msg}`);
        })
      })
      this.pubSub.connect().catch(err => console.error('Connection error:', err))
    }
  }
}

module.exports = PubSub;