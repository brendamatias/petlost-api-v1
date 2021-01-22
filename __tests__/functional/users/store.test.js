import request from 'supertest';
import mongoose from 'mongoose';
import faker from 'faker';
import redis from '../../../src/redis';
import app from '../../../src/app';
import factory from '../../factories';

describe('Authentication', () => {
  afterAll(async (done) => {
    await mongoose.disconnect();
    redis.quit();
    done();
  });

  it('should create a user successfully', async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('email', user.email);
  });

  it('should not create a user with existing email', async () => {
    const oldUser = await factory.create('User');

    const response = await request(app).post('/users').send({
      name: faker.name.findName(),
      email: oldUser.email,
      password: faker.internet.password(),
    });

    expect(response.status).toBe(400);
  });

  it('should not create a user with invalid email', async () => {
    const response = await request(app).post('/users').send({
      name: faker.name.findName(),
      email: 'invalidemail',
      password: faker.internet.password(),
    });

    expect(response.status).toBe(401);
  });

  it('should not create a user without name', async () => {
    const response = await request(app).post('/users').send({
      name: '',
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.status).toBe(401);
  });

  it('should not create a user without email', async () => {
    const response = await request(app).post('/users').send({
      name: faker.name.findName(),
      email: '',
      password: faker.internet.password(),
    });

    expect(response.status).toBe(401);
  });

  it('should not create a user without password', async () => {
    const response = await request(app).post('/users').send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '',
    });

    expect(response.status).toBe(401);
  });
});
