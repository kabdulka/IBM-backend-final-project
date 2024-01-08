import express, { Express, Request, Response } from 'express';
import app from './server';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});