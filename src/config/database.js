const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
      'mongodb+srv://namaste_node_db:FlQgbtGSvZMfZ1V1@namsate-node-cluster.kexukth.mongodb.net/devTinder'
    );
};

module.exports = { connectDB };