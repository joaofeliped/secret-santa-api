import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect('mongodb://localhost:27017/secret-santa', {
        useNewUrlParser: true,
        useFindAndModify: true,
      })
      .then(() => console.log('DB Connected!'))
      .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
      });
  }
}

export default new Database();
