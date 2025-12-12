import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    await request(app).post('/api/auth/register').send({
        email: 'admin@sweets.com',
        password: 'password',
    });
    const User = mongoose.model('User');
    await User.findOneAndUpdate({ email: 'admin@sweets.com' }, { role: 'ADMIN' });

    const resAdmin = await request(app).post('/api/auth/login').send({
        email: 'admin@sweets.com',
        password: 'password',
    });
    adminToken = resAdmin.body.token;

    await request(app).post('/api/auth/register').send({
        email: 'user@sweets.com',
        password: 'password',
    });
    const resUser = await request(app).post('/api/auth/login').send({
        email: 'user@sweets.com',
        password: 'password',
    });
    userToken = resUser.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Sweets API', () => {
    it('should deny create sweet if not admin', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('x-auth-token', userToken)
            .send({
                name: 'Chocolate',
                category: 'Bar',
                price: 2.5,
                quantity: 10
            });
        expect(res.statusCode).toBe(403);
    });

    it('should allow admin to create sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('x-auth-token', adminToken)
            .send({
                name: 'Chocolate',
                category: 'Bar',
                price: 2.5,
                quantity: 10
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Chocolate');
    });

    it('should get all sweets', async () => {
        const res = await request(app)
            .get('/api/sweets')
            .set('x-auth-token', userToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should search sweets', async () => {
        // Create dummy data
        await request(app).post('/api/sweets').set('x-auth-token', adminToken).send({
            name: 'Gummy Bears', category: 'Gummies', price: 1.0, quantity: 50
        });

        const res = await request(app)
            .get('/api/sweets/search?q=Gummy')
            .set('x-auth-token', userToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Gummy Bears');
    });

    it('should update a sweet (Admin)', async () => {
        const createRes = await request(app).post('/api/sweets').set('x-auth-token', adminToken).send({
            name: 'Old Name', category: 'old', price: 1, quantity: 1
        });
        const id = createRes.body._id;

        const updateRes = await request(app)
            .put(`/api/sweets/${id}`)
            .set('x-auth-token', adminToken)
            .send({ name: 'New Name' });

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.name).toBe('New Name');
    });

    it('should delete a sweet (Admin)', async () => {
        const createRes = await request(app).post('/api/sweets').set('x-auth-token', adminToken).send({
            name: 'To Delete', category: 'X', price: 1, quantity: 1
        });
        const id = createRes.body._id;

        const delRes = await request(app)
            .delete(`/api/sweets/${id}`)
            .set('x-auth-token', adminToken);

        expect(delRes.statusCode).toBe(204);
    });

    it('should purchase a sweet and reduce quantity', async () => {
        // Only purchase existing sweet
        // We filter list first
        const listRes = await request(app).get('/api/sweets').set('x-auth-token', userToken);
        const target = listRes.body.find((s: any) => s.quantity > 0);
        const sweetId = target._id;
        const initialQty = target.quantity;

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('x-auth-token', userToken)
            .send({ qty: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(initialQty - 1);
    });

    it('should restock a sweet (Admin)', async () => {
        const listRes = await request(app).get('/api/sweets').set('x-auth-token', userToken);
        const target = listRes.body[0];
        const sweetId = target._id;
        const initialQty = target.quantity;

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('x-auth-token', adminToken)
            .send({ qty: 10 });

        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(initialQty + 10);
    });
});
