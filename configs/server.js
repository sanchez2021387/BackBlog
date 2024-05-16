"use strict";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import postsRoutes from '../src/posts/publication.routes.js';
import commentsRoutes from '../src/comments/comments.routes.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.postsPath = '/blog/v1/posts';
    this.commentsPath = '/blog/v1/comments';

    this.middlewares();
    this.conectDB();
    this.routes();
  }

  async conectDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.postsPath, postsRoutes);
    this.app.use(this.commentsPath, commentsRoutes);
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
